---
title: 'Node 登录模块、权限验证、错误处理和可配置自定义中间件实现笔记'
date: 2020-07-21T12:05:47+08:00
keywords:
  - 'nodejs'
  - 'javascript'
  - 'mongodb'
  - 'express'
description: '近期在补习 Node.js + MongoDB 的配合使用，将学习过程中简单的完整实现记录下来便以后回顾。'
---

近期在补习 [Node.js](https://nodejs.org/) + [MongoDB](https://www.mongodb.com/) 的配合使用，目前已基本将后台管理界面完工。下一步是本人此前从未接触过的账户登录管理以及鉴权相关的内容，因此将学习过程中简单的完整实现记录下来便以后回顾。

<!--more-->

## 管理员账户添加

利用先前的[通用 CRUD 接口实现](/post/2020/universal-crud-router/)创建一个新的数据模型 `UserAdmin` 用于存储管理员账户的信息。简单起见此处只设置了两个字段 `username` 和 `password`。

`username` 使用 String 直接保存即可，但 `password` 一定是需要进行加密的，这里使用 [bcrypt](https://github.com/kelektiv/node.bcrypt.js) 包在数据库接受密码存储时进行加密。

同时，在前端创建用户并设置密码后，下次进入编辑时会默认接收到已进行编码的密码，在此保存会导致将此编码视为明文再次加密的情况，显然是不符合需求的，因此需要通过 `UserAdmin` 模型给 `password` 字段设置 `select: false` 选项。此后前端查询时 `password` 字段将不会被返回，但是设置新密码则依旧会覆盖。

以下为完整的模型定义：

```js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
  username: { type: String },
  password: {
    type: String,
    select: false, // 不返回 空保存不覆盖
    set(val) {
      return bcrypt.hashSync(val, 10);
    },
  },
});

module.exports = mongoose.model('UserAdmin', schema);
```

## 登陆页面及接口

改造基于如下情况：项目当前在独立的文件中引入了 [axios](https://github.com/axios/axios)，通过 `axios.create()` 方法创建一个名为 `http` 的模块并设定 API 的 `baseURL`。在 Vue 的主入口文件中引入这个模块并绑定到 `Vue.prototype.$http` 以方便在各组件中直接使用 API。

### 查找用户

前端首先通过 POST 请求发送登录信息 `{ username: ..., password: ... }`，后端接收到请求后在数据库中根据 `username` 搜索用户。若用户未找到则返回错误码和信息，由前端捕获并展示错误信息。以下为这些第一部分内容的实现：

```js
// 后端登录接口
app.post('/admin/api/login', async (req, res) => {
  const { username, password } = req.body;
  // 通过用户名搜索用户
  const UserAdmin = require('../../model/UserAdmin'); // 用户数据模型
  const user = await UserAdmin.findOne({ username });
  if (!user) {
    // 用户不存在
    // 此处由前后端统一规定返回错误格式
    // 一旦发生错误，在 message 字段中返回给前端错误的详情用于显示在提示框内
    res.status(418);
    res.send({ message: '茶壶不存在' }); // 统一规定的 message
    return;
  }
});
```

此时前端使用 axios 的 interceptor 统一捕获错误并显示在页面上，以下为这些第一部分内容的名为 `http` 的模块的完整代码：

```js
import axios from 'axios';
import Vue from 'vue';

const http = axios.create({
  baseURL: 'http://localhost:3000/admin/api', // API 地址
});

// 拦截器
http.interceptors.response.use(
  (res) => {
    return res; // 响应正常返回
  },
  (err) => {
    if (err.response.data.message) {
      // 此处由前后端统一规定返回错误格式
      // 一旦发生错误，在 message 字段中返回给前端错误的详情用于显示在提示框内
      // 这里的 $message 是由 element 绑定在 Vue.prototype 上的用于显示消息的 popup
      Vue.prototype.$message({
        type: 'error',
        message: err.response.data.message,
      });
    }
    return Promise.reject(err); // 返回一个被 reject 的 Promise
  }
);

export default http;
```

此时当用户不存在时应为如下情况：

![用户不存在错误提示截图](20200719133154.webp)

### 验证密码

若用户存在，则需要验证密码的正确性。先前在定义用户数据模型的 `password` 字段时设置了 `select: false` 选项，因此在查找用户时需要明确指出由于验证需要，应当同时获取加密后的密码：

```js
const bcrypt = require('bcrypt');
// 登录接口
app.post('/admin/api/login', async (req, res) => {
  const { username, password } = req.body;
  // 通过用户名搜索用户
  const UserAdmin = require('../../model/UserAdmin');
  // password 字段设置了默认不获取，需要明确要求获取 password 字段
  const user = await UserAdmin.findOne({ username }).select('+password');
  if (!user) { ... }
  // 用户存在则校验密码
  const userValid = bcrypt.compareSync(password, user.password);
  if (!userValid) {
    // 密码错误
    res.status(403);
    res.send({ message: '密码错误' });
    return;
  }
});
```

如果是为了安全考虑，用户名或密码错误时可以统一返回相同的信息 "用户名或密码错误"，此处就先这样了。

### 返回验证成功的 token

那么这里显然是使用 [jwt](https://www.npmjs.com/package/jsonwebtoken) 了。

首先生成 RSA 私钥和公钥，注意 ssh-keygen 生成 key 后还需用 openssl 生成 pem，这里图方便直接在 WSL 下搞了：

![生成密钥截图一](20200719140143.webp)

![生成密钥截图二](20200719153829.webp)

引入 jwt 和私钥，并使用私钥生成 token：

```js
const jwt = require('jsonwebtoken');
const privateKey = fs.readFileSync(path.resolve(__dirname, '../../../test_key.key'), {
  encoding: 'utf-8',
});
// 登录接口
app.post('/admin/api/login', async (req, res) => {
  '...';
  // 验证成功返回用户 token 并返回
  const token = jwt.sign(
    {
      _id: user._id, // 用户 ID (MongoDB 提供)
      username: user.username, // 用户的 username
    },
    privateKey,
    { algorithm: 'RS256' }
  );
  res.send({ token });
});
```

此时当客户端发送正确的用户名与密码时应该已经能接收到 `token` `了。token` 相关的其他设置如过期时间等也可在此设置。

最后客户端接收 `token` 并视情况和需求保存于 Cookies 或 HTML5 Storage：

```js
async function handleLogin() {
  const res = await this.$http.post('/login', this.model);
  try {
    Cookies.set('token', res.data.token, { sameSite: 'lax', expires: 7 });
  } catch (e) {
    console.error('Failed to write Cookies', e);
  }
  this.$router.push('/'); // 跳转回主页
}
```

## 用户权限校验

### 限制访问数据接口

在先前的[通用 CRUD 接口实现](/post/universal-crud-router/)时已经使用过一个类名转换的中间件，此处再次通过一个校验中间件来限制未登录用户对接口的访问。

这里需要客户端发送请求时带上 `token`。如果之前使用的是 Cookie 进行存储，则请求直接带上 Cookie；如果和此处一样使用了 localStorage，可以在请求头内对 request 添加 axios 拦截器、设置一个专门的字段用于发送 `token`。

注意如果使用的是 axios，则请求默认不带 Cookie。同时使用 cors 包的默认设置时，`Access-Control-Allow-Origin: *` 也会导致 Cookie 带不过去，不管 axios 有无设置 `withCredentials`。因此进行调整：

```js
/* src/http.js */
const http = axios.create({
  baseURL: 'http://localhost:3000/admin/api', // API 地址
  withCredentials: true,
});

/* src/index.js */
app.use(
  require('cors')({
    // cors 包支持正则匹配 此时用例如 http://localhost:8080/heroes/list 进行访问时
    // Access-Control-Allow-Origin 会被设置为 http://localhost:8080
    // 即可支持接受 Cookie
    origin: [/localhost/],
    credentials: true,
  })
);
app.use(require('cookie-parser')()); // 使用 cookie-parser 方便解析 cookie
```

如果之前的 key 生成和设置都正确的话，用公钥应该就可以解出私钥加密过的数据了，即为下面一段代码内的 `tokenData`：

```js
{ _id: '5f13bbd95b24091535392d2d', username: 'admin', iat: 1595141015 }
```

用户权限验证中间件完整代码：

```js
// 登录校验中间件
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const publicKey = fs.readFileSync(path.resolve(__dirname, '../../../test_key.key.pub'), {
  encoding: 'utf-8',
});
const UserAdmin = require('../../model/UserAdmin');

module.exports = async function validatorMiddleware(req, res, next) {
  if (req.cookies.token) {
    let tokenData;
    try {
      tokenData = jwt.verify(req.cookies.token, publicKey, { algorithms: ['RS256'] });
    } catch (e) {
      res.status(403); // 无权限
      res.send({ message: '403 Forbidden Authentication Error' });
      return;
    }
    if (!tokenData._id) {
      res.status(403); // 无权限
      res.send({ message: '403 Forbidden Authentication Failed' });
      return;
    }
    const id = tokenData._id; // 解密得到用户 ID
    const user = await UserAdmin.findById(id); // 验证用户是否存在
    if (!user) {
      res.status(403); // 无权限
      res.send({ message: '403 Forbidden Authentication Failed' });
      return;
    }
    req.user = user; // 把找到的 user 信息挂载到 req 上给以后的中间件使用
    // console.log(user);
    await next();
  } else {
    res.status(403); // 无权限
    res.send({ message: '403 Forbidden No Authentication Data' });
    return;
  }
};
```

### 统一错误处理

在上文的验证中间件内有个明显的问题，在不同的情况下 (`tokenData` 不存在、`id` 不存在、用户未找到等) 需要频繁的进行 `if` 判断与报错，显然是非常麻烦的。

因此引入 [http-assert](https://www.npmjs.com/package/http-assert) 包简化报错代码：

```js
// 每一处的类似如此的代码块，包括在登录、登陆后接口的权限验证等地方的判断
if (!user) {
  res.status(418);
  res.send({ message: '茶壶不存在' });
  return;
}
// 都可以替换为
assert(user, 418, '茶壶不存在');
```

注意通过 `assert()` 抛出的错误还需要由一个错误处理函数统一接受处理，转换为状态码和之前规定的 JSON 格式的错误信息返回给前端：

```js
// 错误处理
// 此处由前后端统一规定返回错误格式
// 一旦发生错误，在 message 字段中返回给前端错误的详情用于显示在提示框内
app.use(async (err, req, res, next) => {
  res.status(err.status);
  res.send({
    message: err.message,
  });
});
```

### 未登录自动跳转

同样在前端 axios 的拦截器内进行判断与跳转即可。这里还有一点要注意，通过 axios 的拦截器在请求接口时判断是可以跳转的，但在不请求接口的页面就不会跳转，因此还需要在前端通过路由守卫进行权限的验证与限制。

### 可配置的中间件

完成验证中间件后，除了让它可以用于 UserAdmin 模型外如果还需要想让其适用于其他情况、或者进行一些配置的动态调整，那么则需要将中间件分类为一个模块。通过使用一个工厂函数来返回中间件函数实现调整中间件设置的目的。

代码实现请见下文 "完整代码"。

### 文件上传 401 问题

文件上传由于使用了 `element-ui` 提供的组件，因此发起的 POST 请求并没有带上 Cookie 会导致验证 401 错误、无法上传文件。需要给上传组件添加 `with-credentials` 以发送 Cookie。

## 完整代码

```js
/* index.js */
const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams 使路由内可访问自身 req.params.resource
const path = require('path');
const assert = require('http-assert');

// 获取类名转换中间件
('...');
// 文件上传中间件
('...');

// 密
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { privateKey } = require('../../keys');

// 校验中间件
const validatorMiddleware = require('./validator')({ modelName: 'UserAdmin' });

module.exports = (app) => {
  /* 通用 CRUD 路由接口部分 */
  ('...');
  app.use('/admin/api/rest/:resource', validatorMiddleware, modelNameMiddleware, router);

  /* 文件上传接口 */
  ('...');

  /* 登录接口 */
  app.post('/admin/api/login', async (req, res) => {
    const { username, password } = req.body;
    // 通过用户名搜索用户
    const UserAdmin = require('../../model/UserAdmin');
    // password 字段设置了默认不获取，需要明确要求获取 password 字段
    const user = await UserAdmin.findOne({ username }).select('+password');
    // if (!user) {
    // 用户不存在 此处由前后端统一规定返回错误格式 一旦发生错误，在 message 字段中返回给前端错误的详情用于显示在提示框内
    //   res.status(418); res.send({ message: '茶壶不存在' }); return;
    // }
    assert(user, 418, '茶壶 (用户) 不存在'); /* I'm a teapot */
    // 用户存在则校验密码
    const userValid = bcrypt.compareSync(password, user.password);
    assert(userValid, 403, '密码错误'); /* Forbidden */
    // 验证成功返回用户 token
    const token = jwt.sign(
      {
        _id: user._id, // 用户 ID (MongoDB 提供)
        username: user.username, // 用户的 username
      },
      privateKey,
      { algorithm: 'RS256' }
    );
    res.send({ token });
  });

  // 错误处理
  // 此处由前后端统一规定返回错误格式
  // 一旦发生错误，在 message 字段中返回给前端错误的详情用于显示在提示框内
  app.use(async (err, req, res, next) => {
    res.status(err.status);
    res.send({
      message: err.message,
    });
  });
};

/* validator.js */
// 登录校验中间件
const jwt = require('jsonwebtoken');
const assert = require('http-assert');
const { publicKey } = require('../../keys');

/**
 * options:
 *   modelName: 验证用的模型
 */
module.exports = (options) => {
  if (options.modelName) {
    const Model = require(`../../model/${options.modelName}`);

    return async function validatorMiddleware(req, res, next) {
      assert(req.cookies.token, 401, '未登陆账户'); /* Unauthorized */
      let tokenData; // 解密 token
      try {
        tokenData = jwt.verify(req.cookies.token, publicKey, { algorithms: ['RS256'] });
      } catch (e) {
        tokenData = null;
      }
      assert(tokenData && tokenData._id, 401, '服务器无法解析登录信息'); /* Bad Request */
      const id = tokenData._id; // 解密得到用户 ID
      const user = await Model.findById(id); // 验证模型(用户)是否存在
      assert(user, 401, '登录的用户不存在'); /* Forbidden */
      req.user = user; // 把找到的 user 信息挂载到 req 上给以后的中间件使用
      await next();
    };
  } else {
    return async function validatorMiddleware(req, res, next) {
      await next(); // 未提供模型跳过这个中间件
    };
  }
};
```

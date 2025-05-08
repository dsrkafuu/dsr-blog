---
title: 'Node + MongoDB 通用 CRUD 接口实现笔记'
date: 2020-07-15T11:46:01+08:00
keywords:
  - 'nodejs'
  - 'javascript'
  - 'mongodb'
  - 'express'
description: '近期在补习 Node.js + MongoDB 的配合使用，将学习过程中简单的完整实现记录下来便以后回顾。'
---

近期在补习 [Node.js](https://nodejs.org/) + [MongoDB](https://www.mongodb.com/) 的配合使用，最初目标是实现一个接口用于 CRUD 分类数据。项目继续发展的时候发现除去分类数据以外，其他数据也需要用到几乎一模一样的接口。在路由中重复定义一大堆只有名字不同的接口对于学习用的小项目来说实在是有点没有必要，因此尝试学习了通用 CRUD 接口的实现。

<!--more-->

## 原版定义

以分类为例，[Mongoose](https://mongoosejs.com/) 模型定义，每个分类有自身的名称，以及关联的父级分类的 ObjectId：

```js
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String },
  parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }, // 类型为ID，关联这个模型本身
});

module.exports = mongoose.model('Category', schema);
```

原接口：

```js
const express = require('express');
const router = express.Router();
const Category = require('../../model/Category');

module.exports = (app) => {
  router.post('/categories', async (req, res) => {
    const model = await Category.create(req.body);
    res.send(model);
  });
  router.put('/categories/:id', async (req, res) => {
    const model = await Category.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  });
  router.get('/categories', async (req, res) => {
    const items = await Category.find().populate('parent').limit(10);
    // populate 根据 parent 内存的 ID 同时查询出 parent 作为对象返回
    res.send(items);
  });
  router.get('/categories/:id', async (req, res) => {
    const model = await Category.findById(req.params.id);
    res.send(model);
  });
  router.delete('/categories/:id', async (req, res) => {
    const model = await Category.findByIdAndDelete(req.params.id);
    res.send(model);
  });
  app.use('/admin/api', router);
};
```

引入 `Category` 模型，针对定义在 `/admin/api/categories` 下的不同路径和 HTTP 方法实现 CRUD。

## 目标

以类似 RESTful 风格实现：访问 `/api/categories` 时使用 `Category` 模型进行操作；相对应访问 `/api/types` 时使用 Type 模型进行操作；其他类推。

## 实现

### 基础实现

首先为了与其他普通接口相区分避免误操作对 URL 进行修改，将 `app.use('/admin/api', router);` 改为 `app.use('/admin/api/rest/:resource', router);`；此处的 `:resource` 即为请求类型 (比如上文的 `categories`)。

其次为了在路由内可访问自身 `req.params.resource` (即获取 `:resource` 参数) 修改 Router 构造函数选项：

```js
const router = express.Router({ mergeParams: true });
```

以创建分类的路由为例，首先对路径进行修改：

```js
router.post('/', async (req, res) => {
  const model = await Category.create(req.body);
  res.send(model);
});
```

在这里我们不能直接使用引入的 Category 模型，而是要根据 URL 动态获取。通过 `req.params.resource` 既可以获取到请求类型，此处的例子获取到的就是访问 `/admin/api/rest/categories` 对应的 `categories`。

通过 [inflection](https://www.npmjs.com/package/inflection) 这个包提供的 `classify` 方法将 `categories` 转换为对应的模型名 `Category`，进行动态的模型引入：

```js
router.post('/', async (req, res) => {
  const parseModelName = require('inflection').classify; // 定义 parseModelName 方法
  const modelName = parseModelName(req.params.resource); // 小写复数转首字母大写单数类名
  const Model = require(`../../model/${modelName}`); // 动态引入对应的 Mongoose 模型
  const model = await Model.create(req.body); // 创建数据
  res.send(model);
});
```

### 中间件

通过以上的修改以及可以基本实现动态 CRUD 了，但是将动态引入模型的代码在每段路由设置路面复制一份显然是很麻烦的，也不利于以后的修改，因此尝试通过中间件引入模型。

首先依旧是通过 [inflection](https://www.npmjs.com/package/inflection) 这个包提供的 `classify` 方法定义一个 `parseModelName` 方法：

```js
const parseModelName = require('inflection').classify;
```

创建一个类名转换中间件：

```js
async function modelNameMiddleware(req, res, next) {
  const modelName = parseModelName(req.params.resource); // 获取模型名称
  req.Model = require(`../../model/${modelName}`); // 挂载 require 的 model 使其能在下一步中以 req.Model 直接使用
  next();
}
```

注意这里将动态引入的模型挂载到 `req.Model`，这样在下一个中间件 (也就是路由) 中就可以直接通过 `req.Model` 使用了。

最后修改路由定义：

```js
router.post('/', async (req, res) => {
  const model = await req.Model.create(req.body); // 直接通过 req.Model 使用模型
  res.send(model);
});
app.use('/admin/api/rest/:resource', modelNameMiddleware, router); // 使用定义的中间件
```

## 完整代码

```js
const express = require('express');
const router = express.Router({ mergeParams: true });
// mergeParams 使路由内可访问自身 req.params.resource

// 小写复数形式转为单数大写类名形式
const parseModelName = require('inflection').classify;
// 获取类名转换中间件
async function modelNameMiddleware(req, res, next) {
  const modelName = parseModelName(req.params.resource);
  // 挂载 require 的 model 使其能在下一步中以 req.Model 直接使用
  req.Model = require(`../../model/${modelName}`);
  next();
}

module.exports = (app) => {
  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body);
    res.send(model);
  });
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  });
  router.get('/', async (req, res) => {
    const items = await req.Model.find().populate('parent').limit(10);
    // populate 根据 parent 内存的 ID 同时查询出 parent 作为对象返回
    res.send(items);
  });
  router.get('/:id', async (req, res) => {
    const model = await req.Model.findById(req.params.id);
    res.send(model);
  });
  router.delete('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndDelete(req.params.id);
    res.send(model);
  });
  app.use('/admin/api/rest/:resource', modelNameMiddleware, router);
};
```

---
title: 'JavaScript AJAX 快速参考笔记'
date: 2020-10-13T14:50:43+08:00
tags:
  - javascript
description: '整理 API 也是一种学习方法。'
image: '/images/2020/js-extends-note/header.webp'
---

直接进入正题，内容分为两部分：一部分为传统 XMLHttpRequest，另一部分是与 Fetch API 相关的 API 内容。

<!--more-->

## URL

在以下两部分之前先引入 URL 对象。

我们可以通过类似 `?name=value&browser=chrome` 的字符串向 URL 添加参数，我们也可以通过 URL 对象更方便的处理 URL。同时 URL 对象也可以作为一个完整的对象传递给下文的 XMLHttpRequest 和 Fetch API 中绝大多数需要 URL 的地方。

### URL 对象

#### 构建 URL 对象

```js
const url1 = new URL('https://example.org/profile/admin'); // https://example.org/profile/admin
const url2 = new URL('/profile/admin', 'https://example.org'); // https://example.org/profile/admin
const url3 = new URL('tester', url2); // https://example.org/profile/admin/tester
```

#### 获取 URL 对象属性

```js
console.log(url1.host); // example.org
```

![属性预览](/images/2020/js-ajax-note/20201013135017.webp)

### SearchParams

#### URLSearchParams

URLSearchParams 接口定义了一些实用的方法来处理 URL 的查询字符串。

```js
const searchParams = new URLSearchParams('name=value&browser=chrome');
searchParams.get('name');
searchParams.set('browser', 'chrome'); // 覆盖
searchParams.append('browser', 'firefox'); // 添加
searchParams.delete('browser');
```

#### URL 对象中的属性

`url.searchParams` 也就是一个 URLSearchParams 对象，可以很方便的管理 URL 参数。

```js
url.searchParams.set('name', 'value');
url.searchParams.set('browser', 'chrome');
for (const [name, value] of url.searchParams) {
  console.log(`${name}=${value}`); // name=value browser=chrome
}
```

## XMLHttpRequest 相关

### XMLHttpRequest 基本

#### 创建 XMLHttpRequest

```js
const xhr = new XMLHttpRequest();
```

#### 初始化 XMLHttpRequest

```js
xhr.open(method, url, [async, user, password]);
```

- `method`：HTTP 方法
- `url`：可以是 URL 字符串，也可以是一个 URL 对象
- `async`：显式设置为 false 则请求会以同步方式处理
- `user, password`：HTTP 基本身份验证的登录名和密码

注意 `open()` 并不会发出请求，仅仅是作为配置。

#### 发送 XHR 请求

```js
xhr.send([body]);
```

- `body`：请求体，如 POST 方法的内容

#### 监听事件

```js
xhr.onload = () => {
  alert(`${xhr.status} ${xhr.response}`);
};
// 仅在无法发出请求时触发
xhr.onerror = () => {};
// 进度监控
xhr.onprogress = function (event) {
  alert(`${event.loaded} of ${event.total}`);
};
```

### 其他属性

- `xhr.status`：HTTP 状态码
- `xhr.statusText`：HTTP 状态字符串
- `xhr.responseType`：设置相应类型
- `xhr.response`：得到响应的 body
- `xhr.readyState`：用于过时的 `xhr.onreadystatechange`
- `xhr.setRequestHeader(name, value)`：设置 HTTP 头，注意不是所有头都是可以设置的，例如 Referer 和 Host

### POST 请求和 FormData

可以使用 FormData 对象方便的建立 POST 请求：

```js
const formData = new FormData();
formData.append('name', 'value');
const xhr = new XMLHttpRequest();
xhr.open('POST', '/api/post');
xhr.send(formData);
xhr.onload = () => console.log(xhr.response);
```

## Fetch API 相关

### Fetch API 基本

```js
try {
  const response = await fetch(url);
  if (response.ok) {
    // 如果 HTTP 状态码为 200-299
    const json = await response.json();
  } else {
    // 如果 HTTP 状态码为 4XX, 5XX 等
    alert('HTTP Error Code: ' + response.status);
  }
} catch (e) {
  console.error(e); // 网络问题等
}
```

响应获取：

- `response.text()`： response 解析为文本
- `response.json()`： response 解析为 JSON
- `response.formData()`： 以 FormData 对象形式返回 response
- `response.blob()`： 以 Blob 形式返回 response
- `response.arrayBuffer()`： 以 ArrayBuffer 形式返回 response
- `response.body`：ReadableStream 对象，可逐块读取以获取进度

### Header

#### 响应的 Header

```js
response.headers.get('Content-Type');
for (let [key, value] of response.headers) {
  alert(`${key}=${value}`);
}
```

#### 请求的 Header

```js
const response = await fetch(url, {
  headers: {
    Authentication: 'secret',
  },
});
```

### POST 请求

设置 `method` 为 POST，并在 body 中发送 JSON 字符串、FormData、二进制数据等即可：

```js
const response = await fetch('/api/post/user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  body: JSON.stringify(user),
});
```

### 其他注意点

#### Cookies

注意默认情况下 `fetch()` 不会发送任何 cookie，需要显式指定：

```js
fetch('http://example.org', {
  credentials: 'include',
});
```

如果服务器同意接受带有 cookie 的请求，首先 `Access-Control-Allow-Origin` 不能设置为 `*` 而必须指定来源，其次服务器还应该在响应中添加 header `Access-Control-Allow-Credentials: true`。

#### 跨源请求

从浏览器角度来看，有两种跨源请求：简单请求和其他请求。

简单请求必须满足下列条件：

- 方法：GET、POST 或 HEAD
- header：仅能设置部分 header

使用 `<form>` 或 `<script>` 标签让浏览器进行简单请求向来是可行的，但浏览器本身不能进行非简单请求。因此对于简单请求，浏览器会立即发送，而对于其他请求，浏览器会发出预检请求，以请求许可。

简单请求流程：

- 浏览器直接发送带有 Origin 头的请求
- 对于没有 cookie 的请求，服务器响应：
  - `Access-Control-Allow-Origin`：`*` 或与 Origin 的值相同
- 对于具有凭据的请求，服务器应该设置：
  - `Access-Control-Allow-Origin`：与 Origin 的相同
  - `Access-Control-Allow-Credentials`：`true`

此外，要授予 JS 访问除 `Cache-Control`、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma` 外的任何响应头的权限，服务器应该在 `Access-Control-Expose-Headers` 中列出允许的 header。

非简单请求预检：

- 浏览器将具有以下 header 的 OPTIONS 请求发送到相同的 URL：
  - `Access-Control-Request-Method`：请求方法
  - `Access-Control-Request-Headers`：以逗号分隔的 header 列表
- 服务器响应：
  - HTTP 状态码：200
  - `Access-Control-Allow-Methods`：允许方法的列表
  - `Access-Control-Allow-Headers`：允许 header 的列表
  - `Access-Control-Max-Age`：缓存秒数

预检通过后才发出实际请求，与简单请求流程相同。

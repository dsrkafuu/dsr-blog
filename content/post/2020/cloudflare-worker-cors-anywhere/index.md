---
title: '使用 CloudFlare Workers 实现 CORS Anywhere'
date: 2020-10-23T19:36:50+08:00
keywords:
  - 'javascript'
  - 'cloudflare'
  - 'cors'
  - '跨域'
description: '访问量较小的 API 可以简单通过 CloudFlare Workers 进行代理。这里以 Bangumi 的 API 为例演示完整的实现。'
---

[CloudFlare Workers](https://workers.cloudflare.com/) 可以实现很多需求，通过它来代理访问非公开、未设置 CORS 头的 API 也在官方的示例项目内。不过由于免费 plan 的访问量限制以及性能限制等，一般用来给自己的实验性项目做一下简单代理。这里以 [Bangumi 的 API](https://bangumi.github.io/api/) 为例演示完整的实现。

<!--more-->

## 目标需求

Bangumi 的 API 的基础 URL 为 `https://api.bgm.tv`。

## Workers 前期设置

Workers 可以直接使用 CloudFlare 提供的域名，不过一般还是绑定自己的域名使用，这种情况下需要一个通过 CloudFlare 提供 DNS 解析的域名。演示中我们以 `worker.example.org` 为例 (假设 `example.org` 是我托管在 CF 的域名)。将 `worker.example.org` 解析到任意页面 (演示中解析到了不使用的 `dsrkafuu.github.io`) 并通过 CloudFlare 代理流量即可。

完成之后创建一个新的 worker，并开始准备代码。Workers 的完整文档见 [CloudFlare Docs](https://developers.cloudflare.com/workers/)。

## 工具函数

首先我们需要限制访问请求的来源，防止有限的 worker 访问次数被他人简单刷空，因此定义一个检查来源的函数：

```js
// 允许的 CORS 来源
const ALLOWED_ORIGIN = [/^https?:\/\/.*dsrkafuu\.su$/, /^https?:\/\/localhost/];
// 是否拒绝所有无 Origin 请求
const ALLOW_NO_ORIGIN = false;

/**
 * 验证 Origin
 * @param {Request} req
 * @return {boolean}
 */
function validateOrigin(req) {
  const origin = req.headers.get('Origin');
  if (origin) {
    for (let i = 0; i < ALLOWED_ORIGIN.length; i++) {
      if (ALLOWED_ORIGIN[i].exec(origin)) {
        return true;
      }
    }
  }
  return ALLOW_NO_ORIGIN; // 是否拒绝所有无 Origin 请求
}
```

由于我们所有的 worker 都在同一个 `worker.example.org` 域名下部署，因此指定 `worker.example.org/bgm` 作为这次代理的根 URL，接下来我们就需要提取出正确的 pathname 来发送给被代理的 API：

```js
// 代理子路径
const PROXY_PATH = /^\/bgm(\/?.*)/;

/**
 * 解析 API 请求路径
 * @param {Request} req
 * @return {string|null}
 */
function validatePath(req) {
  const url = new URL(req.url);
  const path = url.pathname;
  const exp = PROXY_PATH.exec(path);
  // `api.bgm.tv/data` => `workers.example.org/bgm/data`
  // `api.bgm.tv/` => `workers.example.org/bgm`
  if (exp && exp.length > 1) {
    return exp[1] || '';
  }
  return null;
}
```

## 响应 CORS 预检请求

对于所有 CORS 非简单请求的 `OPTIONS` 预检请求，单独写一个处理函数：

```js
/**
 * 响应 CORS OPTIONS 请求
 * @param {Request} req 源请求
 * @return {Response}
 */
function handleOptions(req) {
  const rawOrigin = req.headers.get('Origin');
  const rawMethod = req.headers.get('Access-Control-Request-Method');
  const rawHeaders = req.headers.get('Access-Control-Request-Headers');

  const res = new Response(null, { status: 200 });
  res.headers.set('Access-Control-Allow-Origin', rawOrigin);
  rawMethod && res.headers.set('Access-Control-Allow-Methods', rawMethod);
  rawHeaders && res.headers.set('Access-Control-Allow-Headers', rawHeaders);
  res.headers.set('Access-Control-Max-Age', 86400);
  // 设置 Vary 头使浏览器正确进行缓存
  res.headers.append('Vary', 'Accept-Encoding');
  res.headers.append('Vary', 'Origin');
  return res;
}
```

## 关于 Vary 头的设置

我们有两种返回 CORS 响应的方法，第一种是无条件型 CORS 响应，即 `Access-Control-Allow-Origin` 固定返回 `*` (允许任意网站访问) 或者返回特定的一个源网址。在这种情况下一般是不会有问题的。

第二种情况就是条件型 CORS 响应：如果请求没有 `Origin` 头，那么响应就不包含 `Access-Control-Allow-Origin`；如果请求有 `Origin` 头但不在我们的允许范围内，那么也不包含 `Access-Control-Allow-Origin` 来拒绝跨域请求；如果请求有被允许 `Origin` 头，那我们就返回这个 `Origin` 头作为对应的 `Access-Control-Allow-Origin`。

默认情况下浏览器以 URL 为 key 进行缓存。假设我们允许所有 `*.example.org` 下对资源 `api.org/data` 的访问。我们在 `a.example.org` 访问了这个资源，请求带的 `Origin` 头自然就是 `a.example.org`，返回的 `Access-Control-Allow-Origin` 自然也就是 `a.example.org`；但当我们又通过 `b.example.org` 访问这个资源，请求带的 `Origin` 头自然就是 `b.example.org`，但由于 URL 没变，浏览器直接返回缓存的资源，其中的 `Access-Control-Allow-Origin` 是之前的 `a.example.org`，跨域错误就出现了。

因此我们将对资源 `api.bgm.tv/data` 的访问响应头中的 `Vary` 设置为 `Origin`，这样除去 URL 之外，还会以 `Origin` 头的信息来选择是否使用缓存。

同样的，这个头也可以用 `Vary: User-Agent` 来防止移动客户端误用桌面缓存，具体见：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Vary)。

我们这里拒绝了所有无 `Origin` 的请求，并且返回响应为条件型 CORS 响应，因此是需要注意 `Vary` 的设置的。

## 响应 CORS 请求

我们准备一个函数，负责给源 API 返回的 response 添加 CORS 头。

我们需要用新的 Request 对象覆盖源请求来让它指向真正的 API，而不是我们的 `worker.example.org/bgm`。在构建新对象时，同时这也让这个 Request 对象变为了可修改 (mutable) 状态，这样我们就能手动设置其 header 中的 `Origin`，让 Bangumi 的服务器认为这不是跨域请求而放行。同样的，我们也需要对 Bangumi 服务器返回的 Response 对象进行覆盖来修改 header。

```js
// 无 trail 的 URL
const API_BASE = 'https://api.bgm.tv';
// 伪造请求头
const FAKE_ORIGIN = 'https://bgm.tv';
const FAKE_REFERRER = 'https://bgm.tv/calendar';
// 缓存控制
const CACHE_CONTROL = 'public, no-cache, must-revalidate';

/**
 * 响应 CORS 请求 + 请求伪装
 * @param {Request} req 源请求
 * @param {string} path 解析后的 API 请求路径 (非 null)
 * @return {Response}
 */
async function handleRequest(req, path) {
  const rawURL = new URL(req.url);
  const rawOrigin = req.headers.get('Origin');
  const rawQuerys = rawURL.searchParams;

  // 迁移路径
  const proxyURL = new URL(API_BASE);
  proxyURL.pathname = (proxyURL.pathname + path).replace('//', '/'); // path 由 `/` 开头或为 ``
  // 迁移 query
  for (const [key, value] of rawQuerys) {
    proxyURL.searchParams.append(key, value);
  }

  // 发起代理请求
  req = new Request(proxyURL, req); // 覆盖源请求使其 mutable
  // 伪装 Origin
  req.headers.delete('Origin');
  FAKE_ORIGIN && req.headers.set('Origin', FAKE_ORIGIN);
  // 伪装 Referer
  req.headers.delete('Referer');
  FAKE_REFERRER && req.headers.set('Referer', FAKE_REFERRER);
  // 获取响应
  let res = await fetch(req);
  res = new Response(res.body, res); // 覆盖响应 response 使其 mutable

  res.headers.set('Access-Control-Allow-Origin', rawOrigin);
  res.headers.set('Cache-Control', CACHE_CONTROL);
  // 设置 Vary 头使浏览器正确进行缓存
  res.headers.append('Vary', 'Accept-Encoding');
  res.headers.append('Vary', 'Origin');
  return res;
}
```

## 完成代理

最后添加一个拒绝请求的处理函数，通过 Workers 运行环境提供的 Event 进行相应设置即可：

```js
/**
 * 拒绝请求
 * @return {Response}
 */
function handleReject() {
  return new Response('[CloudFlare Workers] REQUEST NOT ALLOWED', {
    status: 403,
  });
}

addEventListener('fetch', (event) => {
  // 获取请求的信息
  const req = event.request;
  // 验证和解析
  const validOrigin = validateOrigin(req);
  const validPath = validatePath(req);
  if (validOrigin && typeof validPath === 'string') {
    if (req.method === 'OPTIONS') {
      event.respondWith(handleOptions(req));
    } else {
      event.respondWith(handleRequest(req, validPath));
    }
  } else {
    event.respondWith(handleReject());
  }
});
```

## 完整代码

```js
/*! cloudflare-workers-cors-anywhere | DSRKafuU (https://dsrkafuu.net) | Copyright (c) MIT License */

// 无 trail 的 URL
const API_BASE = 'https://api.bgm.tv';
// 代理子路径
const PROXY_PATH = /^\/bgm(\/?.*)/;
// 伪造请求头
const FAKE_ORIGIN = 'https://bgm.tv';
const FAKE_REFERRER = 'https://bgm.tv/calendar';
// 允许的 CORS 来源
const ALLOWED_ORIGIN = [/^https?:\/\/.*dsrkafuu\.su$/, /^https?:\/\/localhost/];
// 是否拒绝所有无 Origin 请求
const ALLOW_NO_ORIGIN = false;
// 缓存控制
const CACHE_CONTROL = 'public, no-cache, must-revalidate';

/**
 * 验证 Origin
 * @param {Request} req
 * @return {boolean}
 */
function validateOrigin(req) {
  const origin = req.headers.get('Origin');
  if (origin) {
    for (let i = 0; i < ALLOWED_ORIGIN.length; i++) {
      if (ALLOWED_ORIGIN[i].exec(origin)) {
        return true;
      }
    }
  }
  return ALLOW_NO_ORIGIN; // 是否拒绝所有无 Origin 请求
}

/**
 * 解析 API 请求路径
 * @param {Request} req
 * @return {string|null}
 */
function validatePath(req) {
  const url = new URL(req.url);
  const path = url.pathname;
  const exp = PROXY_PATH.exec(path);
  // `api.bgm.tv/data` => `workers.example.org/bgm/data`
  // `api.bgm.tv/` => `workers.example.org/bgm`
  if (exp && exp.length > 1) {
    return exp[1] || '';
  }
  return null;
}

/**
 * 响应 CORS OPTIONS 请求
 * @param {Request} req 源请求
 * @return {Response}
 */
function handleOptions(req) {
  const rawOrigin = req.headers.get('Origin');
  const rawMethod = req.headers.get('Access-Control-Request-Method');
  const rawHeaders = req.headers.get('Access-Control-Request-Headers');

  const res = new Response(null, { status: 200 });
  res.headers.set('Access-Control-Allow-Origin', rawOrigin);
  rawMethod && res.headers.set('Access-Control-Allow-Methods', rawMethod);
  rawHeaders && res.headers.set('Access-Control-Allow-Headers', rawHeaders);
  res.headers.set('Access-Control-Max-Age', 86400);
  // 设置 Vary 头使浏览器正确进行缓存
  res.headers.append('Vary', 'Accept-Encoding');
  res.headers.append('Vary', 'Origin');
  return res;
}

/**
 * 响应 CORS 请求 + 请求伪装
 * @param {Request} req 源请求
 * @param {string} path 解析后的 API 请求路径 (非 null)
 * @return {Response}
 */
async function handleRequest(req, path) {
  const rawURL = new URL(req.url);
  const rawOrigin = req.headers.get('Origin');
  const rawQuerys = rawURL.searchParams;

  // 迁移路径
  const proxyURL = new URL(API_BASE);
  proxyURL.pathname = (proxyURL.pathname + path).replace('//', '/'); // path 由 `/` 开头或为 ``
  // 迁移 query
  for (const [key, value] of rawQuerys) {
    proxyURL.searchParams.append(key, value);
  }

  // 发起代理请求
  req = new Request(proxyURL, req); // 覆盖源请求使其 mutable
  // 伪装 Origin
  req.headers.delete('Origin');
  FAKE_ORIGIN && req.headers.set('Origin', FAKE_ORIGIN);
  // 伪装 Referer
  req.headers.delete('Referer');
  FAKE_REFERRER && req.headers.set('Referer', FAKE_REFERRER);
  // 获取响应
  let res = await fetch(req);
  res = new Response(res.body, res); // 覆盖响应 response 使其 mutable

  res.headers.set('Access-Control-Allow-Origin', rawOrigin);
  res.headers.set('Cache-Control', CACHE_CONTROL);
  // 设置 Vary 头使浏览器正确进行缓存
  res.headers.append('Vary', 'Accept-Encoding');
  res.headers.append('Vary', 'Origin');
  return res;
}

/**
 * 拒绝请求
 * @return {Response}
 */
function handleReject() {
  return new Response('[CloudFlare Workers] REQUEST NOT ALLOWED', {
    status: 403,
  });
}

addEventListener('fetch', (event) => {
  // 获取请求的信息
  const req = event.request;
  // 验证和解析
  const validOrigin = validateOrigin(req);
  const validPath = validatePath(req);
  if (validOrigin && typeof validPath === 'string') {
    if (req.method === 'OPTIONS') {
      event.respondWith(handleOptions(req));
    } else {
      event.respondWith(handleRequest(req, validPath));
    }
  } else {
    event.respondWith(handleReject());
  }
});
```

## 扩展实现

在此完整代码的基础上还可以进行不少改动，例如将类似 `API_BASE` 这样的常量替换为从 URL 参数获取，就可以实现通用的 CORS Anywhere 了。类似的思路还可以用于代理类似 Google Custom Search API 等内容，这里放一个示例，也是我的个人站目前正在用的：

```js
// 无 trail 的 URL
const API_BASE = 'https://www.googleapis.com/customsearch/v1';
// 代理子路径
const PROXY_PATH = /^\/(\/?.*)/;
// 允许的请求来源
const ALLOWED_ORIGIN = [/^https?:\/\/.*dsrkafuu\.su$/, /^https?:\/\/localhost/];
// 是否拒绝所有无 Origin 请求
const ALLOW_NO_ORIGIN = false;
// secrets
const API_KEY = 'A**********************************k';
const API_CX = '3***************e';

const blockedRes = (text) =>
  new Response(`[dsr-blog] forbidden: ${text}`, { status: 403 });
const timeoutRes = (text) =>
  new Response(`[dsr-blog] tequest timeout: ${text}`, { status: 408 });

/**
 * 验证 Origin
 * @param {Request} req
 * @return {boolean}
 */
function validateOrigin(req) {
  const origin = req.headers.get('Origin');
  if (origin) {
    for (let i = 0; i < ALLOWED_ORIGIN.length; i++) {
      if (ALLOWED_ORIGIN[i].exec(origin)) {
        return true;
      }
    }
  }
  return ALLOW_NO_ORIGIN; // 是否拒绝所有无 Origin 请求
}

/**
 * 解析 API 请求路径
 * @param {Request} req
 * @return {string}
 */
function validatePath(req) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const valid = PROXY_PATH.exec(pathname);
  if (valid) {
    return true; // 放行
  }
  return false; // 拒绝
}

/**
 * 请求搜索结果
 * @param {string} searchQuerys
 * @returns {Promise<Response>}
 */
async function fetchGoogleAPI(searchQuerys) {
  const url = new URL(API_BASE); // 构建一个新的 URL 对象 `googleapis.com`
  url.searchParams.set('cx', API_CX); // 设置 cx
  url.searchParams.set('key', API_KEY); // 设置 key
  url.searchParams.set('q', searchQuerys); // 设置 q
  const res = await fetch(url);
  return res;
}

/**
 * 响应请求
 * @param {Request} req
 * @returns {Response}
 */
async function handleReq(req) {
  const url = new URL(req.url);
  const searchQuerys = url.searchParams.get('q');
  if (searchQuerys) {
    try {
      let res = await fetchGoogleAPI(searchQuerys);
      // CORS
      res = new Response(res.body, res); // 覆盖响应 response
      res.headers.set(
        'Access-Control-Allow-Origin',
        req.headers.get('Origin') || '*'
      ); // 设置 CORS 头
      res.headers.append('Vary', 'Origin'); // 设置 Vary 头使浏览器正确进行缓存
      return res;
    } catch {
      return timeoutRes('internal Google API error occurred');
    }
  }
  return blockedRes('no search querys found'); // 拒绝
}

addEventListener('fetch', (event) => {
  const req = event.request; // 获取请求的信息
  // 验证身份
  const validOrigin = validateOrigin(req);
  const validPath = validatePath(req);
  // 验证通过
  if (validOrigin && validPath) {
    event.respondWith(handleReq(req)); // 响应
  } else {
    event.respondWith(blockedRes('origin or pathname not allowed')); // 拒绝
  }
});
```

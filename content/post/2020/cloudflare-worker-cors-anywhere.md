---
title: '使用 CloudFlare Workers 实现 CORS 跨域完整代理 API'
date: 2020-10-23T19:36:50+08:00
tags:
  - 'javascript'
  - 'cloudflare'
  - 'cors'
description: '访问量较小的 API 可以简单通过 CloudFlare Workers 进行代理。'
image: '/images/header/cloudflare.webp'
---

[CloudFlare Workers](https://workers.cloudflare.com/) 可以实现很多需求，通过它来代理访问非公开、未设置 CORS 头的 API 也在官方的示例项目内。不过由于免费 plan 的访问量限制以及性能限制等，一般用来给自己的实验性项目做一下简单代理。这里以 [Bangumi 的 API](https://bangumi.github.io/api/) 为例演示完整的实现。

<!--more-->

## 目标需求

Bangumi 的 API 的基础 URL 为 `https://api.bgm.tv/`，由于篇幅限制和实际需求的原因，这里只代理不需要验证的所有普通 GET 请求。下文以 `https://api.bgm.tv/calendar` (每日放送信息) 为测试用例进行实现。

## Workers 前期设置

Workers 可以直接使用 CloudFlare 提供的域名，不过一般还是绑定自己的域名使用，这种情况下需要一个通过 CloudFlare 提供 DNS 解析的域名。演示中我们以 `worker.example.org` 为例 (假设 `example.org` 是我托管在 CF 的域名)。将 `worker.example.org` 解析到任意页面 (演示中解析到了不使用的 `dsrkafuu.github.io`) 并通过 CloudFlare 代理流量即可。

完成之后创建一个新的 worker，并开始准备代码。Workers 的完整文档见 [CloudFlare Docs](https://developers.cloudflare.com/workers/)。

## 工具函数

首先我们需要限制访问请求的来源，防止有限的 worker 访问次数被他人简单刷空，因此定义一个检查 `Referer` 的函数：

```js
// 允许的来源
const ALLOWED_ORIGIN = [/^https?:\/\/my-project\.example\.org/, /^https?:\/\/localhost/];

/**
 * 验证 Origin 头
 * @param {string} origins
 */
function validateOrigin(origin) {
  if (origin && origin.includes('https')) {
    for (let i = 0; i < ALLOWED_ORIGIN.length; i++) {
      if (ALLOWED_ORIGIN[i].exec(origin)) {
        return true; // 通过
      }
    }
  }
  return false; // 拒绝所有非 CORS 请求和非 SSL 请求
}
```

注意这里并不一定需要使用 CORS `Origin` 来检查来源，使用请求中发送的 `Referer` 头也是可以的。

由于我们所有的 worker 都在同一个 `worker.example.org` 域名下部署，因此指定 `worker.example.org/bgm/` 作为这次代理的根 URL，接下来我们就需要提取出正确的 pathname 来发送给被代理的 API：

```js
// 这次代理的根 URL (次级)
const API_PATH = /^\/bgm(.*)/;

/**
 * 解析 pathname
 * @param {string} url
 */
function validatePath(pathname) {
  const parsedPath = API_PATH.exec(pathname);
  if (parsedPath && parsedPath.length > 1) {
    if (parsedPath[1] === '') {
      return '/'; // 这种情况是为了代理根目录 `api.bgm.tv/` => `worker.example.org/bgm/`
    } else {
      return parsedPath[1]; // `api.bgm.tv/*` => `worker.example.org/bgm/*`
    }
  } else {
    return false; // 若不是对 `/bgm*` 的访问则拒绝
  }
}
```

## CORS 处理函数

我们准备一个函数，负责给源 API 返回的 response 添加 CORS 头。

我们需要用新的 Request 对象覆盖源请求来让它指向真正的 API，而不是我们的 `worker.example.org/bgm/`。在构建新对象时，同时这也让这个 Request 对象变为了可修改 (mutable) 状态，这样我们就能手动设置其 header 中的 `Origin`，让 Bangumi 的服务器认为这不是跨域请求而放行。同样的，我们也需要对 Bangumi 服务器返回的 Response 对象进行覆盖来修改 header。

以下为演示实现：

```js
// 源 API 地址
const API_URL = 'https://api.bgm.tv/';

/**
 * 添加 CORS 头
 * @param {Request} request - 源请求
 * @param {string} origin - 源 origin
 * @param {string} pathname - 源请求解析出的正确 pathname
 * @param {URLSearchParams} searchParams - 源请求的 searchParams
 */
async function handleRequest(request, origin, pathname, searchParams) {
  const apiUrl = new URL(API_URL); // 构建一个新的 URL 对象 `api.bgm.tv/`
  apiUrl.pathname = pathname; // 设置正确的 pathname
  for (const [key, value] of searchParams) {
    apiUrl.searchParams.append(key, value);
  } // 迁移正确的 searchParams
  request = new Request(apiUrl, request); // 覆盖源 request
  request.headers.set('Origin', apiUrl.origin); // 伪装 Origin
  let response = await fetch(request); // 获取响应
  response = new Response(response.body, response); // 覆盖响应 response
  response.headers.set('Access-Control-Allow-Origin', origin); // 设置 CORS 头
  response.headers.append('Vary', 'Origin'); // 设置 Vary 头使浏览器正确进行缓存
  return response;
}
```

以上代码中还有一个关键部分在于对响应 `Vary` 头的设置。

## 关于 Vary 头的设置

我们有两种返回 CORS 响应的方法，第一种是无条件型 CORS 响应，即 `Access-Control-Allow-Origin` 固定返回 `*` (允许任意网站访问) 或者返回特定的一个源网址。在这种情况下一般是不会有问题的。

第二种情况就是条件型 CORS 响应：如果请求没有 `Origin` 头，那么响应就不包含 `Access-Control-Allow-Origin`；如果请求有 `Origin` 头但不在我们的允许范围内，那么也不包含 `Access-Control-Allow-Origin` 来拒绝跨域请求；如果请求有被允许 `Origin` 头，那我们就返回这个 `Origin` 头作为对应的 `Access-Control-Allow-Origin`。

默认情况下浏览器以 URL 为 key 进行缓存。假设我们允许所有 `*.example.org` 下对资源 `api.org/data` 的访问。我们在 `a.example.org` 访问了这个资源，请求带的 `Origin` 头自然就是 `a.example.org`，返回的 `Access-Control-Allow-Origin` 自然也就是 `a.example.org`；但当我们又通过 `b.example.org` 访问这个资源，请求带的 `Origin` 头自然就是 `b.example.org`，但由于 URL 没变，浏览器直接返回缓存的资源，其中的 `Access-Control-Allow-Origin` 是之前的 `a.example.org`，跨域错误就出现了。

因此我们将对资源 `api.org/data` 的访问响应头中的 `Vary` 设置为 `Origin`，这样除去 URL 之外，还会以 `Origin` 头的信息来选择是否使用缓存。

同样的，这个头也可以用 `Vary: User-Agent` 来防止移动客户端误用桌面缓存，具体见：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Vary)。

我们这里拒绝了所有 CORS 请求，并且返回响应为条件型 CORS 响应，因此是需要注意 `Vary` 的设置的。

## 完成代理

最后通过 Workers 运行环境提供的 Event 进行相应即可：

```js
addEventListener('fetch', (event) => {
  // 获取请求的信息
  const request = event.request;
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  const pathname = url.pathname;
  // 验证和解析
  const validOrigin = validateOrigin(origin);
  const validPath = validatePath(pathname);
  if (validOrigin && validPath) {
    event.respondWith(handleRequest(request, origin, validPath));
  } else {
    const response = new Response('[bgm.tv api proxy] request not allowed', { status: 403 });
    event.respondWith(response);
  }
});
```

## 完整代码

```js
/*! Mapping Bangumi API in CloudFlare Workers | DSRKafuU <amzrk2.cc> | Copyright (c) MIT License */

const API_URL = 'https://api.bgm.tv/';
const API_PATH = /^\/bgm(.*)/;
const ALLOWED_ORIGIN = [
  /^https?:\/\/dsrca\.amzrk2\.cc/,
  /^https?:\/\/api-bgm\.amzrk2\.workers\.dev/,
  /^https?:\/\/localhost/,
];

/**
 * 验证 Origin 头
 * @param {string} origin
 */
function validateOrigin(origin) {
  if (origin && origin.includes('https')) {
    for (let i = 0; i < ALLOWED_ORIGIN.length; i++) {
      if (ALLOWED_ORIGIN[i].exec(origin)) {
        return true; // 通过
      }
    }
  }
  return false; // 拒绝所有非 CORS 请求和非 SSL 请求
}

/**
 * 解析 pathname
 * @param {string} url
 */
function validatePath(pathname) {
  const parsedPath = API_PATH.exec(pathname);
  if (parsedPath && parsedPath.length > 1) {
    if (parsedPath[1] === '') {
      return '/'; // 这种情况是为了代理根目录 `api.bgm.tv/` => `worker.example.org/bgm/`
    } else {
      return parsedPath[1]; // `api.bgm.tv/*` => `worker.example.org/bgm/*`
    }
  } else {
    return false; // 若不是对 `/bgm*` 的访问则拒绝
  }
}

/**
 * 添加 CORS 头
 * @param {Request} request - 源请求
 * @param {string} origin - 源 origin
 * @param {string} pathname - 源请求解析出的正确 pathname
 * @param {URLSearchParams} searchParams - 源请求的 searchParams
 */
async function handleRequest(request, origin, pathname, searchParams) {
  const apiUrl = new URL(API_URL); // 构建一个新的 URL 对象 `api.bgm.tv/`
  apiUrl.pathname = pathname; // 设置正确的 pathname
  for (const [key, value] of searchParams) {
    apiUrl.searchParams.append(key, value);
  } // 迁移正确的 searchParams
  request = new Request(apiUrl, request); // 覆盖源 request
  request.headers.set('Origin', apiUrl.origin); // 伪装 Origin
  let response = await fetch(request); // 获取响应
  response = new Response(response.body, response); // 覆盖响应 response
  response.headers.set('Access-Control-Allow-Origin', origin); // 设置 CORS 头
  response.headers.append('Vary', 'Origin'); // 设置 Vary 头使浏览器正确进行缓存
  return response;
}

addEventListener('fetch', (event) => {
  // 获取请求的信息
  const request = event.request;
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  const pathname = url.pathname;
  const searchParams = url.searchParams;
  // 验证和解析
  const validOrigin = validateOrigin(origin);
  const validPath = validatePath(pathname);
  if (validOrigin && validPath) {
    event.respondWith(handleRequest(request, origin, validPath, searchParams));
  } else {
    const response = new Response('[bgm.tv api proxy] request not allowed', { status: 403 });
    event.respondWith(response);
  }
});
```

## 扩展实现

通用，类似的思路还可以用于代理类似 Google Custom Search API 等内容，详细的就不说了，这里放一个示例，也是我的个人站目前正在用的：

```js
/*! Google Custom Search in CloudFlare Workers | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */

const ALLOWED_ORIGIN = [/^https?:\/\/example\.org/];
const ALLOWED_PATH = /^\/search(.*)/;

const API_URL = 'https://www.googleapis.com/customsearch/v1';
const API_KEY = 'AI**********DA';
const API_CX = '98**********b8e';

const blockedRes = (text) => new Response(`[search] forbidden: ${text}`, { status: 403 });
const timeoutRes = (text) => new Response(`[search] request Timeout: ${text}`, { status: 408 });

/**
 * 验证 Origin 头是否允许
 * @param {Request} req
 * @returns {boolean}
 */
function validateOrigin(req) {
  const origin = req.headers.get('Origin');
  /* DEV - START */
  if (origin && origin.includes('localhost')) {
    return true;
  }
  /* DEV - END */
  if (origin && origin.includes('https')) {
    for (let i = 0; i < ALLOWED_ORIGIN.length; i++) {
      if (ALLOWED_ORIGIN[i].exec(origin)) {
        return true; // 通过
      }
    }
  }
  return false; // 拒绝所有非 CORS 请求和非 SSL 请求
}

/**
 * 验证 pathname 是否允许
 * @param {Request} req
 * @returns {boolean}
 */
function validatePath(req) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const valid = ALLOWED_PATH.exec(pathname);
  if (valid && valid.length > 1) {
    return true; // 放行
  }
  return false; // 拒绝
}

/**
 * 请求搜索结果
 * @param {string} searchQuerys - 关键词
 * @returns {Promise<Response>}
 */
async function fetchGoogleAPI(searchQuerys) {
  const url = new URL(API_URL); // 构建一个新的 URL 对象 `googleapis.com`
  url.searchParams.set('cx', API_CX); // 设置 cx
  url.searchParams.set('key', API_KEY); // 设置 key
  url.searchParams.set('q', searchQuerys); // 设置 q
  return fetch(url);
}

/**
 * 响应请求
 * @param {Request} req - 源请求
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
      res.headers.set('Access-Control-Allow-Origin', req.headers.get('Origin') || '*'); // 设置 CORS 头
      if (!res.headers.get('Vary').includes('Origin')) {
        res.headers.append('Vary', 'Origin'); // 设置 Vary 头使浏览器正确进行缓存
      }
      return res;
    } catch (e) {
      console.error(e);
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

---
title: '计算机网络基础笔记'
date: 2019-06-12T12:25:32+08:00
tags:
  - cs
  - web
  - http
description: '计算机网络基础笔记。'
---

计算机网络基础笔记。

<!--more-->

## TCP 三次握手

1. 起初两端都处于 `CLOSED` 状态，客户端向服务端发送 SYN 包等待服务端确认，客户端进入 `SYN-SENT` 状态
2. 服务端发回 SYN + ACK 包确认连接请求，进入 `SYN-RCVD` 状态
3. 客户端收到确认，向服务端发送 ACK 包确认建立连接，此时两端都处于 `ESTABLISHED` 状态

## 从输入 URL 到页面加载完成发生了什么

1. DNS 解析
2. TCP 连接
3. 发送 HTTP 请求
4. 服务器处理请求并返回 HTTP 响应
5. 浏览器解析渲染页面
6. 断开 TCP 连接

## 浏览器渲染页面的过程

### WebKit 渲染过程

1. 首先通过请求得到 HTML
2. 解析 HTML 生成 DOM 树
3. 遇见 CSS、图片等则异步加载，不会阻塞 DOM 树的生成
4. 遇见普通的 JS (`<script>`) 则阻塞 DOM 树加载，等到 JS 加载且执行完后继续生成 DOM 树
5. 将 DOM 树 和 CSS 规则树合并到一起生成渲染树
6. 遍历渲染树计算节点的信息并绘制到屏幕

### async 和 defer

- `async`：异步下载，执行时阻塞，可能在任何时候执行，顺序由加载完成先后决定
- `defer`：异步下载，直到 DOMContentLoaded 后才执行，顺序由定义先后决定
- 动态插入：除非显式设置 `false`，否则类似 `async`
- 一起使用：`async` 优先，浏览器不支持时回退到 `defer`

### repaint 和 reflow (回流)

1. repaint 是屏幕中一部分的内容重新渲染
2. reflow 则是因为某些元素的尺寸或存在与否改变了，因此需要重新计算相关联的所有渲染树
3. reflow 必然带来 repaint，但 repaint 不一定会带来 reflow

获取一个元素的 `scrollTop` 和 `offsetTop` 之类的属性时，浏览器为了保证值的正确也会回流取得最新的值。

## HTTP

超文本传输协议，本质是无状态的，使用 Cookies 可以创建有状态的会话；一般基于 TCP/IP 协议，默认端口 80；分为请求和响应两个部分。

### HTTP 请求

```
GET / HTTP/1.1
Host: developer.mozilla.org
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0
Accept: text/css,*/*;q=0.1
Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
Accept-Encoding: gzip, deflate, br
Cookie: dwf_sg_task_completion=False; _ga=GA1.2.2100708258.1587297770
```

- HTTP 方法：GET、POST、OPTIONS 等
- 资源路径和 HTTP 协议版本号
- 其他 headers
- 如果是例如 POST，还会包含发送的信息
- `Connection: keep-alive`：保持该网络连接打开

### HTTP 响应

```
HTTP/2 200 OK
Content-Type: image/png
Content-Length: 63794
Last-Modified: Tue, 17 Dec 2019 00:26:34 GMT
Cache-Control: public,max-age=31536000,immutable

<!DOCTYPE html>
<html lang="zh">
...
```

- HTTP 版本号
- 状态码和状态信息：一般由三位构成
  - `1xx` 表示请求已经接受
  - `2xx` 表示请求已经处理
  - `3xx` 重定向
  - `4xx` 一般为客户端错误
  - `5xx` 一般为服务器错误
  - 常见的：`200 OK`；`403 Forbidden`；`404 Not Found`；`502 Bad Gateway`
- 其他 headers
- 信息

### HTTP 状态码 301 和 302 有什么区别

- `301`：永久重定向，浏览器可以做缓存
- `302`：临时重定向，下次访问依旧用重定向之前的链接

### 常见的信息头

- Host：服务器域名
- User-Agent：UA
- Cookie：Cookie 会一直被携带在 HTTP 请求内发送给服务器，`localStorage` 和 `sessionStorage` 仅和浏览器本地有关，且 `sessionStorage` 仅在当前浏览器窗口关闭之前有效
- `Cache-Control`，`If-Modified-Since`，`Etag`，`If-None-Match`：HTTP 缓存相关

### HTTP 缓存机制

- 发送 HTTP 请求时首先检查浏览器缓存 (是否存在或是否过期)
  - 缓存有效则直接从缓存中得到资源
  - 缓存无效检查是否有 `Etag` 或 `Last-Modified`
    - 有 `Etag` 则带 `If-None-Match` 请求资源
    - 有 `Last-Modified` 则带 `If-Modified-Since` 请求资源
      - `304 Not Modified` 或 `200 OK`
    - 无则直接请求资源
      - `200 OK`

### HTTPS 过程

通过 TLS 协议对 HTTP 进行加密。

1. 客户端发送 HTTPS 请求，并发送支持的密钥算法
2. 服务端选择一种算法返回证书 (非对称加密)
3. 客户端验证证书的有效性，生成随机密码，并用证书公钥加密随机密码发送给服务端
4. 服务端接收到随机密码，用私钥解密，并用这个密码加密数据发送给客户端
5. 客户端用随机密码解密传来的数据 (对称加密)

非对称加密：公钥加密私钥解密

## Cookie 和 Session

Cookie：

1. 浏览器首次请求
2. 服务器响应带有 `Set-Cookie` (用户信息)
3. 浏览器请求带有 Cookie
4. 服务器判断身份

Session：

1. 浏览器首次请求
2. 服务器生成 Session 并保存，响应返回特定包含 Session 信息的 Cookie
3. 浏览器再次请求带有这个 Cookie
4. 服务器查询 Session 判断身份

区别：

Cookie 所有数据存放在客户端，Session 数据存放在服务端

## 跨域

同源策略：协议、端口、域名都相同

1. JSONP 利用 `script` 标签没有跨域限制的特性，让服务器发回可执行的 JS 代码（函数），其参数就是要获取的数据。例如搜狐的当前城市 API，返回的就是 `var returnCitySN = {}`
2. 手动设置 `document.domain`，实现二级域名相同
3. `frame.postMessage({})`
4. CORS

CORS 分为简单请求和需预检的请求：

使用 GET、POST 或 HEAD 方法，请求头的类型和 `Content-Type` 都在限定内的会发出简单请求：

- 浏览器直接发送带有 `Origin` 头的请求
- 对于没有 cookie 的请求，服务器响应：
  - `Access-Control-Allow-Origin`：`*` 或与 `Origin` 的值相同
- 对于具有凭据的请求，服务器应该设置：
  - `Access-Control-Allow-Origin`：与 `Origin` 的相同
  - `Access-Control-Allow-Credentials`：`true`

需预检的请求：

- 浏览器将具有以下 header 的 OPTIONS 请求发送到相同的 URL：
  - `Access-Control-Request-Method`：请求方法
  - `Access-Control-Request-Headers`：以逗号分隔的 header 列表
- 服务器响应：
  - HTTP 状态码：`200`
  - `Access-Control-Allow-Methods`：允许方法的列表
  - `Access-Control-Allow-Headers`：允许 header 的列表
  - `Access-Control-Max-Age`：缓存秒数

预检通过后才发出实际请求，与简单请求流程相同。

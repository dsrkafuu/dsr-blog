---
title: 'Front End'
date: 2019-09-07T23:00:01+08:00
description: '前端应用笔记，包括前端安全、性能优化、移动兼容等内容。'
---

## CSRF 和 XSS 攻击

### CSRF 跨站请求伪造

1. 用户访问并登陆 `a.org`
2. `a.org` 生成并返回 Cookie 给用户
3. 用户访问 `b.org`，其中有指向 `a.org` 的图片、链接和表单等
4. 授权 Cookie 被发送给 `a.org`，造成影响

防御方法：

1. 简易：Referrer 检查 (不可靠)
2. 服务端生成并保存 Token，写入 DOM，客户端发起请求时携带
3. 服务端生成 Token 不保存，写入 DOM 和 Cookie，客户端请求时携带二者，服务端比对
4. 客户端生成 Token，写入 DOM 和 Cookie，请求时携带二者，服务端比对

JWT (一旦签发过期前永远有效)：

1. 服务器认证后，返回含有用户信息的 JSON 对象
2. 客户端每次请求都发送该对象用于验证

### XSS 跨站脚本

利用对用户输入没有限制的漏洞，获取到跨站脚本，在脚本中发起带有 Cookie 的请求给恶意站点。

### 相关 Cookie 字段

- SameSite: Lax 为现代浏览器的默认值，只允许第一方链接及第三方 GET 请求；Strict 仅允许第一方；None 传统允许跨域。
- HttpOnly：JS 中无法获取

## 性能优化

### 指标

- FCP - First Contentful Paint：第一个元素被渲染
- LCP - Largest Contentful Paint：可见最大元素被渲染
- FID - First Input Delay：第一次交互到响应
- TTI - Time to Interactive：所有元素被加载完成
- TBT - Total Blocking Time：FCP 到 TTI 之间阻塞时间的总长

### 网络

1. 减少 HTTP 请求：合并资源文件，小图片内联，雪碧图 (`background-position`) 等 (这里暂不考虑 HTTP/2)
2. 减小资源体积：gzip (服务器) ，webp 图片 (`picture` 和 `srcset`)
3. 缓存：CDN 缓存，HTTP 缓存 (`Cache-Control`，`Last-Modified`，`Etag 304`) ，Service Worker (拦截 HTTP 请求)

### HTTP/2

- 服务端推送：PUSH 方法；例如请求 `.html` 时服务端主动尝试返回 `.css` 和 `.js` 等资源
- 多路复用：尝试将多个 HTTP 请求合并一起发送；在 HTTP/1.1 中，`keep-alive` 可以使 TCP 连接保持打开，但数据传输依旧是 `请求 A => 响应 A => 请求 B => 响应 B` 的模式，而在 HTTP/2 中，就可以实现 `请求 A 和 B => 响应 A 和 B`；在使用 HTTP/2 的情况下，"减少 HTTP 请求" 这类的性能优化并不一定在所有情况下都能有效
- 首部压缩：HTTP 头压缩和复用等
- 二进制分帧：将信息分割为更小的帧，并对它们采用二进制编码，其中例如 HTTP 头会被封装到 Headers 帧

### DOM 与渲染

1. 基础内容：头部 CSS (异步) ，JS 的 `async` 与 `defer`
2. DOM 操作：减少大规模 DOM 操作，使用 class 修改样式，使用 CSS 动画和 `requestAnimationFrame`
3. 事件代理：列表内每个元素设置一个事件 vs 整个列表设置事件 (可冒泡)

## 移动 Web 开发

### 兼容

移动端浏览器的碎片化比桌面端严重，设备之间的差距也很大，很多系统内置 WebView 的更新不及时，因此要注意新特性的兼容。

个人使用 Modernizr 检测兼容性问题，视情况引入 polyfill；原生新特性可以利用 Babel 转译。

### 性能

移动端性能相对来说一定是较差的，不仅仅针对于移动端，类似减少大规模 DOM 操作、小图片的 base64 内联和 lazyload 之类都是有效果的。

### 像素

- px：CSS 内的 px，浏览器使用的单位 (例如：320x568)
- 物理像素：设备屏幕本身像素 (例如：640x1136)
- DPR：设备像素缩放比 (1px = DPR^2 x dp，例如当 DPR=2 时，一个 CSS 像素等于四个物理像素)

因此在这种情况下，直接指定 1px CSS 边框实际是 2px 物理像素的边框。

- PPI：一般单位英寸像素密度较高

同时，各个设备的 viewport 定义一般不同，因此一般手动指定 viewport 宽度为设备宽度：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

两种设计模式：

1. 直接根据计算出的 CSS 像素进行设计，比如上文的 320x568
2. DPR=2，缩放比设为 0.5，根据设备物理像素进行设计

对于边框问题：

1. 利用 CSS Media Query 检查 `-webkit-min-device-pixel-ratio`，设置小数边框 (兼容性问题)
2. 利用 JS 检查 DPR 动态设置 viewport meta 头里的缩放 (`initial-scale`) 和根元素上的字体大小；这个方案需要全局使用 rem 单位，适合新项目
3. 利用图片，`border-image` 或 `background-image`
4. `transform: scale(0.5)`，比例利用 CSS Media Query 检查

### 交互

为了触屏操作而产生的 300 毫秒问题，普通网页一般没事，但要有 APP 体验的话需要解决。

使用 `touch` (`start`、`move`、`end`、`cancel`) 相关事件代替 `click`，注意点击穿透问题，A 上面的 B 元素 `touchstart` 触发后，若 A 消失则 B 的 `click` 会被触发。

弹性滚动：

```css
div {
  -webkit-overflow-scrolling: touch;
}
```

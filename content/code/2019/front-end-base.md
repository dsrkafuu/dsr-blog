---
title: '前端应用笔记'
date: 2019-09-07T23:00:01+08:00
tags:
  - web
description: '前端应用笔记。'
---

前端应用笔记。

<!--more-->

## 性能优化

### 网络

1. 减少 HTTP 请求：合并资源文件，小图片内联，雪碧图 (`background-position`) 等
2. 减小资源体积：gzip (服务器) ，webp 图片 (`picture` 和 `srcset`)
3. 缓存：CDN 缓存，HTTP 缓存 (`Cache-Control`，`Last-Modified`，`Etag 304`) ，Service Worker (拦截 HTTP 请求)

- `Cache-Control`，`max-age` 内浏览器直接获取资源，不发送 HTTP 请求
- 若 `Cache-Control` 过期但服务器设置过 `Etag` 发送响应 (比如取文件 md5 作为 `Etag`) ，下一次客户端发送相同请求时，会设置 `If-None-Match` 为这个 md5，若服务器判断一致则返回 `304`，不下载文件直接获取资源
- 客户端带上 `If-Modified-Since` 发送请求，服务器判断未修改过则 `304`，不下载文件直接获取资源

### 数据

1. 图片懒加载、进度条显示
2. 数据请求的本地缓存：`localStorage`，`sessionStorage`，Service Worker

### DOM 与渲染

1. 基础内容：头部 CSS (异步) ，JS 的 `async` 与 `defer`
2. DOM 操作：减少大规模 DOM 操作，多使用 CSS 动画和 `requestAnimationFrame`

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

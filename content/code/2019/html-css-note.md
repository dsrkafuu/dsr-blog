---
title: 'Web 基础、HTML 与 CSS 笔记'
date: 2019-12-12T10:20:43+08:00
tags:
  - html
  - css
description: 'Web 基础、HTML 与 CSS 笔记。'
image: '/images/2019/html-css-note/header.webp'
---

Web 基础、HTML 与 CSS 笔记，随着自己开发中遇到的各种问题而逐渐更新。

<!--more-->

## HTTP

### 从输入 URL 到页面加载完成发生了什么

1. DNS 解析：优先查找缓存
2. TCP 连接：三次握手；客户端发送报文等待服务器确认，服务端确认发回报文等待建立连接，客户端发送包确认建立连接
3. 发送 HTTP 请求
4. 服务器处理请求并返回 HTTP 报文
5. 浏览器解析渲染页面
6. 断开连接：TCP 四次挥手

### 浏览器渲染页面的过程

火狐使用 Gecko 渲染引擎，以 WebKit 为例：

1. 首先通过请求得到 HTML
2. 解析 HTML 生成 DOM 树
3. 遇见 CSS、图片等则异步加载，不会阻塞 DOM 树的生成
4. 遇见普通的 JS 则阻塞 DOM 树加载，等到 JS 加载且执行完后继续生成 DOM 树
5. 将 DOM 树 和 CSS 规则树合并到一起生成渲染树
6. 遍历渲染树计算节点的信息并绘制到屏幕

### 重绘 repaint 和重排 reflow

1. 重绘是屏幕中一部分的内容重新渲染
2. 重排则是因为某些元素的尺寸或存在与否改变了，因此需要重新计算渲染树对元素进行排列
3. 重排必然带来重绘，但重绘不一定会带来重排，比如只改变文字的颜色，盒子的背景色等

### HTTP 概述

全名超文本传输协议，特性：本质是无状态的，使用 Cookies 可以创建有状态的会话；一般基于 TCP/IP 协议，默认端口 80；请求和响应两个部分

### HTTP 请求

```http
GET / HTTP/1.1
Host: developer.mozilla.org
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0
Accept: text/css,*/*;q=0.1
Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Cookie: dwf_sg_task_completion=False; _ga=GA1.2.2100708258.1587297770
```

- HTTP method：GET、POST、OPTIONS 等
- 资源路径
- HTTP 协议版本号
- 其他 headers
- 如果是例如 POST，还会包含发送的信息

### HTTP 响应

```http
HTTP/2 200 OK
content-type: image/png
content-length: 63794
last-modified: Tue, 17 Dec 2019 00:26:34 GMT
server: AmazonS3
date: Mon, 08 Jun 2020 11:02:02 GMT
cache-control: public,max-age=31536000,immutable
age: 239312

<!DOCTYPE html>
<html lang="zh">
...
```

- HTTP 版本号
- 状态码和状态信息：一般由三位构成
  - 1xx 表示请求已经接受
  - 2xx 表示请求已经处理
  - 3xx 重定向
  - 4xx 一般为客户端错误
  - 5xx 一般为服务器错误
  - 常见的：200 OK；403 Forbidden；404 Not Found；502 Bad Gateway
- 其他 headers
- 信息

### 常见的信息头

- Host：服务器域名
- User-Agent：UA
- Cookie：Cookie 会一直被携带在 HTTP 请求内发送给服务器，`localStorage` 和 `sessionStorage` 仅和浏览器本地有关，且 `sessionStorage` 仅在当前浏览器窗口关闭之前有效

### RESTful API

[阮一峰的博客](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)

## HTML5

### 新增元素

[前往 W3school CN](https://www.w3school.com.cn/html/html5_new_elements.asp)

### 置换元素

浏览器根据元素的标签和属性，来决定元素的具体显示内容。

`<img> <input> <textarea> <select> <object>`

置换元素即是图片在 Firefox 浏览器内 (如搭配 Flexbox 使用时) 底部出现白条的原因，显式设置 `display: block;` 即可解决。

### source 标签和 srcset

```html
<picture>
  <source srcset="/assets/img/avatar.webp" type="image/webp" />
  <source srcset="/assets/img/avatar.jpg" type="image/jpeg" />
  <img src="/assets/img/avatar.jpg" alt="DSRKafuU Avatar" />
</picture>
```

### File API

[前往 MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/File/Using_files_from_web_applications)

## 盒模型

`box-sizing` 定义了如何计算一个元素的总宽度和总高度。

- `content-box`：`width / height = content`；默认值，即标准盒子模型。width 与 height 只包括内容的宽和高，边框和内外边距均不包含在内。
- `border-box`：`width / height = content + padding + border`；IE 默认值。width 与 height 为内容、内边距和边框的总和。

## CSS 选择器

### 伪类与伪元素

- 伪类：元素的特定状态，例如 `:hover`、`:first-child` 等选中的都是已经确实存在的元素，CSS3 指定使用单冒号
- 伪元素：原本并不在文档树中的元素，例如 `::before` 第一个字，如果不单独创建个 span 就无法直接选中 ，CSS3 标准要求使用双冒号，但兼容单冒号

### 运算符

- 后代选择器 `div p`：div 内所有的 p，包括嵌套下去在别的元素里的
- 子元素选择器 `div>p`：div 内所有直接子元素 p，不包括嵌套下去的
- 相邻兄弟选择器 `div+p`：位于 div 后的第一个 p，同级，注意 div 不被选中
- 后续兄弟选择器 `div~p`：所有位于 div 后的 p，同级，注意 div 不被选中

### 选择器优先级

一个选择器的优先级由四个分量构成，每匹配一个规则各在对应位置上加一分：

1. 千位：内联样式
2. 百位：ID 选择器
3. 十位：类选择器、伪类、属性选择器
4. 个位：元素选择器、伪元素

| 选择器                                    | 权重 | 内容                         |
| :---------------------------------------- | :--- | :--------------------------- |
| `h1`                                      | 0001 | 元素选择器                   |
| `h1 + p::first-letter`                    | 0003 | 2 元素选择器 + 1 伪元素      |
| `li > a[href*="en-US"] > .inline-warning` | 0022 | 2 元素 + 1 属性选择器 + 1 类 |
| `#ident`                                  | 0100 | 1 ID 选择器                  |

覆盖 `!important` 唯一的办法就是另一个 `!important` 具有相同优先级而且顺序靠后，或者更高优先级。

## 图片防抖占位

```html
<div class="wrapper">
  <img src="/api/detail/0001.jpg" />
</div>
```

以长宽比 55:100 为例

**使用 padding：**

```css
.banner {
  width: 100%;
  overflow: hidden;
  height: 0;
  padding-bottom: 55%;
}
```

**使用 viewport (移动端)：**

```css
.banner {
  // width: 100vw;
  height: 55vh;
}
```

注意如果显式规定 `100vw` 的 `width` 可能会导致在使用 Chromium 的控制台模拟移动端 DEBUG 时横向宽度溢出，一般使用默认的 `display: block;` 即可

## SCSS 实用性

MAP LIST 循环工具类实现：

```scss
// COLORS
// 名称颜色值冲突需要注意,
$colors: (
  'primary': #db9e3f,
  'white': #fff,
  'grey': #999,
);
@each $key, $var in $colors {
  .color-#{$key} {
    color: $var;
  }
  .color-bg-#{$key} {
    background-color: $var;
  }
}
// ALIGN
$aligns: (left, center, right);
@each $var in $aligns {
  .text-#{$var} {
    text-align: $var;
  }
}
// 直接获取
font-size: map-get($font-sizes, 'md');
```

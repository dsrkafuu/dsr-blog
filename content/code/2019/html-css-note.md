---
title: 'HTML 与 CSS 笔记'
date: 2019-12-12T10:20:43+08:00
tags:
  - html
  - css
description: 'HTML 与 CSS 笔记。'
image: '/images/2019/html-css-note/header.webp'
---

HTML 与 CSS 笔记，随着自己开发中遇到的各种问题而逐渐更新。

<!--more-->

## HTML

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

## 常规布局

### 水平居中

- 文本 / 行内元素 / 行内块级元素：`text-align: center;`
- 单个块级元素：`width: 100px; margin: 0 auto;`
- 多个块级元素：子元素 `display: inline-block;`，父元素 `text-align: center;`
- 绝对定位
- Flexbox：`display: flex; justify-content: center;`

## BFC

BFC 即块级格式上下文，当元素具有 BFC 特性后就变成了一个独立的容器，内部的元素不会在布局上不会影响到任何外部的元素。

### 触发要求

- 浮动元素 (`float: none`; 以外的)
- 绝对定位元素 (`absolute` 和 `fixed`)
- `display` 设置为 `inline-block`、`tabel-cells` 和 `flex`
- `overflow` 设置为 `visible` 以外的值

### 用途

基础 clearfix (清除浮动)：

高度不正常的父元素设置 overflow 来触发 BFC。

现代 clearfix (清除浮动)：

```css
.clearfix::after {
  content: '';
  clear: both;
  display: table;
}
```

阻止元素被浮动元素覆盖：

```html
<div style="height: 100px; width: 100px; float: left; background: lightblue">一个左浮动的元素</div>
<div style="width: 100%; height: 200px; background: #eee">
  一个没有设置浮动, 也没有触发 BFC 的元素
</div>
```

在这种情况下，蓝色的小方块会覆盖在灰色的上层，产生类似 word 图片嵌入的文字包裹效果。 给灰色的方块添加 `overflow` 触发 BFC，则可以实现自适应两栏布局。

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

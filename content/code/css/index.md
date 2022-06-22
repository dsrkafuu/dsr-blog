---
title: 'CSS'
date: 2020-01-22T17:12:11+08:00
description: 'CSS 重难点整理，包括元素类型、盒模型、选择器、布局等内容。'
---

## 行内元素与块元素

行内元素：

- 和其它元素布局在同一行
- 宽高不可控，默认为内部文字或图片的宽度
- 内外边距横向有效，纵向可设置但无实际效果
- 只能容纳文本或其他行内元素

块元素：

- 在新行上开始
- 宽高内外边距可控，默认为全宽
- 可以容纳其他行内元素与块元素

## Box 模型

- `content-box`：w3c 标准盒模型 (宽高不包括 padding 和 border)
- `border-box`：ie 盒模型 (怪异模型) (宽高包括 padding 和 border)

## BFC 块格式上下文

一个独立的容器，不受外部影响，不影响外部。

形成条件：

- 根元素
- `position` 为 `fixed` 或 `absolute`
- `float` 浮动元素 (除了 none)
- `overflow` 为 `hidden`、`auto` 或 `scroll`
- `display` 为 `inline-block` 或 `table-cell` 等
- `display` 为 `flex`、`grid` 的直接子元素

布局规则：

- 内部 box 在垂直方向顺序放置
- 同 BFC 内相邻 box 的 margin 会合并
- BFC 区域不会与 float box 重叠 (传统的自适应两栏布局)

## Flex 布局

- `flex: auto;`：`flex: 0 1 auto;`
- `flex: none;`：`flex: 0 0 auto;`
- `flex: 1;`：`flex: 1 1 0%;`

## CSS 选择器

### 伪类与伪元素

- 伪类：元素的特定状态，例如 `:hover`、`:first-child` 等选中的都是已经确实存在的元素，CSS3 指定使用单冒号
- 伪元素：原本并不在文档树中的元素，例如 `::before`、`:first-letter`，如果不单独创建个 span 就无法直接选中 ，CSS3 标准要求使用双冒号，但兼容单冒号

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

## 百分比参照

- `position: absolute`：最后一个已定位的父元素
- `border-radius`：自身

## BEM 命名法

```css
.block,
.block__element,
.block--modifier {
}
```

- `block`：某个元素或组件
- `block__element`：`block` 的后代，是完整 block 的一部分
- `block--modifier`：`block` 的不同状态或不同版本

可以配合 CSS Module 使用将类名进行 HASH。

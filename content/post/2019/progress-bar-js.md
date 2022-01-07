---
title: '使用 ProgressBar.js 为页面添加浏览进度条'
date: 2019-06-14T19:15:00+08:00
keywords:
  - 'html'
  - 'css'
  - 'javascript'
description: '在给自己博客写主题的时候，计划要加个返回页面顶部的按钮。既然按钮也计划上了，干脆又决定在上面顺便集成一个进度条来显示当前的阅读进度。'
---

在给自己博客写主题的时候，计划要加个返回页面顶部的按钮。既然按钮也计划上了，干脆又决定在上面顺便集成一个进度条来显示当前的阅读进度。作为懒人模范的我自然又开始想着 `Ctrl+C` 了，找了一圈后发现个很不错的轮子 [ProgressBar.js](https://github.com/kimmobrunfeldt/progressbar.js)。

[ProgressBar.js](https://github.com/kimmobrunfeldt/progressbar.js) 能借助 SVG 生成各种形状的响应式进度条。它本身提供了线形，圆形和半圆形等形状，也可以用 Adobe Illustrator 之类的矢量图形编辑器创建自己想要的自定义图形。

<!--more-->

## 简单使用

由于我们只是用在静态页面上，直接通过 CDN 引入 `progressbar.js` 即可：

```html
<!-- 引入 -->
<script src="https://cdn.jsdelivr.net/npm/progressbar.js@1.1.0/dist/progressbar.min.js"></script>
<!-- 生成进度条使用的 div -->
<div id="progress"></div>
```

针对不同项目需求还有其他多种方式，详见[官方文档](https://progressbarjs.readthedocs.io/en/latest/#install)。

引入 js 后即可初始化进度条：

```javascript
var bar = new ProgressBar.Circle('#progress', {
  color: '#8AA2D3',
  strokeWidth: 12,
});
bar.animate(1);
```

以上代码实现的内容为在 `id="progress"` 的 div 内生成一个颜色为 `#8AA2D3` 的宽度为 `12` 的圆形进度条，如下图：

`bar.animate(1);` 意为将进度条进度调整至 1，并且显示动画。

更多实例请见[官方示例列表](https://kimmobrunfeldt.github.io/progressbar.js/)。

## 生成时调整进度条样式

首先生成预置的进度条：

```javascript
var barType1 = new ProgressBar.Circle(); // 圆形
var barType2 = new ProgressBar.Line(); // 线性
var barType3 = new ProgressBar.SemiCircle(); // 半圆形
```

在初始化时即可对进度条样式进行调整，以下为设置项的详情：

```javascript
{
    // 进度条颜色
    color: '#3A3A3A',

    // 进度条宽度百分比，默认为 1.0
    // 当使用线性进度条时应通过调整生成进度条的 container 高度来设置进度条宽度
    // 注意：IE 不支持超过 6 的值
    strokeWidth: 2.1,

    // 当未设置轨迹 (占位) 相关的选项时，轨迹默认不会显示

    // 轨迹颜色
    trailColor: '#F4F4F4',

    // 轨迹宽度百分比，默认与进度条宽度相同
    trailWidth: 0.8,

    // Inline CSS 样式
    // 设置为 null 完全关闭默认样式
    svgStyle: {
        display: 'block',
        width: '100%'
    },

    // 文字选项，文字将会以 <p> 元素形式创建
    // 当设置了文字的时候 'position: relative' 将会默认使用
    // 也可通过 'text.style: null' 关闭
    text: {
        value: 'Text', // 默认为 null
        className: 'progressbar-text',

        // 文字的 Inline CSS 样式
        // 设置为 null 完全关闭默认样式
        style: {
            color: '#F00',
            position: 'absolute',
            left: '50%',
            top: '50%',
            padding: 0,
            margin: 0,
            transform: {
                prefix: true,
                value: 'translate(-50%, -50%)'
            }
        },

        // false 将取消开启文字显示时自动设置 'position: relative' 的功能
        autoStyleContainer: true,

        // 半圆图形用，对齐底部
        alignToBottom: true
    },

    // 填充色
    fill: 'rgba(0, 0, 0, 0.5)',

    // 动画持续时间，单位为 ms
    duration: 1200,

    // 动画效果
    easing: 'easeOut',

    // 自定义动画
    from: { color: '#EEE' },
    to: { color: '#000' },
    step: function(state, circle, attachment) {
        circle.path.setAttribute('stroke', state.color);
    },
}
```

## 后期调整进度条样式

`.animate(progress, [options], [cb])`

设置进度条进度，且显示动画，进度范围为 0-1。

`.set(progress)`

设置进度条进度，不显示动画，进度范围为 0-1。

`.stop()`

停止进度条动画至当前为止。

`.value()`

返回当前至，在进度条展示动画时会即时变化。

`.setText(text)`

设置文字。

更详细的文档请见[官方文档](https://progressbarjs.readthedocs.io/en/latest/#install)。

## 实现带进度条的返回按钮

习惯原因，继续使用 jQuery：

```javascript
$(function () {
  // 初始化进度条
  var bar = new ProgressBar.Circle('#progress', {
    color: '#8AA2D3', // 设置为主题色
    strokeWidth: 12, // 调整宽度
    trailColor: '#E5E2E4',
    trailWidth: 12,
    text: {
      value:
        '<svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M177 159.7l136 136c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160 255.9l-96.4 96.4c-9.4 9.4-24.6 9.4-33.9 0L7 329.7c-9.4-9.4-9.4-24.6 0-33.9l136-136c9.4-9.5 24.6-9.5 34-.1z"></path></svg>',
      autoStyleContainer: false,
      style: null, // 关闭所有 Inline CSS 便于另外设置
    },
    fill: '#E5E2E4',
  });
  // 获取当前页面位置百分比
  var scrolled =
    $(window).scrollTop() / ($(document).height() - $(window).height() - 1);
  // 设置百分比，初始化时展示动画应对直接刷新时的情况
  bar.animate(scrolled);
  // 监控页面滚动，调整百分比避免图形不闭合
  $(window).scroll(function () {
    scrolled =
      $(window).scrollTop() / ($(document).height() - $(window).height() - 1);
    if (scrolled < 0.0005) {
      scrolled = 0;
    } else if (scrolled > 1) {
      scrolled = 1;
    }
    bar.set(scrolled);
  });
});
// 返回顶部的按钮
$('#container-progress').click(function () {
  $('html, body').animate(
    {
      scrollTop: 0,
    },
    'slow'
  );
  return false;
});
```

调整样式：

```scss
#container-progress {
  // 按钮固定在页面右下
  position: fixed;
  width: 3em;
  right: 1em;
  bottom: 1em;

  // 应用之前定义好的主题色 mixin
  @include link-primary();

  .progressbar-text {
    svg {
      // 调整 CSS 大小并置中
      width: 24px;
      vertical-align: middle;
    }

    // 上箭头显示在中央
    position: absolute;
    left: 50;
    top: 50;
    transform: translate(-50, -50);
  }
}
```

## 参考

- [Docs | ProgressBar.js](https://progressbarjs.readthedocs.io/en/latest/api/shape/)
- [Build Custom Responsive Progress Bars with ProgressBar.js | Jake Rocheleau](https://www.hongkiat.com/blog/progressbar-js/)

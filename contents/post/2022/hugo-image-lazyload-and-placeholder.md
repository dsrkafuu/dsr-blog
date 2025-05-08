---
title: 'Hugo 图片懒加载和自适应 CSS 图片占位'
date: 2022-05-07T11:28:12+08:00
keywords:
  - 'hugo'
  - '图片'
  - '懒加载'
  - 'css'
  - '占位'
description: '对于未对中国大陆优化的博客站点而言，图片懒加载几乎是必备的功能，它能够有效提高页面的首屏速度。'
---

对于未对中国大陆优化的博客站点而言，图片懒加载几乎是必备的功能，它能够有效提高页面的首屏速度。静态站点的懒加载方案有很多，但都必然会带来布局偏移的问题，影响页面的 [CLS 分数](https://web.dev/cls/)。

本文将基于浏览器原生懒加载和 Hugo 使用的 Golang `html/template` 模板引擎，实现图片懒加载和对不同比例自适应的 CSS 图片占位。

<!--more-->

## 懒加载实现

图片懒加载有很多实现方式。很久以前有基于 jQuery 的 [Lazy Load](https://plugins.jquery.com/lazyload/)，如今随着 jQuery 退场几乎不再使用了；后来有基于原生 [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) 实现的 [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload)，可以基本上符合懒加载的需求。

随着越来越多曾经的第三方 JS 实现的功能被标准化，针对图片和 iframe 的浏览器原生的懒加载出现在了 [HTML 标准](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#lazy-loading-attributes)中。在写下这篇文章的 2022 年中旬，根据 [Can I use](https://caniuse.com/loading-lazy-attr)，Chrome 77+、Edge 79+、Firefox 75+ 和 Safari 15.4+ 均支持了对图片元素的原生懒加载。

![Can I use 支持图](20220507114713.webp)

作为一个仅对最新大版本提供支持的博客，使用原生懒加载已经不成问题，且原生懒加载的策略由浏览器决定，可以随着版本更新而优化，实现也非常简单：

```html
<img src="https://example.org/img.jpg" loading="lazy" alt="Lazy Image" />
```

## 布局偏移问题

凡是懒加载的图片，必然会出现布局偏移的问题。在图片加载前，图片占据高度为 0，而图片加载后，图片占据高度可能会发生变化，从而导致布局偏移。

布局偏移问题的常规解决方案如下，以全宽图片为例：

1. 将 `img` 元素放置在两层 `div` 容器中
2. 设置外层容器的 `position` 属性为 `relative`，`width` 为 `100%`
3. 设置内层容器的 `height` 为 `0`, `padding` 为图片宽高比
4. 为最外层容器设置占位背景色

```scss
.fiximg {
  position: relative;
  display: block;
  overflow: hidden;
  background-color: var(--color-wrapper);
  width: 100%;

  &__container {
    display: block;
    width: 100%;
    height: 0;
    margin: 0;
    padding-bottom: '<ASPECT RATIO HERE>';

    img {
      display: block;
      width: 100%;
      margin: 0;
      color: var(--color-primary);
      font-size: inherit;
      text-align: center;
    }
  }
}
```

但是，对于博客文章而言，插入图片的宽高比是不确定的，因此将固定宽高比的效果非常一般。

## Go HTML 模板实现

本站的静态网页生成器 Hugo 使用 Golang 的 `html/template` 模板引擎实现模板。

本站的图片资源结构是分散式的。对于每篇文章，Hugo 都存在[页面资源](https://gohugo.io/content-management/page-resources/)这一概念，即在每篇文章的 `index.md` 同目录下的资源文件会被 Hugo 认为是该文章特有的资源。

Hugo 在渲染插入图片时，允许通过 [Markdown Render Hooks](https://gohugo.io/templates/render-hooks/) 的方法对渲染的 HTML 进行自定义，因此主要的实现就在这之中进行。

首先创建 `layouts/_default/_markup/render-image.html` 文件，获取图片资源：

```go
{{ $image := .Page.Resources.Match .Destination }}
{{ if ge (len $image) 1 }}
{{ $image = index $image 0 }}
{{ else }}
{{ warnf "Image not found \"%s\"" .Destination }}
{{ end }}
```

获取图片后，解析图片的宽高，并将宽高乘上 `1.0` 转换为浮点数：

```go
{{ $imageHeight := mul $image.Height 1.0 }}
{{ $imageWidth := mul $image.Width 1.0 }}
{{ if or (lt $imageHeight 1) (lt $imageWidth 1) }}
{{ warnf "Image not valid \"%s\"" .Destination }}
{{ end }}
```

随后，根据宽高计算图片的宽高比，并生成底部 padding 的内联样式：

```go
{{ $ratio := mul (div $imageHeight $imageWidth) 100 }}
{{ $css := printf "padding-bottom: %.4f%%;" $ratio }}
```

最后，根据图片宽度，为大图设置全宽，小图设置为原始宽度，并输出 HTML 即可：

```go
{{ $width := "width: 100%;" }}
{{ if le $imageWidth 652 }}
{{ $width = printf "width: %.0fpx;" $imageWidth }}
{{ end }}
```

```html
<!-- goldmark will insert p tag before & after image div so theres no need to wrap it with p tag -->
<div class="fiximg" style="{{ $width | safeCSS }}">
  <div class="fiximg__container" style="{{ $css | safeCSS }}">
    <img loading="lazy" src="{{ $image.Permalink }}" alt="{{ .Text }}" />
  </div>
</div>
```

## 效果预览

以这篇文章上文的图片为例，加载前：

![懒加载前示意图](20220507123213.webp)

加载完成后：

![懒加载后示意图](20220507123236.webp)

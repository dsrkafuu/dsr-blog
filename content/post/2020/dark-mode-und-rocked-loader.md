---
title: 'CloudFlare 的 Rocket Loader 导致切换夜间模式闪烁'
date: 2020-06-08T10:31:55+08:00
tags:
  - 'html'
  - 'javascript'
  - 'cloudflare'
description: 'Hugo 主题夜间模式填坑，却遇上了 CloudFlare 的另一个坑。'
image: '/images/header/cloudflare.webp'
---

近来在给我的 Hugo 主题 [Fuji](https://github.com/amzrk2/hugo-theme-fuji) 写一次大更新，准备添加一些新功能顺便整理一下混乱的 SCSS 结构。由于近期入手一台 iPad，晚上几乎一直是在夜间模式下逛网页，因此计划给主题添加一个夜间模式。原本挺简单的一个小功能没想到却踩了不少坑，在此记录一下。

<!--more-->

## 原始实现

实现方法很常见，由于切换主题需要顺便重置 [medium-zoom](https://github.com/francoischalifour/medium-zoom) 的背景和 [utterances](https://utteranc.es/) 评论区的主题，因此暂时还没用上 `prefers-color-scheme` 媒体特性，计划之后再添加。目前仅仅是简单的对 `body` 元素添加一个 `data-theme` 属性，通过 js 切换顺便写入 `localStorage`。

### 主题切换按钮

```js
// toggle theme
function toggleTheme() {
  $('body').attr('data-theme', (index, attr) => {
    if (attr === 'light') {
      localStorage.setItem('fuji_theme', 'dark');
      return 'dark';
    } else {
      localStorage.setItem('fuji_theme', 'light');
      return 'light';
    }
  });
}
```

### 加载网页时检测记录的偏好

将检测偏好的代码块直接置于 `body` 下，试图避免网页闪烁。

```html
<body data-theme="{{ .Site.Params.toggleMode }}">
  <script>
    // detect theme data in localStorage
    // change the data-theme attribute of body
    var fujiThemeData = localStorage.getItem('fuji_theme');
    if (fujiThemeData) {
      if ($('body').attr('data-theme') !== fujiThemeData) {
        $('body').attr('data-theme', (index, attr) => {
          if (fujiThemeData === 'dark') {
            return 'dark';
          } else {
            return 'light';
          }
        });
      }
    } else {
      localStorage.setItem('fuji_theme', $('body').attr('data-theme'));
    }
  </script>
  ...
</body>
```

## 遇见问题

在本地测试网页主题切换时一切正常，网页间切换、刷新时也未见闪烁情况。当部署至博客测试时发现问题，网页主题的切换总会在 DOM 加载完成后才进行，导致网页产生十分明显的闪烁问题。为排除问题，将网页直接部署到阿里云，发现闪烁问题消失。在 F12 内监视网页加载情况，发现通过 CloudFlare 加速后的网页在加载时全部内联 `<style>` 块均为注释状态，约 1 秒后自动解除注释并添加 `type="text/javascript"` 属性。

检查 CloudFlare 加速设置后发现 Rocket Loader 处于开启状态，CF 的官方解释为：

> Rocket Loader 会将您所有 JavaScript 的加载一直推迟到渲染之后再进行，从而优先处理您网站的内容（文本、图像、字体等）。
> 在使用 JavaScript 的页面上，这可使您的用户获得更快加载的体验，并且可改善 TTFP、TTFCP、TTFMP 和文件加载等性能指标。

大概的实现方式是通过 CF 提供的 rocket-loader.min.js 推迟 js 加载和执行，因此将加载网页时检测记录偏好的代码延后执行导致网页闪烁。

## 关闭 Rocket Loader

如需对指定的代码片段关闭 Rocket Loader，只需给 `<script>` 标签添加属性 `data-cfasync="false"` 即可。由于其依赖于 jQuery，因此 `<head>` 引入 jQuery 的 `<script>` 标签也需添加该属性。

修改完成并清空对应域名的 CF 缓存后测试正常。

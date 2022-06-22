---
title: '更新深色模式主题并支持 prefers-color-scheme'
date: 2020-06-15T09:20:21+08:00
keywords:
  - 'html'
  - 'javascript'
  - 'css'
  - '深色模式'
  - '夜间模式'
  - '教程'
  - '指南'
description: '自己给博客写的主题 Fuji 正在进行大改版，顺手也把夜间模式进行了改版以适配 prefers-color-scheme。'
---

自己给博客写的主题 [Fuji](https://github.com/dsrkafuu/hugo-theme-fuji) 正在进行大改版，顺手也把夜间模式 (深色模式、黑暗模式？都差不多) 进行了改版以适配 `prefers-color-scheme`。

## v1 的旧实现方法

起初写主题的时候深色模式用了最基础的办法，也是兼容性最好的办法。给 `body` 加上 `data-theme` 属性，根据属性值是 light 还是 dark 判断主题。CSS 中独立写出两种配色，分别包括在 `body[data-theme='light']` 和 `body[data-theme='light']` 块内。

直接维护两套样式的方法清晰直观，但会造成冗余代码，而且构建一时爽、维护火葬场。

<!--more-->

## v2 的新实现方法

首先给主题脑内定义三种模式，`auto`、`light` 和 `dark`。`auto` 模式 (自动模式) 下，主题显示根据 `prefers-color-scheme` 也就是系统自身设定来判断具体显示效果，而 `light` 和 `dark` 模式下 (可以统称为与自动模式对应的手动模式)，则分别显示对应的 `light` 和 `dark` 效果，忽略系统自身设定。

其次需要大概设定一下切换逻辑。当用户第一次进入页面时，模式默认为 `auto`，根据浏览器或者系统的设定来显示。当用户切换为特定模式时，将切换后的模式存储在 `localStorage` 内，方便下一次加载。但是有一点要注意，切换后的模式存储是存 `auto` 还是 `light` 和 `dark` 需要进行判断。

举个栗子：用户可能在白天进入网页，在操作系统或浏览器还没有自动切换到深色模式时，就通过网站上的开关切换显示模式为 `dark` 模式。经过一个夜晚后到了次日白天，用户再度访问网站时，此时依旧是之前设定的 `dark` 模式。这里有两种处理方法，一种是此时直接自动重置为 `auto` 模式，根据 `prefers-color-scheme` 显示；另一种是暂时不管，当用户在第二天白天再次试图手动切换回 `light` 模式时，自动重置为 `auto` 模式。也就是说，当用户试图将模式切换成与系统一致的情况时，重置为 `auto`，以后也就跟随系统了；当用户不做这一步，那么无论系统怎么样，网页永远是用户一开始手动设置的模式。

为了方便适配 `prefers-color-scheme`，将基于 SCSS 变量复用实现的两套 CSS 整合到一套 CSS 中，利用 CSS 自己的变量设定不同的主题。

### 两种模式的 CSS 变量实现

这里由于项目用了 SCSS，方便起见就不改了，不用也可以的：

```scss
// 变量设定部分
@mixin light {
  --color-mode: 'light';
  --color-bg: #fffffd;
}

@mixin dark {
  --color-mode: 'dark';
  --color-bg: #2f3136;
}

body[data-theme='auto'] {
  @include light();

  @media (prefers-color-scheme: dark) {
    @include dark();
  }
}

body[data-theme='light'] {
  @include light();
}

body[data-theme='dark'] {
  @include dark();
}

// 变量使用部分
body {
  background-color: var(--color-bg);
}
```

简单来说就是 `body` 的 `data-theme` 为 `light` 或 `dark` 时直接使用固定的颜色变量，为 `auto` 时根据 `prefers-color-scheme` 设定颜色变量。

### 目标效果预览

### 打开页面的模式检测和切换按键 JS 实现

JS 方面，首先进入页面时需要判断是否为自动模式或是有曾经手动设定过模式：

```js
// 从 localStorage 检测主题
var themeData = localStorage.getItem('data-theme');
// 如果是第一次进入页面，直接设置为 auto
if (!themeData) {
  localStorage.setItem('data-theme', 'auto');
} else {
  // 如果非自动模式，调整主题
  if (themeData !== 'auto') {
    document.body.setAttribute(
      'data-theme',
      themeData === 'dark' ? 'dark' : 'light'
    );
  }
}
```

其次是改变主题的按钮：

```js
// 获取当前实际主题的函数
function getNowTheme() {
    let nowTheme = document.body.getAttribute('data-theme');
    if (nowTheme === 'auto') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
        return nowTheme === 'dark' ? 'dark' : 'light';
    }
}

// 改变主题的按钮
document.querySelector('.btn .btn-toggle-mode').addEventListener('click', () => {
    let nowTheme = getNowTheme();
    let domTheme = document.body.getAttribute('data-theme');
    let systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    if (domTheme === 'auto') {
        // 如果当前为自动模式，切换至用户选择的模式
        document.body.setAttribute('data-theme', nowTheme === 'light' ? 'dark' : 'light');
        localStorage.setItem('fuji_data-theme', nowTheme === 'light' ? 'dark' : 'light');
    } else if (domTheme === 'light') {
        // 如果当前不为自动模式，且将要切换至 dark 模式
        document.body.setAttribute('data-theme', 'dark');
        // 如果将要切换至的 dark 模式是系统当前的模式
        localStorage.setItem('fuji_data-theme', systemTheme === 'dark' ? 'auto' : 'dark');
    } else {
        // 同上 else if
        document.body.setAttribute('data-theme', 'light');
        localStorage.setItem('fuji_data-theme', systemTheme === 'light' ? 'auto' : 'light');
    }
}
```

以上，就基本完工啦。其他的就是一些后期工作，比如应对 `localStorage` 无法写入之类的情况，这里就不实现了。

## 最终效果实例

本站。

## 参考

- [你好黑暗，我的老朋友 —— 为网站添加用户友好的深色模式支持 | Sukka's Blog](https://blog.skk.moe/post/hello-darkmode-my-old-friend/)

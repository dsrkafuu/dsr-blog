---
title: '博客主题重构记录'
date: 2021-05-04T15:24:25+08:00
keywords:
  - 'css'
  - '主题'
  - 'hugo'
description: '整理下混乱的博客主题结构，为后续减少浪费在维护上的时间打下基础。'
banner: 'hugo.webp'
---

我的[博客旧主题](https://github.com/dsrkafuu/hugo-template-aofuji)是基于初学前端时写的 [Fuji 主题](https://github.com/dsrkafuu/hugo-theme-fuji)构建的大改版，而在历经多次小修小补之后终于进入了维护不动的的状态。无论是 Hugo 模板本身，还是相配的 JS 和 CSS 都进入了完全的混乱状态。趁着近期有一点时间，是时候来一次重构了。

<!--more-->

## 整体设计

整体颜色设计基本不变，为了优化整体的样式统一性，主要改动点如下：

- 移除副色调 hover 样式，使用下划线高亮 hover 可点击元素
- 调整全局背景色
- 调整卡片背景色为半透明，配合 CSS `backdrop-filter` 属性实现毛玻璃效果

为减小 CSS 文件大小，移除使用的 Bulma 和 Primer CSS 框架，全部样式均为自定义。

## 模块和设计相关

### 列表

- 文章列表添加字数和阅读时间显示，移动端隐藏
- 笔记列表样式完全重写
- 友链列表样式完全重写

### 侧边栏

- 移除侧边栏的 Firefox 和 Mozilla 广告
- 移除由 Vue.js 构建的自定义搜索，转为 Google 搜索直接跳转
- 粘性元素调整

### Navbar 和 Footer

- 粘性 navbar 配合 CSS `backdrop-filter` 属性实现毛玻璃效果
- 移除 footer 背景色
- 移除 footer 站点状态链接

### 图片

- 全图片迁移至 WebP
- 全图片采用浏览器原生 lazyload

### 评论区

- 利用 Disqus 的 favicon 检查连接状态以选择性加载评论区
- 使用 Intersection Observer 懒加载防止页面性能被连接检查请求拖慢

## 代码结构相关

### JS

- 开发模式由 Hugo 内置 ESBuild 构建，生产模式由 rollup 配合 Babel 构建
- 拆分为组件和插件对功能进行分类
- 剪贴板拦截逻辑调整，仅非代码块且大于 100 字时插入版权信息
- 全模块改写为异步函数，主线程中根据当前页面的 section 并发运行

### CSS

- 自定义 Prism 主题
- CSS 类名格式调整
- 移除所有 CSS 库完全重写，包括 Bulma 和其他 normalize 等

### Go HTML

- 基础模板调整，提供 head 和 main 两个模块，便于选择性插入对应的 CSS 和 JS
- 模板传参全面改为使用 scratch
- 添加通用 pagination 模板
- Lazyload 图片通过内置函数获取长宽比，并用内联样式进行懒加载占位渲染

## 规范相关

- 外置 JS 脚本全部使用自定义动态 loader 加载
- 各模块需要的 DOM 相关属性名定义在各模块内部

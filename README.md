# dsr-blog

![](https://img.shields.io/github/last-commit/dsrkafuu/dsr-blog)
![](https://img.shields.io/github/package-json/v/dsrkafuu/dsr-blog)
[![](https://img.shields.io/github/license/dsrkafuu/dsr-blog)](https://github.com/dsrkafuu/dsr-blog/blob/main/LICENSE)

新版整合式个人博客 [dsr-blog](https://blog.dsrkafuu.net)，基于 Hugo 实现，包含博客文章和笔记整合。非面向主题使用者的通用主题，如果有朋友感兴趣也欢迎发 issue、修改或自己使用。

## 浏览器支持

站点使用的部分现代标准功能如下：

- [WebP 图片](https://caniuse.com/webp)
- [CSSOM Scroll-behavior](https://caniuse.com/css-scroll-behavior)
- [浏览器原生图片懒加载](https://caniuse.com/loading-lazy-attr)
- [CSS Backdrop Filter](https://caniuse.com/css-backdrop-filter)

Supports major browser versions released at 2020 or `ES2020`.

- Chrome: >=87
- Firefox: >=78
- Safari: >=14

## 部分开发细节

### 环境变量

- `HUGO_SENTRY_DSN`

### Hugo

- 内置 ToC 层级限制 2-3
- 完全自定义的分页控制，通过 partial 配合 scratch 变量引入
- 所有可用的 Fromt Matter:
  - `toc`：使用 `false` 关闭目录
  - `banner`：文章头图，可为空
- Lazyload 图片通过 Hugo 内置函数获取长宽比，并用内联样式进行懒加载占位渲染
- 自定义头图路径解析，查找页面资源的 `*index.webp` 文件

### JS

- JS 通过 ESBuild 打包编译
- 手机侧边栏控制 fixed 定位 right 偏移量实现动画淡入，用于显示目录

### CSS

- CSS 通过 Hugo Pipes 由 SCSS 编译而来
- 全局主题与色彩均通过 CSS 变量实现以便于适配多主题
- 定义不同比例占位适应 lazyload，使用 shortcode 参数传入比例渲染对应占位
- Navbar 为响应式，移动平台高度与排列方式单独定义
- 所有标题在 Summary 内不显示
- 侧边栏与导航栏在手机平台上固定，且导航栏上 RSS 在手机上为目录，通过 `data-section` 属性判定

### 评论区

移除评论区，一劳永逸解决审查问题。

## LICENSE

This project and all contributors shall not be responsible for any dispute or loss caused by using this project.

This project is released under the `GNU AGPLv3`, for more information read the [License](https://github.com/dsrkafuu/dsr-blog/blob/main/LICENSE).

**Copyright © 2018-present DSRKafuU (<https://dsrkafuu.net>)**

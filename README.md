# dsr-blog

![GitHub last commit](https://img.shields.io/github/last-commit/dsrkafuu/dsr-blog)
![GitHub package.json version](https://img.shields.io/github/package-json/v/dsrkafuu/dsr-blog)
![GitHub license](https://img.shields.io/github/license/dsrkafuu/dsr-blog)

新版整合式个人博客 [dsr-blog](https://blog.dsrkafuu.net)，基于 Hugo 实现，包含博客文章和笔记整合。非面向主题使用者的通用主题，如果有朋友感兴趣也欢迎发 issue、修改或自己使用。

## 浏览器支持

站点使用的部分现代标准功能如下：

- [WebP 图片](https://caniuse.com/webp)
- [CSSOM Scroll-behavior](https://caniuse.com/css-scroll-behavior)
- [浏览器原生图片懒加载](https://caniuse.com/loading-lazy-attr)
- [CSS Backdrop Filter](https://caniuse.com/css-backdrop-filter)

对于不支持的浏览器将**不会使用任何** fallback 或 polyfill (例如 Safari 13 及以下的 WebP 支持和 Safari 中的图片懒加载支持)。

在以下支持列表以外的浏览器中出现的站点问题将**不会被修复**：

- Chrome 80+
- Firefox 80+
- Firefox ESR
- Any Chromium based browser 80+
- Safari 14+ (macOS Big Sur 17+)

## 部分开发细节

### 环境变量

- `DSR_SENTRY_DSN`

### Hugo

- 内置 ToC 层级限制 2-3
- 完全自定义的分页控制，通过 partial 配合 scratch 变量引入
- 所有可用的 Fromt Matter:
  - `toc`：控制是否显示目录
  - `comments`：控制是否显示评论区
  - `license`：控制是否显示 license 区域
  - `image`：文章头图，可为空
- Lazyload 图片通过 Hugo 内置函数获取长宽比，并用内联样式进行懒加载占位渲染

### JS

- JS 通过 rollup 打包编译 (开发模式为 Hugo Pipes 内置的 ESBuild)
- 所有 scripts 局部模板均为异步函数，不同页面按需并发运行
- 手机侧边栏控制 fixed 定位 right 偏移量实现动画淡入，用于显示目录

|      模块       |                链接                 |  用途  |
| :-------------: | :---------------------------------: | :----: |
|    iconfont     |              internal               | common |
|    clipboard    |              internal               | common |
|     comment     |              internal               | common |
|      theme      |              internal               | common |
|       toc       |              internal               | common |
| prism.js\[cdn\] |       <https://prismjs.com/>        | single |
|     gitalk      | <https://github.com/gitalk/gitalk/> | single |

### CSS

- CSS 通过 Hugo Pipes 由 SCSS 编译而来
- 全局主题与色彩均通过 CSS 变量实现以便于适配多主题
- 定义不同比例占位适应 lazyload，使用 shortcode 参数传入比例渲染对应占位
- Navbar 为响应式，移动平台高度与排列方式单独定义
- 所有标题在 Summary 内不显示
- 侧边栏与导航栏在手机平台上固定，且导航栏上 RSS 在手机上为目录，通过 `data-section` 属性判定

### 评论区

- 利用 Disqus 的 favicon 检查连接状态以选择性加载评论区
- 使用 Intersection Observer 懒加载防止页面性能被连接检查请求拖慢

## LICENSE

The theme is released under the `Apache License 2.0`, for more information read the [LICENSE](https://github.com/dsrkafuu/dsr-blog/blob/master/LICENSE).

**Copyright © 2018-present DSRKafuU (<https://dsrkafuu.net>)**

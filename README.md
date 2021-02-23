# dsr-blog

![GitHub last commit](https://img.shields.io/github/last-commit/dsrkafuu/dsr-blog)
![GitHub package.json version](https://img.shields.io/github/package-json/v/dsrkafuu/dsr-blog)
![GitHub license](https://img.shields.io/github/license/dsrkafuu/dsr-blog)

新版整合式个人博客 [dsr-blog](https://blog.dsrkafuu.su)，基于 Hugo 实现，包含博客文章和笔记整合。

基于 Bulma 开发，非面向主题使用者的通用主题，如果有朋友感兴趣也欢迎发 issue、修改或自己使用。模板已经独立发布于：<https://github.com/dsrkafuu/hugo-template-aofuji>；如果你对可以直接使用的 Hugo 主题感兴趣，请见：<https://github.com/dsrkafuu/hugo-theme-fuji>

## 部分开发细节

### Hugo

- `toc: false` 不渲染 ToC
- `image` 字段未设置则不渲染头图
- 内置 ToC 层级限制 2-3
- 完全自定义的分页控制
- Fromt matters:
  - `toc: false`
  - `comments: false`
  - `license: false`

### JS

- CSS 通过 Hugo Pipes 由 ESBuild 编译而来
- 不同模板使用不同的 scripts 局部模板，引入不同依赖库并通过不同入口文件编译主 JS
- Lazyload 图片需要使用 shortcode 并指定固定的长宽比: 文章头图 40x9 anime-note 32x9
- 手机侧边栏控制 fixed 定位 right 偏移量实现动画淡入，用于显示目录
- 自定义搜索通过 CloudFlare Workers 代理的 Google Custom Search 实现
- 自定义搜索模拟标准搜索表单行为，自动替换中文空格等

|      模块       |                  链接                  |  用途  |
| :-------------: | :------------------------------------: | :----: |
|    iconfont     |                internal                | common |
|    clipboard    |                internal                | common |
|     comment     |                internal                | common |
|      theme      |                internal                | common |
|   toc-control   |                internal                | common |
|    lazysizes    | <https://github.com/aFarkas/lazysizes> | common |
|  cf-gsc-proxy   |                internal                | search |
|  vue.js\[cdn\]  |          <https://vuejs.org/>          | search |
| prism.js\[cdn\] |         <https://prismjs.com/>         | single |
|     gitalk      |  <https://github.com/gitalk/gitalk/>   | single |

### CSS

- CSS 通过 Hugo Pipes 由 SCSS 编译而来
- Markdown 渲染内容部分通过修改 Bulma 预定义变量实现，其他部分通过覆盖 CSS 样式实现
- 全局主题与色彩均通过 CSS 变量实现以便于适配多主题
- 定义不同比例占位适应 lazyload，使用 shortcode 参数传入比例渲染对应占位
- Navbar 为响应式，宽度小于 `$tablet` 时高度与排列方式单独定义
- 所有一级标题不显示，所有标题在 Summary 内不显示
- 侧边栏与导航栏在手机平台上固定，且导航栏上 RSS 在手机上为目录，通过 `data-section` 属性判定
- 在 WebKit 桌面浏览器上使用自定义滚动条，但通过 media 查询过滤不适用于移动端

## LICENSE

<a href="https://app.fossa.com/projects/git%2Bgithub.com%2Fdsrkafuu%2Fdsr-blog?ref=badge_large" alt="FOSSA Status"><img align="right" src="https://app.fossa.com/api/projects/git%2Bgithub.com%2Fdsrkafuu%2Fdsr-blog.svg?type=large"/></a>

The theme is released under the `Apache License 2.0`, for more information read the [LICENSE](https://github.com/dsrkafuu/dsr-blog/blob/master/LICENSE).

**Copyright © 2018-present DSRKafuU (<https://dsrkafuu.su>)**

# amzrk2-ng

新版整合式个人站点，基于 Hugo 实现，包含个人信息页面和博客文章整合。

基于 Bulma 开发，非面向主题使用者的通用主题，如果有朋友感兴趣也欢迎发 issue、修改或自己使用。

## 部分开发细节

### Hugo

- `toc: false` 不渲染 ToC
- `image` 字段未设置则不渲染头图
- 内置 ToC 层级限制 2-3
- 完全自定义的分页控制

### JS

- CSS 通过 Hugo Pipes 由 ESBuild 编译而来
- 不同模板使用不同的 scripts 局部模板，引入不同依赖库并通过不同入口文件编译主 JS
- Lazyload 图片需要使用 shortcode 并指定固定的长宽比: 文章头图 40x9 anime-note 32x9
- 手机侧边栏控制 fixed 定位 right 偏移量实现动画淡入，用于显示目录

|        模块         |                  链接                  |    用途     |
| :-----------------: | :------------------------------------: | :---------: |
|      iconfont       |                internal                |   common    |
|        theme        |                internal                |   common    |
|     toc-control     |                internal                |   common    |
|      modernizr      |        <https://modernizr.com/>        |   common    |
|      lazysizes      | <https://github.com/aFarkas/lazysizes> | list single |
|  email-protection   |                internal                | list search |
|  vue.js\[browser\]  |          <https://vuejs.org/>          |   search    |
| prism.js\[browser\] |         <https://prismjs.com/>         |   single    |
|      disqusjs       |  <https://github.com/SukkaW/DisqusJS>  |   single    |

### CSS

- CSS 通过 Hugo Pipes 由 SCSS 编译而来
- Markdown 渲染内容部分通过修改 Bulma 预定义变量实现，其他部分通过覆盖 CSS 样式实现
- 全局主题与色彩均通过 CSS 变量实现以便于适配多主题
- 定义不同比例占位适应 lazyload，使用 shortcode 参数传入比例渲染对应占位
- Navbar 为响应式，宽度小于 `$tablet` 时高度与排列方式单独定义
- 所有一级标题不显示，所有标题在 Summary 内不显示
- 侧边栏与导航栏在手机平台上固定，且导航栏上 RSS 在手机上为目录

## LICENSE

The theme is released under the `Apache License 2.0`, for more information read the [LICENSE](https://github.com/amzrk2/amzrk2-ng/blob/master/LICENSE).

> © 2020 DSRKafuU <amzrk2.cc>

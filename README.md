# amzrk2-ng

新版整合式个人站点，基于 Hugo 实现，包含个人信息页面和博客文章整合。

基于 Bulma 开发，非面向主题使用者的通用主题，如果有朋友感兴趣也欢迎发 issue、修改或自己使用。

## 部分开发细节

### CSS

- CSS 通过 Hugo Pipes 由 SCSS 编译而来
- Markdown 渲染内容部分通过修改 Bulma 预定义变量实现，其他部分通过覆盖 CSS 样式实现
- 全局主题与色彩均通过 CSS 变量实现以便于适配多主题

## LICENSE

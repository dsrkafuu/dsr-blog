---
title: 'Goose Analytics 开发全记录'
date: 2021-02-12T00:00:00+08:00
tags:
  - 'javascript'
  - 'vue'
  - 'mongodb'
  - 'nodejs'
  - 'express'
description: '从制定计划到完成初版，我是如何开发 Goose Analytics 的？'
---

2020 年下旬，[Google Analytics](https://analytics.google.com/) 发布了 v4，数据收集接口迁移为向 `analytics.google.com` 发送 POST 请求，导致中国大陆不可用。于是因此就计划着开发了 [Goose Analytics](https://github.com/amzrk2/goose-analytics)，作为一个超轻量级的自搭建数据收集工具，用于 GA 的简单替代。

<!--more-->

作为我的第一个完全由自己构思的前端项目，同时作为一个我自己每天都需要用到的项目；从制定计划到完成 0.1 版本，我是如何完成 Goose Analytics 的开发的？

## 基础框架

作为一个重要的 [Vue.js](https://vuejs.org/) 练手与应用项目，在前端的管理面板 (也就是数据展示面板) 自然是使用它了。在最初开始计划这个项目的时候，[Vue 3](https://v3.vuejs.org/) 其本身以及新的[组合式 API](https://v3.vuejs.org/guide/composition-api-introduction.html) 的周边生态相对还不是很完善，因此项目选用了 Vue 2 作为前端的基础框架，但在编写代码时也同时考虑了 Vue 3 的[升级兼容性](https://v3.vuejs.org/guide/migration/introduction.html)。

在后端方便，为了开发的方便以及对 [Vercel](https://vercel.com/) 的 serverless 功能的适配，选用了 [express](https://expressjs.com/) 作为基础框架。数据库则是选择了 [MongoDB](https://www.mongodb.com/)，对于一般的使用，[MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 提供的 500 连接数免费数据库非常简单方便，并且数据库本身由于 [mongoose](https://mongoosejs.com/) 的协助使用也十分便捷。

在 tracker 代码方面，借助 [Babel](https://babeljs.io/) 转译或是其他例如 [rollup](https://rollupjs.org/) 之类的工具打包，只通过 [terser](https://terser.org/) 进行一次压缩并且避免使用过多现代 API 来尽可能的缩小文件大小。

## 代码规范

代码规范分为两部分，格式与 lint。

- 格式：[Prettier](https://prettier.io/) 的 VSCode 插件 + lint-staged 用于 pre-commit hook
- lint：eslint

## Trakcer 代码

在什么都没有的最初开发阶段，首要目标是先把 tracker 写完，DEBUG 则是直接将数据发送到 [JSONPlaceholder](https://jsonplaceholder.typicode.com/)。等到 tracker 完成了，再考虑后端的数据库结构设计。

使用类似 Google 的 [Analytics Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/) 的 key 名向后端传送数据，请求将使用 Beacon API。以下是计划收集的数据：

基本数据：

- `t`：数据种类，包含 `view`、`leave` 和 `event`
- `id`：站点 ID
- `sid`：规避使用 cookie 引入的 session ID
- `d`：时间，`Date.now()`

不同数据种类的特定数据：

- `view`：页面访问
  - `r`：`document.referrer`
  - `lng`：用户语言
  - `scn`：屏幕分辨率，`screen` 大小乘 `dpr`
  - 浏览器：服务端[通过 UA 判断](https://www.npmjs.com/package/bowser)
  - 操作系统：服务端[通过 UA 判断](https://www.npmjs.com/package/bowser)
  - 国家 / 地区：服务端通过 IP 判断，基于 [node-maxmind](https://www.npmjs.com/package/maxmind) 与[免费 GeoIP2 数据库](https://dev.maxmind.com/geoip/geoip2/geolite2/)
- `leave`：页面离开
  - `pvt`：页面停留时间
- `event`：页面事件，在 `window` 上注册全局方法顾调用
  - `en`：自定义事件名
  - `et`：事件类型 (传入事件对象或事件名)

为了避免在 tracker 中使用 cookie，`view` 类型的特殊处理：所有 `view` 类型请求将使用带回调的 XHR 发送，当服务器返回 `201` (即 `sid` 未发送或不存在) 时设置 `localStorage` 存储新的 `sid`，当服务器返回 `204` 时无回调；同时，当发送除 `view` 类型以外的请求却未发送有效的 `sid` 时，请求将被 `400` 拒绝。

## 数据库 Model

为 mongoose 设定以下 model：

- `User`：管理用户，初期版本仅提供单个 `admin` 用户
- `Website`：添加的站点，关联 `User`
- `Session`：数据收集的用户
- `View`：网页浏览记录，关联 `Website` 和 `Session`
- `Event`：网页事件记录，关联 `Website` 和 `Session`

## API Collect 路由

完成 tracker 后，下一个任务是接收信息的基本路由。以下为该路由的处理进程：

1. 收到对 `/api/collect` 的 GET 或 POST 请求
2. 检查是否为 bot 或 localhost
3. 检查请求来源网站是否存在
4. 检查 `sid` 是否存在，若不存在，则新建 session
5. 步骤 3、4 并行运行，完成后判断请求类型

`view` 类型：

1. 写入一个新的 view，包含 `path` 和 `ref` 等数据，并且初始化 `pvt` 为 `0`
2. 检查是否需要更新 session 的属性
3. 更新 `language`、`screen`、`browser`、`system` 和 `location`

`leave` 类型：

1. 搜索网页浏览记录，找到上一次同页同用户同路径的记录
2. 修改 `pvt` 字段

特殊注意点：

- 写入 view 之前需要检测以下情况：
  1. 十五分钟内没有同用户同页访问：写入新的 view
  2. 十五分钟内有同用户同页访问：检查是否需要更新 `referrer`，并更新 `date` 为最新时间
- `pvt` 的更新需要使用 `$inc` 从初值 `0` 增加而不是直接替换更新

## 自定义组件库

首先使用 Vue 完成了以下基本组件库：

- `GIcon...`：图标，由 `vue-svg-loader` 提供
- `GButton`：按钮，包括普通、全宽以及全长
- `GCard`：卡片
- `GInput`：输入框
- `GLabel`：用于简单标注的小 tag
- `GHeader`：通用头部
- `GRouterLink`：对 `GButton` 的二次封装
- `GList`：多功能列表，最右一格可选控制或小图表
- `GMessage`：弹出 toast，与 `src/plugins/message.js` 配合提供 `vm.$info` 和 `vm.$error` 方法

组件库通过插件的 `install` 方法使用 `Vue.use` 进行安装。

## 前端路由

### 前端路由规划

- `/dashboard[?website=]`：数据一览 (动态路由)
  - `/dashboard/[type][?website=]`：数据一览 (动态路由)
- `/realtime[?website=]`：实时监控
- `/settings`：设置页 (动态组件)
  - `About`：关于
  - `Account`：用户设置
  - `WebsiteSettings`：网站设置
  - `WebsiteEdit`：网站编辑 (隐藏)
- `/login`：登录页 (登录前)

### Vuex 规划

使用 Vuex 模块定义多个 module：

- `MESSAGE`：`GMessage` 组件相关数据
- `THEME`：主题切换相关数据
- `COMMON`：基本数据，如当前选择的网站、网站列表、登陆的账户等
- `WEBSITE`：`/settings` 设置页面相关数据

### 路由守卫

鉴权检查：

- 前端未登录时仅允许访问 404 页面与登陆页面
- 后端对所有管理路由添加鉴权中间件

站点选择路由 query 同步：

1. 动态更新导航栏连接，添加 `website` query
2. 若直接访问某页面，则在 `Base` (背景与导航栏) 组件中会有更新 query 的操作，因此无需再次检查

## 后端路由

### 后端路由规划

- `/init`：初始化
- `/login`：登录
- `/metrics`：数据展示
  - `/metrics/dashboard[?website=&type=]`：实时页数据展示
  - `/metrics/realtime[?website=]`：实时页数据展示
- `/admin`：设置页
  - `/admin/website`：站点设置
  - `/admin/account`：用户设置

### 账户管理

在请求 `/login` 登录时，首先请求 `/init` 获取初始化状态。若未初始化，则将第一次登录的用户密码存入数据库，否则直接登录。

密码方面，使用传统的 bcrypt + jsonwebtoken 组合，详见：[Node 登录模块、权限验证、错误处理和可配置自定义中间件实现笔记](/post/2020/login-api/jwt/)。

## 更新计划

- 多用户管理
- Vue.js 大版本更新
- Vue CLI 替换为 Vite
- 迁移至 TypeScript
- Chart.js 图表展示与性能优化

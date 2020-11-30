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

作为一个前端实验性项目，同时作为一个我自己每天都需要用到的项目；从制定计划到完成 1.0 版本，我是如何完成 Goose Analytics 的开发的？

## 基础框架

作为一个重要的 [Vue.js](https://vuejs.org/) 练手与应用项目，在前端的管理面板 (也就是数据展示面板) 自然是使用它了。在最初开始计划这个项目的时候，[Vue 3](https://v3.vuejs.org/) 其本身以及新的[组合式 API](https://v3.vuejs.org/guide/composition-api-introduction.html) 的周边生态相对还不是很完善，因此项目选用了 Vue 2 作为前端的基础框架，但在编写代码时也同时考虑了 Vue 3 的[升级兼容性](https://v3.vuejs.org/guide/migration/introduction.html)。

在后端方便，为了开发的方便以及对 [Vercel](https://vercel.com/) 的 serverless 功能的适配，选用了 [express](https://expressjs.com/) 作为基础框架。数据库则是选择了 [MongoDB](https://www.mongodb.com/)，对于一般的使用，[MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 提供的 500 连接数免费数据库非常的完美，并且数据库本身由于 [mongoose](https://mongoosejs.com/) 的协助使用也十分便捷。

在收集代码方面，计划不借助 [Babel](https://babeljs.io/) 转译或是其他例如 [rollup](https://rollupjs.org/) 之类的工具打包，只通过 [terser](https://terser.org/) 进行一次压缩来尽可能地缩小文件大小。

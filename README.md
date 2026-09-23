# dsr-blog

![](https://img.shields.io/github/last-commit/dsrkafuu/dsr-blog)
![](https://img.shields.io/github/package-json/v/dsrkafuu/dsr-blog)
[![](https://img.shields.io/github/license/dsrkafuu/dsr-blog)](https://github.com/dsrkafuu/dsr-blog/blob/main/LICENSE)

**由于个人兴趣转移等原因，本博客将进入维护模式。**

新版整合式个人博客 [dsr-blog](https://blog.dsrkafuu.net)，基于 Next 实现。

## 本地开发

使用 Bun 安装依赖并运行项目，锁文件为 `bun.lock`：

```bash
bun install --frozen-lockfile
bun run dev
```

提交前可运行 `bun run fmt --check`、`bun run lint`、`bun run test` 和 `bun run build`。

## 环境变量

- `NEXT_PUBLIC_GA_ID`
- Giscus 评论区需要同时配置：
  - `NEXT_PUBLIC_GISCUS_REPO`
  - `NEXT_PUBLIC_GISCUS_REPO_ID`
  - `NEXT_PUBLIC_GISCUS_CATE`
  - `NEXT_PUBLIC_GISCUS_CATE_ID`
- `NEXT_PUBLIC_GISCUS_FRIENDS_TERM`：可选，仅用于友链页的指定 discussion 编号

任一 Giscus 必填变量缺失或为空时，评论区不会渲染，页面其余内容保持可用。

内容层默认按操作输出 Markdown 读取和渲染的调用次数、总耗时、平均值与最大值。服务端变量
`CONTENT_LOG_LEVEL` 可设置为 `perf`（默认）、`debug`（额外输出逐项 LRU 缓存命中）或
`silent`（关闭内容层诊断日志）。

## 本地 Agent Skills

项目 skill 不随仓库上传。新克隆仓库后，如需进行 UI 或 React/Next.js 维护，请先在项目目录安装：

```bash
bunx skills add shadcn/ui --skill shadcn --yes
bunx skills add vercel-labs/agent-skills --full-depth --skill vercel-react-best-practices --yes
```

生成的 `.agents/` 与 `.codex/` 仅供本地使用；`skills-lock.json` 纳入 Git，用于锁定项目 skill 来源与版本。

## LICENSE

This project and all contributors shall not be responsible for any dispute or loss caused by using this project.

This project is released under the `GNU AGPLv3`, for more information read the [License](https://github.com/dsrkafuu/dsr-blog/blob/main/LICENSE).

**Copyright © 2018-present DSRKafuU (<https://dsrkafuu.net>)**

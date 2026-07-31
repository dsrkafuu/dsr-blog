# dsr-blog

![](https://img.shields.io/github/last-commit/dsrkafuu/dsr-blog)
![](https://img.shields.io/github/package-json/v/dsrkafuu/dsr-blog)
[![](https://img.shields.io/github/license/dsrkafuu/dsr-blog)](https://github.com/dsrkafuu/dsr-blog/blob/main/LICENSE)

**由于个人兴趣转移等原因，本博客将进入维护模式。**

新版整合式个人博客 [dsr-blog](https://blog.dsrkafuu.net)，基于 Next 实现。

## 环境变量

- `NEXT_PUBLIC_GA_ID`
- Giscus 评论区需要同时配置：
  - `NEXT_PUBLIC_GISCUS_REPO`
  - `NEXT_PUBLIC_GISCUS_REPO_ID`
  - `NEXT_PUBLIC_GISCUS_CATE`
  - `NEXT_PUBLIC_GISCUS_CATE_ID`
- `NEXT_PUBLIC_GISCUS_FRIENDS_TERM`：可选，仅用于友链页的指定 discussion 编号

任一 Giscus 必填变量缺失或为空时，评论区不会渲染，页面其余内容保持可用。

## 本地 Agent Skills

安装用于 UI 与 React/Next.js 维护的可选项目 skill：

```bash
bunx skills add shadcn/ui --skill shadcn --yes
bunx skills add vercel-labs/agent-skills --full-depth --skill vercel-react-best-practices --yes
```

生成的 `.agents/` 与 `.codex/` 仅供本地使用；`skills-lock.json` 纳入 Git，用于锁定项目 skill 来源与版本。

## LICENSE

This project and all contributors shall not be responsible for any dispute or loss caused by using this project.

This project is released under the `GNU AGPLv3`, for more information read the [License](https://github.com/dsrkafuu/dsr-blog/blob/main/LICENSE).

**Copyright © 2018-present DSRKafuU (<https://dsrkafuu.net>)**

---
title: 'GitHub 进行 fork 后的仓库如何与原仓库同步'
date: 2019-12-12T19:07:41+08:00
keywords:
  - 'github'
  - 'git'
description: '向社区贡献代码时也有不少需要注意的点。'
banner: 'github.webp'
---

向一个社区项目贡献代码已经过去很久了，而今天有突发奇想想再贡献点东西。直接改肯定是不行的，删除再 fork 也不是很好的选择，那如何把自己 fork 的项目与原仓库同步呢？这里以 Vue 3 的文档为例展示一下更新的过程。

<!--more-->

## 设置上游仓库

执行 `git remote -v`，如果发现只有一个仓库 `origin`，即本人 fork 仓库的地址，则说明未设置上游仓库。

这里将上游的主仓库设置为 `upstream`：

```bash
git remote add upstream https://github.com/vuejs/docs-next-zh-cn.git
```

再次执行 `git remote -v`，应该就能看到上游仓库了：

## 获取更新并 merge

执行 `git fetch upstream` 抓取原仓库的更新：

使用 `git checkout master` 确保自己在想要同步的分支，这里以 master 分支为例。

确保本地没有未保存的更改后，使用 `git merge upstream/master` 即可将远程的 master 分支合并到当前分支：

---
title: '博客现有仓库 Git LFS 迁移记录'
date: 2021-11-04T13:54:11+08:00
keywords:
  - 'git'
  - 'github'
  - 'lfs'
description: '博客图片越来越多，是时候把二进制资源迁移到 LFS 存储了。'
---

博客图片越来越多，是时候把二进制资源迁移到 LFS 存储了。

<!--more-->

## 安装

```bash
git lfs install
```

## 迁移

迁移针对以下目标：

- 文章目录内的所有图片
- 静态文件目录内的所有图片
- 静态文件目录内图片文件夹的所有内容

```bash
git lfs migrate import --include="content/**/*.webp" --everything
git lfs migrate import --include="content/**/*.jpg" --everything
git lfs migrate import --include="content/**/*.png" --everything
git lfs migrate import --include="static/**/*.webp" --everything
git lfs migrate import --include="static/**/*.jpg" --everything
git lfs migrate import --include="static/**/*.png" --everything
git lfs migrate import --include="static/**/*.ico" --everything
git lfs migrate import --include="static/images/**/*" --everything
```

以上命令将所有本地分支内匹配的文件转为 LFS 存储。

可以通过 `git lfs ls-files` 查看所有已经转为 LFS 存储的文件。

## 推送

```bash
git push --force
```

注意由于 hash 改变其他人需要重新拉取仓库。

## 清理

```bash
git reflog expire --expire-unreachable=now --all
git gc --prune=now
```

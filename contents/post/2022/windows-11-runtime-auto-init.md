---
title: '解决 Windows 11 开机自动安装 UWP Runtime 失败问题'
date: 2022-03-09T17:24:11+08:00
keywords:
  - '微软'
  - 'bug'
  - 'uwp'
  - '运行时'
description: '每次开机进入系统，总会有弹出三条安装 C++ UWP Runtime 的消息，每次都会自动失败。'
---

> 2022-05-18 更新，该方法可能已失效。

每次开机进入系统，总会有弹出三条安装 C++ UWP Runtime 的消息，每次都会自动失败。

<!--more-->

## 问题

![问题截图](20220309171235.webp)

事实上出现问题的包一般有四个，分别是 C++ 2012-2015 UWP Desktop Runtime 三个和一个 DirectX Runtime。DirectX 由于 Steam 很多时候会自动搞定所以很多时候表现为自动安装三个包。有时开机就开始装，有时打开 UWP 应用后装，总之都会失败且没有任何提示。

## 解决

一边抱怨微软不行一边把这些装了就完事了：

- Microsoft DirextX UWP Runtime
- Microsoft C++ 2012 UWP Desktop Runtime
- Microsoft C++ 2013 UWP Desktop Runtime
- Microsoft C++ 2015 UWP Desktop Runtime

![安装示意图](20220506152216.webp)

~~[百度网盘](https://pan.baidu.com/s/1Zf7lQp3r-ismR77YapTm0g?pwd=45na)~~

~~密码 `@dsrkafuu`，资源来自 LTT 论坛。~~

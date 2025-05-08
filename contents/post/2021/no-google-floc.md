---
title: '对 Google 说不 - 本站已启用屏蔽 FLoC 的 HTTP 标头'
date: 2021-06-23T17:17:11+08:00
keywords:
  - 'google'
  - 'floc'
  - 'analytics'
  - 'privacy'
description: 'Google 正试图设计一种方法让广告商在第三方 Cookie 消失后继续根据用户的浏览情况进行跟踪，拒绝第三方 Cookie 不是为了另一个替代品的出现。'
---

被广泛用于定向广告业务和用户数据收集的[第三方 Cookie 即将迎来它的消失](https://www.cookiebot.com/en/google-third-party-cookies/)，而 Google 正试图设计一种方法让广告商在第三方 Cookie 消失后继续根据用户的浏览情况进行跟踪，即 [FLoC](https://github.com/WICG/floc)。

<!--more-->

## 什么是 FLoC

FLoC 通过获取浏览器的浏览记录将用户加入 "相似" 用户的分组内，每个分组拥有对应的 FLoC ID。通过这项技术可以实现猜测和收集用户的喜好等隐私数据，如果你曾经看过自己 Google 账户中的 [Google 广告设置](https://adssettings.google.com)，其中就可以看到你的年龄、喜好、关注、房产状况等等信息，这些信息主要由 Google 的各项数据收集服务、搜索和个人账户信息等等获取而来，而 FLoC 则是通过浏览器获取类似信息的类似技术。

## 为什么要抵制 FLoC

FLoC 被拒绝的原因正是目前第三方 Cookie 逐渐消失的原因，我们需要的是第三方 Cookie 的消失，而不是出现一个类似 (甚至在用于追踪的情况下功能更加完善) 的替代品。

对这项技术的测试过程被部署到了大量的 Google Chrome 用户身上，而 Google 并没有进行提前的公告等工作，以致于大量用户并不了解这项技术。[EFF 的这篇博文](https://www.eff.org/deeplinks/2021/03/google-testing-its-controversial-new-ad-targeting-tech-millions-browsers-heres)详细解释了部分细节，如果需要的可以尝试阅读一下。

## 本博客使用的追踪技术

本博客站点 (DSRBLOG) 使用了两项追踪技术：

1. [Google Analytics](https://analytics.google.com)：为了解各特定博文的访问量而使用，但有很大几率收集到其他数据；虽然我本人并不需要这些数据，但还请对隐私保护敏感的访问者尝试使用 [uBlock](https://ublock.org) 等工具进行屏蔽
2. [CloudFlare Browser Insights](https://blog.cloudflare.com/introducing-browser-insights/)：CloudFlare 提供的网页性能监测工具，不会收集用户特定的信息

## 可以做的事

- 为自己的站点添加相关的拒绝标头：`Permissions-Policy: interest-cohort=()`
- 使用明确表示拒绝的浏览器：[Brave](https://brave.com)、[Vivaldi](https://vivaldi.com/)
- 使用表示暂时不会跟进的浏览器：[Mozilla Firefox](https://www.mozilla.org/en-US/firefox/)、[Microsoft Edge](https://www.microsoft.com/en-us/edge)

## 关于 FLoC 的更多内容

- [EFF - Am I FLoCed?](https://amifloced.org)
- [FLoC away from Chrome!](https://www.floc-away-from-chrome.com)

---
title: '使用 Hugo 的 Data 模板'
date: 2019-03-21T11:42:55+08:00
tags:
  - 'html'
  - 'golang'
  - 'hugo'
description: '近期闲着无事学习 Hugo，光看不过瘾还得上手弄点简单的东西写写。'
image: '/images/header/hugo.webp'
---

近期闲着无事学习 Hugo，光看不过瘾还得上手弄点简单的东西写写。受铃最近直播零轨的启发，就做了个轨迹系列到现在为止的作品汇总。但是一旦真的开始开工了，自然就会想着偷懒，于是尝试了一波 Hugo 的 Data 模板。

<!--more-->

## 原来是什么样的

顺着 [K2Station](https://dsrca.amzrk2.cc/) 的现有内容，依旧是基于 Bootstrap 4，在一个大卡片中使用胶囊导航，内置小卡片，以下是原文代码：

```html
<div class="card-body tab-content">
  <div class="tab-pane fade show active" id="kiseki-sora">
    <div class="row">
      <div class="col-md-4">
        <div class="card mb-3">
          <div class="card-body">
            <img src="assets/img/01-01-sorafc.jpg" class="card-img-top mb-3" />
            <h5 class="card-title">空之轨迹 FC</h5>
            <h6 class="card-subtitle mb-2 text-muted">2004 | PC PSP</h6>
            <p class="card-text">英雄传说系列第六部作品，轨迹系列第一部作品，首发于 PC 平台。</p>
            <a href="https://www.falcom.co.jp/ed6/" target="_blank" class="card-link">官方网站</a>
            <a href="#" target="_blank" class="card-link">相关链接</a>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card mb-3">
          <div class="card-body">
            <img src="assets/img/01-06-sora3rdkai.jpg" class="card-img-top mb-3" />
            <h5 class="card-title">空之轨迹 the 3rd 改 HD EDITION</h5>
            <h6 class="card-subtitle mb-2 text-muted">2013 | PS3</h6>
            <p class="card-text">
              2012 年 Falcom 宣布空之轨迹系列移植至 PS3 平台，并对画面进行高清重制。
            </p>
            <a href="https://www.falcom.co.jp/sora3rd_psp/hd/" target="_blank" class="card-link">
              官方网站
            </a>
            <a href="#" target="_blank" class="card-link">相关链接</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="tab-pane fade" id="kiseki-zeroao">零之轨迹 | 碧之轨迹 占位</div>
  <div class="tab-pane fade" id="kiseki-sen">闪之轨迹 占位</div>
</div>
```

由于每一块卡片部分的内容都是统一的，再加上从 Falcom 官网拔下来的信息整理为 json 很方便，就直接用了 Data 模板，也方便将来更新。

## 模板运用

原本的 html 代码是直接写在 `content/kiseki/_index.html` 内的，为了用上 Data 模板需要做一些改动。

`content/kiseki/_index.html` 内仅保留 Front Matter，内容置空，全部内容直接在 `layout/kiseki/list.html` 内管理。

以下是 `data/kiseki.json` 的内容示例：

```json
{
  "sora": [
    {
      "img": "01-01-sorafc.jpg",
      "name": "空之轨迹 FC",
      "meta": "2004 | PC PSP",
      "des": "英雄传说系列第六部作品，轨迹系列第一部作品，首发于 PC 平台。",
      "link1": "https://www.falcom.co.jp/ed6/",
      "link2": ""
    },
    {
      "img": "01-05-sorasckai.jpg",
      "name": "空之轨迹 SC 改 HD EDITION",
      "meta": "2013 | PS3",
      "des": "2012 年 Falcom 宣布空之轨迹系列移植至 PS3 平台，并对画面进行高清重制。",
      "link1": "https://www.falcom.co.jp/sorasc_psp/hd/",
      "link2": ""
    }
  ]
}
```

以下是 `layout/kiseki/list.html` 的内容示例：

```html
<div class="tab-pane fade show active" id="kiseki-sora">
    <div class="row">
        {{ range .Site.Data.kiseki.sora }}
        <div class="col-md-4">
            <div class="card mb-3">
                <div class="card-body">
                    <img src="assets/img/{{ .img }}" class="card-img-top mb-3">
                    <h5 class="card-title">{{ .name }}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">{{ .meta }}</h6>
                    <p class="card-text">{{ .des }}</p>
                    <a href="{{ .link1 }}" target="_blank" class="card-link">官方网站</a>
                    <a href="#" target="_blank" class="card-link">相关链接</a>
                </div>
            </div>
        </div>
        {{ end }}
    </div>
    </div>
    <div class="tab-pane fade" id="kiseki-zeroao">
        零之轨迹 | 碧之轨迹 占位
    </div>
    <div class="tab-pane fade" id="kiseki-sen">
        闪之轨迹 占位
    </div>
</div>
```

零轨、闪轨的内容类推即可。

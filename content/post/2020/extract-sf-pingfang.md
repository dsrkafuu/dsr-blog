---
title: 'Catalina 新版苹方字体的提取与移植'
date: 2020-05-01T10:54:25+08:00
tags:
  - 'font'
  - 'apple'
description: '近来由于本地项目需求，需要在 Windows 下临时使用苹方字体。但是旧版苹方的移植方案已经失效，因此需要使用新的方法。'
image: '/images/header/macos-catalina.webp'
---

> 注意：未经授权修改与使用 PingFang 字体是侵犯 Apple 公司版权的行为

各位五一劳动节快乐！近来由于本地项目需求，需要在 Windows 下临时使用苹方字体。目前网上使用最广的两个移植版本都为很旧的 `10.11d9e1`，且字重和渲染都有不小的问题，用起来很不舒服。但是旧版苹方的移植方案已经失效，因此需要使用新的方法。

<!--more-->

## 提取源字体

根据[苹果官网的预置字体清单](https://support.apple.com/zh-cn/HT210192)，决定使用 Catalina 作为文件来源，预置的苹方字体版本为 `15.0d2e5`。

从 Catalina 系统内的 `/System/Library/Fonts` 内取出 `PingFang.ttc` 即可。

![macOS 字体文件夹截图](/images/post/2020/extract-sf-pingfang/20200425135558.webp)

## TTC 解包

使用 Adobe Font Development Kit for OpenType 的 Python 脚本 `otc2otf.py` ([下载地址](https://blogs.adobe.com/CCJKType/files/2014/01/otc2otf.py)) 将 `PingFang.ttc` 解包为各字重分开的 OpenType 字体文件：

```bash
python otc2otf.py -w PingFang.ttc
```

注意 `otc2otf.py` 需要在 Python 2 下运行。解包会将 PSNameUndefined.otf 一起提取出来，由于对移植没什么用删除即可。最终得到如下文件：

![解包后的字体截图](/images/post/2020/extract-sf-pingfang/20200425140859.webp)

## 旧移植方法 (失效)

解包获取的字体由于没有 Windows 平台的 CMap，因此无法在 Windows 下直接安装使用。在最初的 DP1 版本中，只需对 ttc 文件进行解包即可在 Win­dows 下正常使用，而 DP2 之后的版本却不能这样，其根本原因是 DP1 版本的字体有以下 4 个 CMap 子表：

```html
<cmap_for­mat_4 plat­formID="0" pla­tEn­cID="3" lan­guage="0">
  <cmap_for­mat_12
    plat­formID="0"
    pla­tEn­cID="4"
    for­mat="12"
    re­served="0"
    length="185584"
    lan­guage="0"
    nGroups="15464"
  >
    <cmap_for­mat_4 plat­formID="3" pla­tEn­cID="1" lan­guage="0">
      <cmap_for­mat_12
        plat­formID="3"
        pla­tEn­cID="10"
        for­mat="12"
        re­served="0"
        length="185584"
        lan­guage="0"
        nGroups="15464"
      ></cmap_for­mat_12></cmap_for­mat_4></cmap_for­mat_12
></cmap_for­mat_4>
```

而 DP2 之后的版本却变成了 2 个 CMap 子表：

```html
<cmap_for­mat_4 plat­formID="0" pla­tEn­cID="3" lan­guage="0">
  <cmap_for­mat_12
    plat­formID="0"
    pla­tEn­cID="4"
    for­mat="12"
    re­served="0"
    length="189520"
    lan­guage="0"
    nGroups="15792"
  ></cmap_for­mat_12
></cmap_for­mat_4>
```

由于缺乏 `plat­formID` 为 `3` 的子表，Win­dows 将其视为了无效的字体文件。将 DP2 之后的字体文件修改为兼容 Win­dows 的字体文件的方法就是加入对应的表了。

但是在对从 Catalina 中提取出的 `15.0d2e5` 版的字体进行处理后发现，该版本的 CMap 表拥有完整的 4 个子表，但是 Windows 仍然无法正常识别，因此这种移植方法已经失效。

## 新移植方法

为了找出新版字体的移植方法，使用 [CrossFont](https://www.acutesystems.com/scrcf.htm) 对提取出的 otf 进行修改。该软件为付费软件，但有 15 天的试用期，如果只是需要简单实用的话可以直接使用该软件编辑所有提取出的 otf，即可在 Windows 下正常使用。将 CrossFont 生成的文件与提取出的源文件进行对比，发现仅需要修改 name 表的部分内容即可使字体在 Windows 上正常识别、安装。

为此需要安装 [Font­Tools](https://github.com/fonttools/fonttools/releases) 以进行字体 name 表编辑。为方便起见，这里直接在 WSL 内进行操作，其他平台相关教程请见 [Font­Tools 安装与使用简明指南](https://darknode.in/font/font-tools-guide/)，以 Reg­u­lar 字重为例：

安装 Font­Tools 并提取出 name 表：

```bash
sudo apt install fonttools
ttx -t name PingFangSC-Regular.otf
```

![提取 name 表截图](/images/post/2020/extract-sf-pingfang/20200425145049.webp)

编辑生成的 `PingFangSC-Regular.ttx` 移除这些字段：

```html
<namerecord nameID="0" platformID="3" platEncID="1" langID="0x404">
  Copyright © 2015 DynaComware. All rights reserved.
</namerecord>

<namerecord nameID="3" platformID="3" platEncID="1" langID="0x404">
  PingFang SC Regular; 15.0d2e5; 2019-06-14
</namerecord>

<namerecord nameID="5" platformID="3" platEncID="1" langID="0x404"> 15.0d2e5 </namerecord>

<namerecord nameID="6" platformID="3" platEncID="1" langID="0x404"> PingFangSC-Regular </namerecord>

<namerecord nameID="7" platformID="3" platEncID="1" langID="0x404">
  PingFang is a trademark of Apple Inc.
</namerecord>

<namerecord nameID="10" platformID="3" platEncID="1" langID="0x404">
  Designed by DynaComware &amp; Apple.
</namerecord>

<namerecord nameID="11" platformID="3" platEncID="1" langID="0x404"> http://dynacw.com </namerecord>
```

重新打包字体：

```bash
ttx -b -m PingFangSC-Regular.otf PingFangSC-Regular.ttx
```

![打包完成截图](/images/post/2020/extract-sf-pingfang/20200425151150.webp)

得到的 `PingFangSC-Regular#1.otf` 即可在各系统正常安装使用，其他文件类推。

## 字体下载 (测试用)

本人移植了全部 18 个字体文件，方便各位需要在 Windows 下临时使用的朋友，需要的可以在[此处下载](https://pan.baidu.com/s/1IZpVAkyJkU-mkRD2oEOPYg) (提取码：8ri1；解压密码：amzrk2.cc)。

**此处分享的文件仅供交流测试使用，请于下载后 24 小时内删除，任何商业使用及商业利益冲突带来的法律纠纷与本人无关、概不负责。**

## 参考

- [CMap 表相关修改技术简要指南](https://darknode.in/font/cmap-modify-tutorial/)
- [A Few Notes on Using OS X 10.11's New Chinese Font](https://gist.github.com/bitinn/42c95ed95aa3dcf155e2)

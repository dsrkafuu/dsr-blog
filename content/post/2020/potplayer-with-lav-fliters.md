---
title: '简单配置 PotPlayer、LAVFilters 和 xy-VSFilter 满足基本 BDRIP 回放需求'
date: 2020-05-11T19:13:47+08:00
tags:
  - 'anime'
  - 'video'
description: '现在的高清视频观看体验，瓶颈不在片源，也不在制作，而是在播放器。'
image: '/images/2020/potplayer-with-lav-fliters/header.webp'
---

涉及回放似乎就脱不开 madVR，但是我现在不再使用 madVR 自然也是有其原因的。

正如大家所知道的，madVR 几乎是当前最好的解决方案，原生 10bit 输入、颜色处理、高质量缩放。但是 madVR 依旧有个最大的麻烦就是配置。即使是在有大量的配置教程、一键导入与安装的今天，其步骤依旧相当繁琐。

<!--more-->

其次，对我个人来说其实对回放并没有那么高的要求，本身的显示设备也有限，还要考虑平时在低性能设备上回放超高码率录制视频的性能，妥协设定配置。这么一比，配置 madVR 就不再是必然选项了。因此，我转向了争取在我的几台设备上都能很快搞定、方便且体验一致、但回放效果又不过于糟糕的选项。这样我用它干啥都行。

## 所需软件

注意：以下内容下载时可能需要部分科学技术，抑或是找国内替代源。

### PotPlayer

请直接至[官网](https://potplayer.daum.net/?lang=zh_CN)下载最新 x64 版本，写下文章时的版本为 200317 (1.7.21149)。

安装过程一路下一步即可，没啥要修改的，唯一需要注意的是在最后一步时记得勾选安装额外的编解码器，如下图：

![PotPlayer 安装图](/images/2020/potplayer-with-lav-fliters/20200419203943.webp)

### LAVFilters

请直接至 [GitHub](https://github.com/Nevcairiel/LAVFilters/releases) 下载最新版本，写下文章时的版本为 0.74.1。

安装过程勾选 LAV Video Decoder (x64)、LAV Audio Decoder (x64) 和 LAV Splitter Source (x64) 即可。

## 配置 PotPlayer

### 关闭所有内置图像滤镜

![关闭所有内置图像滤镜示意图](/images/2020/potplayer-with-lav-fliters/20200419205416.webp)

### 启用 LAVFilters

右击进入选项，进入下左图所示选项卡，选择 "滤镜/解码器管理"，点击下右图中所示 "搜索后添加"，此时左侧一栏会出现搜索到的滤镜，直接确定即可。

![添加滤镜示意图](/images/2020/potplayer-with-lav-fliters/20200419205506.webp)

确定后，将 "源滤镜/分离器" 内如下图将所有可以设置为 LAV Splitter Source 的全部设置为它，"视频解码器" 内全部设置为 LAV Video Decoder，音频解码器内全部设置为 LAV Audio Decoder。

![设置滤镜示意图](/images/2020/potplayer-with-lav-fliters/20200419205622.webp)

### 视频渲染设置

渲染器设为 EVRCP，尺寸调整使用 Lanczos 3。"色系/属性" 选项卡，设置 YCbCr<->RGB 规则自动选择。

![视频渲染设置示意图](/images/2020/potplayer-with-lav-fliters/20200419210902.webp)

### 音频渲染设置

音频输出改为 WASAPI 渲染器，关闭让声音变得极其难受的规格化。

![音频渲染设置示意图](/images/2020/potplayer-with-lav-fliters/20200419210927.webp)

## 测试 LAVFilters 启用状态

此时随便打开一个视频，使用 `Tab` 键打开信息覆盖层，应该能看到如下图情况，则已正常启用。

{{< lazy "16x9" "测试 LAVFilters 启用状态示意图" "/images/2020/potplayer-with-lav-fliters/20200419211847.webp" >}}

## 设置 LAVFilters

重新右击进入选项，如下图选项卡选择任意为 LAV Splitter Source 右侧的 "..." 按钮，进入分离器设置，如下图打开系统托盘图标便于切换音视频轨道。(当然使用播放器自带亦可)

![LAV Splitter Source 示意图](/images/2020/potplayer-with-lav-fliters/20200419211942.webp)

同理在 "视频解码器" 选项卡进入 LAV Video Decoder 设置，如下图只保留 RGB24 和 RGB32，其他选项视硬解需求而定，建议如图软解。

![LAV Video Decoder 示意图](/images/2020/potplayer-with-lav-fliters/20200419212026.webp)

"音频解码器" 选项卡进入 LAV Audio Decoder 设置，开启 Mixing，物理多声道玩家除外。

![LAV Audio Decoder 示意图](/images/2020/potplayer-with-lav-fliters/20200419212350.webp)

至此，设置已经基本完成，可以投入使用了。

## (可选) 配置 xy-VSFilter 优化外挂字幕性能与效果

### xy-VSFilter

至 [GitHub](https://github.com/Cyberbeing/xy-VSFilter/releases/tag/3.0.0.306) 下载 `xy-VSFilter_3.0.0.306_x64.zip`，解压至任意英文目录，以管理员身份运行 `Install_VSFilter.bat` 注册 dll。

![注册 dll 示意图](/images/2020/potplayer-with-lav-fliters/20200419215553.webp)

进入 "全局滤镜优先权" 选项卡，添加系统滤镜 DirectVobSub 以及 DirectVobSub (auto-loading version)，并将他们都改为强制使用。

![全局滤镜优先权示意图](/images/2020/potplayer-with-lav-fliters/20200419215628.webp)

播放带有外挂字幕的视频，系统托盘出现绿色箭头表示加载成功。

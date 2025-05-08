---
title: 'libwebp 文档笔记 - dwebp 部分'
date: 2020-04-02T18:56:25+08:00
keywords:
  - 'webp'
  - '文档'
  - '图片处理'
description: 'dwebp 将 WebP 文件解压成 PNG, PAM, PPM 或 PGM 图像。'
---

> 基于 libwebp-1.1.0，发布于 2020-01-06T23:53:53Z

## Synopsis

`dwebp [options] input_file.webp`

## Description

dwebp 将 WebP 文件解压成 PNG, PAM, PPM 或 PGM 图像。<!--more-->

## Options

`-h`

输出使用情况概要。

`-version`

输出版本号 (major.mini.review) 并退出。

`-o string`

指定输出文件的名称 (默认为 PNG 格式)。使用 "-" 作为输出文件名将直接输出到 'stdout'。

`-- string`

指定输入文件。如果输入文件以 '-' 开头，这个选项很有用。这个选项必须出现在最后。后面的其他选项将被忽略。如果输入文件是 "-"，数据将从 'stdin' 中读取，而不是文件。

`-bmp`

将输出格式改为未压缩 BMP。

`-tiff`

将输出格式改为未压缩 TIFF。

`-pam`

将输出格式改为 PAM (保留 alpha 通道)。

`-ppm`

将输出格式改为 PPM (丢弃 alpha 通道)。

`-pgm`

将输出格式改为 PGM。输出由 luma/chroma 采样代替 RGB，使用 IMC4 布局。此选项主要用于调试。

`-yuv`

将输出格式改为原始 YUV。输出由 luma/chroma-U/chroma-V 采样代替 RGB，按顺序保存为单个平面。此选项主要用于调试。

`-nofancy`

不使用 YUV420 的 fancy upscaler。这可能会导致锯齿状的边缘 (尤其是红色的边缘)，但应该会更快。

`-nofilter`

即使比特流需要，也不使用环内过滤。这可能会在不符合要求的输出上产生可见的色块，但会使解码速度更快。

`-dither strength`

指定一个抖动强度，数值介于 0 到 100 之间。抖动是一种后处理效果，适用于有损压缩中的色度成分。它有助于平滑渐变和避免带状伪影。

`-nodither`

关闭所有抖动 (默认)。

`-mt`

尝试多线程处理。

`-crop x_position y_position width height`

以 `x_position` 和 `y_position` 为左上角的基点，依照提供的长宽裁剪。裁剪的范围必须为原图的子集。

`-flip`

纵向翻转解码后的图像 (对例如 OpenGL 贴图之类很有用)。

`-scale width height`

将解码后的图片调整为 宽度 x 高度。这个选项主要是为了减少解码大图片所需的内存，当只需要一个小的版本 (缩略图、预览等) 时。注意: 在裁剪后会应用缩放比例。

`-v`

输出额外信息 (特别是编码时间)。

`-noasm`

禁用所有组合优化。

## Examples

```bash
dwebp picture.webp -o output.png
dwebp picture.webp -ppm -o output.ppm
dwebp -o output.ppm -- ---picture.webp
cat picture.webp | dwebp -o - -- - > output.ppm
```

## Authors

dwebp is part of libwebp, and was written by the WebP team. The latest source tree is available at <https://chromium.googlesource.com/webm/libwebp/>

This manual page was written by Pascal Massimino pascal.massimino@gmail.com, for the Debian project (and may be used by others).

Output file format details

- PAM: <http://netpbm.sourceforge.net/doc/pam.html>
- PGM: <http://netpbm.sourceforge.net/doc/pgm.html>
- PPM: <http://netpbm.sourceforge.net/doc/ppm.html>
- PNG: <http://www.libpng.org/pub/png/png-sitemap.html#info>

DSRKafuU(amzrk2)

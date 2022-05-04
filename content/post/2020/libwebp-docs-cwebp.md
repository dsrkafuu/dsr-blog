---
title: 'libwebp 文档笔记 - cwebp 部分'
date: 2020-03-27T19:36:16+08:00
keywords:
  - 'webp'
  - '文档'
  - '图片处理'
description: "cwebp 使用 WebP 格式对图像进行压缩。输入格式可以是 PNG, JPEG, TIFF, WebP 或原始 Y'CbCr 样本。"
---

> 基于 libwebp-1.1.0，发布于 2020-01-06T23:53:53Z

## Synopsis

`cwebp [options] input_file -o output_file.webp`

## Description

cwebp 使用 WebP 格式对图像进行压缩。输入格式可以是 PNG, JPEG, TIFF, WebP 或原始 Y'CbCr 样本。<!--more-->

## Options

### Basic Options

`-o string`

输出文件。若未提供，cwebp 将会如常进行编码但只输出编码详情不输出文件。使用 "-" 直接输出至 stdout。

`-lossless`

无损编码模式。

`-q float`

指定 compression factor，默认 75。

在默认的有损编码模式下，更小的数字输出更小、低质量的文件，100 为最佳质量。

在使用 `-lossless` 指定的有损编码模式下，更小的数字使处理速度更快，但是输出更大的文件，100 为最高压缩率。

`-z int`

类似 -q 的简化版，指定整数 0-9，更小的数字使处理速度更快，但是输出更大的文件，9 为最慢。

`-alpha_q int`

指定 alpha compression factor，设置为 100 即无损 alpha 压缩，默认为 100。

`-preset string`

指定预置的 preset，选项有：default, photo, picture, drawing, icon, text。

此选项会覆盖其他相关选项 (除了 `-q`)，因此应提供在其他选项之前。

`-m int`

指定压缩方法，在速度与文件大小和质量间权衡。可选值为 0-6，默认为 4。当设置为更高的数值，编码器将会花费更多时间追求质量。

`-resize width height`

修改分辨率，如果宽高中有一项为 0，将会自动维持长宽比不变。

`-crop x_position y_position width height`

以 `x_position` 和 `y_position` 为左上角的基点，依照提供的长宽裁剪。裁剪的范围必须为原图的子集。

`-mt`

尝试多线程处理。

`-low_memory`

减少内存占用量。

### Lossy Options

此部分选项尽在有损编码 (默认) 模式下有效。

`-size int`

指定一个目标文件大小 (bytes)。编码器会多次编码压缩尝试以尽量靠近指定的文件大小。

`-psnr float`

指定一个目标 PSNR (dB)。编码器会多次编码压缩尝试以尽量靠近指定的属性值。

`-pass int`

指定在使用以上 `-size` 或 `-psnr` 指令时的最大编码次数。最大值为 10，默认值为 1。若使用了 `-size` 或 `-psnr` 指令但是未明确指定 `-pass`，默认值将会被设置为 6 (即最大 6 次编码)。

`-af`

打开 auto-filter。这种算法会花费额外的时间来优化平衡图像质量。

`-jpeg_like`

此选项会使编码器生成与使用 JPEG 编码器时产生的文件容量大小类似的文件，但是将会有更好的图像质量。

### Advanced Options

`-f int`

指定去块滤波器的强度，范围为 0 (无过滤) 至 100 (最大过滤) 之间。值为 0 将关闭任何过滤。该值越高，图像就越平滑。典型值通常在 20 到 50 之间。

`-sharpness int`

指定滤波的锐度 (若已启用 `-f` 选项)。范围为 0 (最锐利) 至 7 (最不锐利) 之间。默认值为 0。

`-strong`

启用强滤波 (若已启用 `-f` 选项)。默认为开启。

`-nostrong`

关闭强滤波 (若已启用 `-f` 选项)。

`-sharp_yuv`

使用更准确清晰的 RGB->YUV 转换。注意此过程比默认的 "快速" RGB->YUV 转换要慢。

`-sns int`

指定 SNS 的振幅。SNS (Spatial Noise Shaping) 是一众内置算法的集合，用于决定图片的哪个区域应该使用相对较少的比特，以在其他地方更好地使用这些比特。可能的范围从 0 (关闭) 到 100 (最大效果)。默认值为 50。

`-segments int`

指定 SNS 算法分块过程中的分块数量。分块数应该在 1 到 4 的范围内。默认值为 4。

`-partition_limit int`

通过限制某些区块使用的比特数来降低质量。范围为 0 (无降级) 至 100 (完全降级)，默认值为 0。对于中等规模的图像，有用的值通常在 30-70 左右。

### Logging Options

`-v`

输出额外信息 (特别是编码时间)。

`-print_psnr`

计算并输出平均 PSNR (峰值-信号-噪声比)。

`-print_ssim`

计算并输出平均 SSIM (结构相似度量，详情见 <http://en.wikipedia.org/wiki/SSIM>)。

`-print_lsim`

计算并输出本地相似度量 (同位素邻居之间的最小误差之和)。

`-progress`

以百分比形式报告编码进度。

`-quiet`

不输出任何内容。

`-short`

仅输出简要信息 (输出文件大小和 PSNR) 用于测试。

`-map int`

输出额外的 ASCII-map 编码信息。可能的映射值范围为 1 到 6。仅调试用。

### Additional Options

`-s width height`

指出输入文件实际上是由原始 Y'CbCr 4:2:0 samples 组成，遵照 ITU-R BT.601 规范。Luma plane 尺寸为 宽度 x 高度。

`-pre int`

指定一些预处理步骤。在 RGBA->YUVA 转换过程中，使用值 2 将触发质量依赖性的伪随机抖动 (仅有损压缩)。

`-alpha_filter string`

指定 alpha plane 的预测滤波方法。从 none, fast 和 best 中选择，按复杂度和慢速顺序递增。默认为 fast。

`-alpha_method int`

指定 alpha 压缩所用的算法: 0 或 1。算法 0 表示不进行压缩，1 表示使用 WebP 无损格式进行压缩。默认值为 1。

`-exact`

在透明区域保留 RGB 值。默认为关闭，以帮助提高压缩率。

`-blend_alpha int`

该选项使用十六进制指定的背景色 0xRRGGBB 将 alpha 通道 (如果有的话) 与源混合。alpha 通道会被重置为不透明值 255。

`-noalpha`

丢弃 alpha 通道。

`-hint string`

指定关于输入图像类型的提示。可能的值是: photo, picture 或 graph。

`-metadata string`

一个逗号分隔的元数据列表，如果存在的话，指定的只将从输入复制到输出。有效值: all, none, exif, icc, xmp。默认值为 none。

`-noasm`

禁用所有组合优化。

## Examples

```bash
cwebp -q 50 -lossless picture.png -o picture_lossless.webp
cwebp -q 70 picture_with_alpha.png -o picture_with_alpha.webp
cwebp -sns 70 -f 50 -size 60000 picture.png -o picture.webp
cwebp -o picture.webp -- ---picture.png
```

## Authors

cwebp is part of libwebp, and was written by the WebP team. The latest source tree is available at <https://chromium.googlesource.com/webm/libwebp/>

This manual page was written for the Debian project (and may be used by others).

DSRKafuU(amzrk2)

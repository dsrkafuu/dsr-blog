---
title: '为 utterances 添加评论加载中提示'
date: 2019-08-16T15:21:01+08:00
keywords:
  - 'html'
  - 'javascript'
  - '评论系统'
description: '在使用 utterances 作为博客评论系统的时候发现了一些问题。'
---

在使用 [utterances](https://utteranc.es/) 作为博客评论系统的时候发现了一些问题。当评论区处于加载中或是加载失败状态的时候，评论区 `div` 可能会产生一块空白。虽然由于自家主题的原因看不出来，但如果使用到其他主题 (有边框或者阴影之类) 就会很明显。

<!--more-->

## 寻找方法

这其实是个小问题。utterances 本身并没有提供解决方案，其加载方法是在一个 class 为 `utterances` 的 div 内部创建一个 iframe 来显示评论，而加载 iframe 的过程经常会失败。iframe 又由于受跨源限制，没法很好使用 js 监听。

在胡乱翻的时候，发现 utterances 会在加载完成之后，往上文提到的 div 追加类似 `style="height: 267px;"` 的内联样式，于是就决定在这上面做点文章。

考虑加载指示器图形的时候，原本计划用一个旋转的 SVG 图形解决。后来一想，才用了之前的 [ProgressBar.js](https://github.com/kimmobrunfeldt/progressbar.js) 写了一个进度条，就继续用得了。

## 解决问题

首先在原有评论区上面追加一个指示器用 div，并在里面创建一个圆形进度条：

```html
<div id="post-loading">
  <div id="container-loading-bar">
    <div id="loading-bar"></div>
  </div>
  <p>正在加载评论区</p>
</div>
<div id="post-comment">
  <!-- utterances 脚本 -->
</div>
```

其次的任务全部在 js 里实现就行，详情如下：

```javascript
$(function () {
  // 初始化进度条
  var loadingBar = new ProgressBar.Circle('#loading-bar', {
    color: '#8AA2D3',
    strokeWidth: 15,
    trailColor: '#E5E2E4',
    trailWidth: 15,
    fill: '#E5E2E4',
  });
  // 开始时以总时长为 10 秒 (10 秒记为超时) 的速度显示进度条加载状态
  loadingBar.animate(1.0, {
    duration: 10000,
  });

  var commentStatus; // 评论区加载状态
  var commentLoadingTime = 0; // 评论区加载已花费时间
  var commentCheckInterval = self.setInterval(checkUtterances, 500); // 0.5 秒轮询评论区加载状态

  function checkUtterances() {
    // 获取 style 属性
    commentStatus = $('#post-comment .utterances').attr('style');
    // 若 style 属性为 undefined，即评论区还未加载
    if (commentStatus === undefined) {
      // 加载时间增加
      commentLoadingTime += 1;
      // 已花费 10 秒以上则超时
      if (commentLoadingTime > 20) {
        clearInterval(commentCheckInterval);
        $('#post-comment').hide();
        $('#post-loading p').text('评论区加载失败');
      }
      return;
      // 若 style 属性不为 undefined，即评论区已加载
    } else {
      clearInterval(commentCheckInterval);
      // 进度条跳满并隐藏指示区
      loadingBar.animate(
        1.0,
        {
          duration: 500,
        },
        function () {
          $('#post-loading').hide();
        }
      );
    }
  }
});
```

## 参考

- [Docs | ProgressBar.js](https://progressbarjs.readthedocs.io/en/latest/api/shape/)

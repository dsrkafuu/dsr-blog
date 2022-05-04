---
title: '自定义 Hugo 的分页导航栏'
date: 2019-11-19T20:16:41+08:00
keywords:
  - 'html'
  - 'golang'
  - 'hugo'
  - '分页'
description: '从抛弃 Jekyll 转向 Hugo 搞毫无用处的静态站到现在，别人的主题用久了也腻了，于是自己从零开始。'
banner: 'hugo.webp'
---

从抛弃 Jekyll 转向 Hugo 搞毫无用处的静态站到现在，全程就是在不停的 `Ctrl+C` 和 `Ctrl+V`。别人的主题用久了也腻了，于是翻来找去从 [printempw](https://github.com/printempw) 那儿继续 `Ctrl+C` 了一个主题，不过这次是自己从零开始。

在写分页导航的时候遇到了不少问题，也查了不少资料，简单记录一下。

<!--more-->

## 自定义 Hugo 的分页导航栏

Hugo 内置了 Pagination 导航模板，用内置的模板是一般情况下最省心的解决方案，官方文档提供了两种方案如下：

```go
{{ $paginator := .Paginate (where .Pages "Type" "posts") }}
{{ template "_internal/pagination.html" . }}
{{ range $paginator.Pages }}
    {{ .Title }}
{{ end }}
```

```go
{{ template "_internal/pagination.html" . }}
{{ range .Paginator.Pages }}
    {{ .Title }}
{{ end }}
```

在创建普通 list 页面的时候使用下面的方案即可，但在创建例如 Fuji 主题的主页 list 的时候，由于需要对获取的文章进行筛选，因此需要用到上一种解决方案。

## 对内置模板的小改动

来看一下使用内置导航模板生成的 HTML 内容：

```html
<ul class="pagination">
  <li class="page-item">
    <a href="/" class="page-link" aria-label="First">
      <span aria-hidden="true">&laquo;&laquo;</span>
    </a>
  </li>
  <li class="page-item disabled">
    <a class="page-link" aria-label="Previous">
      <span aria-hidden="true">&laquo;</span>
    </a>
  </li>
  <li class="page-item active"><a class="page-link" href="/">1</a></li>
  <li class="page-item"><a class="page-link" href="/page/2/">2</a></li>
  <li class="page-item"><a class="page-link" href="/page/3/">3</a></li>
  <li class="page-item disabled">
    <span aria-hidden="true">&nbsp;&hellip;&nbsp;</span>
  </li>
  <li class="page-item"><a class="page-link" href="/page/5/">5</a></li>
  <li class="page-item">
    <a href="/page/2/" class="page-link" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
    </a>
  </li>
  <li class="page-item">
    <a href="/page/5/" class="page-link" aria-label="Last">
      <span aria-hidden="true">&raquo;&raquo;</span>
    </a>
  </li>
</ul>
```

导航栏内部元素中，中间被省略的数字会被添加一个 disabled 类，当处在第一页或最后一页时，相对应的上一页和下一页的链接也会被添加这个类。当前的页面会被添加 active 类。只需根据不同的类进行 CSS 修正即可，例如：

```scss
ul.pagination li.page-item {
  display: inline;
  // 移除处于第一页时的前一页和处于最后一页时的下一页
  // 注意：此处会将数字之间的省略号一起移除，仍需完善
  &.disabled {
    display: none;
  }
  // 移除没有大用处的第一页和最后一页的直接跳转链接
  &:first-child,
  &:last-child {
    display: none;
  }
}
```

## 如何自建导航栏

对于想要更进一步自定义的情况，内置的分页导航栏就不够用了，需要自建导航栏。

以需要筛选内容的首页为例，首先需要获取分页变量：

```go
{{ $paginator := .Paginator }}
```

其次可以通过判断有几个分页来决定是否显示分页导航栏：

```go
{{ if gt $paginator.TotalPages 1 }}
    <!-- 分页导航栏 -->
{{ end }}
```

获取所有的分页代号，并写入导航栏中，并为当前页面添加特殊类：

```go
<ul class="pagination">
    {{ range $paginator.Pagers }}
    <li class="pag-item{{ if eq . $paginator }} pag-current{{ end }}">
        <a href="{{ .URL }}" class="pag-link">{{ .PageNumber }}</a>
    </li>
    {{ end }}
</ul>
```

添加上一页的链接，下一页同理：

```go
{{ if $paginator.HasPrev }}
    <li class="pag-item pag-previous">
        <a href="{{ $paginator.Prev.URL }}" class="pag-link"></a>
    </li>
{{ end }}
```

## 智能导航栏

现在基本的导航栏已经成型了，但是最大的问题是当页面过多的时候，将所有页号都显示出来一定会使导航栏变得很长，为了解决这个问题现在需要这些功能：

- 当前页面需要显示在导航栏内
- 当有很多页面时，导航栏将展示出当前页面前后的几页
- 显示出的页码个数不能超过限制

例如当有十个页面时，并且定义 `$offsetLinks = 2` 时希望实现如下图的效果：

- 最大可显示的页码数 `$maxLinks = ($offsetLinks * 2) + 1`
- 如果总页面数小于 `$maxLinks`，那么所有页码正常显示
- 当前页面为 1-3 和 8-10 时的显示与其他不同，需要独立定义
- 以上这条引出上下限变量 `$lowerLimit = $offsetLinks + 1` 和 `$upperLimit = .TotalPages - $offsetLinks`

### 变量

在模板中定义这些变量：

```go
{{ $offsetLinks := 2 }}
<!-- $maxLinks = ($offsetLinks * 2) + 1 -->
{{ $maxLinks := (add (mul $offsetLinks 2) 1) }}
<!-- $lowerLimit = $offsetLinks + 1 -->
{{ $lowerLimit := (add $offsetLinks 1) }}
<!-- $upperLimit = $paginator.TotalPages - $offsetLinks -->
{{ $upperLimit := (sub $paginator.TotalPages $offsetLinks) }}
```

在 `{{ range $paginator.Pagers }}` 的循环内，使用 Hugo 的 scratchpad 来定义一个页码 flag 布尔变量。用这玩意来显示或隐藏页码，默认设置为 `false`。

```go
{{ range $paginator.Pagers }}
    {{ $.Scratch.Set "pageNumFlag" false }}
{{ end }}
```

使用 `.Scratch` 的原因是因为 `if` 段内定义的局部变量外部无法访问。

### 页码数不够多的情况

如果总页面数小于 `$maxLinks`，那么所有页码正常显示：

```go
{{ range $paginator.Pagers }}
    {{ $.Scratch.Set "pageNumFlag" false }} <!-- 页码数足够多的情况 -->
    {{ if gt $paginator.TotalPages $maxLinks }}
        <!-- ... -->
    {{ else }} <!-- 页码数不够多的情况 -->
        {{ $.Scratch.Set "pageNumFlag" true }}
    {{ end }}

    {{ if eq ($.Scratch.Get "pageNumFlag") true }}
        <li class="pag-item{{ if eq . $paginator }} pag-current{{ end }}">
            <a href="{{ .URL }}" class="pag-link">{{ .PageNumber }}</a>
        </li>
    {{ end }}
{{ end }}
```

### 页码数足够多的情况

以下为基本思路，详情请见最终代码：

```go
<!-- 如果当前页面为例子中的 1-3 区间  -->
{{ if le $paginator.PageNumber $lowerLimit }}
    <!-- ... -->
<!-- 如果当前页面为例子中的 8-10 区间 -->
{{ else if ge $paginator.PageNumber $upperLimit }}
    <!-- ... -->
<!-- 如果当前页面为例子中的 4-7 区间 -->
{{ else }}
    <!-- ... -->
{{ end }}
```

## 最终整体代码

```go
<!-- 开始 输出一定数量的位于 posts 分类下的文章 -->
{{ $paginator := .Paginate (where .Data.Pages "Type" "posts") }}
{{ range $paginator.Pages }}
<div class="post">
    <h2 class="post-title">
        <a href="{{ .Permalink }}">{{ .Title }}</a>
    </h2>
    <div class="post-summary">
        {{ .Summary }}
    </div>
</div>
{{ end }}
<!-- 结束 输出一定数量的位于 posts 分类下的文章 -->

<!-- 开始 分页导航 -->
{{ $paginator := .Paginator }}
<!-- 基础偏移变量 -->
{{ $offsetLinks := 2 }}
<!-- $maxLinks = ($offsetLinks * 2) + 1 -->
{{ $maxLinks := (add (mul $offsetLinks 2) 1) }}
<!-- $lowerLimit = $offsetLinks + 1 -->
{{ $lowerLimit := (add $offsetLinks 1) }}
<!-- $upperLimit = $paginator.TotalPages - $offsetLinks -->
{{ $upperLimit := (sub $paginator.TotalPages $offsetLinks) }}

<!-- 如果有超过一页的内容 (即需要导航栏) -->
{{ if gt $paginator.TotalPages 1 }}
<ul class="pagination">
    <!-- 上一页 -->
    {{ if $paginator.HasPrev }}
    <li class="pag-item pag-previous">
        <a href="{{ $paginator.Prev.URL }}" class="pag-link">«</a>
    </li>
    {{ end }}

    <!-- 数字页码部分 -->
    {{ range $paginator.Pagers }}
    {{ $.Scratch.Set "pageNumFlag" false }}
    <!-- 页码数足够多的情况 -->
    {{ if gt $paginator.TotalPages $maxLinks }}
        <!-- 如果当前页面为例子中的 1-3 区间  -->
        {{ if le $paginator.PageNumber $lowerLimit }}
            {{ if le .PageNumber $maxLinks }}
            {{ $.Scratch.Set "pageNumFlag" true }}
            {{ end }}
        <!-- 如果当前页面为例子中的 8-10 区间 -->
        {{ else if ge $paginator.PageNumber $upperLimit }}
            {{ if gt .PageNumber (sub $paginator.TotalPages $maxLinks) }}
            {{ $.Scratch.Set "pageNumFlag" true }}
            {{ end }}
        <!-- 如果当前页面为例子中的 4-7 区间 -->
        {{ else }}
            {{ if and ( ge .PageNumber (sub $paginator.PageNumber $offsetLinks) ) ( le .PageNumber (add $paginator.PageNumber $offsetLinks) ) }}
            {{ $.Scratch.Set "pageNumFlag" true }}
            {{ end }}
        {{ end }}
    <!-- 页码数不够多的情况 -->
    {{ else }}
        {{ $.Scratch.Set "pageNumFlag" true }}
    {{ end }}
    <!-- 输出页码 -->
    {{ if eq ($.Scratch.Get "pageNumFlag") true }}
    <li class="pag-item{{ if eq . $paginator }} pag-current{{ end }}">
        <a href="{{ .URL }}" class="pag-link">
            {{ .PageNumber }}
        </a>
    </li>
    {{ end }}
    {{ end }}

    <!-- 下一页 -->
    {{ if $paginator.HasNext }}
    <li class="pag-item pag-next">
        <a href="{{ $paginator.Next.URL }}" class="pag-link">»</a>
    </li>
    {{ end }}
</ul>
{{ end }}
```

## 参考

- [Pagination | Hugo](https://gohugo.io/templates/pagination/)
- [How to build custom Hugo pagination | Glenn McComb](https://glennmccomb.com/articles/how-to-build-custom-hugo-pagination/)
- [Hugo Pagination | Oliver Schmid](https://oliverschmid.space/posts/hugo-pagination/)

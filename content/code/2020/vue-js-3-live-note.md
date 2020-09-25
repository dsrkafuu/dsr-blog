---
title: 'Vue 3 即时笔记'
date: 2020-09-23T18:34:00+08:00
tags:
  - 'vue'
  - 'javascript'
description: '学习 Vue 3 之随笔记录。'
image: '/images/2020/vue-js-live-note/header.webp'
---

这篇文章用于记录自己在学习 Vue 3 时不够熟练的部分以及与 Vue 2 有不同之处的部分，用于自己将来的复习及日常开发。笔记将会随着自己的学习进度随时更新。

<!--more-->

- [Vue 2 即时笔记](/code/vue-js-live-note/)
- [React 即时笔记](/code/react-js-live-note/)

## 全局 API

Vue 2 中从同一个 Vue 构造函数创建的每个根实例都共享相同的全局配置，因此会出现污染情况，例如插件的使用以及全局配置等。

Vue 3 中引入了应用实例的概念，利用 `createApp()` 可以创建一个应用实例：

```js
import { createApp } from 'vue';
const app = createApp({});
app.use(VueRouter); // Vue.use() 不再可用
app.component('button-counter', {
  data: () => ({
    count: 0,
  }),
  template: '<button @click="count++">Clicked {{ count }} times.</button>',
}); // Vue.component() 不再可用
app.mount('#app'); // 将实例挂载至 DOM
```

为了考虑 tree-shaking 的支持，全局 API 现在只能作为 ES 模块构建的命名导出进行访问：

```js
import { nextTick } from 'vue';
nextTick(() => {}); // Vue.nextTick() 和 vm.$nextTick()
```

在自定义插件中使用全局 API 时，可能会被打包程序 (如 webpack) 一并打包入最终构建，需要配置将 Vue 从最终打包中排除。

```js
module.exports = {
  externals: {
    vue: 'Vue',
  },
}; // webpack
export default {
  external: ['vue'],
}; // rollup
```

## 模板指令

### v-model

#### 改动

用于自定义组件时，`v-model` 所使用的 prop 和事件默认名称已更改：

- prop：`value` => `modelValue`
- event：input => `update:modelValue`

因此，不再需要的 `v-bind` 的 `.sync` 修饰符和组件的 `model` 选项已移除，同时可以通过自定义 `v-model` 修饰符。并且也支持了在同一个组件上使用多个 `v-model`。

```html
<!-- 2.x custom v-model -->
<component v-model="pageTitle" />
<component :value="pageTitle" @input="pageTitle = $event" />
<!-- 2.x .sync attri -->
<component :title="pageTitle" @update:title="pageTitle = $event" />
<component :title.sync="pageTitle" />
<!-- 3.x custom v-model -->
<component v-model:title="pageTitle" />
<component :title="pageTitle" @update:title="pageTitle = $event" />
<!-- 这里如果未指定 model 名称为 title，则默认使用 modelValue -->
```

#### 自定义修饰符

内置修饰符：`.trim`、`.number` 和 `.lazy`，在此基础上还能自定义修饰符。添加到组件 `v-model` 的修饰符将通过 `modelModifiers` prop 提供给组件。

#### 实例

每当 `<input/>` 元素触发 `input` 事件时，都将字符串大写：

```html
<div id="app">
  <my-component v-model.capitalize="myText"></my-component>
</div>
```

```js
const app = Vue.createApp({
  data() {
    return {
      myText: '',
    };
  },
});
app.component('my-component', {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({}),
    },
  },
  methods: {
    emitValue(e) {
      let value = e.target.value;
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1);
      }
      this.$emit('update:modelValue', value);
    },
  },
  template: `<input type="text" :value="modelValue" @input="emitValue">`,
});
app.mount('#app');
```

### key 属性

对于 `v-if`、`v-else` 和 `v-else-if` 的各分支项，Vue 会自动生成唯一的 key 因此不再需要提供 key；如果手动提供 key，则必须唯一不可重复。

在使用 `<template>` 时，key 可以直接设置在 `template` 上而不是子节点上：

```html
<!-- 2.x -->
<template v-for="item in list">
  <div :key="item.id"></div>
</template>
<!-- 3.x -->
<template v-for="item in list" :key="item.id">
  <div></div>
</template>
```

### v-for

#### v-if 与 v-for 的优先级

两者作用于同一个元素上时，`v-if` 会拥有比 `v-for` 更高的优先级。但是比起在模板层面同时使用这两者管理相关逻辑，更好的办法是通过创建计算属性，筛选出需要的元素列表，并以此创建可见元素。

#### v-for 与 ref 数组

Vue 2 中，`v-for` 里使用的 `ref` 会将 `$refs` 填充为一个 ref 数组；Vue 3 中，要从单个绑定获取多个 ref，需要将 ref 绑定到一个函数上：

```html
<div v-for="item in list" :ref="setItemRef"></div>
```

```js
import { ref, onBeforeUpdate, onUpdated } from 'vue';
// 模拟 Vue 2 中的 ref 数组
export default {
  setup() {
    let itemRefs = []; // itemRefs 不必是数组，也可以是一个对象
    const setItemRef = (el) => {
      itemRefs.push(el);
    }; // 调用时放入 DOM 元素
    onBeforeUpdate(() => {
      itemRefs = [];
    }); // 将要更新时清空数组，准备再次的 setItemRef
    onUpdated(() => {
      console.log(itemRefs);
    });
    return {
      itemRefs,
      setItemRef,
    };
  },
};
```
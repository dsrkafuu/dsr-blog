---
title: 'Vue.js 2'
date: 2020-07-30T09:26:55+08:00
tags:
  - 'vue'
  - 'javascript'
description: '学习 Vue 2 之随笔记录。'
image: '/images/2020/vue-js-live-note/header.webp'
---

这篇文章用于记录自己在学习 Vue 2 时不够熟练的部分以及与其他框架有不同之处的部分，用于自己将来的复习及日常开发。笔记将会随学习进度更新。

<!--more-->

- [Vue 3 即时笔记](/code/vue-js-3-live-note/)
- [React 即时笔记](/code/react-js-live-note/)

## Vue 实例

### 生命周期钩子

- `beforeCreate()` / `created()`
- `beforeMount()` / `mounted()`
- `beforeUpdate()` / `updated()`
- `beforeDestroy()` / `destroyed()`

### 箭头函数注意事项

不要在选项 property 或回调上使用箭头函数，比如 `created: () => console.log(this.a)` 或 `vm.$watch('a', newValue => this.myMethod())`。注意箭头函数并没有 `this` 的特性。

## 模板语法

注意在 HTML 代码 DOM 中直接使用模板时，需要避免使用大写字符来命名键名，因为浏览器会把 attribute 名全部强制转为小写。

### 指令

如果 `v-bind:attribute` 属性的值是 `null`、`undefined` 或 `false`，则涉及的 attribute 不会被包含在渲染出来的 HTML 元素中。

用方括号括起来的 JS 表达式也可以作为一个指令的参数：`v-bind:[someattr]`

## 计算属性和侦听器

### 计算属性缓存

在展示处理过的字符时，可以将同一函数定义为一个方法而不是一个计算属性，两种方式的最终结果是完全相同的。然而计算属性基于它们的响应式依赖进行缓存。只在相关响应式依赖发生改变时它们才会重新求值，而不必在每次获取内容时都执行函数。

## class 与 style 绑定

### 常用 class 绑定模式

绑定一个返回对象的计算属性：

```html
<div v-bind:class="classObject"></div>
```

```js
data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

### 自定义组件 class 绑定

当在一个自定义组件上使用 class property 时，这些 class 将被添加到该组件的根元素上面。这个元素上已经存在的 class 不会被覆盖。

### 内联样式绑定

`v-bind:style` 和 class 一样，通过样式对象即可完成，常常结合返回对象的计算属性使用。

## 条件渲染

### 元素复用与 key 值

通常会复用已有元素而不是从头开始渲染：

```html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input" />
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input" />
</template>
```

在没有设置 `key` 时，上面的代码中切换 `loginType` 将不会清除用户已经输入的内容。

## 列表渲染

### 遍历对象

在遍历对象时，会按 `Object.keys()` 的结果遍历，但是不能保证它的结果在不同的 JavaScript 引擎下都一致。

## 事件处理

```html
<button v-on:click="warn('Form cannot be submitted yet.', $event)">Submit</button>
```

```js
methods: {
  warn(message, event) {
    if (event) {
      event.preventDefault() // 访问原生事件对象
    }
    alert(message)
  }
}
```

### 原生事件行为和修饰符

可以通过传入 `$event` 参数为 `e`，并在事件处理程序中调用 `e.preventDefault()` 或 `e.stopPropagation()`。

也可以通过事件修饰符实现，例如对应的 `.prevent` 和 `.stop`。事件修饰符可以连续使用，并按照顺序生效。

## 表单输入绑定

绑定可以简易使用 `v-model` 进行 "双向" 数据绑定，其本质只是数据流的语法糖：`数据 => DOM 显示 => DOM 改变 => 事件 => 数据改变 => DOM 显示改变`。`v-model` 会忽略所有表单元素的 `value`、`checked`、`selected` 的初始值而总是将 Vue 实例的数据作为数据来源。

## 组件

### 基础父子传值

- `父 => 子`：`props`

- `子 => 父`：`vm.$emit()` 触发事件 (可带参数)，父组件 `v-on` 监听并更新数据

这种数据交换方式有一种简写，使用 `.sync` 即可：

```html
<!-- 基本 -->
<custom-component :title="fatherTitle" @update:title="fatherTitle = $event" />
<!-- this.$emit('update:title', newTitle) -->
<!-- 注意事件名 -->
<!-- 简写 -->
<custom-component :title.sync="fatherTitle" />
```

### props

将一个对象的所有属性都作为 prop 传入，可以使用不带参数的 `v-bind` (取代 `v-bind:prop-name`)。

单向数据流注意：

- prop 用来传递一个初始值，最好在本地的 data 中添加一个对应的属性并将这个 prop 用作其初始值
- prop 以一种原始的值传入且需要进行转换，最好使用计算属性
- 对象和数组是通过引用传入，直接改变将会影响数据/父组件状态

prop 验证：

```js
Vue.component('my-component', {
  props: {
    // 基础类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: [Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true,
    },
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: () => {
        message: 'hello';
      },
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1;
      },
    },
  },
});
```

### 自定义 v-model

一个组件上的 `v-model` 默认会利用名为 `value` 的 prop 和名为 `input` 的事件。

`model` 选项可以用来自定义利用哪个 prop 和事件：

```js
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: ['checked'],
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `,
});
```

现在在这个组件上使用 `v-model` 的时候，值将会传入名为 `checked` 的 prop。当触发一个 `change` 事件并附带一个新的值的时候，对应的属性将会被更新。

### 基础组件相关

#### 属性继承

使用 `inheritAttrs: false` 和 `$attrs` 可以防止属性被继承到错误的元素上，撰写基础组件的时候常会用到：

```js
Vue.component('base-input', {
  inheritAttrs: false, // 不继承属性 (除了 class 和 style)
  props: ['label', 'value'], // 接受 label 和 value 属性
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs" // 属性继承到这儿而不是 label 标签上
        v-bind:value="value" // 适配 v-model
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `,
});
```

#### 原生事件映射绑定

对类似上文的重新包裹过的 input，如果使用 `@focus.native` 监听 ut 的原生事件时监听器将静默失败，因为根元素其实并不是 input。

为了解决这个问题，Vue 提供了一个 `$listeners` 属性，它是一个包含了作用在这个组件上的所有监听器的对象，因此可以配合 `v-on="$listeners"` 将所有的事件监听器指向这个组件的某个特定的子元素，以此来解决这个问题：

```js
Vue.component('base-input', {
  inheritAttrs: false, // 不继承属性 (除了 class 和 style)
  props: ['label', 'value'], // 接受 label 和 value 属性
  computed: {
    inputListeners: () => {
      var vm = this;
      return Object.assign(
        {}, // 合并为新对象
        this.$listeners, // 从父级添加所有的监听器，例如上文的 focus
        // 自定义其他监听器
        {
          input: (event) => {
            vm.$emit('input', event.target.value); // 适配 v-model
          },
        }
      );
    },
  },
  template: `
    <label>
      {{ label }}
      <input v-bind="$attrs" v-bind:value="value" v-on="inputListeners" />
    </label>
  `,
});
```

现在 `<base-input>` 组件可以完全像一个普通的 `<input>` 元素一样使用了。

### 插槽

#### 具名插槽

组件：

```html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
</div>
```

使用该组件：

```html
<base-layout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>
  <template v-slot:default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>
</base-layout>
```

#### 作用域插槽

在父级使用插槽时可以访问子组件中才有的数据，并决定其显示方式。

在子组件中绑定需要在父组件中访问的数据：

```html
<span>
  <slot :user="user">{{ user.name }}</slot>
</span>
```

在父组件中和试图使用昵称而不是名字来显示用户：

```html
<current-user>
  <template v-slot:default="slotProps">{{ slotProps.user.nickname }}</template>
  <template v-slot="{user}">{{ user.nickname }}</template>
</current-user>
```

## 边界情况

### refs 注意事项

`$refs` 只会在组件渲染完成之后生效，并且它们不是响应式的。应该避免在模板或计算属性中访问 `$refs`。

## mixin

当组件使用混入对象时，所有混入对象的选项将被 "混合" 进入该组件本身的选项。

```js
const myMixin = {
  created() {
    this.hello();
  },
  methods: {
    hello() {
      console.log('hello from mixin!');
    },
  },
};
const Component = Vue.extend({
  mixins: [myMixin],
});
```

合并冲突处理：

- 数据对象在内部递归合并，发生冲突时以组件数据优先
- 同名钩子函数将合并为一个数组都被调用，并且混入对象的钩子函数将会优先调用

## 响应式原理相关

### 监听数据变化

Vue 利用了 `Object.defineProperty(obj, prop, descriptor)` 方法将响应式的属性定义为 getter 和 setter。每个组件 (也就是一个 Vue 实例) 都有对应的一个 watcher 实例，它会将渲染某个组件时用到的数据记录下来，当数据的 setter 执行、数据改变时重新渲染组件，实现数据的响应式变化。

### 异步更新队列

Vue 在更新 DOM 时是异步执行的，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。如果想在数据更新后立刻对更新后的 DOM 进行一些操作，则可能无法在更新完成后准确进行。

`Vue.nextTick(fn)` 和 `this.$nextTick(fn)` 提供了解决方案，回调函数将在 DOM 更新完成后被调用，并且其本身也返回 Promise：

```js
methods: {
  updateMessage: async () => {
    this.message = '已更新';
    console.log(this.$el.textContent); // => '未更新'
    await this.$nextTick();
    console.log(this.$el.textContent); // => '已更新'
  };
}
```

### 响应式数据注意事项

#### 数组

无法监测的变化：

- 用数字引索位置直接设置数组元素：`arr[0] = "content"`
- 直接修改数组的长度属性：`arr.length = 100`

可监测的途径：

- `Vue.set()` 和 `vm.$set()`：`Vue.set(array, index, newValue)`
- `Array.prototype.splice()`：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
- Vue 已经进行过包裹的数组相关方法：`push()`、`pop()`、`shift()`、`unshift()`、`splice()`、`sort()`、`reverse()`

#### 对象

已经存在用于渲染的对象属性的变化会被 Vue 监测，但 Vue 无法监测到属性的添加或移除。

可监测的途径：

- `Vue.set()` 和 `vm.$set()` 依旧可以使用：`Vue.set(obj, propName, newValue)`
- 直接将对象替换为一个新对象，比如当为对象添加多个属性或 mixin 对象：`this.object = Object.assign({}, this.object, anotherObject)`

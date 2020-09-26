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

## 函数式组件和异步组件

在 3.x 中，函数式组件 2.x 的性能提升可以忽略不计，因此我们建议只使用有状态的组件；同时单文件组件中 `<template>` 上的 `functional` 属性已经被移除。

在 3.x 中若需要使用函数式组件，则需要用普通函数创建：

```js
import { h } from 'vue';
const DynamicHeading = (props, context) => {
  return h(`h${props.level}`, context.attrs, context.slots);
};
DynamicHeading.props = ['level'];
export default DynamicHeading;
```

同时由于函数式组件被定义为纯函数，因此异步组件的定义也进行了修改。在 2.x 中，通过将组件定义为一个返回 Promise 的函数，来创建异步组件：

```js
const asyncComponent = () => import('Component.vue'); // 动态 import 返回 Promise
const asyncComponentWithConfig = {
  component: () => import('Component.vue'),
  delay: 200,
  loading: LoadingComponent,
};
```

在 3.x 中，则需要通过 `defineAsyncComponent()` 显式定义异步组件：

```js
import { defineAsyncComponent } from 'vue';
import LoadingComponent from 'LoadingComponent.vue';
const asyncComponent = defineAsyncComponent(() => import('Component.vue'));
const asyncComponentWithConfig = defineAsyncComponent({
  loader: () => import('Component.vue'),
  delay: 200,
  loadingComponent: LoadingComponent,
});
```

## 生命周期函数

- `destroyed` => `unmounted`
- `beforeDestroy` => `beforeUnmount`

## 提供 / 注入

如果我们有这样的层次结构：

```txt
Root
└─ TodoList
   ├─ TodoItem
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics
```

如果要将 TodoList 内的数据直接传递给 TodoListStatistics，我们传统上是把这个属性向下依次传递：TodoList => TodoListFooter => TodoListStatistics。

通过提供 / 注入方法，可以直接执行以下操作：

```js
const app = Vue.createApp({});
app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets'],
    };
  },
  provide() {
    return { user: 'John Doe', todoLength: this.todos.length };
  },
  template: `
    <div>{{ todos.length }}</div>
  `,
});
app.component('todo-list-statistics', {
  inject: ['user', 'todoLength'], // 注入 property
  created() {
    console.log(`Injected property: ${this.user} - ${this.todoLength}`);
  },
});
```

## 响应式 (重要)

以下代码均基于下一段解释的 Composition API。

```js
import { ref, reactive } from 'vue';

// 响应式数据
const count = ref(0);
// 访问响应式数据 (需要 .value)
count.value++;
console.log(count.value); // 1
// 模板使用响应式数据 (自动 ref 展开，不需要 .value，但需要确保在 setup 中已经 return 过)
`<span>{{ count }}</span>`;

// 响应式对象
const state = reactive({
  count: 0,
});
// 访问响应式对象 (自动 ref 展开，不需要 value)
state.count++;
console.log(state.count); // 1
state.count = ref(2); // 替换时也可以使用响应式数据
console.log(state.count); // 2
```

**注意：ref 展开仅发生在被响应式对象嵌套的时候。当从数组或其他原生集合类型如 Map 访问 ref 时，不会进行展开。**

ES6 解构时，必须使用工具函数防止丢失响应性：

```js
import { toRefs } from 'vue';
let { author, title } = toRefs(book); // 必须使用防止丢失响应性
```

也可以限制响应式变量为不可更改，建议创建一个 Proxy：

```js
import { reactive, readonly } from 'vue';
const original = reactive({ count: 0 });
const copy = readonly(original);
original.count++; // 可行
copy.count++; // 不可行，警告: "Set operation on key 'count' failed: target is readonly."
```

## Composition (组合) API

用于优化 Vue 2 传统单文件组件某一特定逻辑关注点分散在各处的问题。

### 简单上手

`setup` 组件选项在创建组件之前执行，因此在 `setup` 选项中没有 `this`。这意味着，除了 `props` 之外，将无法访问组件中声明的任何属性 (本地状态、计算属性或方法)。

`setup` 选项是一个接受 `props` 和 `context` 的函数，从 `setup` return 的所有内容都将暴露给组件的其余部分 (计算属性、方法、生命周期钩子等等) 以及组件的模板，**因此没有在 return 内返回的内容在外部是无法获取的**。

Vue 3 中，可以通过一个新的 `ref` 函数使任何响应式变量在任何地方起作用，`ref` 接受参数并返回它包装在具有 `value` 属性的对象中，然后可以使用该属性访问或更改响应式变量的值。这样 ref 就对值创建了一个响应式的引用，因此就可以在整个应用程序中安全地传递它，而不必担心在某个地方失去它的响应式。对应 `ref`，可以使用 `reactive` 递归深转换一个对象为响应式对象。

加上生命周期钩子和监听器后到现在为止的实例，这个实例实现了从 API 获取某用户对应的内容，并在用户更改时更新内容：

```js
import { fetchUserRepositories } from '@/api/repositories'; // 模拟远程 API
import { ref, onMounted, watch, toRefs } from 'vue'; // 用到的方法
// 组件中的 setup
function setup(props) {
  const { user } = toRefs(props); // 使用 `toRefs` 创建对 prop 的 `user` 属性的响应式引用
  const repositories = ref([]); // 响应式内容 `repositories`
  const getUserRepositories = async (username) => {
    repositories.value = await fetchUserRepositories(username); // 更新 `prop.user`
  };
  onMounted(() => {
    getUserRepositories(user.value);
  }); // 生命周期钩子
  watch(user, () => {
    getUserRepositories(user.value);
  }); // 在用户 prop 的响应式引用上设置一个侦听器

  return {
    repositories,
    getUserRepositories,
  };
}
```

其它部分的业务逻辑也可以进行迁移并且差分，以下是拆分为多文件后的完整示例：

```js
// src/composables/useUserRepositories.js /* 获取用户数据功能模块 */
import { fetchUserRepositories } from '@/api/repositories'; // 模拟远程 API
import { ref, onMounted, watch, toRefs } from 'vue'; // 用到的方法

export default function useUserRepositories(user) {
  const { user } = toRefs(props); // 使用 `toRefs` 创建对 prop 的 `user` 属性的响应式引用
  const repositories = ref([]); // 响应式内容 `repositories`
  const getUserRepositories = async (username) => {
    repositories.value = await fetchUserRepositories(username); // 更新 `prop.user`
  };
  onMounted(() => {
    getUserRepositories(user.value);
  }); // 生命周期钩子
  watch(user, () => {
    getUserRepositories(user.value);
  }); // 在用户 prop 的响应式引用上设置一个侦听器

  return {
    repositories,
    getUserRepositories,
  };
}
```

```js
// src/composables/useRepositoryNameSearch.js /* 搜索过滤功能模块 */
import { ref, onMounted, watch, toRefs } from 'vue';

export default function useRepositoryNameSearch(repositories) {
  const searchQuery = ref(''); // 响应式搜索关键词
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter((repository) => repository.name.includes(searchQuery.value));
  }); // 符合关键词的 repo 计算属性，注意计算属性也需要使用 `.value` 来访问

  return {
    searchQuery,
    repositoriesMatchingSearchQuery,
  };
}
```

```js
// src/composables/useRepositoryNameSearch.js /* 搜索过滤功能模块 */
import { ref, onMounted, watch, toRefs } from 'vue';

export default function useRepositoryNameSearch(repositories) {
  const searchQuery = ref(''); // 响应式搜索关键词
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter((repository) => repository.name.includes(searchQuery.value));
  }); // 符合关键词的 repo 计算属性，注意计算属性也需要使用 `.value` 来访问

  return {
    searchQuery,
    repositoriesMatchingSearchQuery,
  };
}
```

最终完成的组件：

```js
// src/components/UserRepositories.vue
import { toRefs } from 'vue';
import useUserRepositories from '@/composables/useUserRepositories';
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch';

export default {
  components: { RepositoriesSearchBy, RepositoriesList },
  props: { user: { type: String } },
  setup(props) {
    const { user } = toRefs(props); // user 响应式引用
    // 获取内容模块
    const { repositories, getUserRepositories } = useUserRepositories(user);
    // 搜索模块
    const { searchQuery, repositoriesMatchingSearchQuery } = useRepositoryNameSearch(repositories);

    return {
      // 因为我们并不关心未经过滤的仓库，可以在 `repositories` 名称下直接返回过滤后的结果
      repositories: filteredRepositories,
      getUserRepositories,
      searchQuery,
    };
  },
};
```

### setup

`setup` 接收两个参数，第一个为 `props`；`props` 是响应式的，当传入新的属性时会被更新。**注意不能直接在 `props` 上使用 ES6 解构，这会破坏响应式的特性**，需要使用 `toRefs` 函数来进行解构：

```js
import { toRefs } from 'vue';
function setup(props) {
  const { propName } = toRefs(props);
}
```

`setup` 函数的第二个参数是 `context`；它是一个非响应式的普通对象，可以直接解构。

```js
export default {
  setup(props, { attrs, slots, emit }) {
  }
}
}
```

`setup` 返回对象的内容可以在模板上直接使用，并且**不用通过 `.value` 获取数据**。同时，在 `setup` **内部的 `this` 并非指向该 Vue 实例**。

### 生命周期钩子

因为 `setup` 是围绕 `beforeCreate` 和 `created` 生命周期钩子运行的，所以不需要显式地定义它们。换句话说，在这些钩子中编写的任何代码都应该直接在 `setup` 函数中编写。

其他的生命周期钩子，则统一遵循以下变化：

- `beforeMount` => `onBeforeMount`
- `mounted` => `onMounted`

### 提供 / 注入方法

提供：

```html
<!-- src/components/MyMap.vue -->
<template>
  <my-marker />
</template>
<script>
  import { provide, reactive, readonly, ref } from 'vue';
  import MyMarker from './MyMarker.vue';
  export default {
    components: { MyMarker },
    setup() {
      const location = ref('North Pole'); // 提供值 (响应式)
      const geolocation = reactive({
        longitude: 90,
        latitude: 135,
      }); // 提供对象 (响应式)
      const updateLocation = () => {
        location.value = 'South Pole';
      }; // 提供用于修改数据的方法
      provide('location', readonly(location)); // 禁止子组件修改
      provide('geolocation', readonly(geolocation)); // 禁止子组件修改
      provide('updateLocation', updateLocation);
    },
  };
</script>
```

注入：

```html
<!-- src/components/MyMarker.vue -->
<script>
  import { inject } from 'vue';
  export default {
    setup() {
      const userLocation = inject('location', 'The Universe'); // 可以提供默认值
      const userGeolocation = inject('geolocation');
      const updateUserLocation = inject('updateUserLocation');
      return {
        userLocation,
        userGeolocation,
        updateUserLocation,
      };
    },
  };
</script>
```

---
title: 'Vue.js'
date: 2020-09-11T11:11:11+08:00
description: 'Vue.js 重点整理，包括一些框架特定的内容、特性，以及与其他框架的对比等。'
---

## MVC 与 MVVM

MVC：

1. View 把操作转移到 Controller 处理
2. Controller 完成业务逻辑后，要求 Model 改变状态
3. Controller 通知 Model 将新的数据发送到 View

MVVM：

1. View 把操作转移到 VM 处理
2. VM 完成业务逻辑后，要求 Model 改变状态
3. VM 与 View 双向绑定，VM 更新自动反映在 View 上

## VDOM

通过 JS 对象模拟庞大繁杂的 DOM 节点，通过特定的 render 方法将其渲染为实际的 DOM 元素。

Diff 算法指的是通过 VDOM 节点的比较得到 patch 对象，解析并更新需要更新的实际 DOM 元素；对于两棵树传统的 Diff 算法时间复杂度为 O(n^3)，VDOM 的算法中一般通过同级比较来简化。

Vue 中 diff 过程：

1. 首先比较两个节点是否可以视为同一个，根据 key 和 selector 判断
2. 若不同，则直接替换结点，例如 classname 不同
3. 若相同，则对比这两个结点
4. 文本不同则更新文本
5. 一方有节点则进行子结点的增删
6. 两方都有结点则进行子结点对比，此过程 Vue 使用双向判断

## 组件通信

- `props` <=> `$emit`
- `$parent` <=> `$children` (不建议)
- `provide` <=> `inject`
- Vuex
  - State
  - Getters: 计算属性
  - Mutations: 同步
  - Actions: 异步

## 响应式原理

### Vue 2

当一个普通的对象转为响应式对象时，Vue 通过 `Object.defineProperty` 将其属性转为 getter 和 setter；当通过数据渲染组件时，watcher 会记录下依赖的数据；当数据改变，watcher 通知视图更新。

无法检测对象属性的添加、直接利用索引添加数组元素、改变数组长度等；解决方案为包裹数组方法和利用 `$set` 手动派发更新。

### Vue 3

同样是监听数据变化，Vue 3 使用 Proxy 拦截对所包括的响应式对象的操作，因此可以检测 Vue 2 中无法直接监测到的变化。

```js
const dinner = {
  meal: 'tacos',
};
const handler = {
  get(target, prop, receiver) {
    track(target, prop); // 跟踪更改它的函数
    return Reflect.get(...arguments);
  },
  set(target, key, value, receiver) {
    trigger(target, key); // 触发函数以便它可以更新最终值
    return Reflect.set(...arguments);
  },
};
const proxy = new Proxy(dinner, handler);
console.log(proxy.meal);
```

### Proxy 和 Reflect

Proxy 用于将一个对象包装起来并拦截对其的操作。

Reflect 是一个用于简化 Proxy 创建的对象。对于每个可被 Proxy 捕获的内部方法，在 Reflect 中都有一个对应的方法，其名称和参数与 Proxy 捕捉器相同。所以，我们可以使用 Reflect 来将操作转发给原始对象。

当某个对象继承了被 Proxy 包裹的对象时，内部函数通过 `this` 获取原型上的属性时可能会错误的被 Proxy 拦截，使用 Reflect 来避免。

## 批量更新和 nextTick

响应式原理中提到数据改版 watcher 通知视图更新，对应的 watcher 其实是被推进类似 Event Loop 的队列，在下一个 tick 的时候将这个队列中的 watcher 全部取出并触发。`nextTick` 内部依靠 `Promise.then` 和 `setTimeout` 等原生异步队列相关的函数。

## Router 模式

- HASH 模式：由于 HASH 的变化浏览器可以记录，因此监听 hashchange 事件，在 HASH 中提供路径
- History 模式：通过 H5 新增的两个 History API 方法 `pushState` 和 `replaceState` 不刷新页面的特性改变 URL，通过监听 popstate 事件得知页面变化，刷新和直接访问次级页面需要服务端配置

## 模板编译

1. 将模板字符串转换成元素的 AST 抽象语法树
2. 优化语法树，标记静态节点
3. 生成代码 render 函数，`createElement`

## 生命周期顺序

渲染：

```
父 beforeCreate => 父 created => 父 beforeMount =>
子 beforeCreate => 子 created => 子beforeMount =>
子 mounted => 父 mounted
```

更新和销毁：

```
父 beforeUpdate => 子 beforeUpdate => 子 updated => 父 updated
父 beforeDestroy => 子 beforeDestroy => 子 destroyed => 父 destroyed
```

## 简化样例 Observer

```js
let data = {
  name: 'name',
  detail: {
    age: 12,
  },
};

let initWatcher = null;
class Watcher {
  constructor(data, key, cb) {
    this.data = date;
    this.key = key;
    this.cb = cb;
    // 触发 getter 初始化过程
    initWatcher = this;
    this.preValue = data[key];
    initWatcher = null;
  }

  update() {
    if (this.preValue !== this.data[this.key]) {
      this.cb(this.data[this.key]);
    }
  }
}

class Dependency {
  constructor() {
    this.watchers = [];
  }

  subscribe(watcher) {
    this.watchers.push(watcher);
  }

  notify() {
    this.watchers.forEach((watcher) => watcher.update());
  }
}

class Observer {
  constructor() {
    this.observe(data);
  }

  observe(data) {
    if (!data || typeof data !== 'object') {
      return;
    }
    for (let key of Object.keys(data)) {
      this.observe(data[key]);
      this.defineProp(data, key, data[key]);
    }
  }

  defineProp(obj, key, value) {
    const dep = new Dependency();
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get() {
        if (initWatcher) {
          dep.subscribe(initWatcher);
        }
        return value;
      },
      set(newValue) {
        this.observe(newValue);
        value = newValue;
        dep.notify();
      },
    });
  }
}
```

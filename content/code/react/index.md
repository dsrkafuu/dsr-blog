---
title: 'React'
date: 2020-09-11T11:11:11+08:00
description: 'React 重点整理，包括一些框架特定的内容、特性，以及与其他框架的对比等。'
---

## 对比 Vue.js

### 数据更新

- Vue：Vue 2 通过 getter、setter 与函数包裹；Vue 3 使用 Proxy；数据变化时自动更新显示
- React：手动 setState 或通过 Redux 等库触发数据变化和视图更新

### 组件通信

- Vue：父组件单向传值给子组件，子组件 emit 事件给父组件监听
- React：父组件单向传值给子组件，同时传递 handler 函数给组件调用

- `props` <=> `onEvent()`
- `Context.Provider` <=> `useContext`
- Redux / MobX

### Diff 算法

1. 节点比对区别：例如节点 class 更改，React 视为同节点，仅更新其属性
2. 列表比对区别：都通过 key 优化，但 Vue 采用双端对比

## Hooks 和类组件的区别

最大的区别函数组件每次渲染都会有独立 props 和 state，而 class 组件总是会通过 this 拿到最新的 props 和 state；即函数式组件捕获了渲染所使用的值。

例如有一个在一秒后会变化为 `B` 的 prop 为 `name`，目前为 `A`；有一个 `button` 的 `handleClick` 在三秒后会 `alert(this.props.name)`；在类组件中 `alert` 的结果会是 `B`，因为 `this` 已经指向了最新的 `props`。

而在函数组件中，`alert(props.name)` 得到的却是调用 `handleClick` 时 (即变化前) 的 `A`。

这也是造成一些额外问题的原因，例如 `useEffect` 未正确指定其依赖于某个 `count` 值却在三秒后 `setState(count+1)`，这里的 `count` 就永远为固定值了。

对于 `setState` 问题可以使用 `setState((state)=>state+1)` 解决，对于异步函数中获取到旧值可以使用 `useRef` 解决。

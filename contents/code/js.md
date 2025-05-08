---
title: 'JavaScript'
date: 2020-01-22T17:12:11+08:00
description: 'JavaScript 重难点整理，包括数据类型、执行上下文、事件循环等内容。'
---

## 数据

### 数据类型

七种基本数据类型，一种复杂数据类型：

- `number`：+-(2^53-1) 范围内的数字
- `string`：字符串
- `boolean`：true 和 false
- `null`：未知的值
- `undefined`：未定义的值
- `bigint`：任意长度的整数
- `symbol`：唯一标识符
- `object`：复杂的数据结构

数据存储：

- 栈：基本类型和引用类型地址
- 堆：引用类型地址实际指向的数据

### 类型检查

`typeof` 运算符：

- `typeof (()=>{})` 会返回 `"function"`
- `typeof []` 会返回 `"object"`
- `typeof null` 会返回 `"object"`，但实际上它并不是一个对象

`instanceof` 运算符：

- 支持继承的对象检测方法

`Object.prototype.toString.call([])`：

- `Object.prototype.toString.call([]) === '[object Array]'`
- `Object.prototype.toString.call(()=>{}) === '[object Function]'`

## 类型转换

- `window.isNaN('abc')`：`true`
- `Number.isNaN('abc')`：此方法不进行类型转换，因此为 `false`
- `[0] == true`：数组调用 `toString` 再变为数字 0，因此为 `false`

## 执行上下文和变量提升

区别 `let` 和 `var`：

- `let` 拥有块级作用域
- `let` 声明的全局变量不是全局对象的属性
- `let` 用于循环中可以正常创建副本
- `let` 不允许重定义

执行上下文可以理解为当前代码的执行环境，它会形成一个作用域：

- 全局环境
- 函数环境
- `eval`

变量提升被认为是对执行上下文工作方式的一种认识，例如：

```js
function test() {
  console.log(foo);
  console.log(bar);
  var foo = 'Hello';
  console.log(foo);
  var bar = function () {
    return 'world';
  };
  function foo() {
    return 'hello';
  }
}
test();
```

等价于：

```js
function test() {
  // 函数声明提升，且优先于变量声明
  function foo() {
    return 'hello';
  }
  // 变量声明提升，但 foo 已经存在，忽略 var 定义
  // var foo = undefined;
  // 变量声明提升，函数表达式和其他变量赋值一致不提升
  var bar = undefined;

  // 执行阶段
  console.log(foo); // [Function]
  console.log(bar); // undefined
  foo = 'Hello';
  console.log(foo); // Hello
  bar = function () {
    return 'world';
  };
}
test();
```

### 闭包

闭包简单来说就是函数中的函数；闭包可以通过一个函数去访问原本在外层无法直接访问到的数据，并且保证数据不被回收。

### 暂时性死区

和直接使用 `var` 定义不同，由于没有变量提升，`let`、`const` 定义的变量在声明之前使用会报错。

## Event Loop 事件循环

首先将事件分为宏任务与微任务：

- 宏任务：主线 JS 代码、事件、`setTimeout` 和 `setInterval` 等
- 微任务：`process.nextTick` 和 `Promise` 回调等

事件循环流程：

- 首先执行主线同步任务
- 当遇到异步任务时将任务搁置一边独立执行，当异步任务有了结果将其放入对应的异步任务队列
- 主线同步任务执行完毕，检查微任务队列是否有内容，若有则一直执行至清空
- 进入下一轮循环，检查宏任务队列是否有内容，若有则一直执行至清空
- 继续执行主线同步任务

代码例：

```js
console.log('Start');

const timer1 = setTimeout(() => {
  console.log('Timer 1');
}, 0);

const promise1 = new Promise((resolve, reject) => {
  console.log('Promise 1');
  resolve('Promise 1 Fulfilled');
});
promise1
  .then((val) => {
    console.log(val);
    return 'Promise 1 Then Fulfilled';
  })
  .then((val) => {
    console.log(val);
    const timer3 = setTimeout(() => {
      console.log('Timer 3 in Promise 1');
    });
  });

const promise2 = new Promise((resolve, reject) => {
  const timer2 = setTimeout(() => {
    console.log('Timer 2 in Promise 2');
    resolve();
  });
});
promise2
  .then(() => {
    console.log('Promise 2 Then 1');
  })
  .then(() => {
    console.log('Promise 2 Then 2');
  });

console.log('End');

/* 执行结果
 * Start
 * Promise 1
 * End
 * Promise 1 Fulfilled
 * Promise 1 Then Fulfilled
 * Timer 1
 * Timer 2 in Promise 2
 * Promise 2 Then 1
 * Promise 2 Then 2
 * Timer 3 in Promise 1
 */
```

解析：

1. 首先执行主线同步任务，输出 Start、Promise 1 和 End
2. 此时宏任务队列中有 `timer1` 和 `timer2`；微任务队列中有 `promise1` 的第一个 `then`
3. 检查微任务队列，输出 Promise 1 Fulfilled 和 Promise 1 Then Fulfilled
4. 此时宏任务队列中有 `timer1`、`timer2` 和 `timer3`；微任务队列中为空
5. 下一轮循环，输出 Timer 1；微任务队列仍为空
6. 下一轮循环，输出 Timer 2 in Promise 2；微任务队列中加入 `promise2` 的第一个 `then`
7. 优先微任务队列，输出 Promise 2 Then 1 和 Promise 2 Then 2
8. 下一轮循环，输出 Timer 3 in Promise 1

注意：在 Promise 同步构造函数中，在没有返回值的情况下，`resolve()` 后的代码依旧会被执行，只是无法再使用 `reject()` 改变该 Promise 的状态。

## Map 与 WeakMap

- WeakMap 的 key 只接受使用对象
- WeakMap 不支持迭代，`keys()` 等方法无法使用

在 Map 中，若将某对象设置为 key，则后期将对该对象的直接引用置为 `null`，GC 不会回收，通过 `Map.keys()` 可以找到该对象；而在 WeakMap 中，该对象会被回收，但无法保证 GC 何时工作。

## 遍历和迭代

`for...in...`：

- 遍历对象及其原型链上可枚举属性
- 遍历数组元素及自定义属性
- 返回 string 类型的 key

`Object.keys()`：

- 遍历对象本身的可枚举属性
- 遍历数组元素及自定义属性
- 返回 string 类型的 key

`for...of...`：

- 遍历任何可迭代对象 (普通对象不支持)
- 返回 any 类型的 value

## Promise

- `Promise.all()`：所有成功则成功；任一失败则失败
- `Promise.any()`：任一成功则成功；所有失败则失败
- `Promise.race()`：任一成功则成功；任一失败则失败
- `Promise.allSettled()`：所有都成功或失败最后返回结果

## This 指向绑定

对于 `this` 指向在函数执行时才能确定，创建时无法确定。

对于一般函数，`this` 指向调用者：

```js
var x = 1;
var obj = {
  x: 2,
  say: function () {
    console.log(this.x);
  },
};
obj.say(); // 2 (obj.x)
```

```js
var x = 1;
function Obj() {
  this.x = 2;
  const say = function () {
    console.log(this.x);
  };
  say();
}
const obj = new Obj(); // 1 (window.x)
```

对于箭头函数，`this` 指向其父级执行上下文：

```js
var x = 1;
var obj = {
  x: 2,
  say: () => {
    console.log(this.x);
  },
};
obj.say(); // 1 (window.x)
```

```js
var x = 1;
function Obj() {
  this.x = 2;
  const say = () => {
    console.log(this.x);
  };
  say();
}
const obj = new Obj(); // 2 (obj.x)
```

`call`、`apply`、`bind` 都用于绑定 `this` 指向：

- `call`：第一参数为 this 指向，剩余参数为参数列表，临时改变 this 并立即执行
- `apply`：第一参数为 this 指向，第二参数为参数数组，临时改变 this 并立即执行
- `bind`：第一参数为 this 指向，剩余参数为参数列表，返回 this 指向确定的函数，同时在调用返回的函数时还可以添加剩余参数

## 继承与原型链

每个实例对象都有一个私有属性 `__proto__` 指向它的原型对象，该原型对象也有原型，一直到 `null` 为止。

- `__proto__`：常见的浏览器原型链实现
- `getPrototypeOf()` 获取 `[[Prototype]]`：等价于 `__proto__`
- `prototype` 函数才有，指向原型对象；原型对象也有 `constructor` 属性与之对应

```
function Dog            [[Prototype]]
prototype     ==>  <==  constructor
                        __proto__     ==> Object.prototype
dog1                     ^^               __proto__          ==> null
__proto__     ===========||
```

### 模拟实现 new

```js
function genInstance(Constructor, ...args) {
  // const obj = {};
  // obj.__proto__ = Constructor.prototype;
  const obj = Object.create(Constructor.prototype);
  const ret = Constructor.call(obj, ...args);

  if (ret && typeof ret === 'object') {
    return ret;
  }
  return obj;
}
```

### 原型链继承

```js
function Parent() {
  this.names = [];
}
Parent.prototype.getNames = function () {
  console.log(this.names);
};
function Child() {}
Child.prototype = new Parent();

const child1 = new Child();
const child2 = new Child();
child1.names.push('1');
console.log(child2.getName()); // ['1']
```

- 引用类型的属性会被所有子实例共享
- 无法向 Parent 传参

### 组合继承

引入经典继承 (借用构造函数)：

```js
function Parent() {
  this.names = [];
}
Parent.prototype.getNames = function () {
  console.log(this.names);
};
function Child() {
  Parent.call(this, arguments); // 借用构造函数
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;

const child1 = new Child();
const child2 = new Child();
child1.names.push('1');
console.log(child2.getName()); // []
```

- 调用了两次父构造函数，导致 `Child.prototype` 和 `child1` 中有重复的 `names`

### 寄生组合继承

引入寄生式继承 (使用父原型而不是父实例作为 `Child.prototype`)：

```js
function Parent() {
  this.names = [];
}
Parent.prototype.getNames = function () {
  console.log(this.names);
};
function Child() {
  Parent.call(this, arguments); // 借用构造函数
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

## DOM API

### Element 与 Node

- Node 是一个基类，DOM 中的 Element、Text 和 Comment 都继承于它
- Node 包含了其内部的 Element 结点，除此之外还有直接插入的文本，注释等内容
- NodeList 和 ElementCollcetion 都不是真正的数组

### 元素相关属性

- `clientHeight`：content + padding
- `offsetHeight`：content + padding + border + scrollbar
- `scrollHeight`：滚动部分总高度，包括当前不可见部分
- `scrollTop`：滚动部分顶端距离可见部分顶端的高度
- `offsetTop`：当前元素顶部距离最近父元素顶部的距离

### 事件、冒泡和捕获

事件传播的三个阶段：

1. 捕获阶段
2. 目标阶段
3. 冒泡阶段

当一个事件发生在一个元素上，它会首先运行在该元素上的处理程序，然后运行其父元素上的处理程序，然后一直向上到其他祖先上的处理程序；几乎所有事件都会冒泡，但也有例如 `focus` 的事件不会冒泡。

- `event.target`：是引发事件的目标元素，冒泡过程中不会发生变化
- `this`：当前元素，其中有一个当前正在运行的处理程序

## ESM 与 CommonJS 模块

### 加载与解析

CJS 模块同步加载，输出的是值的拷贝；对于基本类型，一旦输出，模块内部的变化影响不到这个值；对于引用类型，效果同引用类型的赋值操作；通过导出 getter 函数可以获取模块内部的变化；ES 模块是动态引用，并且不会缓存值。

由于 CJS 模块是同步的，因此可以放在代码段的任何位置；而 ESM 只是静态定义，在代码解析阶段就会被执行：`import` 会被提升到头部执行，`export` 与 `var` 定义的变量提升有类似的效果。

两种模块都不会重复执行。

### 循环依赖

CJS 模块当遇到 `require()` 语句时，会执行模块中的代码，得到的是已经执行部分的结果。

## ES6+ 新要素

- `let` 和 `const`
- 扩展运算符
- 箭头函数
- `class`
- Map 和 Set

### 箭头函数特性

- 没有自己的 `this`，内部 `this` 指向父级执行上下文
- 无法作为构造函数，没有 `prototype` 属性
- 无法使用 `arguments`，需要 rest 参数
- 无法作为 generator 函数使用

## ES 标准流程

- `Stage 0`：开放提交，提议、想法
- `Stage 1`：正式建议，初步 demo 和标准
- `Stage 2`：草案，标准语言解释和实验性实现
- `Stage 3`：接近完成，等待测试、审核和用户反馈
- `Stage 4`：确认会被包含到将来的标准中

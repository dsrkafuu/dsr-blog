---
title: 'JavaScript 基础关注点笔记'
date: 2020-01-01T12:05:37+08:00
tags:
  - javascript
description: 'JavaScript 踩坑大全。'
image: '/images/2020/js-extends-note/header.webp'
---

JavaScript 基础关注点笔记，随着自己开发中遇到的各种问题而逐渐更新。

<!--more-->

## 数据类型

七种基本数据类型，一种复杂数据类型：

- `number`：+-(2^53-1) 范围内的数字
- `bigint`：任意长度的整数。
- `string`：字符串
- `boolean`：true 和 false
- `null`：未知的值
- `undefined`：未定义的值
- `symbol`：唯一标识符
- `object`：复杂的数据结构

`typeof` 运算符：

- `typeof null` 会返回 `"object"`，但实际上它并不是一个对象。

## 类型转换

### 数字类型转换

```js
Number(''); // 0
Number('   123   '); // 123
Number('123z'); // NaN
Number(undefined); // NaN
Number(null); // 0
```

一元运算符 `+` 有相同的效果。注意 `null` 变成数字 `0`，`undefined` 变成 `NaN`。

### 布尔转换

```js
Boolean(0); // false
Boolean(''); // false
Boolean('0'); // true
```

### 运算转换

```js
alert(2 + 2 + '1'); // 41，4 + '1' = 41
alert(6 - '2'); // 4，将 '2' 转换为数字
alert('6' / '2'); // 3，将两个运算元都转换为数字
```

## 值比较

比较字符串时，使用字典顺序进行判定。按照字符串每一位依次比较，出现不同即可得出结果，若一直到有一方结束依旧未出结果，则较长的一方为大。

```js
alert(null > 0); // false
alert(null == 0); // false
alert(null >= 0); // true
alert(null === undefined); // false
```

相等性检查 `==` 和普通比较符 `> < >= <=` 的代码逻辑是相互独立的。进行值的比较时，`null` 会被转化为数字，因此它被转化为了 `0`。这就是为什么（3）中 `null >= 0` 返回值是 `true`，（1）中 `null > 0` 返回值是 `false`。

另一方面，`undefined` 和 `null` 在相等性检查 `==` 中不会进行任何的类型转换，它们有自己独立的比较规则，所以除了它们之间互等外，不会等于任何其他的值。这就解释了为什么（2）中 `null == 0` 会返回 `false`。

## 函数

函数表达式是在代码执行到达时被创建，并且仅从那一刻起可用；函数声明由于声明提升，因此在代码段中被定义之前的位置它就可以被调用。

函数声明只在它所在的代码块中可见，因此若需要通过 `if` 判断条件赋值函数则需要表达式。

## 对象

整数属性会被进行排序，其他属性则按照创建的顺序显示。

简单对象克隆：`Object.assign({}, obj);`

## 可选链

可选链 `?.` 是一种访问嵌套对象属性的防错误方法。即使中间的属性不存在，也不会出现错误。如果可选链 `?.` 前面部分是 `undefined` 或者 `null`，它会停止运算并返回 `undefined`。

```js
alert(user.address && user.address.street);
alert(user.address?.street);
```

可选链 `?.` 不是一个运算符，而是一个特殊的语法结构。它还可以与函数和方括号一起使用。

```js
user.exportData?.();
user?.['assas'];
```

## Symbol

```js
let id1 = Symbol('id');
let id2 = Symbol('id');
alert(id1 === id2); // false
alert(id1.toString()); // Symbol(id)
alert(id1.description); // id
// 从全局注册表中读取
let id = Symbol.for('id'); // 如果该 Symbol 不存在，则创建它
let idAgain = Symbol.for('id');
alert(id === idAgain); // true
```

如果我们使用的是属于第三方代码的某个对象，我们想要给它们添加一些标识符，这种情况下就可以给它们使用 Symbol 键而不用担心覆盖原有属性的问题。`Object.keys()` 和 `for in` 都会跳过 Symbol。

## 字符串

这些符号的长度是 2：

```js
alert('𝒳'.length); // 2
alert('😂'.length); // 2
alert('𩷶'.length); // 2
```

`String.fromCodePoint` 和 `str.codePointAt` 是几种处理它们少数方法。原先的 `String.fromCharCode` 和 `str.charCodeAt` 并不能很好的处理这些 UTF-16 字符。它们的作用是相同的。

同时用于循环可迭代对象的 `for of` 也能正确处理这类字符。

## 数组

在数组中搜索：

```js
const arr = [NaN];
alert(arr.indexOf(NaN)); // -1（应该为 0，但是严格相等 === equality 对 NaN 无效）
alert(arr.includes(NaN)); // true（这个结果是对的）
```

简单排序：

```js
arr.sort((a, b) => a - b);
```

## Map 和 Set

在数组和对象之外还有两种存储数据的结构，Map 和 Set。

Map 是一个带键的数据项的集合，和对象很类似，它们的最大差别是 Map 允许使用任何类型的数据作为键，而不只是字符串和 Symbol。注意虽然可行，但 `map[key]` 不是使用 Map 的正确方式，而应该使用 `set()`、`get()`、`has()` 等方法；Set 是值的集合，它不存在键并且每一个值只能出现一次。

WeakMap 是类似于 Map 的集合，它仅允许对象作为键，并且一旦通过其他方式无法访问它们，便会将它们与其关联值一同删除；WeakSet 是类似于 Set 的集合，它仅存储对象，并且一旦通过其他方式无法访问它们，便会将其删除。它们都仅允许单个操作。

对于 Map：

```js
let john = { name: 'John' };
let map = new Map();
map.set(john, '...');
john = null;
// john 依旧被存储在 map 中，我们可以使用 map.keys() 来获取它
```

而对于 WeakMap：

```js
let john = { name: 'John' };
let weakMap = new WeakMap();
weakMap.set(john, '...');
john = null;
// john 被从内存中删除了！
```

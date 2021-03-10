---
title: 'JavaScript 常见手写'
date: 2020-01-22T17:12:11+08:00
tags:
  - javascript
description: 'JavaScript 常见手写。'
---

## 节流函数

```js
/**
 * @param {Function} fn
 * @param {number} delay
 * @return {Function}
 */
const throttle = function (fn, delay) {
  let timer = null;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(), delay);
  };
};
window.onresize = throttle(myFunction, 200);
```

## 柯里化

将一个函数从可调用的 `f(a, b, c)` 转换为可调用的 `f(a)(b)(c)`：

```js
/**
 * @param {Function} func
 * @return {Function}
 */
function curry(func) {
  return function curried(...args) {
    if (args.length > func.length) {
      return curry.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, [...args, ...args2]);
      };
    }
  };
}
```

## 扁平化

输入：

```js
{
  a: 1,
  b: [1, 2, { c: true }, [3]],
  d: { e: 2, f: 3 },
  g: null,
}
```

```js
/**
 * @param {Array} input
 * @param {string} name
 * @param {Object} res
 */
function _flatten(input, name, res) {
  for (let key of Object.keys(input)) {
    let baseName = name;
    const val = input[key];
    if (val === null || val === undefined) {
      continue;
    }
    if (/^[0-9]/.exec(`${key}`)) {
      baseName += `[${key}]`;
    } else if (baseName === '') {
      baseName += `${key}`;
    } else {
      baseName += `.${key}`;
    }
    if (typeof val === 'object') {
      _flatten(val, baseName, res);
    } else {
      res[baseName] = val;
    }
  }
}
/**
 * @param {Array} input
 * @return {Object}
 */
function flatten(input) {
  const res = {};
  _flatten(input, '', res);
  return res;
}
```

## Promise 并发限制

```js
/**
 * @param {number} limit
 * @param {Array} arr
 * @param {Function} fetch
 * @return {Promise<any[]>}
 */
async function asyncPool(limit, arr, fetch) {
  const pending = []; // 工作任务
  const results = []; // 任务结果
  let index = 0;

  async function push() {
    if (index >= arr.length) {
      return Promise.resolve();
    }
    // 添加任务
    const p = fetch(arr[index++]); // 初始化 Promise
    pending.push(p);
    results.push(p);
    p.then(() => pending.splice(pending.indexOf(p), 1)); // 完成后从 pending 删除
    // 若达上限，则等待任一完成后添加；否则直接添加
    if (pending.length >= limit) {
      await Promise.race(pending);
    }
    await push();
  }

  await push();
  return await Promise.all(results);
}
```

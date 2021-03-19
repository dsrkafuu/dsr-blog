---
title: 'JavaScript 常见手写'
date: 2020-01-22T17:12:11+08:00
tags:
  - javascript
description: 'JavaScript 常见手写。'
---

## 防抖与节流

```js
/**
 * 防抖：仅执行一次
 * @param {Function} func
 * @param {number} delay
 * @return {Function}
 */
const debounce = (func, delay) => {
  let timer = null;
  return function (...args) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};
window.onresize = debounce(myFunc, 200);

/**
 * 节流：限制最小执行间隔
 * @param {Function} fn
 * @param {number} delay
 * @return {Function}
 */
const throttle = function (fn, delay) {
  let timer = null;
  return (...args) => {
    !timer &&
      setTimeout(() => {
        func(...args);
        clearTimeout(timer);
      }, delay);
  };
};
window.onresize = throttle(myFunc, 200);
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
      return func.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, [...args, ...args2]);
      };
    }
  };
}
```

## 扁平化

### 数组

```js
// 标准递归
function flatten(arr) {
  return arr.reduce((preVal, val) => {
    return preVal.concat(Array.isArray(val) ? flatten(val) : val);
  }, []);
}

// 字符串分割
function flatten(arr) {
  return Array.prototype.toString
    .call(arr)
    .split(',')
    .map((val) => Number(val));
}

// 重复扩展直至扁平
function flatten(arr) {
  while (arr.some((val) => Array.isArray(val))) {
    arr = [...arr];
  }
  return arr;
}
```

### 对象

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

## 深拷贝

```js
// 可以通过 WeakMap 解决循环引用问题，同时保证内存被回收
function cloneDeep(src) {
  if (typeof src === 'object') {
    const ret = Array.isArray(src) ? [] : {};
    for (let key of Object.keys(src)) {
      ret[key] = cloneDeep(src[key]);
    }
    return ret;
  } else {
    return src;
  }
}
```

## `Promise.all()` Polyfill

```js
/**
 * @param {Array} arr
 * @return {Promise<any[]>}
 */
function promiseAll(arr) {
  return new Promise((resolve, reject) => {
    let pending = arr.length;
    const results = new Array(arr.length);

    arr.forEach((p, idx) => {
      p.then(
        (res) => {
          results[idx] = res;
          if (--pending === 0) {
            resolve(results);
          }
        },
        (e) => reject(e)
      );
    });
  });
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
      return;
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

## 非递归二叉树遍历

先序：

```js
function preOrder(node) {
  const stack = [];

  while (node || stack.length > 0) {
    if (node) {
      stack.push(node);
      console.log(node.val);
      node = node.left;
    } else {
      const top = stack.pop();
      node = top.right;
    }
  }
}
```

中序：

```js
function inOrder(node) {
  const stack = [];

  while (node || stack.length > 0) {
    if (node) {
      stack.push(node);
      node = node.left;
    } else {
      const top = stack.pop();
      console.log(top.val);
      node = top.right;
    }
  }
}
```

## `bind()`

```js
Function.prototype.bind = function () {
  const args = [...arguments]; // Array.prototype.slice.call(arguments)
  const context = args[0];
  const params = args.slice(1);

  const func = this;
  return function () {
    func.apply(context, [...params, ...arguments]);
  };
};
```

## `instanceof`

```js
function instanceOf(inst, func) {
  let proto = inst.__proto__;
  // let proto = Object.getPrototypeOf(inst);
  while (true) {
    if (proto === null) {
      return false;
    }
    if (proto === func.prototype) {
      return true;
    }
    proto = proto.__proto__;
    // proto = Object.getPrototypeOf(proto);
  }
}
```

## `new`

```js
function new(func, ...args) {
  const obj = Object.create(func.prototype);
  const ret = func.call(obj, ...args);

  if (Object.prototype.toString.call(ret).startsWith('[object O')) {
    return ret;
  }
  return obj;
}
```

## Vue Observer

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

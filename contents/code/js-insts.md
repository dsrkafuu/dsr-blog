---
title: 'JS Insts'
date: 2020-01-22T17:12:11+08:00
description: 'JavaScript 常见手写，包括防抖、节流、柯里、扁平、去重等各类手写。'
---

## 工具函数

### 防抖与节流

```ts
/**
 * 防抖：仅执行一次
 */
const debounce = <F extends (...args: any[]) => any>(func: F, delay = 300) => {
  let timer: number | null = null;
  const ret = (...args: any) => {
    if (timer) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      func(...args);
      timer = null;
    }, delay);
  };
  return ret as (...args: Parameters<F>) => void;
};
element.onclick = debounce(myFunc);

/**
 * 节流：限制最小执行间隔
 */
const throttle = <F extends (...args: any[]) => any>(func: F, delay = 300) => {
  let timer: number | null = null;
  const ret = (...args: any) => {
    if (!timer) {
      timer = window.setTimeout(() => {
        func(...args);
        timer = null;
      }, delay);
    }
  };
  return ret as (...args: Parameters<F>) => void;
};
window.onresize = throttle(myFunc);
```

### 柯里化

将一个函数从可调用的 `f(a, b, c)` 转换为可调用的 `f(a)(b)(c)`：

```js
/**
 * @param {Function} func
 * @return {Function}
 */
function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, [...args, ...args2]);
      };
    }
  };
}
```

### 扁平化

#### 数组

```js
// 标准递归
function flatten(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
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

#### 对象

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

### 去重

```js
Array.prototype.unique = function () {
  const arr = this;
  return arr.filter((val, idx) => arr.indexOf(val) === idx);
};
```

### 深拷贝

```js
// 可以通过 WeakMap 解决循环引用问题，同时保证内存被回收
const map = new WeakMap();
function cloneDeep(src) {
  if (src && typeof src === 'object') {
    if (map.has(src)) {
      return map.get(src);
    } else {
      map.set(src, src);
    }
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

## Promise

### Promise 构造函数

Promises/A+ 标准中仅指定了 Promise 对象的 then 方法的行为，其它一切我们常见的方法、函数都并没有指定。

```js
class Promise {
  constructor(func) {
    // 初始化状态
    const self = this;
    this.status = 'pending';
    this.data = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    // API 函数
    function resolve(value) {
      if (self.status === 'pending') {
        self.status = 'resolved';
        self.data = value;
        self.onResolvedCallbacks.forEach((func) => {
          func();
        });
      }
    }
    function reject(reason) {
      if (self.status === 'pending') {
        self.status = 'rejected';
        self.data = reason;
        self.onRejectedCallbacks.forEach((func) => {
          func();
        });
      }
    }

    // 执行同步构造器
    try {
      func(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onResolved, onRejected) {
    // 检查参数
    if (typeof onResolved !== 'function') {
      onResolved = function () {};
    }
    if (typeof onRejected !== 'function') {
      onRejected = function () {};
    }

    // resolve 或 reject 则执行对应回调
    if (this.status === 'resolved') {
      return new Promise((resolve, reject) => {
        try {
          resolve(onResolved(this.data));
        } catch (e) {
          reject(e);
        }
      });
    }
    if (this.status === 'rejected') {
      return new Promise((resolve, reject) => {
        try {
          resolve(onRejected(this.data));
        } catch (e) {
          reject(e);
        }
      });
    }

    // pending 状态则等待 pending 完成
    if (this.status === 'pending') {
      return new Promise((resolve, reject) => {
        this.onResolvedCallbacks.push(() => {
          try {
            resolve(onResolved(this.data));
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            resolve(onRejected(this.data));
          } catch (e) {
            reject(e);
          }
        });
      });
    }
  }
}
```

### Polyfill `Promise.all()`

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

### Promise 并发限制

```js
/**
 * @param {number} limit
 * @param {Array} arr
 * @param {Function} fetch
 * @return {Promise<any[]>}
 */
async function asyncPool(limit, arr, fetch) {
  const pending = [];
  const results = [];
  let index = 0; // 入池用下标

  // 入池一个
  async function push() {
    // 若已经全部进入池子则等待全部完成
    if (index >= arr.length) {
      return;
    }

    // 获得一个 Promise
    const p = fetch(arr[index]);
    pending.push(p);
    results.push(p);
    // Promise 完成后在 pending 中删除
    p.then(() => pending.splice(pending.indexOf(p), 1));

    if (pending.length >= limit) {
      await Promise.race(pending);
    }
    index++;
    await push();
  }

  await push();
  return await Promise.all(results);
}
```

## 原生 API

### `bind()`

```js
Function.prototype.bind = function (...args) {
  const func = this; // 需要绑定的函数
  const ctx = args[0]; // 绑定的 this
  const params = args.slice(1); // bind 时传入的参数
  return (...args) => func.apply(ctx, [...params, ...args]);
};
```

### `instanceof`

```js
function instanceOf(inst, func) {
  let proto = Object.getPrototypeOf(inst);
  while (true) {
    if (!proto) {
      return false;
    }
    if (proto === func.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
}
```

### `new`

[JavaScript - 模拟实现 new](/code/js/#模拟实现-new)

### `reduce()` 实现 `map()`

```js
Array.prototype.mapPolyfill = function (func, thisValue) {
  const self = thisValue || this;
  const ret = [];
  this.reduce((pre, cur, idx, arr) => {
    return ret.push(func.call(self, cur, idx, arr));
  }, ret);
  return ret;
};
```

## 语言特性

### Iterable 对象

```js
const object = {
  a: 1,
  b: 2,
  c: 3,
  // 本质是一个 Generator 函数
  *[Symbol.iterator]() {
    for (const key of Object.keys(this)) {
      yield this[key];
    }
  },
};
console.log(...object); // 1 2 3
object.d = 4;
console.log(...object); // 1 2 3 4
```

### LazyMan (事件循环)

```js
new LazyMan('Tony')
  .eat('lunch')
  .eat('dinner')
  .sleepFirst(5)
  .sleep(10)
  .eat('junk food');
// Hi I am Tony
// 等待了5秒...
// I am eating lunch
// I am eating dinner
// 等待了10秒...
// I am eating junk food

class LazyMan {
  constructor(name) {
    this.taskList = [];
    console.log(`Hi I am ${name}`);
    // 等待第一次事件循环
    // 即 tasklist 初始化完成
    setTimeout(() => {
      this.next();
    }, 0);
  }

  next() {
    const func = this.taskList.shift();
    func && func();
  }

  eat(food) {
    const func = () => {
      console.log(`I am eating ${food}`);
      this.next();
    };
    this.taskList.push(func);
    return this;
  }

  sleepFirst(time) {
    const func = () => {
      setTimeout(() => {
        console.log(`等待了${time}秒...`);
        this.next();
      }, time * 1000);
    };
    this.taskList.unshift(func);
    return this;
  }

  sleep(time) {
    const func = () => {
      setTimeout(() => {
        console.log(`等待了${time}秒...`);
        this.next();
      }, time * 1000);
    };
    this.taskList.push(func);
    return this;
  }
}
```

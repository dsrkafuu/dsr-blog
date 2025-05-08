---
title: 'CS'
date: 2019-01-07T11:05:30+08:00
description: '计算机专业基础相关笔记，包括算法与数据结构、操作系统等基础内容。'
---

## 算法与数据结构

### 冒泡 / 选择 / 插入排序

冒泡排序：

1. 从前往后比较相邻元素，如果第一个比第二个大，就交换
2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对；这步做完后，最后的元素会是最大的数
3. 针对所有的元素重复以上的步骤，除了最后一个
4. 重复执行

选择排序：

1. 从前往后寻找最小元素，存放至起始位置
2. 除了起始元素外，从前往后寻找最小元素，存放至二号位置
3. 重复执行

插入排序：

1. 将起始元素看做一个有序序列，把第二个元素到最后一个元素看做未排序序列
2. 扫描未排序序列，将每个元素插入到有序序列部分的适当位置，相同则靠后插入
3. 每次插入有序序列长度增加、未排序序列长度减少
4. 重复执行

### 希尔排序

基于插入排序的改进：将整个未排序序列按照一定的间隔分割为若干子序列，分别进行插入排序，待整个序列基本有序时，再对整体进行插入排序。

```js
/**
 * @param {Array<Number>} arr
 */
const shellSort = (arr) => {
  const length = arr.length;

  for (
    let gap = length >> 1; // 间隔最初取为 length/2
    gap >= 1; // 最后一次排序为间隔为 1 的全元素插入排序
    gap >>= 1 // 间隔每次减小一半
  ) {
    // 从第 gap 个元素开始，逐个对其所在组进行插入排序
    for (let i = gap; i < length; i++) {
      // 寻找插入位置并插入
      const temp = arr[i];
      let j;
      for (j = i - gap; j >= 0; j -= gap) {
        if (temp < arr[j]) {
          arr[j + gap] = arr[j]; // 后移比当前元素大的元素
        } else {
          arr[j + gap] = temp; // 插入该位置
          break;
        }
      }
      // 若一直后移到底没有替换过 temp
      // 则将当前分组的第一个元素替换为 temp
      if (j < 0) {
        arr[i % gap] = temp;
      }
    }
  }
};
```

### 归并排序

以分治法为基础：将整个序列分为最小的有序子序列 (一个元素)，两两有序合并；每轮合并完成后，子序列大小翻倍。

```js
/**
 * @param {Array<Number>} lArr
 * @param {Array<Number>} rArr
 */
const merge = (lArr, rArr) => {
  const res = [];
  // 寻找小元素归并
  while (lArr.length && rArr.length) {
    res.push(lArr[0] <= rArr[0] ? lArr.shift() : rArr.shift());
  }
  // 若两方还有一侧有剩余元素则全部并入
  while (lArr.length) {
    res.push(lArr.shift());
  }
  while (rArr.length) {
    res.push(rArr.shift());
  }
  return res;
};

/**
 * @param {Array<Number>} arr
 */
const mergeSort = (arr) => {
  const length = arr.length;
  // 仅单个元素时为最小有序序列
  if (length <= 1) {
    return arr;
  }
  // 递归
  const mid = length >> 1;
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  return merge(mergeSort(left), mergeSort(right));
};
```

### 快速排序

1. 从序列中选择一个基准元素，例如第一个
2. 分区：所有比基准小的元素的摆放在基准前面，所有比基准大的元素的摆放在基准后面；每轮分区完成后，基准会处于两个子序列的中间，且可以保证左侧都比基准小，右侧都比基准大
3. 对左右子序列递归执行排序

```js
/**
 * @param {Array<Number>} arr 整个序列
 * @param {Array<Number>} left 分区头
 * @param {Array<Number>} right 分区尾
 */
const partition = (arr, left, right) => {
  const base = left; // 本次分区的基准
  let split = base; // 记录分区后小于基准部分的右边界
  // 从 base + 1 开始将小于 base 值的置于左侧
  for (let i = base + 1; i <= right; i++) {
    if (arr[i] <= arr[base]) {
      [arr[i], arr[split + 1]] = [arr[split + 1], arr[i]];
      split++;
    }
  }
  // 将 base 移动至分隔位置
  [arr[base], arr[split]] = [arr[split], arr[base]];
  return split;
};

/**
 * @param {Array<Number>} arr
 * @param {Array<Number>} left 分区头
 * @param {Array<Number>} right 分区尾
 */
const quickSort = (arr, left, right) => {
  if (left === undefined && right === undefined) {
    left = 0;
    right = arr.length - 1;
  }

  if (left < right) {
    const spilt = partition(arr, left, right);
    quickSort(arr, left, spilt - 1);
    quickSort(arr, spilt + 1, right);
  }
  return arr;
};
```

### 堆排序

1. 首先创建一个大顶堆：每个节点的值都大于等于其子节点的值
2. 把堆顶最大值和堆尾 (最后一个叶子结点) 交换，并且堆的尺寸减一
3. 对新堆把堆顶 heapify 到指定位置
4. 重复以上操作

```js
/**
 * @param {Array<number>} arr 大顶堆
 * @param {number} i 需下沉元素的下标
 * @param {number} length 堆的当前大小
 */
const heapify = (arr, i, length) => {
  const left = 2 * i + 1; // 左子结点
  const right = left + 1; // 右子节点
  // 寻找左右子结点中大的那个
  let larger = i;
  if (left < length && arr[left] > arr[larger]) {
    larger = left;
  }
  if (right < length && arr[right] > arr[larger]) {
    larger = right;
  }
  // 递归处理
  if (larger !== i) {
    [arr[i], arr[larger]] = [arr[larger], arr[i]];
    heapify(arr, larger, length);
  }
};

/**
 * @param {Array<number>} arr 源序列
 */
const heapSort = (arr) => {
  // 转换为大顶堆
  let length = arr.length;
  for (let i = (length >> 1) - 1; i >= 0; i--) {
    heapify(arr, i, length);
  }
  // 堆排序
  for (let i = length - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, 0, --length);
  }
  return arr;
};
```

### 时间复杂度总表

|   算法   |   平均   |   最好   |   最坏   | 稳定性 |
| :------: | :------: | :------: | :------: | :----: |
| 冒泡排序 |  O(n^2)  |   O(n)   |  O(n^2)  |  稳定  |
| 选择排序 |  O(n^2)  |  O(n^2)  |  O(n^2)  | 不稳定 |
| 插入排序 |  O(n^2)  |   O(n)   |  O(n^2)  |  稳定  |
| 希尔排序 | 步长影响 |   O(n)   | 步长影响 | 不稳定 |
| 归并排序 | O(nlogn) | O(nlogn) | O(nlogn) |  稳定  |
| 快速排序 | O(nlogn) | O(nlogn) |  O(n^2)  | 不稳定 |
|  堆排序  | O(nlogn) | O(nlogn) | O(nlogn) | 不稳定 |

### 二叉树操作

```ts
interface TNode {
  val: number;
  left: TNode | null;
  right: TNode | null;
}

/**
 * 深度优先遍历 (先序)
 * @param tnode
 */
function dfs(tnode: TNode) {
  if (!tnode) {
    return;
  }
  console.log(tnode.val);
  dfs(tnode.left);
  dfs(tnode.right);
}

/**
 * 广度优先遍历
 * @param tnode
 */
function bfs(tnode: TNode) {
  if (!tnode) {
    return;
  }
  const query: TNode[] = [];
  query.push(tnode);
  while (query.length) {
    const node = query.shift();
    console.log(node.val);
    node.left && query.push(node.left);
    node.right && query.push(node.right);
  }
}

/**
 * 非递归遍历
 * @param tnode
 */
function noRecurse(tnode: TNode) {
  const stack: TNode[] = [];
  while (tnode || stack.length > 0) {
    if (tnode) {
      stack.push(tnode);
      console.log(tnode.val); // 先序
      tnode = tnode.left;
    } else {
      const top = stack.pop();
      // console.log(top.val); // 中序
      tnode = top.right;
    }
  }
}
```

## 操作系统

### 进程与线程

线程是进程中执行运算的最小单位，是系统独立调度资源的基本单位，线程自己不拥有系统资源，但可与同属一个进程的其它线程共享该进程所拥有的全部资源。一个线程可以创建和撤消另一个线程，同一进程中的多个线程之间可以并发执行。

线程是资源调度的基本单位，进程是资源调度和分配的基本单位。

### 进程通信

1. 信号通信：发送接收信号并执行相应操作
2. 管道 (例如高速缓冲区的文件交换)
3. 共享内存与信号量：PV 操作，读取共享内存
4. Socket：Linux 中表现为 socket 相关的函数

### 死锁的条件

1. 互斥
2. 不可剥夺
3. 请求和保持
4. 循环等待

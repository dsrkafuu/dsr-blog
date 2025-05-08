---
title: 'LeetCode'
date: 2020-09-04T17:14:22+08:00
description: '本笔记收录了我的部分 LeetCode 解题过程，笔记不定期更新，寻找题目请使用搜索。'
---

本笔记收录了我的部分 LeetCode 解题过程，笔记不定期更新，寻找题目请使用 `Ctrl + F` 搜索。

使用语言为 JavaScript，由于语言本身特性以及 V8 引擎实现特性，理论更优的算法很可能在判题过程中展现出更慢的结果，同一题进行多次提交、亦或是单纯的将定义题解的 `var` 替换为 `const` 都有可能表现出很大的速度、空间差距，因此 LeetCode 提交中的数据仅供参考。

源代码同步仓库：<https://github.com/dsrkafuu/dsr-leetcode>，题解思路大部分完整标注于注释中。

## 数据结构

<https://github.com/dsrkafuu/dsr-leetcode/blob/main/class>

## 题解列表

**剑指 Offer 03 - 数组中重复的数字**

1. 遍历 + set：<https://leetcode-cn.com/submissions/detail/137886172/>
2. In-place 方法：<https://leetcode-cn.com/submissions/detail/137890828/>

**剑指 Offer 04 - 二维数组中的查找**

1. 遍历：<https://leetcode-cn.com/submissions/detail/138305063/>
2. In-place 方法：<https://leetcode-cn.com/submissions/detail/138346942/>

**剑指 Offer 05 - 替换空格**

- 正则：<https://leetcode-cn.com/submissions/detail/138350073/>

**剑指 Offer 06 - 从尾到头打印链表**

- 栈：<https://leetcode-cn.com/submissions/detail/138354124/>

**剑指 Offer 07 - 重建二叉树**

1. 递归：<https://leetcode-cn.com/submissions/detail/138552016/>
2. 递归 (优化)：<https://leetcode-cn.com/submissions/detail/138562868/>

**剑指 Offer 09 - 用两个栈实现队列**

- 栈：<https://leetcode-cn.com/submissions/detail/138567129/>

**剑指 Offer 10-1 - 斐波那契数列**

1. 递归：<https://leetcode-cn.com/submissions/detail/138771276/>
2. 迭代：<https://leetcode-cn.com/submissions/detail/138773440/>
3. 查表：<https://leetcode-cn.com/submissions/detail/138774072/>

**剑指 Offer 10-2 - 青蛙跳台阶问题**

- 迭代：<https://leetcode-cn.com/submissions/detail/138773678/>

**剑指 Offer 11 - 旋转数组的最小数字**

1. 遍历：<https://leetcode-cn.com/submissions/detail/138780412/>
2. 二分：<https://leetcode-cn.com/submissions/detail/138791609/>

**剑指 Offer 12 - 矩阵中的路径**

- 回溯 (DFS)：<https://leetcode-cn.com/submissions/detail/139129194/>

**剑指 Offer 13 - 机器人的运动范围**

- 回溯 (DFS)：<https://leetcode-cn.com/submissions/detail/139357849/>

**剑指 Offer 14-1 - 剪绳子**

1. 递归：<https://leetcode-cn.com/submissions/detail/139507621/>
2. 动态规划：<https://leetcode-cn.com/submissions/detail/139506724/>

**剑指 Offer 14-2 - 剪绳子**

- 贪心 (数学规律)：<https://leetcode-cn.com/submissions/detail/139518221/>

**剑指 Offer 15 - 二进制中 1 的个数**

- 正则：<https://leetcode-cn.com/submissions/detail/139520739/>

**剑指 Offer 16 - 数值的整数次方**

1. 运算符：<https://leetcode-cn.com/submissions/detail/139983767/>
2. 快速幂：<https://leetcode-cn.com/submissions/detail/139990529/>

**剑指 Offer 18 - 删除链表的节点**

- 双指针：<https://leetcode-cn.com/submissions/detail/139998699/>

**剑指 Offer 21 - 调整数组顺序使奇数位于偶数前面**

1. 双指针：<https://leetcode-cn.com/submissions/detail/141552993/>
2. 排序：<https://leetcode-cn.com/submissions/detail/141555301/>

**剑指 Offer 22 - 链表中倒数第 k 个节点**

- 快慢指针：<https://leetcode-cn.com/submissions/detail/142106813/>

**剑指 Offer 24 - 反转链表**

- 三指针：<https://leetcode-cn.com/submissions/detail/142114705/>

**剑指 Offer 25 - 合并两个排序的链表**

1. 迭代：<https://leetcode-cn.com/submissions/detail/142118266/>
2. 迭代 (优化)：<https://leetcode-cn.com/submissions/detail/142121429/>

**剑指 Offer 26 - 树的子结构**

- DFS (先序遍历)：<https://leetcode-cn.com/submissions/detail/143400989/>

**剑指 Offer 27 - 二叉树的镜像**

- DFS (后序遍历)：<https://leetcode-cn.com/submissions/detail/143404579/>

**剑指 Offer 27 - 对称的二叉树**

- BFS (类层次遍历)：<https://leetcode-cn.com/submissions/detail/143409066/>

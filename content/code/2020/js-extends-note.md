---
title: 'JavaScript 继承方式简单笔记'
date: 2020-08-02T16:19:39+08:00
tags:
  - javascript
description: '语法糖是生产力进步的阶梯。'
image: 'https://cdn.jsdelivr.net/npm/sks@0.1.9/hexo-5.png'
---

直接进入正题，下图为继承方式的简单分类，这里主要只注重于组合继承、寄生组合继承与 ES6 Class 继承。

<!--more-->

![继承方式简单分类图](/preview/img/js-extends-note/20200802162333.png)

## 组合继承

组合继承结合原型链继承和构造函数继承，子类实例拥有独立的实例属性 (来自构造函数继承) 和共享的原型方法 (来自原型链继承)：

```js
function SuperClass(name) {
  this.name = name;
  this.friends = ['1', '2'];
}
SuperClass.prototype.printName = function () {
  console.log(this.name);
};
function SubClass(name, age) {
  SuperClass.call(this, name);
  this.age = age;
}
SubClass.prototype = new SuperClass(); // 注意这里
SubClass.prototype.constructor = SubClass;
SubClass.prototype.printAge = function () {
  console.log(this.age);
};
const subInstance = new SubClass('aName', 18);
```

上例中子类的实例中有独立的实例属性 `name` `friends` `age`，共享原型方法 `printName()` `printAge()`。由于子类的 prototype 其实是一个父类的实例，因此其中有冗余的独立的实例属性 `name` 和 `friends` 被创建，而这两个属性被子类实例构造函数中调用 `call()` 生成的同名属性覆盖。

![组合继承实例图](/preview/img/js-extends-note/20200802161333.png)

## 寄生组合继承

组合继承结合寄生式继承改造为寄生组合继承：

```js
function SuperClass(name) {
  this.name = name;
  this.friends = ['1', '2'];
}
SuperClass.prototype.printName = function () {
  console.log(this.name);
};
function SubClass(name, age) {
  SuperClass.call(this, name);
  this.age = age;
}
SubClass.prototype = Object.create(SuperClass.prototype); // 不同之处
SubClass.prototype.constructor = SubClass;
SubClass.prototype.printAge = function () {
  console.log(this.age);
};
const subInstance = new SubClass('aName', 18);
```

上例中子类的实例中同样有独立的实例属性 `name` `friends` `age`，共享原型方法 `printName()` `printAge()`。但不同之处在于子类的 prototype 不再是父类的一个实例了，而是一个父类 prototype 的拷贝，因此其中不会有冗余的独立的实例属性 `name` 和 `friends`。

![寄生组合继承实例图](/preview/img/js-extends-note/20200802161414.png)

## ES6 Class 继承

ES6 Class 继承的结果和寄生组合继承基本类似，实现方式略有不同：

```js
function SuperClass(name) {
  this.name = name;
  this.friends = ['1', '2'];
}
SuperClass.prototype.printName = function () {
  console.log(this.name);
};
function SubClass(name, age) {
  SuperClass.call(this, name);
  this.age = age;
}
SubClass.prototype = Object.create(SuperClass.prototype); // 不同之处
SubClass.prototype.constructor = SubClass;
SubClass.prototype.printAge = function () {
  console.log(this.age);
};
const subInstance = new SubClass('aName', 18);
```

![ES6 Class 继承实例图](/preview/img/js-extends-note/20200802161702.png)

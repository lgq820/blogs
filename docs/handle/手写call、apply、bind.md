---
title: 手写call、apply、bind
date: 2020-06-25
categories:
 - 手写源码
tags:
 - 手写题
---

### 1、手写call
call()：在使⽤⼀个指定的 this 值和若⼲个指定的参数值的前提下调⽤某个函数或⽅法。
call传入的参数不固定，第一个参数代表函数体内this指向，从第二个参数开始往后，每个参数被一次传入函数。

**call 函数代码实现如下：**

```js
 Function.prototype.myCall = function(context) {
      // 判断调用对象是否为函数
      if(typeof this !== "function") throw new Error('调用对象应为函数!')
      // 判断context上下文是否存在；否的话，context设置为window
      if(typeof context === 'undefined' || context === null) context = window;
      // 获取参数
      let args = [...arguments].slice(1);
      let result = null;

      // 将函数作为上下文对象的一个属性。
      context.fn = this;
      // 调用函数
      result = context.fn(...args);
      // 删除属性
      delete context.fn;
      return result;
    }

    const obj = {
      name: 'Lee',
      isWorking: true,
    }
    function getUserWork(x, y) {
      console.log(x, y);
      console.log(this);
    }
    getUserWork.myCall(obj, 2, 4);// this === obj
    getUserWork.myCall();// this === window
    getUserWork.myCall(null, 2, 4);// this === window
```

### 2、手写apply
apply 的实现跟 call 类似，只是⼊参不⼀样，apply为数组；

**apply 函数代码实现如下：**

```js
 Function.prototype.myApply = function(context) {
      // 判断调用对象是否为函数
      if(typeof this !== "function") throw new Error('调用对象应为函数!')
      // 判断context上下文是否存在；否的话，context设置为window
      if(typeof context === 'undefined' || context === null) context = window;
      
      // 获取参数
      let result = null;

      context.fn = this;
      // 判断是否传参
      result = arguments[1] ? context.fn(...arguments[1]) : context.fn();
      // 删除属性
      delete context.fn;
      return result;
    }

    const obj = {
      name: 'Lee',
      isWorking: true,
    }
    function getUserWork(x, y) {
      console.log(x, y);
      console.log(this);
    }
    getUserWork.myApply(obj, [2, 4]);// this === obj
    getUserWork.myApply();// this === window
    getUserWork.myApply(null, [2, 4]);// this === window
```

### 3、手写bind

bind() ⽅法会创建⼀个新函数。当这个新函数被调⽤时，bind() 的第⼀个参数将作为它运⾏时的 this，之后的⼀序列参数将会在传递的实参前传⼊作为它的参数。

**bind 函数代码实现如下：**
```js
Function.prototype.myBind = function(context) {
      // 判断调用对象是否为函数
      if(typeof this !== "function") throw new Error('调用对象应为函数!')
      // 判断context上下文是否存在；否的话，context设置为window
      if(typeof context === 'undefined' || context === null) context = window;
      
      const fn = this;
      // 调用apply来绑定函数调用，返回一个函数
      return function(...args) {
        return fn.apply(context, args);
      }
    }

    const obj = {
      name: 'Lee',
      isWorking: true,
    }
    function getUserWork(x, y) {
      console.log(x, y);
      console.log(this);
    }
    const mybind1 = getUserWork.myBind(obj, [2, 4]);// this === obj
    mybind1();
    const mybind2 = getUserWork.myBind();// this === window
    mybind2();
    const mybind3 = getUserWork.myBind(null, 2, 4);// this === window
    mybind3();
    const mybind4 = getUserWork.myBind(obj);// this === obj
    mybind4();
```
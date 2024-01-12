---
title: this关键字总结
date: 2020-12-10
categories:
 - frontEnd
tags:
 - js
---

> 本文将介绍 this 关键字在函数、箭头函数上下文，以及修改this关键字的方法。
### 一、this 关键字调用方式
#### 1、普通函数调用


```js
function getThis() {
    console.log(this);// this === window
}
```
当函数作为普通函数调用时，this指向在严格模式和非严格模式下有所不同。严格模式下，`this`指向`undefined`，非严格模式下，`this`指向`window`。

#### 2、函数作为对象方法调用


```js
const obj = {
    name: 'Lee',
    sayHi: function(){
        console.log(this)// this === {name: 'Lee', sayHi: ƒ}
    }
 }
 obj.sayHi()
```
当函数被作为对象的方法调用时，其中的 `this` 指向该对象本身。上述代码：`sayHi`函数作为`obj`的一个方法调用。所以this指向obj，而不是全局对象window。

#### 3、构造函数调用

```js
function Person(name, age){
    this.name = name;
    this.age = age;
    console.log(this);// this === Person {name: 'Lee', age: 22}
}

const person = new Person('Lee', 22);
```
通过 `new` 关键字创建实例时，`this` 关键字会指向新创建的对象。

#### 4、箭头函数调用

```js
const obj = {
  name: 'Lee',
  greetting: function() {
    const arrowFunc = () => {
     console.log(this);// this === {name: 'Lee', greetting: ƒ}
    };

    return arrowFunc();
  }
};
console.log(obj.greetting());



const obj = {
  name: 'Lee',
  sayHi: () => {
      console.log(this);// this === window
  }
};

obj.sayHi();

```
箭头函数的 `this` 绑定与常规函数不同，箭头函数没有自己的 `this` 值，而是捕获了封闭上下文的 `this` 值。所以上述代码中，箭头函数中的this引用的就是最近作用域中 `this`。

#### 5、函数调用时使用call或apply


```js
const obj = {
    name: 'Lee'
}

function useCallOrApply(x, y){
     console.log(x, y);
     console.log(this);
}
useCallOrApply.call(obj, 1, 2);// this === obj 1、2 为参数
useCallOrApply.apply(obj, [1, 2]);// this === obj [1, 2] 为参数
```

通过使用函数的 `call` 或 `apply` 方法，可以显式地指定函数执行时的上下文，即 `this` 的值。在上述代码中，`useCallOrApply.call(obj, 1, 2)` 和 `useCallOrApply.apply(obj, [1, 2])` 中的 `this` 都被绑定到了 `obj` 对象.


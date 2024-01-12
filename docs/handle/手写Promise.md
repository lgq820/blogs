---
title: 手写Promise源码
date: 2020-06-21
categories:
 - 手写源码
tags:
 - 手写题
---

Promise 是 JavaScript 中用于异步编程的一个重要概念，它是 ES6 标准引入的原生对象，用于处理异步操作。Promise 对象代表一个现在、将来或永远可能可用，也可能不可用的值。

Promise 有三种状态：

Pending（进行中）：初始状态，既不是 fulfilled 也不是 rejected。

Fulfilled（已成功）：操作成功完成时的状态，此时 Promise 的结果可以通过 .then 方法访问。

Rejected（已失败）：操作失败时的状态，此时 Promise 的原因可以通过 .catch 或 .then 的第二个回调函数访问。

Promise 可以通过 new Promise 构造函数创建，并接受一个执行器函数（executor function）作为参数。这个函数接受两个参数，分别是 resolve 和 reject 函数，它们分别用于改变 Promise 的状态。

 ### 完整源码如下：

 ```js

 class MyPromise {
      // 构造方法
      constructor(exector) {
        // 初始化this指向
        this.initBind();
        // 初始化值
        this.initValue();
        try {
          // 执行传进来的函数
          exector(this.resolve, this.reject);
        } catch (e) {
          // 捕捉到错误直接执行reject
          this.reject(e);
        }
      }
      // 初始化this
      initBind() {
        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);
      }
      // 初始化值
      initValue() {
        this.promiseResult = null;// 终值
        this.promiseStatus = 'pending';// 状态
        this.onFulfilledCallbacks = [];// 保存成功回调
        this.onRejectedCallbacks = [];// 保存失败回调
      }

      resolve(value) {
        // state是不可变的
        if(this.promiseStatus !== 'pending') return;
        // 如果执行resolve，状态变为fulfilled
        this.promiseStatus = 'fulfilled';
        // 终值为传进来的值
        this.promiseResult = value;
        // 执行保存的成功回调
        while (this.onFulfilledCallbacks.length) {
          this.onFulfilledCallbacks.shift()(this.promiseResult);
        }
      }

      reject(reason) {
        // state是不可变的
        if(this.promiseStatus !== 'pending') return;
         // 如果执行reject，状态变为rejected
        this.promiseStatus = 'rejected';
        // 终值为传进来的reason
        this.promiseResult = reason;
        // 执行保存的失败回调
        while (this.onRejectedCallbacks.length) {
          this.onRejectedCallbacks.shift()(this.promiseResult);
        }
      }
      // 接收两个回调 onFulfilled, onRejected
      then(onFulfilled, onRejected) {
        // 参数校验，必须为函数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

        var thenPromise = new MyPromise((resolve, reject) => {
          const resolvePromise = cb => {
            setTimeout(() => {
              try {
                const x = cb(this.promiseResult);

                if(x === thenPromise) {
                  throw new Error('不能返回自身。。。')
                }

                if(x instanceof MyPromise) {
                  // 如果返回值是Promise
                  x.then(resolve, reject)
                } else {
                  resolve(x); // 非Promise就直接成功
                }
                
              } catch (err) {
                reject(err);
                throw new Error(err);
              }
            })
          }
          if(this.promiseStatus === 'fulfilled'){
            // onFulfilled(this.promiseResult);// 如果当前为成功状态，执行第一个回调
            resolvePromise(onFulfilled)
          } else if(this.promiseStatus === 'rejected'){
            // onRejected(this.promiseResult);// 如果当前为失败状态，执行第二哥回调
            resolvePromise(onRejected)
          } else if (this.promiseStatus === 'pending') {
            // 如果状态为待定状态，暂时保存两个回调
            this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled));
            this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected));
          }
        })

        return thenPromise;
      }

      /**
       * all
       * 1.接收一个Promise数组，数组中如有非Promise项，则此项当做成功；
       * 2. 如果所有Promise都成功，则返回成功结果数组；
       * 3. 如果有一个Promise失败，则返回这个失败结果；
      */
     static all(promises) {
      const result = [];
      let count = 0;
      return new  MyPromise((resolve, reject) => {
        const addData = (index, value) => {
          result[index] = value;
          count++;
          if(count === promises.length) resolve(result);
        }
        
        promises.forEach((promise, index) => {
          if(promise instanceof MyPromise) {
            promise.then(res => {
              addData(index, res);
            }, err => reject(err));
          } else {
            addData(index, promise);
          }
        });

      })
     }

     /**
      * race
      * 1. 接收一个Promise数组，数组中如有非Promise项，则此项当做成功；
      * 2. 哪个Promise最快得到结果，就返回那个结果，无论成功失败；
     */

     static race(promises) {
      return new MyPromise((resolve, reject) => {
        promises.forEach(promise => {
          if(promise instanceof MyPromise) {
            promise.then(res => resolve(res), err => reject(err));
          } else {
            resolve(promise);
          }
        })
      })
     }

     /**
      * allSettled
      * 1. 接收一个Promise数组，数组中如有非Promise项，则此项当做成功；
      * 2. 把每一个Promise的结果，集合成数组后返回；
     */

    static allSettled(promises) {
      return new MyPromise((resolve, reject) => {
        const result = [];
        let count = 0;
        const addData = (status, value, i) => {
          result[i] = {
            status,
            value
          }
          count++;
          if(count === promises.length) resolve(result);
        }

        promises.forEach((promise, index) => {
          if(promise instanceof MyPromise) {
            promise.then(res=> {
              addData('fulfilled', res, index);
            }, err => {
              addData('rejected', err, index);
            })
          } else {
            addData('fulfilled', promise, index);
          }
        });
      })
    }

    /**
     * any 与all相反
     * 1. 接收一个Promise数组，数组中如有非Promise项，则此项当做成功；
     * 2. 如果有一个Promise成功，则返回这个成功结果；
     * 3. 如果所有Promise都失败，则报错；
     * 
    */
    static any(promises) {
      return new MyPromise((resolve, reject) => {
        let count = 0;
        promises.forEach(promise => {
          promise.then(res => {
            resolve(res);
          }, err => {
            count++;
            if(count === promises.length){ reject(new Error('All promises were rejected'))};
          });
        });
      })
    }

    // catch方法
    catch (onRejected) {
      return this.then(undefined, onRejected)
    }
    // 添加静态resolve方法
    static resolve (value) {
      // 如果参数是MyPromise实例，直接返回这个实例
      if (value instanceof MyPromise) return value
      return new MyPromise(resolve => resolve(value))
    }
    // finnally
    finally (cb) {
      return this.then(
        value  => MyPromise.resolve(cb()).then(() => value),
        reason => MyPromise.resolve(cb()).then(() => { throw reason })
      );
    }


  }
    


    const test4 = new MyPromise((resolve, reject) => {
      reject(1)
    });
  
    const test5 = new MyPromise((resolve, reject) => {
      reject('234243')
    })

    const test6 = new MyPromise((resolve, reject) => {
      resolve({ code: 200 })
    })

    MyPromise.any([test4, test5, test6]).then(res => console.log('res', res), err => console.log('err', err)).finally(()=> console.log('finally...'))
  ```
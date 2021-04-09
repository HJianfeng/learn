# 手写Promise
Promise 必须为以下三种状态之一：等待态（Pending）、执行态（Fulfilled）和拒绝态（Rejected）。一旦Promise 被 resolve 或 reject，不能再迁移至其他任何状态（即状态 immutable）。  

基本过程：  
1. 初始化 Promise 状态（pending）
2. 立即执行 Promise 中传入的fn函数，将Promise内部的 resolve、reject作为参数传递给fn，按事件机制时机处理  
3. 执行 then() 注册回调处理数组（then 方法可被同一个 promise 调用多次）  
4. Promise里的关键是要保证，then方法传入的参数 onFulfilled 和 onRejected，必须在then方法被调用的那一轮事件循环之后的新执行栈中执行。

### 第一版  
基于 `PromiseA+` 规范
```javascript
function Promise(fn) {
  let state = 'pending';
  let value = null;
  const callbacks = [];

  this.then = function(onFulfilled) {
    return new Promise((resolve, reject)=> {
      handle({ //桥梁，将新 Promise 的 resolve 方法，放到前一个 promise 的回调对象中
          onFulfilled, 
          resolve
      })
    })
  }

  function resolve(newValue) {
    const fn = () => {
      if(state !== 'pending') return;
      if(newValue && (typeof newValue === 'object' || typeof newValue === 'function')){
        const {then} = newValue
        if(typeof then === 'function'){
          // newValue 为新产生的 Promise,此时resolve为上个 promise 的resolve
          //相当于调用了新产生 Promise 的then方法，注入了上个 promise 的resolve 为其回调
          then.call(newValue,resolve)
          return
        }
      }
      state = 'fulfilled';
      value = newValue;
      handelCb();
    }
    setTimeout(fn, 0) //基于 PromiseA+ 规范
  }

  //桥梁
  function handle(callback) {
    if(state === 'pending'){
      callbacks.push(callback)
      return;
    }
    if(state === 'fulfilled') {
      if(!callback.onFulfilled) {
        callback.resolve(value);
      }
      const ret = callback.onFulfilled(value); //处理回调
      callback.resolve(ret) //处理下一个 promise 的resolve
    }
  }

  function handelCb(){
    while(callbacks.length) {
      const fulfiledFn = callbacks.shift();
      handle(fulfiledFn);
    };
  }
  
  fn(resolve)
}
```
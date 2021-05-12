# axios 源码分析-取消请求

## 使用取消请求
有的时候我们会进行一些耗时比较长的请求，如果中途我们不想再继续了，如何能够取消请求呢，先看看axios官方文档关于取消请求的用法
```javascript
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function(thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // handle error
  }
});

axios.post('/user/12345', {
  name: 'new name'
}, {
  cancelToken: source.token
})

// cancel the request (the message parameter is optional)
source.cancel('Operation canceled by the user.');
```
通过`axios.CancelToken.source()`得到一个对象，这个对象有两个属性，一个是`token`，一个是`cancel`方法，通过config把`token`传给我们想要取消的请求，然后调用`cancel`方法，就能够取消我们的请求，并且在`catch`里面得到我们调用`cancel`时传入的消息。

## CancelToken
我们在axios源码找到`CancelToken`类，位置在`/lib/cancel/CancelToken.js`
```javascript
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};
```
可以看出我们调用的`axios.CancelToken.source()`方法返回的对象里面是`token`和`cancel`，`token`就是`CancelToken`的实例。  

其中`cancel`就是从实例里面拿到的`c`方法。我们再来看一下`CancelToken`的内容。
```javascript
function CancelToken(executor) {
  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }
    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};
```
`CancelToken`传入一个函数，通过这个函数把`function cancel(message)`返回给了`CancelToken.source().cancel`。  

`CancelToken.source().token`有`promise`和`reason`两个属性，`promise` 一直处于 pending状态，`reason`属性是一个`Cancel`类的实例，Cancel类的构造函数如下：
```javascript
// /lib/cancel/Cancel.js
function Cancel(message) {
    this.message = message;
}

Cancel.prototype.toString = function toString() {
    return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;
```
可以看出`reason`属性里只有一个`message`。也就是我们取消请求时传入的消息。那是如何把这个消息抛出的呢，在`axios`的拦截器里面的调用`CancelToken.prototype.throwIfRequested`来抛出消息。
```javascript
// /lib/core/dispatchRequest.js
function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
    }
}
// 拦截器
module.exports = function dispatchRequest(config) {
    // 判断是否已经取消请求
    throwIfCancellationRequested(config);
    
    /* ... */
};

// /lib/cancel/CancelToken
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
        throw this.reason;
    }
}
```
检测`config.cancelToken`是否有`reason`属性，如果有，将`reason`抛出，`axios`进入`rejected`状态。  

我们知道`axios`其实就是帮我们封装了js的`XMLHttpRequest`对象，我们可以看一下`XMLHttpRequest`的文档，在文档中我们知道取消请求的方法是`abort()`的，所以前面处理那么多只是为了调用这个请求的`abort()`方法。
```javascript
// lib/adapters/xhr.js
if (config.cancelToken) {
    // Handle cancellation
    config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
            return;
        }

        // 取消请求
        request.abort();
        
        // promise进入rejected
        reject(cancel);
        // Clean up request
        request = null;
    });
}
```
这段代码把`onCanceled`传给了`cancelToken.promise`属性，所以当我们调用`cancelToken.promise`的`resolve`函数时，就会调用这个方法，通过这个方法调用`request.abort()`取消请求和改变请求的状态，使catch中抛出错误。


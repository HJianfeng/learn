## tapable 是什么
Webpack可以将其理解是一种基于事件流的编程范例，一个插件合集。而tabable就是为了控制插件在webpack事件流上的运行，tabable 暴露了很多Hook（钩子）类，为插件提供挂载的钩子。
```javascript
const {
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesLoopHook,
	AsyncSeriesWaterfallHook
 } = require("tapable");
```
![](https://user-gold-cdn.xitu.io/2020/3/24/1710b42a06d08210?w=1824&h=762&f=png&s=216508)  
tapable 的钩子分为同步和异步两大类，异步又分为串行和并行，

## 为什么要阅读 tapable 源码
要想了解webpack的实现原理，那么了解tapable的使用方法是必不可少的，其实我们只要会使用tapable就好了，那为什么还要花时间去阅读tapable的源码？
1. 大佬写的代码，很值得去阅读
2. 代码比较少，我们只要花少量时间就能研究明白，而且会有收获

## SyncHook
我们先来看看最简单的 SyncHook, 首先看看它的用法。
```javascript
import { SyncHook } from 'tapable';

//所有的构造函数都接收一个可选的参数，这个参数是一个字符串的数组。
const hook = new SyncHook(['param1','param2']); // 创建钩子对象
hook.tap('event1', (param) => console.log('event1:', param));
hook.tap('event2', (param) => console.log('event2:', param));
hook.tap('event3', (param, param2) => console.log('event3:', param, param2));

hook.call('hello', 'world'); 
// call方法调用钩子，打印出
// event1:hello
// event2:hello
// event3:hello world
```
使用很简单，通过`tap`方法注册钩子，并定义回调方法，然后通过`call`方法调用钩子，可以看到，这个钩子订阅的事件都是按顺序同步执行的。   
我们可以简单模拟下原理
```javascript
class SyncHook {
    constructor() {
        this.taps = [];
    }
    tap(options,fn) {
        this.taps.push(fn)
    }
    call() {
        this.taps.forEach(fn => fn(...arguments))
    }
}
```
## SyncBailHook
SyncBailHook 只要监听函数中有一个函数的返回值不为undefined，则跳过剩下所有的逻辑。  
```javascript
let queue = new SyncBailHook(['param1']); //所有的构造函数都接收一个可选的参数，这个参数是一个字符串的数组。
// 订阅
queue.tap('event 1', function (param1) {// tap 的第一个参数是用来标识订阅的函数的
    console.log(param1, 1);
    return 1;
});
queue.tap('event 2', function (param1) {
    console.log(param1, 2);
});
queue.tap('event 3', function () {
    console.log(3);
});
// 发布
queue.call('hello', 'world');// 发布的时候触发订阅的函数 同时传入参数

// 控制台输出
/* hello 1 */
```
上面这个栗子，因为在响应event1时，回调函数返回值 !== undefined，所以就跳过了剩下的事件，只打印`hello 1`

## 源码解读
记住重点，tapable核心就是call和tap两个方法。  
  
我们来看一下SyncHook是如何实现的
```javascript
// tapable/lib/SyncHook.js
const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");

class SyncHookCodeFactory extends HookCodeFactory {
	content({ onError, onDone, rethrowIfPossible }) {
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onDone,
			rethrowIfPossible
		});
	}
}
const factory = new SyncHookCodeFactory();
const COMPILE = function(options) {
	factory.setup(this, options);
	return factory.create(options);
};
function SyncHook(args = [], name = undefined) {
	const hook = new Hook(args, name);
	hook.constructor = SyncHook;
	hook.compile = COMPILE;
	return hook;
}
SyncHook.prototype = null;
module.exports = SyncHook;
```
代码很简单，我们可以看到在SyncHook.js文件里只是重写了一个`COMPILE`函数，其他方法都是继承于`Hook`和`HookCodeFactory`，如果我们先看一下其他的Hook的代码会发现所有都是继承这两个抽象类，这里就体现出了作者抽象化的思想。既然都是继承自`Hook`和`HookCodeFactory`，那我们先去看一下`Hook`类的`tap`方法

### tap、tapAsync、tapPromise方法
注册方法有三种tap、tapAsync、tapPromise，分别对应同步、异步和promise的钩子，他们的原理都一样只是传给`_tap`方法的type不一样，分别是`sync`、`async`和`promise`。
```javascript
_tap(type, options, fn) {
	if (typeof options === "string") {
		options = {
			name: options
		};
	}
	if (typeof options.context !== "undefined") {
		deprecateContext();
	}
	// 同步 整理配置项
	options = Object.assign({ type, fn }, options);
	// 注册拦截器
	options = this._runRegisterInterceptors(options);
	this._insert(options);
}
_insert(item) {
    // 将item 推进 this.taps
    this.taps[i] = item;
}
```
它的核心功能是拼起一个options对象，options的内容如下：
```javascript
options:{
    name, // 插件名称
    type: "sync" | "async" | "promise", // 插件注册的类型
    fn, // 插件的回调函数，被call时的响应函数
    stage, // 插件调用的顺序值
    before，// 插件在哪个插件之前调用
}
```
拼好了options，就利用_insert方法将其放到taps变量里，以供后续调用。_insert方法内部就是实现了根据stage和before两个值，对options的插入到taps中的顺序做了调整并插入。

### call方法

```
const CALL_DELEGATE = function(...args) {
	this.call = this._createCall("sync");
	return this.call(...args);
};
class Hook {
    constructor(args) {
    	this.taps = [];
    	this.call = CALL_DELEGATE;
    }

    // 执行compile生成call方法
    _createCall(type) {
    	return this.compile({
            taps: this.taps,
			interceptors: this.interceptors,
			args: this._args,
			type: type
    	});
    }
}
```
我们可以看到`this.call`调用`this._createCall("sync")`来生成call方法，`_createCall`里面调用了在每个Hook文件里重写的`compile`函数，所以到这里我们就清楚的知道，当我们调用call方法时，运行的是compile方法所返回的函数。  
当然除了`call`方法外，还有`callAsync`和`promise`，他们的区别在于传给`_createCall`的type不一样，`callAsync`的type是async，`promise`的type是promise。  
了解完 Hook.js 所做的事情后，我们回到SyncHook.js里面所重写的compile方法。
```javascript
class SyncHookCodeFactory extends HookCodeFactory {
	content({ onError, onDone, rethrowIfPossible }) {
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onDone,
			rethrowIfPossible
		});
	}
}
const factory = new SyncHookCodeFactory();
const COMPILE = function(options) {
	factory.setup(this, options);
	return factory.create(options);
};
```
compile方法里面调用了`SyncHookCodeFactory`类中的`setup`和`create`，`SyncHookCodeFactory`继承自`HookCodeFactory`，我们去`HookCodeFactory`里面看看这两个方法。

### setup、create
```javascript
setup(instance, options) {
	instance._x = options.taps.map(t => t.fn);
}
```
setup很简单，只是把`taps`里面的所有回调函数生成一个数组赋值给钩子实例中的_x。  
然后再看下factory实例调用的create方法。
```javascript 
create(options) {
    this.init(options);
    let fn;
    switch (this.options.type) {
        case "sync":
            fn = new Function(
                this.args(),
                '"use strict";\n' +
                this.header() +
                this.contentWithInterceptors({
                    onError: err => `throw ${err};\n`,
                    onResult: result => `return ${result};\n`,
                    resultReturns: true,
                    onDone: () => "",
                    rethrowIfPossible: true
                })
            );
        );
        break;
    }
}
```
里面根据`this.options.type`来判断执行哪个逻辑，create会将传进来的所有事件，进行组装。最终生成call方法。如下就是我们这次的案例最终生成的call方法。
```javascript
function anonymous(param1) {
    "use strict";
    var _context;
    var _x = this._x;
    var _fn0 = _x[0];
    _fn0(param1);
    var _fn1 = _x[1];
    _fn1(param1);
    var _fn2 = _x[2];
    _fn2(param1);
}
```
  
总结一下，核心就是call和tap两个方法，其实还有tapAsync等...但是原理都是一样的。tap收集订阅的事件，触发call方法时根据hook的种类动态生成对应的执行体。如下图，其他hook的实现也是同理。

![](https://user-gold-cdn.xitu.io/2020/3/30/1712909ed833983f?w=1280&h=496&f=png&s=180620)

## Tapable在Webpack中的应用
Webpack 的流程可以分为以下三大阶段：

![](https://user-gold-cdn.xitu.io/2020/3/30/171290c9f1a76ac1?w=1280&h=526&f=png&s=227025)
执行webpack时，会生成一个compiler实例。
```javascript
// node_modules/webpack/lib/webpack.js
const Compiler = require("./Compiler");
const MultiCompiler = require("./MultiCompiler");

const webpack = (options, callback) => {
	// ...省略了多余代码...
    let compiler;
    if (typeof options === "object") {
    	compiler = new Compiler(options.context);
    } else {
    	throw new Error("Invalid argument: options");
    }
})
```
我们发现Compiler是继承了Tapable的。同时发现webpack的生命周期hooks都是各种各样的钩子。
```javascript
// node_modules/webpack/lib/Compiler.js
class Compiler extends Tapable {
    constructor(context) {
    super();
        this.hooks = {
            /** @type {AsyncSeriesHook<Stats>} */
            done: new AsyncSeriesHook(["stats"]),
            /** @type {AsyncSeriesHook<>} */
            additionalPass: new AsyncSeriesHook([]),
            /** @type {AsyncSeriesHook<Compiler>} */
            beforeRun: new AsyncSeriesHook(["compiler"]),
            /** @type {AsyncSeriesHook<Compiler>} */
            run: new AsyncSeriesHook(["compiler"]),
            /** @type {AsyncSeriesHook<Compilation>} */
            emit: new AsyncSeriesHook(["compilation"]),
            /** @type {AsyncSeriesHook<string, Buffer>} */
            assetEmitted: new AsyncSeriesHook(["file", "content"]),
            /** @type {AsyncSeriesHook<Compilation>} */
            afterEmit: new AsyncSeriesHook(["compilation"]),
        
            // ....等等等很多
        }
    }
}
```
然后在初始化webpack的配置过程中，会循环我们配置的以及webpack默认的所有插件也就是plugin。
```javascript
// 订阅在options中的所有插件
if (options.plugins && Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
        if (typeof plugin === "function") {
            plugin.call(compiler, compiler);
        } else {
            plugin.apply(compiler);
        }
    }
}
```
这个过程，会把plugin中所有tap事件收集到每个生命周期的hook中。 最后根据每个hook执行call方法的顺序（也就是生命周期）。就可以把所有plugin执行了。
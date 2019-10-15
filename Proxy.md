# 代理模式Proxy 和 Vue3数据响应系统
## 一、代理模式
### Proxy
`Proxy` 提供了强大的 Javascript 元编程，尽管他不像其他 ES6 功能用的普遍，但`Proxy`有许多功能，包括运算符重载，对象模拟，简洁而灵活的API创建，对象变化事件，甚至Vue 3背后的内部响应系统提供动力。  
  
`Proxy`用于修改某些操作的默认行为，也可以理解为在目标对象之前架设一层拦截，外部所有访问都先经过这层拦截，所以我们叫它为代理模式。  

ES6原生提供了`Proxy`构造函数，用来生成`Proxy`实例。
``` javascript
var proxy = new Proxy(target, handler);
```
`Proxy`对象的所有用法，都是上面这种形式，不同的只是`handle`参数的写法。其中`new Proxy`用来生成Proxy实例，target是表示所要拦截的对象，handle是用来定制拦截行为的对象。  
例子：
```javascript
const target = {}
const proxy = new Proxy(target, {
    get: (obj, prop) => {
        console.log('设置 get 操作')
        return obj[prop];
    },
    set: (obj, prop, value) => {
        console.log('set 操作')
        obj[prop] = value;
    }
});
proxy.a = 2  // set 操作
proxy.a  // 设置 get 操作
```
当给目标对象进行赋值或获取属性时，就会分别触发`get`和`set`方法，`get`和`set`就是我们设置的代理，覆盖了默认的赋值或获取行为。  
当然，除了`get`和`set`，`Proxy`还可以拦截其他共计13种操作
```javascript
/* 
handler.get
handler.set
handler.has
handler.apply
handler.construct
handler.ownKeys
handler.deleteProperty
handler.defineProperty
handler.isExtensible
handler.preventExtensions
handler.getPrototypeOf
handler.setPrototypeOf
handler.getOwnPropertyDescriptor
*/
var target = function (a,b) { 
  return a + b;
 };
const proxy = new Proxy(target, {
    apply: (target, thisArg, argumentsList) => {
        console.log('apply function', argumentsList)
        return target(argumentsList[0], argumentsList[1]) * 10;
    }
});
proxy(1, 2)
```
### Proxy 的用法
#### 验证属性
```javascript
let validator = {
  set: (obj, prop, value) => {
    if(prop === 'age') {
      if(!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer')
      }
      if(value > 200) {
        throw new TypeError('The age is seems invalid')
      }
    }
    obj[prop] = value;

    return true;
  }
};

let p = new Proxy({}, validator);
p.age = '11' // Uncaught TypeError: The age is not an integer
p.age = 2000 // Uncaught TypeError: The age is seems invalid
p.age = 18 // true
```
我们有时候可能会对一个对象的某些属性进行一些限制，比如年龄age，只能是字符串而且不超过 200 岁，当不满足这些要求时我们就可以通过代理抛出错误

## 二、vue3 数据驱动: reactivity
10月出的时候，vue3公布了源码，其中数据响应式系统核心就是采用 `Proxy` 代理模式，我们来看看它的源码， `reactivity`的源码位置在`packages`的文件内，
以下是简化后的源码。
``` javascript
// 代码经过删减
import { mutableHandlers, readonlyHandlers } from './baseHandlers'
// rawToReactive 和 reactiveToRaw 是两个弱引用的 Map 结构
// 这两个 Map 用来保存原始数据 和 可响应数据
// 创建完 Proxy 后需要把原始数据和 Proxy对象分别保存到这两个Map结构
const rawToReactive = new WeakMap() // 键是原始数据，值是响应数据
const reactiveToRaw = new WeakMap() // 键是响应数据，值是原始数据

export const targetMap = new WeakMap<any, KeyToDepMap>()
// entry
function reactive(target) {
 // if trying to observe a readonly proxy, return the readonly version.
 // 如果是只读proxy，直接返回
  if (readonlyToRaw.has(target)) {
    return target
  }
  // target is explicitly marked as readonly by user
  // 如果目标被用户标记为只读，那么通过 readonly 创建一个只读的Proxy
  if (readonlyValues.has(target)) {
    return readonly(target)
  }
  return createReactiveObject(
    target,
    rawToReactive,
    reactiveToRaw,
    mutableHandlers,
  )
}

function createReactiveObject(target, toProxy, toRaw, baseHandlers) {
  let observed = toProxy.get(target)
  // 原数据已经有相应的可响应数据, 返回可响应数据
  if (observed !== void 0) {
    return observed
  }
  // 原数据已经是可响应数据
  if (toRaw.has(target)) {
    return target
  }
  observed = new Proxy(target, baseHandlers)
  toProxy.set(target, observed)
  toRaw.set(observed, target)
  // 把原数据当做key保存在targetMap，value值是一个 Map 类型
  // 
  if (!targetMap.has(target)) {
    targetMap.set(target, new Map())
  }
  return observed
}
```
`reactive` 方法就是暴露给外面的入口方法，方法里面只做了一件事情，就是判断是否要生成只读的`Proxy`对象，如果是则调用`readonly`创建，不是则直接使用`createReactiveObject`来生成响应是数据。  
  
`createReactiveObject` 里面第一步尝试在`toProxy`中获取是否已经有这个`target`的响应式数据，如果有则直接把获取到的返回出去，第二步判断`target`里面是否已经是可响应数据，第三步就是通过`new Proxy`创建可响应数据，其中`baseHandlers`在`./baseHandlers.ts`这个文件下定义。创建完成后，把数据保存到`toProxy`和`toRaw`，这样方便下次创建时使用。  

我们知道响应式数据是如何创建，接下来我们看一下`baseHandlers.ts`里面定义的`handler`实现 
#### get
先看一段代码，
```javascript
let handler = {
  get: (obj, prop) => {
      console.log('get 操作')
      return obj[prop];
  },
  set: (obj, prop, value) => {
    console.log('set 操作')
    return true;
  }
};

let p = new Proxy({
  a: {}
}, handler);
p.a.c = 1  // get 操作
```
这时候我们对target里面的a对象进行赋值，但是我们的`set`里面是不能触发深度的数据赋值，但是这时候是会触发`get`，那么这里就会出现一个问题，较深层次的数据就无法被代理到了。解决办法很简单，就是通过`get`判断值是否为对象，如果是则把值再走一遍`Proxy`。
```javascript
function createGetter(isReadonly: boolean) {
  return function get(target: any, key: string | symbol, receiver: any) {
    const res = Reflect.get(target, key, receiver)
    // 
    track(target, OperationTypes.GET, key)
    return isObject(res)
      ? isReadonly
        ? // need to lazy access readonly and reactive here to avoid
          // circular dependency
          readonly(res)
        : reactive(res)
      : res
  }
}

let handler = {
  get: createGetter(false),
  set: (obj, prop, value) => {
    console.log('set 操作')
    return true;
  }
};

let p = new Proxy({
  a: {}
}, handler);
p.a.c = 1  // get 操作
```
在`vue3`中使用`createGetter`方法来返回`get`，`createGetter`里面判断通过`Reflect.get`获取到的数据如果是`Object`，则继续调用`reactive`生成`Proxy`对象，从而获得了对对象内部的侦测。并且，每一次的 proxy 数据，都会保存在 `WeakMap` 中，访问时会直接从中查找，从而提高性能。 `track`方法和`effect`有关，我们下文再说。 
#### set

```javascript
function set(
  target: any,
  key: string | symbol,
  value: any,
  receiver: any
): boolean {
  const hadKey = hasOwn(target, key)
  const result = Reflect.set(target, key, value, receiver)
  // 是否新增 key
  // trigger 是用来触发回调
  if (!hadKey) {
    trigger(target, OperationTypes.ADD, key)
  } else if (value !== oldValue) {
    trigger(target, OperationTypes.SET, key)
  }  
  return result
}
```
对于 `set` 函数来说，有主要两个作用，第一个就是设置值，第二个是调用 `trigger`，这也是 `effect` 中的内容。  
简单来说，如果某个 `effect` 回调中有使用到 `value.num`，那么这个回调会通过`track`方法被收集起来，并在调用 `value.num = 2` 时通过`trigger`触发。  

那么怎么收集这些内容呢？这就要说说 `targetMap` 这个对象了。`targetMap`是在`reactive`里面创建的`WeakMap`类型，
它用于存储依赖关系。
```javascript
// effect.ts
import { targetMap } from './reactive'

// track用来把回调保存在 targetMap 中
export function track(
  target: any,
  type: OperationTypes,
  key?: string | symbol
) {
  if (!shouldTrack) {
    return
  }
  // activeReactiveEffectStack 的用处是保持依赖函数的存在
  const effect = activeReactiveEffectStack[activeReactiveEffectStack.length - 1]
  if (effect) {
    // 这个函数做的事情就是塞依赖到 map 中，用于下次寻找是否有这个依赖
    // 另外就是把 effect 的回调保存起来
    // 通过获取targetMap上保存的 Map 类型数据
    let depsMap = targetMap.get(target)
    if (depsMap === void 0) {
      // 什么都没有，设置空的map给它
      targetMap.set(target, (depsMap = new Map()))
    }
    // 获取target中的依赖
    let dep = depsMap.get(key!)
    if (dep === void 0) {
      depsMap.set(key!, (dep = new Set()))
    }
    if (!dep.has(effect)) {
      dep.add(effect)
      effect.deps.push(dep)
    }
  }
}
```
我们再了解一下`effect`的组成
```javascript
function createReactiveEffect(
  fn: Function,
  options: ReactiveEffectOptions
): ReactiveEffect {
  // 一系列赋值操作，重点看 run 的实现
  const effect = function effect(...args): any {
    return run(effect as ReactiveEffect, fn, args)
  } as ReactiveEffect
  effect.isEffect = true
  effect.active = true
  effect.raw = fn
  effect.scheduler = options.scheduler
  effect.onTrack = options.onTrack
  effect.onTrigger = options.onTrigger
  effect.onStop = options.onStop
  effect.computed = options.computed
  // 用于收集依赖函数
  effect.deps = []
  return effect
}

function run(effect: ReactiveEffect, fn: Function, args: any[]): any {
  if (!effect.active) {
    return fn(...args)
  }
  if (activeReactiveEffectStack.indexOf(effect) === -1) {
    cleanup(effect)
    // 执行回调 push，回调执行结束 pop
    // activeReactiveEffectStack 的用处是保持依赖函数的存在
    // 举个例子：
    // const counter = reactive({ num: 0 })
    // effect(() => {
    //   console.log(counter.num)
    // })
    // counter.num = 7
    // effect 回调在执行的过程中会触发 counter 的 get 函数
    // get 函数会触发 track，在 track 函数调用的过程中会执行 effect.deps.push(dep) 并且将
    // 也就是把回调 push 到了回调的 deps 属性上
    // 这样在下次 counter.num = 7 的时候会触发 counter 的 set 函数
    // set 函数会触发 trigger，在 trigger 函数中会 effects.forEach(run)，把需要执行的回调都执行一遍
    try {
      activeReactiveEffectStack.push(effect)
      return fn(...args)
    } finally {
      activeReactiveEffectStack.pop()
    }
  }
}
```
## 最后
我们最后把流程再回顾一下，首先通过`createReactiveObject`创建`Proxy`对象，创建完成后把这个`Proxy`对象当作`key`保存在`targetMap`中。当触发`get`方法时调用 `track` 函数，把依赖函数保存到`targetMap`中。触发`set`的时候在调用`trigger`运行回调。


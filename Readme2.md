# call、apply和bind原理和模拟实现
## 前言
在 javascript 中，call、apply和bind 都是为了改变某个函数运行时的上下文（context）而存在的，换句话说，就是为了改变函数体内部 this 的指向。  
如果用一句话介绍 call那就是，使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。    
call() 和 apply()的区别在于，call()方法接受的是若干个参数的列表，而apply()方法接受的是一个包含多个参数的数组。  
bind()方法则会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。   
总的来说call和apply会自动执行，而bind不会。  
举个例子：
```javascript
var foo = {
    value: 1
};
function bar(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);
}
bar.call(foo, 'vision', 25);
bar.apply(foo,['vision', 25]);
var bindFoo = bar.bind(foo, 'vision', 25);
bindFoo()
```
## 一、call和apply的模拟实现
#### 模拟第一步
通过上面的例子，我们看到主要有以下两点：  
1. this指向改变  
2. 函数执行了

改变this指向的一个思路是，我们可以把函数挂载到一个对象上，这样这个函数的this就指向了这个对象，但是为了不影响原本的对象，在我们执行完函数后需要使用```delete```删除挂载在这个对象的函数。  
例子：
```javascript
var foo = {
    value: 1,
    bar: function() {
        console.log(this.value)
    }
};
foo.bar() // 1
delete foo.bar
```
所以一共有三步：  
1. 将函数设置为对象的属性：foo.fn = bar  
2. 执行函数：foo.fn()
3. 删除函数：delete foo.fn

封装起来，第一版如下：
```javascript
// 第一版
Function.prototype.call2 = function(context) {
    context.fn = this;  // 把函数挂载到指定的对象上
    context.fn();  //执行
    delete context.fn;  //删除
}

// 打开浏览器验证一下
var foo = {
    value: 1
};
function bar() {
    console.log(this.value);
}

bar.call2(foo); // 1
```
ok!
#### 模拟第二步
在 call 中是可以传参数的，传入的参数并不确定，所以我可以使用 Arguments 对象来获取参数，arguments 是一个对应于传递给函数的参数的类数组对象。在第一个例子中我们的 Arguments 对象是这样的。
```javascript
// arguments = {
//      0: foo
//      1: 'vision',
//      2: 25,
//      length: 3
// }
var args = [];
for(var i = 1, len = arguments.length; i < len; i++) {
    args.push(arguments[i]);
}
```
这样不确定长度的参数就获取到了，用ES6的写法来实现我们第二版
```javascript
// 第二版
Function.prototype.call2 = function(context) {
    context.fn = this;
    let args = [];
    for(let i = 1, len = arguments.length; i < len; i++) {
        args.push(arguments[i]);
    }
    context.fn(...args);
    delete context.fn;
}
```
#### 模拟第三步
还有2个细节需要注意：  
1、this 参数可以传 null 或者 undefined，此时 this 指向 window  
2、this 参数可以传基本类型数据，原生的 call 会自动用 Object() 转换  
3、函数是可以有返回值的  
```javascript
// 第三版
Function.prototype.call2 = function(context) {
    context = context ? Object(context) : window;
    context.fn = this;
    let args = [];
    for(let i = 1, len = arguments.length; i < len; i++) {
        args.push(arguments[i]);
    }
    let result = context.fn(...args);
    delete context.fn;
    return result;
}
```
apply和call的区别就是传参的不同，所以apply的模拟
```javascript
Function.prototype.apply2 = function(context, arr) {
    context = context ? Object(context) : window;
    context.fn = this;

    let result;
    if (!arr) {
        result = context.fn();
    } else {
        result = context.fn(...arr);
    }
    delete context.fn;
    return result;
}
```
## bind的模拟实现
bind的特点：  
1. 返回一个函数  
2. 可以传入参数  

关于指定 this 的指向，我们可以参考 call 或者 apply 实现
```javascript
// 第一版
Function.prototype.bind2 = function (context) {
    var self = this;
    return function () {
        return self.apply(context);
    }
}
```
返回一个函数，这个函数使用apply改变this。
#### bind的参数模拟
bind方法可以在调用bind()时传入参数，也可以在函数执行时传入其他参数
```javascript
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);
}
var bindFoo = bar.bind(foo, 'vision');
bindFoo('25'); // 1  vision  25
```
函数需要传 name 和 age 两个参数，可以在 bind 的时候，只传一个 name，在执行返回的函数的时候，再传另一个参数 age，这里我们也可以用arguments来处理。
```javascript
// 第二版
Function.prototype.bind2 = function (context) {
    // 第一个参数是context，所以从第二个参数开始，这里获取的是调用bind()传入的参数
    var aArgs   = Array.prototype.slice.call(arguments, 1),
        self = this;
    return function () {
        // 这里获取的是执行函数传入的参数,然后把两个参数 concat 组合起来
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(context, aArgs.concat(bindArgs));
    }
}
```
#### 构造函数特性
完成了改变this和参数的问题，最难的部分要来了，bind还有一个特性就是
> 一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

```javascript
var foo = {
    value: 1
};
function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}
bar.prototype.friend = 'kevin';

var bindFoo = bar.bind(foo, 'vision');
var obj = new bindFoo('25');  // 使用 new 创建对象，指定的this绑定失效
// undefined
// vision
// 25
console.log(obj.habit);  // shopping
console.log(obj.friend); // kevin
```
整理一下：  
1. 用bind创建的函数继承原函数的原型
2. 使用new 创建对象时this被忽略

想要创建出来的函数继承原函数的原型，我们可以让返回函数的prototype修改为绑定函数的 prototype，这样就解决了第一个问题
```javascript
Function.prototype.bind2 = function (context) {
    var aArgs = Array.prototype.slice.call(arguments, 1),
        self = this,
        fBound = function () {
            var bindArgs = Array.prototype.slice.call(arguments);
            return self.apply(context, aArgs.concat(bindArgs));
        };
    // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
    fBound.prototype = this.prototype;
    return fBound
}
```
还有个this指向问题，这时候的this还是指向了 context，所以我们要做个判断
```javascript
// 第三版
Function.prototype.bind2 = function (context) {
    var aArgs = Array.prototype.slice.call(arguments, 1),
        self = this,
        fBound = function () {
            var bindArgs = Array.prototype.slice.call(arguments);
            // 用instanceof判断当前是否被当做构造函数，如果是则把this指向实例，可以让实例获得来自绑定函数的值
            return self.apply(this instanceof fBound ? this : context, aArgs.concat(bindArgs));
        };
    // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
    fBound.prototype = this.prototype;
    return fBound
}
```
还有一个问题，因为```fBound.prototype = this.prototype;```的存在，当改变 fBound.prototype的时候，this.prototype也会改变。所以我们进行一下优化。
```javascript
Function.prototype.bind2 = function (context) {
    var aArgs = Array.prototype.slice.call(arguments, 1),
        self = this,
        fNOP  = function() {},
        fBound = function () {
            var bindArgs = Array.prototype.slice.call(arguments);
            // 用instanceof判断当前是否被当做构造函数，如果是则把this指向实例，可以让实例获得来自绑定函数的值
            return self.apply(this instanceof fBound ? this : context, aArgs.concat(bindArgs));
        };
    // 维护原型关系
    if (this.prototype) {
      fNOP.prototype = this.prototype;
    }
    // 下行的代码使fBound.prototype是fNOP的实例,因此
    // 返回的fBound若作为new的构造函数,new生成的新对象作为this传入fBound,新对象的__proto__就是fNOP的实例
    fBound.prototype = new fNOP();
    return fBound;
}
```
至此我们就完成了bind方法的模拟。

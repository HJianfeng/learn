# 前端基础面试题
#### 1.CSS实现三角形

```javascript
<div class="triangle"></div>
.triangle{
  width:0;
  height:0;
  border-right:50px solid transparent;
  border-left:50px solid transparent;
  border-bottom:50px solid red;
}
```
#### BFC
块级格式化上下文，它是一个独立的渲染区域它规定了内部的Block-level Box如何布局  
##### BFC触发条件
1. 根元素，即HTML 元素
2. float值不为none
3. overflow值不为visible
4. display值为inline-block、table-cell、table-caption
5. position值为absolute或fixed
##### BFC布局规则
1. 内部的Box会在垂直方向，一个接一个的放置
2. 属于同一个BFC的两个相邻box的margin会重叠
3. BFC的区域不会与float box重叠
4. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之也如此
5. 计算BFC的高度时浮动元素也参与计算  

#### 2.数组乱序
```javascript
let arr = ['A','B','C','D','E','F','G','H','I','J'];
function shuffle(arr) {
  var i = arr.length, t, j;
  while (i) {
    j = Math.floor(Math.random() * i--)
    t = arr[i]
    arr[i] = arr[j];
    arr[j] = t;
  }
}
```
#### 3.for in 和 for of 区别
- for in 的index索引为字符串型数字，不能直接进行几何运算
- for in会遍历数组所有的可枚举属性，包括原型。
- for in更适合遍历对象，不要使用for in遍历数组
- for in遍历的是数组的索引（即键名），而for of遍历的是数组元素值。
```javascript
for (var value of myArray) {}
for (var index in myArray) {}
```
#### 4.Promise接收的函数中resolve()后的代码是否会执行？
不会，resolve()是异步函数
#### 5.css两列布局，右列定宽，左列自适应。
```html
<style>
.box {
  display: flex;
  display: -webkit-flex;
}
.left {
  flex: 1;
  background:red;
}
.right {
  flex: 0 1 100px;
  background:#fe3;
}
</style>
<div class="box">
  <div class="left">
  left
  </div>
  <div class="right">
  right
  </div>
</div>
```
#### 6.cookie，session，token
- Token用来做身份验证

```javascript
以下几点特性会让你在程序中使用基于Token的身份验证
1.无状态、可扩展
2.支持移动设备
3.跨程序调用
4.安全
 ```

- cookie 是一个非常具体的东西，指的就是浏览器里面能永久存储的一种数据，仅仅是浏览器实现的一种数据存储功能。  
`cookie由服务器生成，发送给浏览器，浏览器把cookie以kv形式保存到某个目录下的文本文件内，下一次请求同一网站时会把该cookie发送给服务器。由于cookie是存在客户端上的，所以浏览器加入了一些限制确保cookie不会被恶意使用，同时不会占据太多磁盘空间，所以每个域的cookie数量是有限的。`
- session就是会话  
`session，服务器要知道当前发请求给自己的是谁。为了做这种区分，服务器就要给每个客户端分配不同的“身份标识”，然后客户端每次向服务器发请求的时候，都带上这个“身份标识”，服务器就知道这个请求来自于谁了。`

#### 7.回流，重绘
+ 在页面加载时，浏览器把获取到的HTML代码解析成1个DOM tree，我自己简单的理解就是DOM Tree和我们写的CSS结合在一起之后，渲染出了render tree
+ 什么是回流  
`当render tree中的一部分(或全部)因为元素的规模尺寸，布局，隐藏等改变而需要重新构建。这就称为回流(reflow)。每个页面至少需要一次回流，就是在页面第一次加载的时候，这时候是一定会发生回流的，因为要构建render tree。在回流的时候，浏览器会使渲染树中受到影响的部分失效，并重新构造这部分渲染树，完成回流后，浏览器会重新绘制受影响的部分到屏幕中，该过程成为重绘。`
+ 什么是重绘   
`当render tree中的一些元素需要更新属性，而这些属性只是影响元素的外观，风格，而不会影响布局的，比如background-color。则就叫称为重绘。`
+ 区别:  
```
他们的区别很大：
回流必将引起重绘，而重绘不一定会引起回流。比如：只有颜色改变的时候就只会发生重绘而不会引起回流
当页面布局和几何属性改变时就需要回流
比如：添加或者删除可见的DOM元素，元素位置改变，元素尺寸改变——边距、填充、边框、宽度和高度，内容改变
```
#### 8.节流，防抖
- 函数防抖（debounce）：就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。用来防止持续触发事件时高频发送请求
```
function debounce(fn, wait) {
    var timeout = null;
    return function() {
        if(timeout !== null)
            clearTimeout(timeout);
        timeout = setTimeout(fn, wait);
    }
}
function handle() {
    console.log(Math.random());
}
window.addEventListener('scroll', debounce(handle, 1000));
```
- 函数节流（throttle）：是让一个函数无法在很短的时间间隔内连续调用，当上一次执行完之后过了规定的时间间隔，才能进行下一次的函数调用。（所谓节流，就是指连续触发事件但是在N秒中只执行一次函数）节流会稀释函数的执行频率。
```javascript
var throttle = function(func, delay) {
    var timer = null;
    return function() {
        var context = this;
        var args = arguments;
        if (!timer) {
            timer = setTimeout(function() {
                func.apply(context, args);
                timer = null;
            }, delay);
        }
    }
}
function handle() {
    console.log(Math.random());
}
window.addEventListener('scroll', throttle(handle, 1000));
```

## React 题目

#### React 生命周期
一、初始化阶段   
- constructor  初始化状态
- componentWillMount  组件即将被渲染到页面之前触发
- render 组件渲染
- componentDidMount 渲染后触发

二、运行中阶段  
- componentWillReceiveProps   组件接收到属性时触发
- shouldComponentUpdate   当组件接收到新属性，组件的状态发生改变时触发。组件首次渲染时并不会触发
- componentWillUpdate  组件即将被更新时触发
- componentDidUpdate  组件被更新后触发

三、销毁阶段  
- componentWillUnmount 组件被销毁时触发


#### React数据获取为什么一定要在componentDidMount里面调用？
- constructor
- componentWillMount
- render
- componentDidMount  
如果你要获取外部数据并加载到组件上，只能在组件"已经"挂载到真实的网页上才能作这事情，其它情况你是加载不到组件的。

#### 你能解释下“状态提升”理念吗？
使用 react 经常会遇到几个组件需要共用状态数据的情况。这种情况下，我们最好将这部分共享的状态提升至他们最近的父组件当中进行管理。

#### react如果不能在组件间传递数据，你怎样给多级组件传递数据？
可以使用react的Context或者使用redux、mobx

#### 你是怎样调试 React 代码问题的，你用哪些工具？
除了使用linter（eslint，jslint)外，还可以使用调试工具（React Developer Tools）来打断点

#### React 中 setState 什么时候是同步的，什么时候是异步的？
setState本身并不是异步，只是因为react的性能优化机制体现为异步。在react的生命周期函数或者作用域下为异步，在原生的环境下为同步。
(在 React 中，如果是由 React 引发的事件处理（比如通过 onClick 引发的事件处理），调用 setState 不会同步更新 this.state  
除此之外的 setState 调用会同步执行 this.state ) 

#### setState 异步更新
setState 通过一个队列机制来实现 state 更新，当执行 setState() 时，会将需要更新的 state 浅合并后放入 状态队列，而不会立即更新 state，队列机制可以高效的批量更新 state。

####  promise, async/await, Generator函数 这三都实现异步的方案及区别吗？
- Promise主要为了解决回调地狱的问题（优雅的异步回调解决方案），他是一个对象，使用链式的写法来实现同步异步操作
- async/await这是一个用同步的思维来解决异步问题的方案。
- Generator 是多个线程相互协作，完成异步任务，它最大的特点就是可以交出函数的执行权，懂得退让。
- Generator 函数的执行必须靠执行器，async函数自带执行器。

#### 什么是执行上下文
执行上下文就是当前 JavaScript 代码被解析和执行时所在环境的抽象概念， JavaScript 中运行任何的代码都是在执行上下文中运行。
- 全局执行上下文：只有一个，浏览器中的全局对象就是 window 对象，this 指向这个全局对象。
- 函数执行上下文：存在无数个，只有在函数被调用的时候才会被创建，每次调用函数都会创建一个新的执行上下文。
- Eval 函数执行上下文： 指的是运行在 eval 函数中的代码，很少用而且不建议使用。

#### Vue实现数据双向绑定的原理：
采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty（）来劫持各个属性的setter，getter
```javascript
<body>
<div id="app">
    <input type="text" id="txt">
    <p id="show"></p>
</div>
</body>
<script type="text/javascript">
    var obj = {}
    Object.defineProperty(obj, 'txt', {
        get: function () {
            return obj
        },
        set: function (newValue) {
            document.getElementById('txt').value = newValue
            document.getElementById('show').innerHTML = newValue
        }
    })
    document.addEventListener('keyup', function (e) {
        obj.txt = e.target.value
    })
</script>
```

#### 为什么用Nodejs,它有哪些缺点？
- 事件驱动，通过闭包很容易实现客户端的生命活期。
- 不用担心多线程，锁，并行计算的问题
- V8引擎速度非常快

#### 一个http请求，从客户端到服务端需要经过哪些步骤
简单描述为：  
1.DNS 解析:将域名解析成 IP 地址  
2.TCP 连接：TCP 三次握手  
3.发送http请求(请求行，请求头，请求信息)  
4.服务器处理请求并返回 HTTP 报文  
5.浏览器解析渲染页面  
6.断开连接：TCP 四次挥手  

#### 1.JavaScript中的变量类型有哪些？

（1）值类型（基本类型）：字符串（String）、数值（Number）、布尔值（Boolean）、Undefined、Null  （这5种基本数据类型是按值访问的，因为可以操作保存在变量中的实际的值）

（2）引用类型：对象（Object）、数组（Array）、函数（Function）

#### js 堆和栈
JS内存空间分为栈(stack)、堆(heap)、池(一般也会归类为栈中)。 其中栈存放变量，堆存放复杂对象，池存放常量，所以也叫常量池。

#### let 与 var 的区别
通过var定义的变量，作用域是整个封闭函数，是全域的 。通过let定义的变量，作用域是在块级或是子块中。

## Vue 相关面试题

#### 对于MVVM的理解？
MVVM 是 Model-View-ViewModel  
- Model代表数据模型
- View 代表UI 组件,它负责将数据模型转化成UI 展现出来  
- ViewModel 监听模型数据的改变和控制视图行为、处理用户交互。通过双向数据绑定把 View 层和 Model 层连接了起来

#### Vue的生命周期
beforeCreate 创建前  
created  
beforeMount  
mounted  
beforeUpdate  
updated  
beforeDestroy  
destroy  
vue生命周期的作用是什么？ 答：它的生命周期中有多个事件钩子，让我们在控制整个Vue实例的过程时更容易形成好的逻辑。

#### Vue实现数据双向绑定的原理
采用数据劫持结合发布者-订阅者模式，通过Object.defineProperty来劫持各属性的setter和getter，数据变化时发布消息给订阅者，来触发监听事件

#### Vue组件间的参数传递
1.父组件与子组件传值  
  父组件传给子组件：子组件通过props方法接受数据;  
  子组件传给父组件：$emit方法传递参数  
2.非父子组件间的数据传递，兄弟组件传值  
  eventBus，就是创建一个事件中心，相当于中转站，可以用它来传递事件和接收事件。项目比较小时，用这个比较合适。（虽然也有不少人推荐直接用VUEX，具体来说看需求咯。技术只是手段，目的达到才是王道。）

#### vuex是什么
只用来读取的状态集中放在store中； 改变状态的方式是提交mutations，这是个同步的事物； 异步逻辑应该封装在action中。

#### Vue的路由实现：hash模式 和 history模式
1.hash模式: 在浏览器中符号“#”  
2.history模式: history采用HTML5的新特性；且提供了两个新方法：pushState（），replaceState（）可以对浏览器历史记录栈进行修改，以及popState事件的监听到状态变更。

#### Vue与Angular以及React的区别？
 1.与AngularJS的区别  
    相同点：都支持指令：内置指令和自定义指令；都支持过滤器：内置过滤器和自定义过滤器；都支持双向数据绑定；都不支持低端浏览器。  
    不同点：AngularJS的学习成本高，比如增加了Dependency Injection特性，而Vue.js本身提供的API都比较简单、直观；在性能上，AngularJS依赖对数据做脏检查，所以Watcher越多越慢；Vue.js使用基于依赖追踪的观察并且使用异步队列更新，所有的数据都是独立触发的。    

2.与React的区别  
    相同点：React采用特殊的JSX语法，Vue.js在组件开发中也推崇编写.vue特殊文件格式，对文件内容都有一些约定，两者都需要编译后使用；中心思想相同：一切都是组件，组件实例之间可以嵌套；都提供合理的钩子函数，可以让开发者定制化地去处理需求；都不内置列数AJAX，Route等功能到核心包，而是以插件的方式加载；在组件开发中都支持mixins的特性。
    不同点：
    React采用的Virtual DOM会对渲染出来的结果做脏检查；Vue.js在模板中提供了指令，过滤器等，可以非常方便，快捷地操作Virtual DOM。

#### vue-router的钩子函数
1.beforeEach(to, from, next)，全局前置守卫，在导航被确认之前触发  
  - to：route即将进入的目标路由对象
  - from：route当前导航正要离开的路由
  - next：function一定要调用该方法resolve这个钩子。执行效果依赖next方法的调用参数。可以控制网页的跳转。
2.beforeResolve 全局解析守卫。beforeEach 类似，区别是在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用
3.afterEach 全局后置钩子

#### vue如何自定义一个过滤器？
在vue实例的filters属性中定义 。全局定义过滤器 Vue.filter

#### 对keep-alive 的了解？
keep-alive是 Vue 内置的一个组件，可以使被包含的组件保留状态，或避免重新渲染。

#### 一句话就能回答的面试题
1.css只在当前组件起作用  答：在style标签中写入scoped即可  
2.v-if 和 v-show 区别  答：v-if按照条件是否渲染，v-show是display的block或none；  
3.route和router的区别 答：route是路由信息对象。router是“路由实例”对象包括了路由的跳转方法，钩子函数等。  
4.vue.js的两个核心是什么？ 答：数据驱动、组件系统  
5.vue几种常用的指令 答：v-for 、 v-if 、v-bind、v-on、v-show、v-else  
6.vue常用的修饰符？ 答：.prevent: 提交事件不再重载页面；.stop: 阻止单击事件冒泡；.self: 当事件发生在该元素本身而不是子元素的时候会触发；.capture: 事件侦听，事件发生的时候会调用  
7.v-on 可以绑定多个方法吗？ 答：可以  
8.vue中 key 值的作用？ 答：key的作用是为了在diff算法执行时更快的找到对应的节点，提高diff速度。  
9.vue等单页面应用及其优缺点 答：优点：数据驱动、组件化、轻量、简洁、高效、快速、模块友好。缺点：不支持低版本的浏览器，最低只支持到IE9；不利于SEO；首屏加载时间稍长



#### nuxt相关知识  
1.页面属性：
- asyncData 方法：会在组件（限于页面组件）每次加载之前被调用，可以利用 asyncData方法来获取数据并返回给当前组件
- fetch 方法：它会在组件每次加载前被调用（在服务端或切换至目标路由之前）。
- head 方法设置当前页面的头部标签。
- layout 属性来为页面指定使用哪一个布局文件
- middleware 属性，在应用中的特定页面设置中间件
- scrollToTop 属性，用于控制页面渲染前是否滚动至页面顶部
- transition 属性，实现路由切换时的过渡动效。
- validate 方法，校验动态路由参数的有效性。
- watchQuery 属性 ，监听参数字符串更改并在更改时执行组件方法

#### ES6新特性
- ES6箭头函数
- const 与 let 变量
- 模板字面量：模板字面量用倒引号 ( `` )
    ```javascript
    `please see ${student.name}`
    ```
- 解构：es6可以使用解构从数组和对象提取值并赋值给独特的变量
    ```javascript
    const point = [10, 25, -34];
    const [x, y, z] = point;
    ```
- 对象字面量简写法：对象的属性名称和变量名称一样，那么就可以从对象属性中删掉这些重复的变量名称。
    ```
    let type = 'quartz';
    let color = 'rose';
    let carat = 21.29;
    const gemstone = {type,color,carat};
    ```
- for...of循环
- 展开运算符：...

#### express中间件执行顺序和koa中间件
- Express的中间件是顺序执行
- Koa是从第一个中间件开始执行,遇到 await next() 就进入下一个中间件，一直到执行到最后一个中间件。然后再逆序执行上一个中间件  await next() 后面的代码，一直到第一个中间件 await next() 后面的代码执行完毕才发出响应。

#### HTTP返回码中301与302的区别
- 301 redirect: 301 代表永久性转移(Permanently Moved)。
- 302 redirect: 302 代表暂时性转移(Temporarily Moved )。


## angular题库

#### 1.请解释Angular 2应用程序的生命周期hooks是什么？
Angular 2组件/指令具有生命周期事件，是由@angular/core管理的。
- ngOnChanges：当指令的任何一个可绑定属性发生变化时调用
- ngOnInit：它会在 Angular 初始化完了该指令的所有数据绑定属性之后调用
- ngDoCheck：检测并在Angular上下文发生变化时执行
- ngOnDestroy：Angular 每次销毁指令/组件之前调用并清扫
- ngAfterViewInit：Angular创建组件的视图后。
- ngAfterViewChecked：Angular 做完组件视图和子视图的变更检测之后调用。

#### 2.使用Angular 2，和使用Angular 1相比，有什么优势？
- 更好的速度和性能
- 更简单的依赖注入
- 模块化，跨平台
- 具备ES6和Typescript的好处。
- 灵活的路由，具备延迟加载功能

#### 3.Angular 2中的路由工作原理是什么？
Angular应用程序具有路由器服务的单个实例，并且每当URL改变时，相应的路由就与路由配置数组进行匹配。在成功匹配时，它会应用重定向，此时路由器会构建ActivatedRoute对象的树，同时包含路由器的当前状态。

#### 4.什么是事件发射器？它是如何在Angular 2中工作的？
 EventEmitter是在@ angular/core模块中定义的类，由组件和指令使用，用来发出自定义事件。  
 可以通过模块的任何一个组件，使用订阅subscribe方法来实现事件发射的订阅。emit方法来发出事件

#### 5.如何在Angular 2应用程序中使用codelyzer？
用于运行和检查是否遵循了预定义的编码准则。Codelyzer仅对Angular和TypeScript项目进行静态代码分析。  


Codelyzer运行在tslint的顶部，其编码约定通常在tslint.json文件中定义。Codelyzer可以直接通过Angularcli或npm运行。像Visual Studio Code和Atom这样的编辑器也支持codelyzer，只需要通过做一个基本的设置就能实现。

#### 6. 什么是延迟加载？如何在Angular 2中启用延迟加载？

大多数企业应用程序包含用各式各样的用于特定业务案例的模块。捆绑整个应用程序代码并完成加载，会在初始调用时，产生巨大的性能开销。延迟加载使我们只加载用户正在交互的模块，而其余的模块会在运行时按需加载。

#### 7. 在Angular 2应用中，我们应该注意哪些安全威胁？
1. 避免为你的组件使用/注入动态HTML内容。
2. 不要将外部网址放在应用程序中，除非它是受信任的。
3. 避免网址重定向，除非它是可信的。
4. 考虑使用AOT编译或离线编译。
5. 通过限制api，选择使用已知或安全环境/浏览器的app来防止XSRF攻击。

#### 8. 如何优化Angular 2应用程序来获得更好的性能？
1. 考虑AOT编译。
2. 应用程序经过了捆绑，uglify和tree shaking。
3. 去除不存在不必要的import语句。
4. 移除不使用的第三方库。
5. 所有dependencies 和dev-dependencies都是明确分离的。
6. 如果应用程序较大时，我会考虑延迟加载而不是完全捆绑的应用程序。

#### 什么是AOT编译？它有什么优缺点？
AOT编译代表的是预先编译Ahead Of Time编译，其中Angular编译器在构建时，会将Angular组件和模板编译为本机JavaScript和HTML。编译好的HTML和JavaScript将会部署到Web服务器，以便浏览器可以节省编译和渲染时间。

#### Observables和Promises的核心区别是什么？
 1. Promise本质上也是一个Observable，能使用fromPromise把Promise转成Observable
 2. 但是Promise .then()只能返回一个值，Observable可以返回多个值
 3. Promise要么resolve要么reject，并且只响应一次。而Observable可以响应多次
 4. Promise不能取消，Observable可以调用unsubscribe()取消订阅

#### angular的数据绑定采用什么机制？详述原理
脏检查机制。  

双向数据绑定是 AngularJS 的核心机制之一。当 view 中有任何数据变化时，会更新到 model ，当 model 中数据有变化时，view 也会同步更新，显然，这需要一个监控。  

原理就是，Angular 在 scope 模型上设置了一个监听队列，用来监听数据变化并更新 view 。每次绑定一个东西到 view 上时 AngularJS 就会往监听队列里插入一条 $watch ，用来检测它监视的 model 里是否有变化的东西。当浏览器接收到可以被 angular context 处理的事件时，$digest 循环就会触发，遍历所有的 $watch ，最后更新 dom。

## rxjs
是一个基于可观测数据流在异步编程应用中的库。  

Rxjs是观察者 + 迭代器模式的结合，Observable作为被观察者，是一个值或事件的流集合。就像是一个序列，裡面的元素会随着时间推送。
```javascript
var source = Rx.Observable.create(function(observer){
  try {
    observer.next(1)
    observer.next(2)
    observer.next(3)
    setTimeout(() => {
		observer.next('RxJS 30 days!');
	}, 2000)
    //throw 'some exception'
    //observer.complete()
  }catch(e){
    observer.error(e)
  }
});
var observer = {
  next: (val) => console.log(val),
  error: () => console.log('出错啦'),
  complete: () => console.log('完成'),
}
var subscribe = source.subscribe(observer);
var timer = setTimeout(()=>{
  subscribe.unsubscribe();
  console.log('取消订阅')
},2000)
```
#### Observable解决的问题
- 同步和异步的统一
- 可组合的数据变更过程
- 数据和视图的精确绑定
- 条件变更之后的自动重新计算

#### Operator —— 操作符
- zip：在所有 observables 发出后，将它们的值作为数组发出
- from：将数组、promise 或迭代器转换成 observable 。
- range：依次发出给定区间内的数字。
  ```javascript
  const source = Rx.Observable.range(0, 3);
  source.subscribe((val) => {
    console.log(val)   // 0   1   2
  })
  ```
- of：按顺序发出任意数量的值
  ```javascript
  const source = Rx.Observable.of(1,2,3);
  source.subscribe((val) => {
    console.log(val)   // 1   2   3
  })
  ```
- forkJoin：并行运行所有可观察序列(Observables)并收集它们的最后元素。
  ```javascript
  var source = Rx.Observable.forkJoin(
      Rx.Observable.of(1, 2, 3),
      Rx.Observable.range(0, 10),
    );
    var subscription = source.subscribe(
      x => console.log(`onNext: ${x}`),
      e => console.log(`onError: ${e}`),
      () => console.log('onCompleted')
    );
    // onNext: 3,9
　  // onCompleted
  ```
  - concat：按照顺序，前一个 observable 完成了再订阅下一个 observable 并发出值
  ```javascript
  var source1 = Rx.Observable.return(42);
  var source2 = Rx.Observable.return(56);

  var source = Rx.Observable.concat(source1, source2);

  var subscription = source.subscribe(
    x => console.log(`onNext: ${x}`),
    e => console.log(`onError: ${e}`),
    () => console.log('onCompleted')
  );
  // => onNext: 42
  // => onNext: 56
  // => onCompleted
  ```

## 基础

#### express的核心是什么
路由，中间件，视图引擎

#### css优先级
1. 类型选择器：标签选择器和伪元素
2. 类选择器
3. id选择器
4. 内联样式
5. !important

#### css3有什么新特性
比较重要的就是加入了动画，媒体查询

#### 抛物线动画怎么做
两个盒子，水平垂直分解，用transition分别控制两个盒子，一个x轴，一个y轴

#### 实现一个奇偶数不同样式的表格？
css3 nth-child(n)

#### W3C描述的GET和POST的区别
  1. POST 比 GET 更安全，因为GET参数直接暴露在URL上，POST参数在HTTP消息主体中，而且不会被保存在浏览器历史或 web 服务器日志中。  
  2. 对参数的数据类型，GET只接受ASCII字符，而POST没有限制，允许二进制。  
  3. GET在浏览器回退/刷新时是无害的，而POST会再次提交请求。  
  4.  GET请求只能进行url编码(application/x-www-form-urlencoded)，而POST支持多种编码方式(application/x-www-form-urlencoded 或 multipart/form-data)，可以为二进制使用多重编码。  
  5. 对参数数据长度的限制，GET方法URL的长度是受限制的，最大是2048个字符，POST参数数据是没有限制的。  
  6. GET请求会被浏览器主动缓存，POST不会，除非手动设置。  
  7. GET请求参数会被完整保留在浏览器历史记录里，而POST中的参数不会被保留。  
  8. GET请求可被收藏为书签，POST不能。

#### POST默认的数据使用什么方式?
form表单，application/x-www-form-urlencoded

#### 彩色图片利用js或css实现黑白
filter: grayscale(100%);

#### webpack的核心是什么
入口(entry)、输出(output)、loader、插件(plugins)

#### 解释一下函数声明和函数表达式的区别


#### VUE DOM渲染的过程中可能有哪些情况会阻塞渲染

# JS
#### Reflect 对象创建目的
1. 将object对象一些内部的方法，放到Reflect对象上。比如：object.defineProperty  
2. 修改某些 Object 方法的返回结果，让其变得更合理。  
    比如： Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。

3. 让操作对象的编程变为函数式编程  
```javascript
// 老写法
'assign' in Object // true
 
// 新写法
Reflect.has(Object, 'assign') // true
```
4. Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象 的方法，就能在 Reflect 对象上找到对应的方法。这就让 Proxy 对象可 以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。

#### 聊聊vue中的 keep-alive 的实现原理
- 获取 keep-alive 包裹着的第一个子组件对象及其组件名
- 根据设定的 include/exclude（如果有）进行条件匹配,决定是否缓存。不匹配,直接返回组件实例
- 根据组件 ID 和 tag 生成缓存 Key,并在缓存对象中查找是否已缓存过该组件实例。如果存在,直接取出缓存值并更新该 key 在 this.keys 中的位置(更新 key 的位置是实现 LRU 置换策略的关键)
- 在 this.cache 对象中存储该组件实例并保存 key 值,之后检查缓存的实例  数量是否超过 max 的设置值,超过则根据 LRU 置换策略删除最近最久未使用的实例（即是下标为 0 的那个 key）
- 最后组件实例的 keepAlive 属性设置为 true,这个在渲染和执行被包裹组件的钩子函数会用到,这里不细说    

#### 写一个正则，根据name取cookie中的值。
```javascript
const getCookie = function(name) {
  let arr;
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  if (arr = document.cookie.match(reg)) return unescape(arr[2]);
  return null;
}
new RegExp(`(^| )${name}=([^;]*)(;|$)`)
```

# 继承
#### 原型链继承
```javascript
function Parent() {
  this.name = 'parent';
}
Parent.prototype.getName = function () {
    console.log(this.name);
}

function Child() {

}
Child.prototype = new Parent();
var child1 = new Child();

console.log(child1.getName()) 
```
问题：   
1.引用类型的属性被所有实例共享
```javascript
var child1 = new Child();
child1.name = 'yayu';
console.log(child1.name); // yayu

var child2 = new Child();
console.log(child2.name); // yayu
```
2.在创建 Child 的实例时，不能向Parent传参

#### 经典继承（借用构造函数）
```javascript
function Parent() {
  this.names = ['kevin', 'daisy'];
}

function Child() {
  Parent.call(this);
}

var child1 = new Child();
child1.names.push('yayu');
console.log(child1.names); // ["kevin", "daisy", "yayu"]

var child2 = new Child();
console.log(child2.names); // ["kevin", "daisy"]
```
优点：  
1. 避免了引用类型的属性被所有实例共享
2. 可以在 Child 中向 Parent 传参
缺点：  
1、方法都在构造函数中定义，每次创建实例都会创建一遍方法。
2、只能继承构造里的信息

#### 组合继承
原型链继承和经典继承双剑合璧。
```javascript
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}
Parent.prototype.getName = function () {
    console.log(this.name)
}

function Child(name,age) {
  Parent.call(this,name);
  this.age = age;
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;


var child1 = new Child('kevin', '18');
child1.colors.push('black');
console.log(child1.name); // kevin
console.log(child1.age); // 18
console.log(child1.colors); // ["red", "blue", "green", "black"]

var child2 = new Child('daisy', '20');
console.log(child2.name); // daisy
console.log(child2.age); // 20
console.log(child2.colors); // ["red", "blue", "green"]
```
优点：融合原型链继承和构造函数的优点，是 JavaScript 中最常用的继承模式。  

组合继承最大的缺点是会调用两次父构造函数。
#### 原型式继承
就是 ES5 Object.create 的模拟实现，将传入的对象作为创建的对象的原型。
```javascript
function createObj(o) {   //传递一个字面量函数
 function F(){}     //创建一个构造函数
 F.prototype = o;    //把字面量函数赋值给构造函数的原型
 return new F()     //最终返回出实例化的构造函数
}
var person = {
    name: 'kevin',
    friends: ['daisy', 'kelly']
}

var person1 = createObj(person);
person1.friends.push('taylor');
console.log(person1.friends); // ["daisy", "kelly", "taylor"]


var person2 = createObj(person);
console.log(person2.friends); // ["daisy", "kelly", "taylor"]
```
缺点：
包含引用类型的属性值始终都会共享相应的值，这点跟原型链继承一样。

#### 寄生式继承
创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象。
```javascript
function createObj(o) {
  let clone = Object.create(o);
  clone.sayName = function() {
    console.log('hi');  
  }
  return clone;
}

var person = {
    name: 'kevin',
    friends: ['daisy', 'kelly']
}

var person1 = createObj(person);
person1.friends.push('taylor');
console.log(person1.friends); // ["daisy", "kelly", "taylor"]


var person2 = createObj(person);
console.log(person2.friends); // ["daisy", "kelly", "taylor"]
```
缺点：
1. 跟借用构造函数模式一样，每次创建对象都会创建一遍方法。
2. 包含引用类型的属性值始终都会共享相应的值

#### 寄生组合式继承
```javascript
function Parent (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
    console.log(this.name)
}

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

var F = function() {};
F.prototype = Parent.prototype
Child.prototype = new F();

var child1 = new Child('kevin', '18');
console.log(child1);
```
封装一下
```javascript
function object(o) {
  function F() {};
  F.prototype = o;
  return new F();
}
function prototype(child, parent) {
  var prototype = object(parent.prototype)
  prototype.constructor = child;
  child.prototype = prototype;
}
// 当我们使用的时候：
prototype(Child, Parent);
```



#### 1.CSS实现三角形

```
<div class="triangle"></div>
.triangle{
  width:0;
  height:0;
  border-right:50px solid transparent;
  border-left:50px solid transparent;
  border-bottom:50px solid red;
}
```
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
.box{
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
```
以下几点特性会让你在程序中使用基于Token的身份验证
1.无状态、可扩展
2.支持移动设备
3.跨程序调用
4.安全
 ```
- cookie 是一个非常具体的东西，指的就是浏览器里面能永久存储的一种数据，仅仅是浏览器实现的一种数据存储功能。  
```cookie由服务器生成，发送给浏览器，浏览器把cookie以kv形式保存到某个目录下的文本文件内，下一次请求同一网站时会把该cookie发送给服务器。由于cookie是存在客户端上的，所以浏览器加入了一些限制确保cookie不会被恶意使用，同时不会占据太多磁盘空间，所以每个域的cookie数量是有限的。```
- session就是会话  
```session，服务器要知道当前发请求给自己的是谁。为了做这种区分，服务器就要给每个客户端分配不同的“身份标识”，然后客户端每次向服务器发请求的时候，都带上这个“身份标识”，服务器就知道这个请求来自于谁了。```
#### 7.回流，重绘
+ 在页面加载时，浏览器把获取到的HTML代码解析成1个DOM tree，我自己简单的理解就是DOM Tree和我们写的CSS结合在一起之后，渲染出了render tree
+ 什么是回流  
```当render tree中的一部分(或全部)因为元素的规模尺寸，布局，隐藏等改变而需要重新构建。这就称为回流(reflow)。每个页面至少需要一次回流，就是在页面第一次加载的时候，这时候是一定会发生回流的，因为要构建render tree。在回流的时候，浏览器会使渲染树中受到影响的部分失效，并重新构造这部分渲染树，完成回流后，浏览器会重新绘制受影响的部分到屏幕中，该过程成为重绘。```
+ 什么是重绘   
```当render tree中的一些元素需要更新属性，而这些属性只是影响元素的外观，风格，而不会影响布局的，比如background-color。则就叫称为重绘。```
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
```

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
```
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

#### 第 18 题：React 中 setState 什么时候是同步的，什么时候是异步的？
在 React 中，如果是由 React 引发的事件处理（比如通过 onClick 引发的事件处理），调用 setState 不会同步更新 this.state  
除此之外的 setState 调用会同步执行 this.state  

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

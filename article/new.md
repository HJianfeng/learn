# new的模拟实现

new 运算符的作用：new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一

```javascript
function objectFactory() {
    // 用new Object() 的方式新建了一个对象 obj
    var obj = new Object(),
    // 取出第一个参数，就是我们要传入的构造函数。此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数
    Constructor = [].shift.call(arguments);
    // 将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性
    obj.__proto__ = Constructor.prototype;
    // 使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
    var ret = Constructor.apply(obj, arguments);
    // 假如构造函数的返回值是对象，则只返回这个对象
    return typeof ret === 'object' ? ret : obj;

};
```
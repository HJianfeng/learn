# 常用设计模式有哪些

## 设计模式是什么
设计模式是软件设计中常见问题的典型解决方案。 它们就像能根据需求进行调整的预制蓝图， 可用于解决代码中反复出现的设计问题。  
  
设计模式与方法或库的使用方式不同， 你很难直接在自己的程序中套用某个设计模式。 模式并不是一段特定的代码， 而是解决特定问题的一般性概念。 你可以根据模式来实现符合自己程序实际所需的解决方案。

## 模式包含哪些内容？
大部分模式都有正规的描述方式， 以便在不同情况下使用。 模式的描述通常会包括以下部分：  
- 意图部分简单描述问题和解决方案。
- 动机部分将进一步解释问题并说明模式会如何提供解决方案。
- 结构部分展示模式的每个部分和它们之间的关系。
- 在不同语言中的实现提供流行编程语言的代码， 让读者更好地理解模式背后的思想。  

部分模式介绍中还列出其他的一些实用细节， 例如模式的适用性、 实现步骤以及与其他模式的关系。

## 分类
`创建型设计模式`：专注于处理对象的创建  
Constructor构造器模式，Factory工厂模式，Singleton单例模式，builder生成器模式  

`结构型设计模式`：对象间组合，建立对象之间的关系  
Decorator装饰者模式，Facade外观模式，Flyweight享元模式，Adapter适配器模式，Proxy代理模式  

`行为设计模式`：简化和改善对象间的通信   
Mediator中介者模式，Observer观察者模式 

## 常用的设计模式
### 单例模式
单例模式是一种创建型设计模式， 让你能够保证一个类只有一个实例， 并提供一个访问该实例的全局节点。
```javascript
class Person{
  static instance;
  constructor(name){
      if(Person.instance){
          return Person.instance;
      }else{
          Person.instance = this;
      }
      this.name = name;
  }
}
```
通过静态属性instance来记录Person类的实例化状态来实现单例。但是这种实现方式并不灵活，假如我们有多个类都需要实现单例，我们需要给每个类都写上静态成员来保存实例化状态。有没有一种通用的办法来实现呢？其实我们可以通过高阶函数及闭包的缓存特性来记录类的实例化状态。具体代码如下：
```javascript
class Person{
    constructor(name){
        this.name = name;
    }
}
class Animal{
    constructor(name){
        this.name = name;
    }
}

function getSingle(fn){
    let instance;
    return function(...args){
        if(!instance){
            instance = new fn(...args); 
        }
        return instance;
    }
}
let PSingle = getSingle(Person);
let PAnimal = getSingle(Animal);
let zhangsan = new PSingle("张三");
let lisi = new PSingle("李四");
console.log(zhangsan,lisi);
```
### 工厂模式
工厂方法模式是一种创建型设计模式， 其在父类中提供一个创建对象的方法， 允许子类决定实例化对象的类型。
```javascript
class Luban{
   constructor(){
       this.name = "鲁班";
   }
}
class Yase{
   constructor(){
       this.name = "亚瑟";
   }
}

function Factory(type){
   if(type==="鲁班"){
       return new Luban();
   }else if(type==="亚瑟"){
       return new Yase();
   }
}
let luban =  Factory("鲁班");
console.log(luban);
```
### 装饰器模式
装饰模式是一种结构型设计模式， 允许你通过将对象放入包含行为的特殊封装对象中来为原对象绑定新的行为。
```javascript
 // o为已有对象
var M20 = function(o){    // 这里定义一个装饰类
    var str = '20多岁的时候,';
    // o是传入的对象，调用传入对象的方法，加以装饰
    this.eat = function(){
        return str + o.eat()+",肥得很！";
    };
    this.drink = function(){
        return str + o.drink()+",就是个水桶！";
    };
    this.coding = function(){
        return str + o.coding()+",代码又写得撇！";
    };
}
alert(new M20(david).eat());    // 20多岁的时候,大卫是个大胖子，一天只晓得吃,肥得很！
alert(new M20(david).drink());    // 20多岁的时候,大卫除了吃就是喝,就是个水桶！
alert(new M20(david).coding());    // 20多岁的时候,写代码吧，大卫,代码又写得撇！
```

### 观察者模式（发布订阅）
观察者模式是一种行为设计模式， 允许你定义一种订阅机制， 可在对象事件发生时通知多个 “观察” 该对象的其他对象。

```javascript
class Event{
    constructor() {
        this.handlers = {};
    }
    addEventListener(type, handler) {
        if (!this.handlers[type]) {
            this.handlers[type] = [];
        }
        this.handlers[type].push(handler);
    }
    removeEventListener(type, handler) {
        if (!(type in this.handlers)) {
            return;
        }
        if(!handler) {
            delete this.handlers[type];
        } else {
            const idx = this.handlers.findIndex(i => i === handler);
            if(idx >= 0) {
                this.handlers[type].splice(idx, 1);
                if (this.handlers[type].length === 0) {
                    delete this.handlers[type]
                }
            }
        }
    }
    dispatchEvent(type, ...params) {
        if (!(type in this.handlers)) {
            return;
        }
        this.handlers[type].forEach(handler => {
            handler(...params)
        }
    }
}
```

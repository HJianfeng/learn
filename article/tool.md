# 数组
## 1. `allEqual` 检查数组各项相等
```javascript
const allEqual = arr => arr.every(val => val === arr[0]);

allEqual([1, 2, 3, 4, 5, 6]); // false
allEqual([1, 1, 1, 1]); // true
```
## 2. `approximatelyEqual` 约等于
```javascript
const approximatelyEqual = (v1, v2, epsilon = 0.001) => Math.abs(v1 - v2) < epsilon;

approximatelyEqual(Math.PI / 2.0, 1.5708); // true
```
## 3. `arrayToCSV` 数组转CSV格式（带空格的字符串）
```javascript

const arrayToCSV = (arr, delimiter = ',') => {
	return arr.map(v => v.map(x => `"${x}"`).join(delimiter)).join('\n')
};
  
arrayToCSV([['a', 'b'], ['c', 'd']]); // '"a","b"\n"c","d"'
arrayToCSV([['a', 'b'], ['c', 'd']], ';'); // '"a";"b"\n"c";"d"'

```
## 4. `average` 平均数
```javascript
const average = (...nums) => nums.reduce((acc, val) => acc + val, 0) / nums.length;
average(...[1, 2, 3]); // 2
average(1, 2, 3); // 2
```

## 5. `castArray` 其它类型转数组
```javascript
const castArray = val => (Array.isArray(val) ? val : [val]);
castArray('foo'); // ['foo']
castArray([1]); // [1]
castArray(1); // [1]
```
## 6. `countOccurrences` 检测数值出现次数
```javascript
const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
countOccurrences([1, 1, 2, 1, 2, 3], 1); // 3
```
## 7. `deepFlatten` 递归扁平化数组
```javascript
const deepFlatten = arr => [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)));

deepFlatten([1, [2], [[3], 4], 5]); // [1,2,3,4,5]
```
## 8. `difference` 寻找差异（并返回第一个数组独有的）
此代码段查找两个数组之间的差异，并返回第一个数组独有的。
```javascript
const difference = (a, b) => {
  const s = new Set(b);
  return a.filter(x => !s.has(x));
};

difference([1, 2, 3], [1, 2, 4]); // [3]
```
## 9. `differenceBy`  先执行再寻找差异
在将给定函数应用于两个列表的每个元素之后，此方法返回两个数组之间的差异。
```javascript
const differenceBy = (a, b, fn) => {
  const s = new Set(b.map(fn));
  return a.filter(x => !s.has(fn(x)));
};

differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor); // [1.2]
differenceBy([{ x: 2 }, { x: 1 }], [{ x: 1 }], v => v.x); // [ { x: 2 } ]

```
## 10. `dropWhile`  删除不符合条件的值
此代码段从数组顶部开始删除元素，直到传递的函数返回为true。
```javascript
const dropWhile = (arr, func) => {
  while (arr.length > 0 && !func(arr[0])) arr = arr.slice(1);
  return arr;
};

dropWhile([1, 2, 3, 4], n => n >= 3); // [3,4]
```
## 11. `flatten` 指定深度扁平化数组
此代码段第二参数可指定深度。
```javascript
const flatten = (arr, depth = 1) =>
  arr.reduce((a, v) => a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v), []);

flatten([1, [2], 3, 4]); // [1, 2, 3, 4]
flatten([1, [2, [3, [4, 5], 6], 7], 8], 2); // [1, 2, 3, [4, 5], 6, 7, 8]
```
## 12. `indexOfAll` 返回数组中某值的所有索引
此代码段可用于获取数组中某个值的所有索引，如果此值中未包含该值，则返回一个空数组。
```javascript
const indexOfAll = (arr, val) => arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), []);

indexOfAll([1, 2, 3, 1, 2, 3], 1); // [0,3]
indexOfAll([1, 2, 3], 4); // []

```
## 13. `intersection`  两数组的交集
```javascript

const intersection = (a, b) => {
  const s = new Set(b);
  return a.filter(x => s.has(x));
};

intersection([1, 2, 3], [4, 3, 2]); // [2, 3]
```
# 函数
## 1. `attempt`捕获函数运行异常
该代码段执行一个函数，返回结果或捕获的错误对象。
```javascript
```
## 1. `attempt`
```javascript
onst attempt = (fn, ...args) => {
  try {
    return fn(...args);
  } catch (e) {
    return e instanceof Error ? e : new Error(e);
  }
};
var elements = attempt(function(selector) {
  return document.querySelectorAll(selector);
}, '>_>');
if (elements instanceof Error) elements = []; // elements = []

```
## 2. `runPromisesInSeries` 运行多个Promises
```javascript
const runPromisesInSeries = ps => ps.reduce((p, next) => p.then(next), Promise.resolve());
const delay = d => new Promise(r => setTimeout(r, d));

runPromisesInSeries([() => delay(1000), () => delay(2000)]);
//依次执行每个Promises ，总共需要3秒钟才能完成

```
## 3. `timeTaken` 计算函数执行时间
```javascript

const timeTaken = callback => {
  console.time('timeTaken');
  const r = callback();
  console.timeEnd('timeTaken');
  return r;
};

timeTaken(() => Math.pow(2, 10)); // 1024, (logged): timeTaken: 0.02099609375ms

```
## 4. `createEventHub` 简单的发布/订阅模式
创建一个发布/订阅（发布-订阅）事件集线，有emit，on和off方法。
1. 使用Object.create(null)创建一个空的hub对象。
2. emit，根据event参数解析处理程序数组，然后.forEach()通过传入数据作为参数来运行每个处理程序。
3. on，为事件创建一个数组（若不存在则为空数组），然后.push()将处理程序添加到该数组。
4. off，用.findIndex()在事件数组中查找处理程序的索引，并使用.splice()删除。
```javascript
const createEventHub = () => ({
  hub: Object.create(null),
  emit(event, data) {
    (this.hub[event] || []).forEach(handler => handler(data));
  },
  on(event, handler) {
    if (!this.hub[event]) this.hub[event] = [];
    this.hub[event].push(handler);
  },
  off(event, handler) {
    const i = (this.hub[event] || []).findIndex(h => h === handler);
    if (i > -1) this.hub[event].splice(i, 1);
    if (this.hub[event].length === 0) delete this.hub[event];
  }
});

```
用法：
```javascript
const handler = data => console.log(data);
const hub = createEventHub();
let increment = 0;

// 订阅，监听不同事件
hub.on('message', handler);
hub.on('message', () => console.log('Message event fired'));
hub.on('increment', () => increment++);

// 发布：发出事件以调用所有订阅给它们的处理程序，并将数据作为参数传递给它们
hub.emit('message', 'hello world'); // 打印 'hello world' 和 'Message event fired'
hub.emit('message', { hello: 'world' }); // 打印 对象 和 'Message event fired'
hub.emit('increment'); // increment = 1

// 停止订阅
hub.off('message', handler);

```
## 5. `memoize` 缓存函数
通过实例化一个Map对象来创建一个空的缓存。

通过检查输入值的函数输出是否已缓存，返回存储一个参数的函数，该参数将被提供给已记忆的函数；如果没有，则存储并返回它。
```javascript
const memoize = fn => {
  const cache = new Map();
  const cached = function(val) {
    return cache.has(val) ? cache.get(val) : cache.set(val, fn.call(this, val)) && cache.get(val);
  };
  cached.cache = cache;
  return cached;
};
```
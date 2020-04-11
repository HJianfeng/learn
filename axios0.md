# Axios 源码解析

## Axios 功能
- 从浏览器中创建 XMLHttpRequests
- 从 node.js 创建 http 请求
- 拦截请求和响应
- 取消请求
## Axios 使用
```javascript
// 请求方式
axios(config)
axios.get(url[, config])
axios.request(config)
// 处理同时发生多个请求
axios.all(iterable)

// 创建一个实例
const instance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  transformRequest: [data => qs.stringify(data)] // 参数转换
});
instance.request(config)
instance.get(url[, config])
instance.all(iterable)
```

## 源码解读
先来看`/lib/axios.js`这个文件，这个是创建axios的入口文件
```javascript
'use strict';
var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults')

function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);
  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);
  // Copy context to instance
  utils.extend(instance, context);
  return instance;
}

// 创建一个默认实例
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
module.exports = axios;
// Allow use of default import syntax in TypeScript
module.exports.default = axios;
```
`createInstance`方法的作用  
1. 实例`Axios`类。
2. 将`Axios.prototype.request`的执行上下文绑定到 `context`，这一步是为了我们能够直接使用`axios(config)`这种方式来请求
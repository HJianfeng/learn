## 前言
我们都用过构建工具，webpack应该是最经常用的，除了webpack以外还有一个构建工具也是非常优秀的，那就是Rollup，所以今天我们来学习一下Rollup。

## Tree-shaking
Tree-shaking是rollup提出的，这也是rollup一个非常重要的feature，那什么是Tree-shaking，在构建代码时，静态分析代码中的 import，并将排除任何未实际使用的代码，只打包使用到的代码。这样的好处是减少代码的体积。举个例子：
我们在根目录中创建两个文件，index.js 和 math.js
```javascript
// math.js
export function plus (a) {
    return a + a;
}
export function square (a) {
    return a * a;
}
```
```javascript
// index.js
import { square } from './math.js';
console.log( square( 5 ) ); 
```
然后运行 `rollup index.js --o bundle.js --f iife`  其中 `--o` 代表输出文件，如果不传会直接在控制台输出，`--f` 是输出的文件类型，`iife` 代表立即执行函数，其他几种类型是
- amd - AMD
- cjs -CommonJS
- es - ES6 modules
- umd - UMD
- system - SystemJS loader

构建完后我们看看bundle.js
```javascript
(function () {
  'use strict';

  // math.js
  function square (a) {
    return a * a;
  }

  console.log( square( 5 ) );

}());
```
我们发现这里只出现了我们引入的square函数，并没有把plus函数也打包进来。

## webpack 和 rollup 
Webpack 在 2012 年创建，当时的主要作用是用来构建复杂的单页应用（SPA）。尤其是它的两个特点改变了一切：
1. 代码分割
2. 静态资源的导入

而Rollup 的开发理念则不同，它利用 ES2015 模块的巧妙设计，尽可能高效地构建精简且易分发的 JavaScript 库。而webpack是通过将模块分别封装进函数中，然将这些函数通过能在浏览器中实现的 require 方法打包（`__webpack_require__`），最后依次处理这些函数。在你需要实现按需加载的时候，这种做法非常的方便，但是这样做引入了很多无关代码，比较浪费资源。  

 webpack构建输出的代码其实有三种。
 - 你的业务逻辑代码
 - Runtime - 代码执行的引导
 - Manifest - 模块依赖关系的记录
 
  比如上面那个例子，我们运行`webpack index.js --mode development ` 进行构建，打包出来的文件是这样子的：
```javascript
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ \"./math.js\");\n\n\nconst num = Object(_math_js__WEBPACK_IMPORTED_MODULE_0__[\"square\"])( 5 ) ;\nconsole.log( num ); \n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./math.js":
/*!*****************!*\
  !*** ./math.js ***!
  \*****************/
/*! exports provided: plus, square */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"plus\", function() { return plus; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"square\", function() { return square; });\n// math.js\nfunction plus (a) {\n  return a + a;\n}\nfunction square (a) {\n  return a * a;\n}\n\n//# sourceURL=webpack:///./math.js?");

/***/ })

/******/ });
```
- 可以看到构建结果中的业务逻辑代码，Runtime和Manifest
- 在Manifest中记录中依赖关系，通过__webpack_require__加载
- 构建结果中包含了没有使用到的plus
- 构建体积明显比rollup中iife格式大
- 代码执行的时候，rollup中iife输出格式，代码执行的速度更快，webpack构建出来的还有依赖查找，而且每个模块通过一个函数包裹形式，执行的时候，就形成了一个个的闭包，占用了内存

所以rollup 比较适合打包 js 的 sdk 或者封装的框架等，例如，vue 源码就是 rollup 打包的。而 webpack 比较适合打包一些应用，例如 SPA 或者同构项目等等。

## 使用
除了直接用命令后执行构建外，也可以使用配置文件的来配置一些属性。在根目录下创建 rollup.config.js 
```javascript
// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  }
};
```
然后执行 `rollup -c` 生成`bundle.js`文件
```javascript
'use strict';

// math.js
function square (a) {
  return a * a;
}

console.log( square( 5 ) ); 
```
可以看到，这和我们上面构建的是一样的，只不过我们设置文件类型是 cjs。  
Rollup中也有很强大的插件系统，我们修改一下index.js
```javascript
import { version } from '../package.json';

export default function() {
    console.log('version: ' + version);
}
```
直接引入`package.json`获取到version，然后在执行`rollup -c`，这时候命令行是会报错的，因为json文件是不能被引入的，但是有一个插件`rollup-plugin-json`可以解决这个问题，我们先安装一下，`npm install rollup-plugin-json --save`，修改`rollup.config.js `
```javascript

import json from 'rollup-plugin-json'; // 引入插件
export default {
  input: 'src/index.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [ json() ]   // 使用插件
};
```
然后在执行构建命令发现，这次构建成功了
```javascript
'use strict';

var version = "1.0.0";

function index() {
    console.log('version: ' + version);
}

module.exports = index;
```
成功从 `package.json`里获取到了version属性。

## 外链(external -e/--external)
使用rollup打包，比如我们在自己的库中需要使用第三方库，例如lodash等，又不想在最终生成的打包文件中出现lodash。这个时候我们就需要使用external属性。
```javascript
import _ from 'lodash'

_.chunk(['a', 'b', 'c', 'd'], 2);
```
构建后我们发现最终文件里把整个 lodash给打包进来了，这样就加大了我们包的体积，所以我们需要使用 external 属性。
```javascript
import resolve from 'rollup-plugin-node-resolve'; // rollup无法识别node_modules中的包,需要用这个插件
export default {
  input: 'src/index.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  external: ['lodash'],
  plugins: [ resolve() ]   // 使用插件
};
```
构建后
```javascript
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _ = _interopDefault(require('lodash'));

_.chunk(['a', 'b', 'c', 'd'], 2);
```
最终文件不会把 lodash打包进来。

## 其他属性
rollup提供了很多个性化的配置属性，比如 footer和banner，可以为文件头部和尾部添加文字，更多属性可以看 [文档](https://www.rollupjs.com/guide/big-list-of-options/)

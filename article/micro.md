# 微前端实践

<a name="e17d58e6"></a>
# 什么是微前端


> 微前端是一种多个团队通过独立发布功能的方式来共同构建现代化 web 应用的技术手段及方法策略。


<br />有几个核心特点：<br />

- 技术栈无关，主框架不限制接入应用的技术栈，可以是任何框架
- 独立开发、独立部署，无需放在同一个文件夹内
- 独立运行时，每个微应用之间状态隔离，运行时状态不共享



<a name="b6c64f1b"></a>
# 如何实现

<br />这里主要使用了 `qiankun` 这个框架，它有两个特点：<br />

- 简单。`qiankun` 对于用户而言只是一个类似 jQuery 的库，他只提供了几个简单的API，就可以完成微应用的接入
- 解耦/技术栈无关。这个符合微前端的特点，每个微应用独立互不干扰，且技术栈不限



<a name="a3e3b883"></a>
# 开始

<br />开始之前可以去 [qiankun](https://qiankun.umijs.org/zh/api#registermicroappsapps-lifecycles) 了解基本API。<br />

<a name="a24bec65"></a>
## 主应用基座

<br />主应用的功能主要是创建微应用的承载容器和注册接入其他微应用。容器规定了微应用的显示区域，微应用将在该容器内渲染并显示。<br />我们这里使用 `vue-cli` 来创建主应用，`vue create micro-app-main`，我们为它增加一个路由文件和一些样式<br />

```javascript
// /src/routes/index.js
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
const routes = [
  {
    /**
     * path: 路径为 / 时触发该路由规则
     * name: 路由的 name 为 Home
     * component: 触发路由时加载 `Home` 组件
     */
    path: '/',
    name: 'Home',
    component: () => import('@/views/pages/index')
  }
];

export default new Router({
  mode: 'history',
  routes
});
```


```javascript
// /src/main.js
import Vue from 'vue';
import App from './App.vue';
import router from './routes';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
```

<br />接下来设置一下主应用的布局，我们会有一个菜单和显示区域<br />

```javascript
// src/App.vue
// 在/src/App.vue里面增加一个menus 数据，这个数据用于渲染菜单栏
menus =  [
{
  key: "Home",
  title: "主页",
  path: "/",
},
];
```

<br />增加一些样式后，我们现在的页面就成了这样<br />
<br />![](https://cdn.nlark.com/yuque/0/2020/png/1552873/1591580292564-8179e758-8d3a-4eb0-84d7-944cf196da1f.png#align=left&display=inline&height=856&margin=%5Bobject%20Object%5D&originHeight=856&originWidth=2130&size=0&status=done&style=none&width=2130)<br />

<a name="6a4d39b7"></a>
### 接入qiankun

<br />构建好主框架以后，我们新建一个`./src/micro/app.js` 文件<br />

```javascript
const apps = [
  /**
   * name: 微应用名称 - 具有唯一性
   * entry: 微应用入口 - 通过该地址加载微应用
   * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
   * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
   */
  {}
];
// http://192.168.31.16:8080/
export default apps;
```

<br />这个文件我们用于注册微应用，当然，现在我们还没创建微应用，所以是空的。<br />

```javascript
// ./src/micro/index.js 注册文件
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { message } from 'ant-design-vue';
import {
  registerMicroApps,
  addGlobalUncaughtErrorHandler,
  start
} from 'qiankun';

// 微应用注册信息
import apps from './apps';

/**
 * 注册微应用
 * 第一个参数 - 微应用的注册信息
 * 第二个参数 - 全局生命周期钩子
 */
registerMicroApps(apps, {
  // qiankun 生命周期钩子 - 微应用加载前
  beforeLoad: (app) => {
    // 加载微应用前，加载进度条
    NProgress.start();
    console.log('before load', app.name);
    return Promise.resolve();
  },
  // qiankun 生命周期钩子 - 微应用挂载后
  afterMount: (app) => {
    // 加载微应用前，进度条加载完成
    NProgress.done();
    console.log('after mount', app.name);
    return Promise.resolve();
  }
});

/**
 * 添加全局的未捕获异常处理器
 */
addGlobalUncaughtErrorHandler((event) => {
  console.error(event);
  const { message: msg } = event;
  // 加载失败时提示
  if (msg && msg.includes('died in status LOADING_SOURCE_CODE')) {
    message.error('微应用加载失败，请检查应用是否可运行');
  }
});

// 导出 qiankun 的启动函数
export default start;
```

<br />这个就是微前端最重要的一个文件了，我们使用了`qiankun`的`registerMicroApps`、`addGlobalUncaughtErrorHandler`、`start` 三个 API，`registerMicroApps`用于注册微应用，`addGlobalUncaughtErrorHandler` 用于捕获全局异常。<br />当然，我们还需要在vue的入口文件起用它<br />

```javascript
// ...省略部分代码
import startQiankun from './micro'; // 引入qiankunodern alternative to CSS 

startQiankun(); // 启用
```

<br />到这里一个非常简单的主应用框架就搭好了。<br />

<a name="28cd5865"></a>
## 接入 Vue 微应用

<br />同样的，我们通过vue-cli新建一个vue 应用，具体就不赘述了，创建好后，我们需要为它增加路由。<br />

```javascript
// ./src/routes/index.js
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
const routes = [
  {
    /**
     * path: 路径为 / 时触发该路由规则
     * name: 路由的 name 为 Home
     * component: 触发路由时加载 `Home` 组件
     */
    path: '/',
    name: 'Home',
    component: () => import('@/views/home')
  },
  {
    path: '/list',
    name: 'List',
    component: () => import('@/views/list')
  }
];
export default new Router({
  base: window.__POWERED_BY_QIANKUN__ ? "/vue" : "/",
  mode: 'history', // 后端支持可开
  routes
});
```

<br />`window.__POWERED_BY_QIANKUN__` 这个变量是判断当前的环境是否是微应用，因为我们有两种情况，一种是作为微应用接入到主应用当中，还有一种是独立运行的时候。当作为微应用时我们需要和主应用区分开路由，所以在所有路由前面加一个路径 `/vue`。<br />接下来需要改造一下 `main.js`<br />

```javascript
// src/main.js
import Vue from "vue";

import App from "./App.vue";
import router from './routes';

Vue.config.productionTip = false;

let instance = null;

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render() {
  // 挂载应用
  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount("#app");
}

// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log("VueMicroApp bootstraped");
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log("VueMicroApp mount", props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log("VueMicroApp unmount");
  instance.$destroy();
  instance = null;
}
```

<br />前面我们说过，它有两种情况，独立运行和微应用运行，独立运行时我们直接挂载 vue 就可以了，微应用运行时我们要在微前端的生命周期里进行挂载。<br />微前端有三个生命周期钩子，`bootstrap`、`mount`、`unmount`三种，我们在`mount`内进行挂载vue应用。`unmount`里面进行注销。<br />
<br />根据`qiankun`文档上描述，我们还需要在`webpack`中配置打包信息，这是为了让主应用能正确识别微应用暴露出来的一些信息<br />

```javascript
// ./vue.config.js
// micro-app-vue/vue.config.js
const path = require("path");

module.exports = {
  devServer: {
    // 监听端口
    port: 8080,
    // 关闭主机检查，使微应用可以被 fetch
    disableHostCheck: true,
    // 配置跨域请求头，解决开发环境的跨域问题
    headers: {
      "Access-Control-Allow-Origin": "*", // 避免跨域
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: "VueMicroApp",
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: "umd",
      // 按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
      jsonpFunction: `webpackJsonp_VueMicroApp`,
    },
  },
};
```


<a name="99c35e79"></a>
### 接入到主应用

<br />微应用改造好了，我们回到主应用进行配置<br />

```javascript
// src/micro/apps.js
const apps = [
  /**
   * name: 微应用名称 - 具有唯一性
   * entry: 微应用入口 - 通过该地址加载微应用
   * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
   * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
   */
  {
    name: 'VueMicroApp', // 唯一性
    entry: '//localhost:8080',
    container: '#frame',
    activeRule: '/vue'
  }
];
export default apps;
```

<br />配置菜单栏<br />

```javascript
// src/App.vue
menus: [
{
  key: 'Home',
  title: '主页',
  path: '/'
},
{
  key: 'VueMicroApp',
  title: 'Vue主页',
  path: '/vue'
},
{
  key: 'VueMicroAppList',
  title: 'Vue列表页',
  path: '/vue/list'
}
]
```

<br />因为这个微应用有两个路由，所以菜单我们增加配置两个。<br />
<br />![](https://cdn.nlark.com/yuque/0/2020/png/1552873/1591580292478-b6c68ddd-a43e-43a2-913c-9e828a6b2108.png#align=left&display=inline&height=99&margin=%5Bobject%20Object%5D&originHeight=396&originWidth=1598&size=0&status=done&style=none&width=400)<br />
<br />这样我们就完成了，vue 微应用的接入<br />

<a name="5d49e2ae"></a>
## 接入 React 应用

<br />我们使用create-react-app 创建一个 react 的应用，`npx create-react-app micro-react-app` ，创建成功后，我们和之前vue微应用一样，在入口文件先导出`qiankun`的三个生命周期钩子函数。<br />

```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

function render() {
  ReactDOM.render(<App />,document.getElementById('root'));
}
// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {
  console.log("react bootstraped");
}
export async function mount(props) {
  render(props);
}
export async function unmount() {
  console.log("react unmount");
  ReactDOM.unmountComponentAtNode(document.getElementById("root"));
}
```

<br />接下来为它添加一个路由<br />

```javascript
// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import './App.css';
import Home from "./pages/index";
import List from "./pages/list";

// 当作为微应用时需要和主应用区分开路由
const BASE_NAME = window.__POWERED_BY_QIANKUN__ ? "/react" : "";

function App() {
  return (
    <div className="App">
      <Router basename={BASE_NAME}>
          <Route exact path="/" component={Home} />
          <Route path="/list" component={List} />
      </Router>
    </div>
  );
}
export default App;
```

<br />接下来还需要配置webpack 使 index.js 导出的生命周期钩子函数可以被 qiankun 识别获取。因为我们使用的是`create-react-app`创建的，如果需要扩展webpack 的话需要借助一哥工具`react-app-rewired`，在根目录下新建`config-overrides.js`<br />

```javascript
const path = require("path");

module.exports = {
  webpack: (config) => {
    // 微应用的包名，这里与主应用中注册的微应用名称一致
    config.output.library = `ReactMicroApp`;
    // 将你的 library 暴露为所有的模块定义下都可运行的方式
    config.output.libraryTarget = "umd";
    // 按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
    config.output.jsonpFunction = `webpackJsonp_ReactMicroApp`;

    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },

  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      // 关闭主机检查，使微应用可以被 fetch
      config.disableHostCheck = true;
      // 配置跨域请求头，解决开发环境的跨域问题
      config.headers = {
        "Access-Control-Allow-Origin": "*",
      };
      // 配置 history 模式
      config.historyApiFallback = true;

      return config;
    };
  },
};
```

<br />和vue 微应用一样配置好webpack，修改package.json 的启动参数<br />

```
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
  "eject": "react-app-rewired eject"
}
```


<a name="10236f59"></a>
### 接入主应用

<br />接下来就是在主应用中进行注册了<br />

```javascript
// 主应用 src/micro/apps.js
const apps = [
  /**
   * name: 微应用名称 - 具有唯一性
   * entry: 微应用入口 - 通过该地址加载微应用
   * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
   * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
   */
  {
    name: 'VueMicroApp',
    entry: '//localhost:8888',
    container: '#frame',
    activeRule: '/vue'
  },
  {
    name: 'ReactMicroApp',
    entry: '//localhost:10100',
    container: '#frame',
    activeRule: '/react'
  }
];
export default apps;
```

<br />增加左侧菜单<br />

```javascript

menus: [
    ...
    {
      key: 'ReactMicroApp',
      title: 'react主页',
      path: '/react'
    },
    {
      key: 'ReactMicroAppList',
      title: 'react列表',
      path: '/react/list'
    }
]
```

<br />这样就完成了react微应用的接入<br />

<a name="4JaoM"></a>
## 静态网页
如果我们只是想接入静态页面，同样也是非常简单，静态页面我们需要借助 `express` 或者 `koa` 框架来启动，创建一个文件夹 `micro-static-app` 里面创建入口文件 index.js 和 静态页面index.html
```javascript
// index.js
const express = require("express");
const cors = require("cors");

const app = express();
// 解决跨域问题
app.use(cors());
app.use('/', express.static('static'));

// 监听端口
app.listen(10200, () => {
  console.log("server is listening in http://localhost:10200")
})

```
然后需要在 index.html 进行渲染和暴露微应用生命周期钩子
```javascript
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>static App</title>
  </head>

  <body>
    <section
      id="app-container"
      style="padding: 20px; color: blue;"
    ></section>
  </body>
  <!-- 引入 jquery -->
  <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script>
    /**
     * 请求接口数据，构建 HTML
     */
    async function buildHTML() {
      return `<div>静态页面</div>`
    }

    /**
     * 渲染函数
     * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
     */
    const render = ($) => {
      const html = buildHTML();
      $("#app-container").html(html);
      return Promise.resolve();
    };

    // 独立运行时，直接挂载应用
    if (!window.__POWERED_BY_QIANKUN__) {
      render($);
    }

    ((global) => {
      /**
       * 注册微应用生命周期钩子函数
       * global[appName] 中的 appName 与主应用中注册的微应用名称一致
       */
      global["StaticMicroApp"] = {
        /**
         * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
         * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
         */
        bootstrap: () => {
          console.log("MicroJqueryApp bootstraped");
          return Promise.resolve();
        },
        /**
         * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
         */
        mount: () => {
          console.log("MicroJqueryApp mount");
          return render($);
        },
        /**
         * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
         */
        unmount: () => {
          console.log("MicroJqueryApp unmount");
          return Promise.resolve();
        },
      };
    })(window);
  </script>
</html>
```
这样我们对静态页面的处理就完成了<br />
<br />同样的，我们在主应用中进行注册
```javascript
// src/micro/apps.js
const apps = [
  /**
   * name: 微应用名称 - 具有唯一性
   * entry: 微应用入口 - 通过该地址加载微应用
   * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
   * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
   */
  {
    name: 'VueMicroApp',
    entry: '//localhost:8888',
    container: '#frame',
    activeRule: '/vue'
  },
  {
    name: 'ReactMicroApp',
    entry: '//localhost:10100',
    container: '#frame',
    activeRule: '/react'
  },
  {
    name: "StaticMicroApp",
    entry: "//localhost:10200",
    container: "#frame",
    activeRule: "/static"
  }
];
export default apps;

```

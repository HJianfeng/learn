# Webpack性能优化你知道哪些

## 优化开发体验
### 1. 优化Loader配置

由于Loader对文件的转换操作很耗时，所以需要让尽可能少的文件被Loader处理。可以通过 test/include/exclude 三个配置项来命中Loader要应用规则的文件。
```javascript
module .exports = { 
  module : {
    rules : [{
      //如果项目源码中只有 文件，就不要写成/\jsx?$/，以提升正则表达式的性能
      test: /\.js$/, 
      //babel -loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
      use: ['babel-loader?cacheDirectory'] , 
      //只对项目根目录下 src 目录中的文件采用 babel-loader
      include: path.resolve(__dirname,'src'),
    }],
  }
}
```
### 2. 优化 resolve.modules 配置
resolve.modules 的默认值是['node_modules']，含义就是先去当前目录的 node_modules 目录下查找我们想找的模块，如果没找到就去上一级目录 ../node_modules 中找，再没有就去 ../../node_modules 中找，以此类推。这和 Node.js 的模块寻找机制很相似。  

当安装的第三方模块都放在项目根目录的 node_modules 目录下时，就没有必要按照默认的方式去一层层地寻找，可以指明存放第三方模块的绝对路径，以减少寻找.
```javascript
module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')]
  },
}
```
### 3. 优化 resolve.mainFields 配置  
在安装的第三方模块中都会有一个 package.json 文件，用于描述这个模块的属性,其中可以存在多个字段描述入口文件，原因是某些模块可以同时用于多个环境中，针对不同的运行环境需要使用不同的代码。

resolve.mainFields 的默认值和当前的 target 配置有关系，对应的关系如下。
- target web 或者 webworker 时，值是［'browser','module','main']。
- target 为其他情况时，值是［ 'module','main']。

以 target 等于 web 为例， Webpack 会先采用第三方模块中的 browser 宇段去寻找模块的入口文件，如果不存在，就采用 module 字段，以此类推。  
  
为了减少搜索步骤，在明确第三方模块的入口文件描述字段时，我们可以将它设置得尽量少。 由于大多数第三方模块都采用 main 宇段去描述入口文件的位置，所以可以这样配置：
```javascript
module.exports = { 
  resolve: { 
    //只采用 main 字段作为入口文件的描述字段，以减少搜索步骤
    mainFields: ['main']
  }
}
```
### 4. 优化 resolve.alias 配置
resolve.alias 配置项通过别名来将原导入路径映射成一个新的导入路径。  
通过配置 resolve.alias, 可以让 Webpack 在处理库时，直接使用单独、完整的文件,从而跳过耗时的递归解析操作.
```javascript
module.exports = {
  resolve: {
    //使用 alias 将导入 react 的语句换成直接使用单独、完整的 react.min.js 文件，
    //减少耗时的递归解析操作
    alias: {
      'react': path.resolve(__dirname, './node_modules/react/dist/react.min.js'), 
    }
  }
}
```


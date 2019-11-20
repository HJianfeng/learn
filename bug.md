# 记一次报错解析 [Vue warn]: You may have an infinite update loop in a component

## 出现原因
再一次开发过程中，突然发现控制台里出现一个错误：
```
[Vue warn]: You may have an infinite update loop in a component render function
```
根据警告信息我们可以初步知道是组件里有可能出现无限调用`render`函数的情况，但是检查完代码并没有出现死循环等错误。不过发现一段代码有点奇怪。  
```javascript
<template>
<div>
  <template v-for="(item, index) in list">
    {{getInfo(item.status)}}
  </template>
</div>
</template>
<script>       
export default {
    data() {
      return {
          returnStatus: true
        }
    },
    methods: {
      getInfo(status) {
        const option = ['普通', '退款中', '退款取消', '退款完成', '退款驳回', '退款关闭'];
        switch (status) {
          case 1:
            this.returnStatus = true;
            return option[0];
          case 2:
            this.returnStatus = false;
            return option[1];
          case 3:
            this.returnStatus = false;
            return option[2];
        }
      }
    }
  };
</script>
```
最终发现问题就是出来这里： 在 `v-for` 循环中 （render - getInfo - render ）间接修改了data响应数据而且没有终止条件。状态的改变会导致渲染方法的执行，上述两种情况的相同点在于，执行渲染时，又会改变状态，诱发无限循环。此时 Vue 就会发出警告（并不是真的已经无限循环了）。  
## 解决办法
只要把方法内的修改 data 的操作去除就可以了。
```javascript
getInfo(status) {
  const option = ['普通', '退款中', '退款取消', '退款完成', '退款驳回', '退款关闭'];
  switch (status) {
    case 1:
      return option[0];
    case 2:
      return option[1];
    case 3:
      return option[2];
  }
}
```
## 小结
- 尽可能用事件改变状态 ，驱动页面渲染重绘
- 慎用内联表达式，对于自定义vue属性而言，它会被渲染器自执行
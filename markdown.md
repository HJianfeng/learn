# markdown 基础语法

## 块级元素  
### 标题
Markdown 支持两种形式的标题, [Setext] [1] 和 [atx] [2].  
   
Setext 样式的标题使用的等号来表示一级标题, 使用连字符表示二级标题. 例如:
```
This is an H1
=============

This is an H2
-------------
```  
任意长度的 `=` 或 `-` 都是可以的.  
  
Atx 样式的标题每行开头使用 1-6 井号, 对应 1-6 级标题. 例如:  
```
# This is an H1

## This is an H2

###### This is an H6
```
可选地, 你可以 "关闭" atx 样式的标题. 这纯粹是美化需要 -- 如果你认为这样美观一些就用吧. 关闭标签的井号数量甚至不需要和起始位置的匹配. (起始的井号数量决定了标题的级别.) :  
```
# This is an H1 #

## This is an H2 ##

### This is an H3 ######
```

### 块引用
Markdown 使用 `>` 字符作为块引用. 
```
> 这是一个段落
```
> 这是一个段落 

块引用可以嵌套 (例如, 块引用中包含块引用) , 只需添加额外层级的 > 即可:
```
> 这是一个段落
>> 嵌套
```
> 这是一个段落
>> 嵌套

### 列表
Markdown 支持有序列表和无序列表.  
  
无序列表有三种方式，`*`、`+`、`-`，他们都是完全一样的。  
```
*  Red
*  Green
*  Blue
+  Red
+  Green
+  Blue
-  Red
-  Green
-  Blue
```
*  Red
*  Green
*  Blue
+  Red
+  Green
+  Blue
-  Red
-  Green
-  Blue  

有序列表使用数字加句号:
```
1. Bird
2. McHale
3. Parish
```
1. Bird
2. McHale
3. Parish

### 代码块
代码块用于输出编程语言和标记语言，代码块中的行会被原样呈现.  
  
要在 Markdown 中插入代码块, 使用 ` 或者 ``` 字符包裹代码。
```
代码块
``` 

### 水平线
如果一行中只有三个以上的连字符, 星号, 或者下划线则会在该位置生成一个 `<hr />` 标签. 星号和连字符之间的空格也是允许的. 下面的例子都会生成一条水平线:
```
* * *

***

*****

- - -

---------------------------------------
```
* * *

***

*****

- - -

---------------------------------------

## 内联元素
### 链接
Markdown 支持两种链接形式: 内联 和 引用.  
这两种形式下链接文本的定界符都是 [中括号].  
要创建内联链接, 只需在链接文本的右括号后面紧接一对圆括号. 圆括号里面放所需的 URL 链接, 还可以放一个 可选 的链接标题, 标题要用引号包围. 例如:  
```
这是一个有title属性的 [链接](http://example.com/ "Title")。

[这个链接](http://example.net/) 没有属性。
```
这是一个有title属性的 [链接](http://example.com/ "Title")。

[这个链接](http://example.net/) 没有属性。

### 强调
Markdown 将星号 (`*`) 和下划线 (`_`) 作为强调标记。例如, 下面的输入:
```
*single asterisks*

_single underscores_

**double asterisks**

__double underscores__
```
*single asterisks*

_single underscores_

**double asterisks**

__double underscores__

强调可以用在单词中:
```
这是*强调*作用
```
这是*强调*作用

### 内联代码
要输出一个代码片段, 需要使用重音符号 (`). 不同于预格式的代码块, 代码片段只是在普通段落中标识出代码. 例如:
```
方法`printf()` function.
```
方法`printf()` function.

### 图片
```
![Alt text](/path/to/img.jpg)
![Alt text](/path/to/img.jpg "Optional title")
```
![Alt text](/path/to/img.jpg)
![Alt text](/path/to/img.jpg "Optional title")
## 前言
想必大家对常见的排序算法和查找算法都不陌生，这篇文章主要对这些常见的算法做一个整理～

## 排序
## 插入排序
插入排序的基本思想是：每一趟将一个待排序的记录，按其关键字的大小插入到已经排好序的一组记录的适当位置上，直到所有待排序记录全部插入为止。  
我们这里介绍两种方法：直接插入排序、希尔排序。
### 直接插入排序
直接插入排序是一种最简单的排序方法，其操作是将一条记录插入到已排好的有序表中，从而得到一条有序的记录。  
### 步骤
1. 设待排序的记录存放在数组 r[l..n]中， r[l]是一个有序序列。
2. 循环 n-1 次，每次使用顺序查找法，查找`r[i]（i<=n）`，在已排好序的序列 r[l …i-1]中的插入位置，然后将 r[i]插入表长为 i-l 的有序序列 r[l …i-l]
```
初始关键字  (49)  38  65  97  76  13
i=2         (38   49) 65  97  76  13
i=3         (38   49  65) 97  76  13
i=4         (38   49  65  97) 76  13
i=5         (38   49  65  76  97) 13
i=6         (13   38  49  65  76  97) 
```
```javascript
function InsertSort(L) {
    // 对数组L进行直接插入排序
    var temp;
    for(let i = 1; i<=L.length; i++) {
        if(L[i] < L[i-1]) {
            temp = L[i];        // 将待插人的记录暂存到监视哨中
            L[i] = L[i-1];      //r[i-1]后移
            for(var j=i-2; temp<L[j]; j--) {
                L[j+1] = L[j];
            }
            L[j+1] = temp;      // 将 temp即原L[i]，插人到正确位置
        }
    }
    return L;
}
```
### 分析  
在直接插入排序中，内层的for循环数取决于待插记录与有序区之间的关系。最好情况是正序排列，比较一次，不移动，时间复杂度是O(n)，最坏情况是逆序，时间复杂度O(n^2)。稳定排序。更适合于初始记录基本有序的情况。

### 希尔排序
希尔排序是插入排序的一种，先将整个待排序记录序列分割成几组，从而减少参与
直接插入排序的数据量，对每组分别进行直接插入排序，然后增加每组的数据量，重新分组。 这样当经过几次后分组排序后，整个序列“基本有序”，再对全体进行一次直接插入排序。

![](https://user-gold-cdn.xitu.io/2020/2/24/170760f7e1f324f7?w=1080&h=1126&f=png&s=797853)
```javascript
function ShellSort(arr) {
    var temp,
        len = arr.length;
        gap = Math.floor(len/2);
    // 第一个循环控制增量
    for (gap; gap > 0; gap = Math.floor(gap/2)) {
        for (var i = gap; i < len; i++) {
            temp = arr[i];
            for (var j = i-gap; j >= 0 && arr[j] > temp; j-=gap) {
                arr[j+gap] = arr[j];
            }
            arr[j+gap] = temp;
        }
    }
    return arr;
}
```
### 分析
希尔排序和直接插入排序一样只应用到了一个临时变量，所以它的空间复杂度为O(1)。因为记录是跳跃式的移动，所以他是不稳定的。记录总的比较次数和移动次数都比直接插入排序要少，n越大时，效果越明显。所以适合初始记录无序、n较大时的情况。


## 直接选择排序
直接选择排序是选择排序中的一种，它的基本思想是每一趟从数组中选出关键字最小的数字，按顺序放在已排序好的关键字最后，直到全部排完为止。
```javascript
function selectSort(arr) {
    var k, // k指向每趟排序关键值最小的下标
        temp;
    for(var i=0; i<arr.length; i++) {
        k = i;
        for(var j = i+1;j<arr.length;j++) {
            if(arr[j] < arr[k]) k = j;
        }
        if(k!==i){
            temp = arr[i];
            arr[i] = arr[k];
            arr[k] = temp;
        }
    }
    return arr;
}
```
直接选择排序中，移动的次数较小，主要是比较的次数。最好情况（正序）：不移动。最坏情况（逆序）：移动3(n-1)次。它的时间复杂度为O(n^2)，空间复杂度只使用了k和temp两个变量，所以空间复杂度为 O(1)。

## 堆排序
堆排序是利用树结构所设计的一种排序算法，在排序过程中把`n[0...n-1]`看成一颗完全二叉树，利用双亲节点和孩子节点之间的关系，构造出大根堆或者小根堆。大根堆也就是每个双亲节点都比孩子节点大，所以根是最大的数字。小根堆意思一样，只不过每个双亲节点都比孩子节点小。我们这里只利用大根堆来排序。堆排序其实就是一个持续构建大根堆的过程，每一趟排序把构建完的大根堆，取出最大值也就是根，放在最末尾的有序区内，然后重复把无序区构建成大根堆，再把根放入有序区内，直到排序完成。

比如数组：[49,38,65,97,76,13,27]，用完全二叉树表示它。

![](https://user-gold-cdn.xitu.io/2020/2/25/1707b6cbb6389bfb?w=952&h=638&f=png&s=205769)  
构建成大根堆，则是：[97,76,65,38,49,13,27]

![](https://user-gold-cdn.xitu.io/2020/2/25/1707b6e89df58a7c?w=956&h=614&f=png&s=202287)     


构建大根堆的代码：
```javascript
//  比较current节点和他的孩子节点大小，并调整为大的值在前
function HeapAdjust(arr, current, size) {
    var temp = arr[current-1];
    // 完全二叉树由一个特点，左孩子的位置是双亲节点位置的两倍，则右孩子是两倍加1，所以这里的2*current代表 current 节点的左孩子
    for(var j = 2*current; j <= size; j*=2) {
        if(j<size && arr[j] < arr[j+1]) ++j;
        if(temp > arr[j]) break;
        arr[current-1]=arr[j];
        current = j;
    }
    arr[current-1] = temp;
    return arr;
}
// 建大根堆
function CreatHeap(arr) {
    const len = arr.length;
    for(var i = len; i >0; i--) {
        HeapAdjust(arr, i, len);
    }
}
```
建初始堆：

![](https://user-gold-cdn.xitu.io/2020/2/25/1707bbb15af6a54e?w=926&h=1040&f=png&s=359624)

我们现在知道了大根堆的创建，就可以很容易的写出堆排序算法
```javascript
function HeapSort(arr) {
    // 建初始堆
    CreatHeap(arr)
    var temp;
    console.log('初始堆', arr)
    for(let i = arr.length;i>1;i--) {
        temp = arr[0];
        arr[0] = arr[i-1];
        arr[i-1] = temp;
        console.log(`第${arr.length-i+1}趟：`, arr)
        HeapAdjust(arr, 1, i-1);
    }
    return arr;
}
```
时间复杂度：堆排序运行时间主要消耗在建初始堆和调整堆时反复“筛选”上。它的时间复杂度是O(nlog2n)。  
空间复杂度：仅需要一个temp临时变量，O(1);堆排序不稳定，数组记录比较高时使用堆排序会更有效率。

## 快速排序
快速排序的基本思想是：通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据都比另外一部分的所有数据都要小，然后再按此方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，以此达到整个数据变成有序序列。  
步骤：在待排序的n个元素中任取一个元素当作支点，通常我们都会取第一个元素。然后经过对比把所有小于它的元素交换到它前面，所有大于它的元素交换到它的后面，然后再重复对其左右边重复操作，直到排序完成。  
  
一趟排序的具体操作：  
1. 选择数组中第一个元素作为支点，暂存在`temp`变量上，并定义两个指针，`low`和`high`，初始时分别指向第一个元素和最后一个元素（`第一趟时：low=0;high=arr.length-1`）
2. 从数组的最右侧开始搜索，找到第一个比支点小的元素，把`high`指向当前位置，然后移动到`low`的位置
3. 然后从左侧`low`的位置开始向右搜索，找到第一个比支点大的元素，把`low`指向该位置，然后移动到`high`的位置。
4. 重复2和3的步骤，直到`low`和`high`的位置相等为止。  

例如[49,38,65,97,28,13,50]的第一趟排序图示

![](https://user-gold-cdn.xitu.io/2020/2/26/17080612c044e3e5?w=1916&h=954&f=png&s=660060)
第一趟排序完成后，数组被分为了`[13,38,28]`和`[97,65,50]`这左右两部分，分别在对这两部分进行快速排序，这样最后就会变成一个有序的序列。
```javascript
// 对数组进行一趟划分的方法,返回最后支点位置
function Partition(arr, low, high) {
    var key = arr[low];
    while(low<high) {
        // 从high的位置右往左找到第一个小于key的值
        while(low<high && arr[high] >= key) { high--; }
        arr[low] = arr[high];  // 找到后移动到low位置
        // 从low的位置左往右找到第一个大于key的值
        while(low<high && arr[low] <= key) { low++; }
        arr[high] = arr[low];   // 找到后移动到high位置
    }
    arr[low] = key;
    console.log(arr);  // 每一趟的结果
    return low;
}
// 快速排序
function QSort(arr) {
  QuickSort(arr, 0, arr.length-1);
  function QuickSort(arr, low, high) {
    if(low < high) {
      var pivotloc = Partition(arr, low, high);
      QuickSort(arr, low, pivotloc-1); // 对左表递归排序
      QuickSort(arr, pivotloc+1, high); // 对右表递归排序
    }
  }
  return arr;
}
```
时间复杂度：O(nlog2n)，空间复杂度：因为用到了递归，执行时需要一个栈来存放相应数据，所以空间复杂度是为O(n)。快速排序是不稳定，当记录较大时，快速排序是这些排序算法中最快的，所以适用于初始记录无序，n较大的情况。
## 一、动态规划  
首先动态规划要满足三个条件：  
1. **最优化原理**：如果问题的最优解所包含的子问题的解也是最优的，就称该问题具有最优子结构，即满足最优化原理。
2. **无后效性**：即某阶段状态一旦确定，就不受这个状态以后决策的影响。也就是说，某状态以后的过程不会影响以前的状态，只与当前状态有关。
3. **有重叠子问题**：即子问题之间是不独立的，一个子问题在下一阶段决策中可能被多次使用到。（该性质并不是动态规划适用的必要条件，但是如果没有这条性质，动态规划算法同其他算法相比就不具备优势）  

动规解题的一般思路:    
  动态规划所处理的问题是一个多阶段决策问题，一般由初始状态开始，通过对中间阶段决策的选择，达到结束状态。这些决策形成了一个决策序列，同时确定了完成整个过程的一条活动路线(通常是求最优的活动路线)。  

动态规划决策过程:  
1. **划分阶段**：按照问题的时间或空间特征，把问题分为若干个阶段。在划分阶段时，注意划分后的阶段一定要是有序的或者是可排序的，否则问题就无法求解。
2. **确定状态和状态变量**：将问题发展到各个阶段时所处于的各种客观情况用不同的状态表示出来。当然，状态的选择要满足无后效性。
3. **确定决策并写出状态转移方程**：因为决策和状态转移有着天然的联系，状态转移就是根据上一阶段的状态和决策来导出本阶段的状态。所以如果确定了决策，状态转移方程也就可写出。但事实上常常是反过来做，根据相邻两个阶段的状态之间的关系来确定决策方法和状态转移方程。
4. **寻找边界条件**：给出的状态转移方程是一个递推式，需要一个递推的终止条件或边界条件。
一般，只要解决问题的阶段、状态和状态转移决策确定了，就可以写出状态转移方程（包括边界条件）。


### 1、新21点
题目：爱丽丝参与一个大致基于纸牌游戏 “21点” 规则的游戏，描述如下：  
爱丽丝以 0 分开始，并在她的得分少于 K 分时抽取数字。 抽取时，她从 [1, W] 的范围中随机获得一个整数作为分数进行累计，其中 W 是整数。 每次抽取都是独立的，其结果具有相同的概率。  
当爱丽丝获得不少于 K 分时，她就停止抽取数字。 爱丽丝的分数不超过 N 的概率是多少？  

题解：
1. 动态规划题目，先定下 dp 的概念。令 dp[x]表示从得分为 x 的情况开始游戏并且获胜的概率，目标是求 dp[0]的值。
2. 要想获胜则要符合 `K <= x <= N`,此时的概览 dp[x] = 1;
3. 计算 `0<= x < K`。注意到每次在范围 [1, W] 内随机抽取一个整数，所以求dp[x]概率时,分母为`W`，分子为所有胜利的次数，`dp[x+1]+dp[x+2]+...+dp[x+W]`,因此可以得到如下状态转移方程: `(dp[x+1]+dp[x+2]+...+dp[x+W])/W`。

代码：
```javascript
var new21Game = function(N, K, W) {
    if(K === 0) return 1.0;
    const dp = new Array(K + W).fill(0);  // 初始置概率为0
    for (let i = K; i <= N; i++) {  // 置符合`K <= x <= N` 时，概率为1
        dp[i] = 1;
    }
    for (let i = K - 1; i >= 0; i--) {
        for (let j = 1; j <= W; j++) {
            dp[i] += dp[i + j] / W;
        }
    }
    return dp[0]
};
```
优化：  
对 dp 的相邻项计算差分，有如下结果：`dp[x] - dp[x+1] = (dp[x+1]-dp[x+W+1])/W`，则
`dp[x] = (dp[x+1]-dp[x+W+1])/W + dp[x+1]`
```
dp[x] = (dp[x+1]+dp[x+2]+...+dp[x+W])/W
dp[x+1] = (dp[x+1+1]+dp[x+2-1]+...+dp[x+W+1])/W

dp[x] - dp[x+1] = (dp[x+1]-dp[x+W+1])/W
dp[x] = (dp[x+1]-dp[x+W+1])/W + dp[x+1]
```
```javascript
var new21Game = function(N, K, W) {
    if(K === 0) return 1.0;
    const dp = new Array(K + W).fill(0);
    for (let i = K; i <= N; i++) {
        dp[i] = 1.0;
    }
    dp[K - 1] = 1.0 * Math.min(N - K + 1, W) / W;
    for (let i = K - 2; i >= 0; i--) {
        dp[i] = dp[i + 1] - (dp[i + W + 1] - dp[i + 1]) / W;
    }
    return dp[0]
};
```

### 2、剪绳子
给你一根长度为 n 的绳子，请把绳子剪成整数长度的 m 段（m、n都是整数，n>1并且m>1），每段绳子的长度记为 k[0],k[1]...k[m - 1] 。请问 k[0]*k[1]*...*k[m - 1] 可能的最大乘积是多少？例如，当绳子的长度是8时，我们把它剪成长度分别为2、3、3的三段，此时得到的最大乘积是18。

题解：  
对于正整数 n，当 n≥2 时，可以拆分成至少两个正整数的和。令 i 是拆分出的第一个正整数，则剩下的部分是 n−i，n−i 可以不继续拆分，或者继续拆分成至少两个正整数的和。由于每个正整数对应的最大乘积取决于比它小的正整数对应的最大乘积，因此可以使用动态规划求解。（关键在于把大的问题，拆分成小的问题）
第一步：定义dp数组，dp[i] 表示将正整数 i 拆分成至少两个正整数的和之后，这些正整数的最大乘积。  
第二步：当 i≥2 时，假设对正整数 i 拆分出的第一个正整数是 j（1≤j<i），则有以下两种方案：
- 将 i 拆分成 j 和 i−j，且 i−j 不再拆分成多个正整数，此时的乘积是 j×(i−j)；
- 将 i 拆分成 j 和 i−j 的和，且 i−j 继续拆分成多个正整数，此时的乘积是 j×dp[i−j]。
所以，状态转移方程为` dp[i]=Math.max(j*(i−j),j*dp[i−j])`

```javascript
var cuttingRope = function(n) {
    if(n <= 1) return 0;
    const dp = new Array(n+1).fill(0);

    for (let i = 2; i <= n; i++) {
        for (let j = 1; j < i; j++) {
            dp[i] = Math.max(dp[i], Math.max(j*(i-j), j * dp[i - j]));
        }        
    }
    return dp[n]
};
```

### 3、统计字典序元音字符串的数目
给你一个整数 n，请返回长度为 n 、仅由元音 (a, e, i, o, u) 组成且按 字典序排列 的字符串数量。

字符串 s 按 字典序排列 需要满足：对于所有有效的 i，s[i] 在字母表中的位置总是与 s[i+1] 相同或在 s[i+1] 之前。
```
输入：n = 1
输出：5
解释：仅由元音组成的 5 个字典序字符串为 ["a","e","i","o","u"]

输入：n = 2
输出：15
解释：仅由元音组成的 15 个字典序字符串为["aa","ae","ai","ao","au","ee","ei","eo","eu","ii","io","iu","oo","ou","uu"]
```

题解：  
找规律：可知如果设 dp[i] 为以`字母[i]`为结尾的个数，那么`a`可以作为`dp[0]`的结尾，`e`可以作为`dp[0]`和`dp[1]`的结尾，... ，`u`可以作为`dp[0]、dp[1]、dp[2]、dp[3]、dp[4]`的结尾。而dp[i]的数量是当n=0 到 n=n-1 时的dp[i]相加，所以思路如下：  

```javascript
var countVowelStrings = function(n) {
    const dp = new Array(5).fill(1); // n=0时都为1
    for (let i = 1; i < n; i++) {
        for (let j = 4; j >= 0; j--) { // 字母j（从u开始）
            for (let k = j-1; k >= 0; k--) {  // 字母 j 前面的字母都可以用 j 当作结尾
                dp[j] = dp[j] + dp[k]
            }
        }
    }
    return dp[0]+dp[1]+dp[2]+dp[3]+dp[4]
};
```
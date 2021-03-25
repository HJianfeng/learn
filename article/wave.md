# 原理
水波图动画我们已经见过很多次了，一开始看到波浪，可能不知道从何入手，我们来看看波浪的特征就会有灵感了

![](https://user-gold-cdn.xitu.io/2020/7/16/173566215accd0ae?w=1266&h=648&f=png&s=167196)

其实就是借助三角函数中的正余弦曲线

# 三角函数
正弦函数：**y = A sin(Bx + C) + D**，正弦函数可以构建出一个有规律的正弦曲线

![](https://user-gold-cdn.xitu.io/2020/7/16/173566d75d027147?w=650&h=300&f=png&s=26776)

通过修改A、B、C、D 几个参数我们能得到不一样结果。 
  
A 控制振幅，A 值越大，曲线更陡峭：
![](https://user-gold-cdn.xitu.io/2020/7/16/173566ec00650074?w=650&h=300&f=png&s=42708)
B 控制着周期，B 值大于 1 时，B越大周期越小，B 值小于 1 大于 0 时，周期变长：

![](https://user-gold-cdn.xitu.io/2020/7/16/1735689d2dbaa6e3?w=650&h=300&f=png&s=44452)  
C 控制曲线左移或者右移，小于0时曲线向右移动，大于0时曲线向左移动  
D 控制曲线的上下移动  

了解了这些基础概念后我们就有了一个概念：  
- 振幅：控制波浪的高度
- 周期：控制波浪的宽度
- 相移：控制波浪的水平移动
- 垂直位移：控制水位的高度

# 实现
首先我们画出一条正弦曲线
```javascript
function draw (ctx) {
  const canvasWidth = 300;
  const canvasHeight = 300;
  const startX = 0;
  const waveWidth = 0.05; // 波浪宽度,数越小越宽
  const waveHeight = 20; // 波浪高度,数越大越高
  const xOffset = 0; // 水平位移

  ctx.beginPath();
  for (let x = startX; x < startX + canvasWidth; x += 20 / canvasWidth) {
    const y = waveHeight * Math.sin((startX + x) * waveWidth + xOffset);
    // 通过公式： y = 波浪高度 * sin(x * 波浪宽度 + 水平位移)
    points.push([x, (canvasHeight / 2) + y]);
    ctx.lineTo(x, (canvasHeight / 2) + y);
  }
  // 绘制容器
  ctx.lineTo(canvasWidth, canvasHeight);
  ctx.lineTo(startX, canvasHeight);
  ctx.lineTo(points[0][0], points[0][1]);
  ctx.stroke();
}
draw(ctx)
```
现在我们就画好了一条静止的波浪和容器，那如何能让它动起来呢，上面我们已经说过了，xOffset 是控制他的水平位移的，所以只要动态且有规律的改变xOffset的值，就能够让波浪动起来
```javascript
function drawSin (ctx, xOffset) {
  ...
}
function draw() {
  var xOffset = 0; // 水平位移
  var speed = .1;
  const canvas = document.getElementById('mycanvas');
  const ctx = canvas.getContext('2d');
  function start() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    xOffset += speed;
    // 曲线绘制
    drawSin(ctx, xOffset);
    requestAnimationFrame(() => {
      start()
    });
  }
  start();
}
draw()
```
# 水位控制
现在我们想做一个波浪升高的动画，** A sin(Bx + C) + D** 那么我们只要动态控制 D 的大小就可以了，水位最低时，D 等于canvas的高度，也就是在canvas容器的最底部，所以得到一个很简单的公示`(1-nowRange)*canvasHeight` nowRange 范围时0-1，代表整个容器的比率。我们需要控制水位到canvas容器一半的位置，那么只要使nowRange为0.5就可以了。
```javascript
function drawSin (ctx, xOffset = 0, nowRange = 0) {
  const points = [];
  const canvasWidth = 500;
  const canvasHeight = 500;
  const startX = 0;
  const waveWidth = 0.05; // 波浪宽度,数越小越宽
  const waveHeight = 20; // 波浪高度,数越大越高

  ctx.beginPath();
  for (let x = startX; x < startX + canvasWidth; x += 20 / canvasWidth) {
   // 计算水位值
    const D = (1 - nowRange) * canvasHeight;
    const y = waveHeight * Math.sin((startX + x) * waveWidth + xOffset) + D;
    points.push([x,  y]);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(canvasWidth, canvasHeight);
  ctx.lineTo(startX, canvasHeight);
  ctx.lineTo(points[0][0], points[0][1]);
  ctx.stroke();
}

function draw() {
  var xOffset = 0; // 水平位移
  var speed = .1;
  var nowRange = 0;
  const canvas = document.getElementById('mycanvas');
  const ctx = canvas.getContext('2d');
  canvas.height = 500;
  canvas.width = 500;
  function start() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    xOffset += speed;
    // 计算nowRange，最高为0.5
    if (nowRange < 0.5) {
      nowRange += 0.01;
    }
    // 曲线绘制
    drawSin(ctx, xOffset, nowRange);
    requestAnimationFrame(() => {
      start()
    });
  }
  start();
}
draw()
```
最后加上颜色就可以了，并且可以使用 ctx.clip 裁剪方法，为它设置容器
```javascript

class Wave {
  constructor({
    canvasWidth, // 轴长
    canvasHeight, // 轴高
    waveWidth = 0.055, // 波浪宽度,数越小越宽
    waveHeight = 6, // 波浪高度,数越大越高
    xOffset = 0,
    speed = 0.04,
    colors = ['#DBB77A', '#BF8F3B'], // 波浪颜色
  } = {}) {
    this.points = [];
    this.startX = 0;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.waveWidth = waveWidth;
    this.waveHeight = waveHeight;
    this.xOffset = xOffset;
    this.speed = speed;
    this.colors = colors;
  }
  getChartColor(ctx) {
    const radius = this.canvasWidth / 2;
    const grd = ctx.createLinearGradient(radius, radius, radius, this.canvasHeight);
    grd.addColorStop(0, this.colors[0]);
    grd.addColorStop(1, this.colors[1]);
    return grd;
  }
  draw(ctx) {
    ctx.save();
    const points = this.points;
    ctx.beginPath();
    for (let i = 0; i < points.length; i += 1) {
      const point = points[i];
      ctx.lineTo(point[0], point[1]);
    }
    ctx.lineTo(this.canvasWidth, this.canvasHeight);
    ctx.lineTo(this.startX, this.canvasHeight);
    ctx.lineTo(points[0][0], points[0][1]);
    ctx.fillStyle = this.getChartColor(ctx);
    ctx.fill();
    ctx.restore();
  }
  setParams({
    nowRange,
  } = {}) {
    this.points = [];
    const {
      startX, waveHeight, waveWidth, canvasWidth, canvasHeight, xOffset,
    } = this;
    for (let x = startX; x < startX + canvasWidth; x += 20 / canvasWidth) {
      const y = Math.sin(((startX + x) * waveWidth) + xOffset);
      const dY = canvasHeight * (1 - (nowRange / 100));
      this.points.push([x, dY + (y * waveHeight)]);
    }
    this.xOffset += this.speed;
  }
}

class drawClass {
  init() {
    const canvas = document.getElementById('mycanvas');
    canvas.height = 500;
    canvas.width = 500;
    this.canvas = canvas;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.radius = this.canvasWidth / 2;
    this.nowRange = 0;
    this.rangeValue = 60;
    this.wave1 = new Wave({
      canvasWidth: this.canvasWidth, // 轴长
      canvasHeight: this.canvasHeight, // 轴高
      waveWidth: 0.05, // 波浪宽度,数越小越宽
      waveHeight: 4, // 波浪高度,数越大越高
      colors: ['rgba(38, 116, 233, .5)', 'rgba(8, 96, 228, 1)'], // 波浪颜色
      xOffset: 0, // 初始偏移
      speed: 0.04, // 速度
    });
    this.wave2 = new Wave({
      canvasWidth: this.canvasWidth, // 轴长
      canvasHeight: this.canvasHeight, // 轴高
      waveWidth: 0.04, // 波浪宽度,数越小越宽
      waveHeight: 3, // 波浪高度,数越大越高
      colors: ['rgba(38, 116, 233, .5)', 'rgba(8, 96, 228, .5)'], // 波浪颜色
      xOffset: 2, // 初始偏移
      speed: 0.02, // 速度
    });
    const start = () => {
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      if (this.drawContainer) {
        this.drawContainer(ctx);
      }
      if (this.nowRange <= this.rangeValue) {
        this.nowRange += 1;
      }
      if (this.nowRange > this.rangeValue) {
        this.nowRange -= 1;
      }
      this.wave2.setParams({ nowRange: this.nowRange });
      this.wave2.draw(ctx);
      this.wave1.setParams({ nowRange: this.nowRange });
      this.wave1.draw(ctx);
      window.requestAnimationFrame(start);
    }
    start();
  }

  drawContainer(ctx) {
    const r = this.canvasWidth / 2;
    const lineWidth = 4;
    const cR = r - (lineWidth);
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(r, r, cR, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(186, 165, 130, 0.3)';
    ctx.stroke();
    ctx.clip();
  }
}
var draw = new drawClass();
draw.init()
```
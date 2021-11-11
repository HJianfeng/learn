

class WaterFall {
  constructor(container, options) {
    this.gap = options.gap || 0;
    this.container = container;
    this.items = container.children || [];
    this.heightArr = [];
    this.renderIndex = 0;
    window.addEventListener('resize', () => {
      this.renderIndex = 0;
      this.heightArr = [];
      this.layout()
    });
    this.container.addEventListener('DOMSubtreeModified', () => {
      this.layout();
    })
  }
  layout() {
    if(this.items.length === 0) return;
    const gap = this.gap;
    const pageWidth = this.container.offsetWidth;
    const itemWidth = this.items[0].offsetWidth;
    const columns = parseInt(pageWidth / (itemWidth + gap)); // 总共有多少列
    while (this.renderIndex < this.items.length) {
      let top, left;
      if(this.renderIndex < columns) { // 第一列
        top = 0; left = (itemWidth + gap) * this.renderIndex;
        this.heightArr.push(this.items[this.renderIndex].offsetHeight)
      } else {
        const minIndex = this.getMinIndex(this.heightArr);
        top = this.heightArr[minIndex] + gap;
        left = this.items[minIndex].offsetLeft
        this.heightArr[minIndex] += (this.items[this.renderIndex].offsetHeight + gap); 
      }
      this.container.style.height = this.getMaxHeight(this.heightArr) + 'px';
      this.items[this.renderIndex].style.top = top + 'px';
      this.items[this.renderIndex].style.left = left + 'px';
      this.renderIndex++;
    }
  }

  getMinIndex(heightArr) {
    let minIndex = 0;
    let min = heightArr[minIndex]
    for (let i = 1; i < heightArr.length; i++) {
      if(heightArr[i] < min) {
        min = heightArr[i]
        minIndex = i;
      }      
    }
    return minIndex;
  }
  getMaxHeight(heightArr) {
    let maxHeight = heightArr[0]
    for (let i = 1; i < heightArr.length; i++) {
      if(heightArr[i] > maxHeight) {
        maxHeight = heightArr[i]
      }      
    }
    return maxHeight;
  }
}
window.onload = function() {
  const waterfall = document.getElementById('waterfall');
  const water = new WaterFall(waterfall, {gap: 10})
  water.layout()
}

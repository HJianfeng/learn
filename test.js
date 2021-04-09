
/*
实现 int sqrt(int x) 函数。

计算并返回 x 的平方根，其中 x 是非负整数。

由于返回类型是整数，结果只保留整数的部分，小数部分将被舍去。
*/
var sqrt = function(x) {
  let l = 0, r = x, ans = -1;
  while(l <= r) {
    let mid = Math.floor((l + r) / 2);
    if(mid * mid <= x) {
      ans = mid;
      l = mid + 1;
    } else {
      r = mid - 1;
    }
  }
  return ans;
};

console.log(sqrt(8));

Function.prototype.call2 = function(context) {
  context = context?Object(context):window;
  context.fn = this;
  const args = arguments.slice(1);
  const result = context.fn(...args);
  delete context.fn;
  return result;
}

Function.prototype.apply2 = function(context, arr) {
  context = context?Object(context):window;
  context.fn = this;
  let result;
  if(arr) {
    result = context.fn(...arr);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
}

Function.prototype.bind2 = function(context) {
  const args = Array.prototype.slice(arguments, 1);
  const self = this;

  const fNop = function() {};
  const fn = function() {
    const bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(context, args.concat(bindArgs))
  }
  fNop.prototype = this.prototype;
  fn.prototype = new fNop();
  return fn;
}
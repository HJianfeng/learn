const addRemote = async (a,b)=> new Promise(resolve => {
  setTimeout(()=> {resolve(a+b)},1000)
})

async function add(...arg) {
  if(arg.length === 0) return 0;
  if(arg.length === 1) return arg[0];
  let res = 0;
  for (const key of arg) {
    res = await addRemote(res, key);
  }
  return res;
}

(async function main() {
  console.log(await add(1));
  console.log(await add(1,2,2));
})()



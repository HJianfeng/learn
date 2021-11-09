const puppeteer = require("puppeteer");
const iPhone = puppeteer.devices["iPhone 6"]; // puppeteer.devices内置大量设备的预设定值

//使用 puppeteer.launch 启动 Chrome
(async () => {
  const browser = await puppeteer.launch({
    headless: false, //有浏览器界面启动
  });
  const page = await browser.newPage();
  await page.emulate(iPhone);
  await page.goto("https://www.taobao.com", { waitUntil: "networkidle0" });
 
  await browser.close();
})();
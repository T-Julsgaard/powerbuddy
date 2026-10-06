const {chromium}=require('C:/Users/thoma/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const context=await browser.newContext({viewport:{width:1280,height:1000}});
 const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve('outputs/powerbuddy.html').replace(/\\/g,'/'));await page.waitForTimeout(400);
 const out='outputs/verification';fs.mkdirSync(out,{recursive:true});
 await page.screenshot({path:out+'/01-home-desktop.png'});
 await page.locator('[data-action="add-reading"]').first().click();await page.waitForTimeout(350);await page.screenshot({path:out+'/02-reading.png'});
 await page.keyboard.press('Escape');await page.locator('[data-mode="locked"]').first().click();await page.waitForTimeout(350);await page.screenshot({path:out+'/03-lock.png'});
 console.log(JSON.stringify({errors,title:await page.title(),icons:await page.locator('svg.icon path').count()}));
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});

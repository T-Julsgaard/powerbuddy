const {chromium}=require('C:/Users/thoma/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const OUT='outputs/verification',URL='file:///'+path.resolve('outputs/powerbuddy.html').replace(/\\/g,'/');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true}),errors=[],network=[],checks=[];
 for(const size of [{width:393,height:852},{width:360,height:800},{width:430,height:932},{width:1280,height:1000}]){
  const c=await browser.newContext({viewport:size,reducedMotion:size.width<740?'reduce':'no-preference'});await c.setOffline(true);const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url())});await p.goto(URL);
  const prefix='final-'+size.width+'x'+size.height;
  const act=async(a,extra='',scope='')=>{await p.locator(`${scope} [data-action="${a}"]${extra}:visible`.trim()).first().click()};
  const shot=async(name)=>{await p.waitForTimeout(330);await p.screenshot({path:OUT+'/'+prefix+'-'+name+'.png'})};
  const geometry=async()=>{const d=await p.evaluate(()=>({w:innerWidth,pw:document.documentElement.scrollWidth,cw:document.querySelector('#content').clientWidth,cs:document.querySelector('#content').scrollWidth}));assert.ok(d.pw<=d.w);assert.ok(d.cs<=d.cw+1)};
  for(const tab of ['Home','Usage','Plan','Rewards']){await act('tab','[data-tab="'+tab+'"]','#tabs');await geometry();await shot(tab.toLowerCase())}
  await act('tab','[data-tab="Usage"]','#tabs');for(const resource of ['electricity','water']){await act('resource','[data-id="'+resource+'"]');await act('chart-kind','[data-id="hour"]');const axis=await p.locator('.chart-axis').innerText();const ticks=axis.trim().split('\n');assert.equal(new Set(ticks).size,3);await shot('hours-'+resource);await geometry()}
  await act('settings');assert.equal(await p.locator('.assumptions').evaluate(e=>e.open),false);assert.match(await p.locator('.sheet-body').innerText(),/^Useful updates/);if(size.width<740)assert.equal(await p.locator('#presenter-toggle').isVisible(),false);await shot('settings');await p.keyboard.press('Escape');
  await act('tab','[data-tab="Home"]','#tabs');await act('add-reading');await shot('reading');await p.locator('#reading-form button[type="submit"]').click();await shot('reading-error');assert.equal(await p.locator('.errors').evaluate(e=>document.activeElement===e),true);await p.locator('#electricity').fill('2000');await p.locator('#water').fill('35');await p.locator('#reading-form button[type="submit"]').click();assert.match(await p.locator('.sheet-body').innerText(),/unusually high/);await shot('reading-warning');await act('confirm-reading');await shot('reading-success');await p.keyboard.press('Escape');
  if(size.width<740)await p.locator('#presenter-toggle').click();await act('reset');await act('confirm-reset');
  if(size.width<740)await p.locator('#presenter-toggle').click();await act('device','[data-mode="locked"]','#presenter');if(size.width<740)await p.locator('#presenter-toggle').click();await p.locator('#scenario').selectOption('cheaper');await act('scenario');if(size.width<740)await p.locator('#presenter-toggle').click();await shot('lock-notification');
  await p.locator('[data-action="unlock"]').focus();await p.keyboard.press('Enter');assert.equal(await p.evaluate(()=>PowerBuddy.snapshot().device),'app');
  if(size.width===393){await act('device','[data-mode="locked"]','#presenter').catch(async()=>{await p.locator('#presenter-toggle').click();await act('device','[data-mode="locked"]','#presenter')});await p.mouse.move(40,700);await p.mouse.down();await p.mouse.move(40,520);await p.mouse.up();assert.equal(await p.evaluate(()=>PowerBuddy.snapshot().device),'app')}
  checks.push(`${size.width}x${size.height}: revised Home, all tabs, fractional chart ticks, Settings, error/warning/success, locked scenario, keyboard unlock, no horizontal overflow`);await c.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(network,[]);
 function contrast(a,b){const rgb=x=>x.match(/\w\w/g).map(h=>parseInt(h,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);const lum=x=>{const [r,g,b]=rgb(x);return .2126*r+.7152*g+.0722*b};const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
 const ratios={inkOnPorcelain:contrast('172720','f6f5f0'),mutedOnPorcelain:contrast('56635c','f6f5f0'),greenOnSoft:contrast('215b43','e6ede3'),waterOnPorcelain:contrast('376c91','f6f5f0'),whiteOnGreen:contrast('ffffff','215b43'),amberOnSoft:contrast('78551b','f6eddc'),redOnError:contrast('a43c32','f6e7e3')};for(const value of Object.values(ratios))assert.ok(value>=4.5);
 const report={checks,pointerSwipe:'Synthetic mouse pointer swipe at 393x852 passed; physical touch untested',errors,network,contrastRatios:ratios,bytes:fs.statSync('outputs/powerbuddy.html').size};fs.writeFileSync(OUT+'/final-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

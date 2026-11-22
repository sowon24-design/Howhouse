import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdirSync, writeFileSync } from 'node:fs'
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const browser = await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL || 'msedge'})
const page = await browser.newPage({viewport:{width:412,height:915},deviceScaleFactor:1})
const errors=[]; page.on('pageerror',error=>errors.push(error.message))
const checks=[]
const ok=(name)=>{checks.push(name); console.log('PASS',name)}
await page.addInitScript(()=>localStorage.setItem('howhouse.catalog.profile.v1',JSON.stringify({nickname:'유소원',ageConfirmed:true,policyVersion:'catalog-2026-11-12-youtube-v2'})))
const base=process.env.MICRO_URL || 'http://127.0.0.1:5187'
async function home(){await page.goto(base+'/#home');await page.locator('.hh-home-banner').waitFor();await page.evaluate(()=>document.fonts.ready)}
async function press(selector){const el=page.locator(selector).first();await el.scrollIntoViewIfNeeded();const b=await el.boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();return el}
const style=(el,prop)=>el.evaluate((e,p)=>getComputedStyle(e)[p],prop)
try {
  await home()
  mkdirSync('docs/microinteraction',{recursive:true})
  await page.setViewportSize({width:412,height:1400})
  await page.addStyleTag({content:'.hh-home-preview-tools{display:none!important}.hh-catalog-frame{height:auto!important;max-height:none!important;overflow:visible!important}'})
  await page.locator('.hh-home').screenshot({path:'docs/microinteraction/home.png'})
  await page.setViewportSize({width:412,height:915})
  await home()
  let el=await press('.hh-home-banner')
  assert.equal(await el.getAttribute('data-home-pressed'),'true')
  assert.match(await style(el,'transform'),/0\.98/)
  await page.mouse.move(2,2);await page.mouse.up();await page.waitForTimeout(200)
  assert.equal(await el.getAttribute('data-home-pressed'),'false')
  assert.equal(new URL(page.url()).hash,'#home');ok('Banner press and outside cancellation')
  await el.click();await page.waitForURL('**/#search');ok('Banner opens search without delay')
  await home(); el=page.locator('.hh-home-categories button').first();await el.focus();await page.keyboard.down('Space')
  assert.equal(await el.getAttribute('data-home-pressed'),'true');assert.match(await style(el.locator('img'),'transform'),/0\.94/)
  await page.keyboard.up('Space');await page.waitForURL('**/#solutions/**');ok('Space feedback and category navigation')
  await home();await page.locator('.hh-home-banner').focus();await page.keyboard.press('Enter');await page.waitForURL('**/#search');ok('Enter opens search')
  await home();el=await press('.hh-home-problem');await page.waitForTimeout(190)
  assert.equal(await el.getAttribute('data-pressed'),'true');assert.match(await style(el.locator('.ui-asset'),'transform'),/4, 0/)
  await page.mouse.up();await page.waitForURL('**/#case/**');ok('Popular problem arrow and detail navigation')
  await home();el=page.locator('.hh-home-categories button').first()
  await el.dispatchEvent('pointerdown',{pointerId:1,isPrimary:true,button:0,pointerType:'touch'})
  await el.dispatchEvent('pointercancel',{pointerId:1,isPrimary:true,pointerType:'touch'})
  assert.equal(await el.getAttribute('data-home-pressed'),'false');ok('Touch scroll cancellation clears feedback')
  el=await press('.hh-home-banner');await page.evaluate(()=>window.dispatchEvent(new Event('blur')))
  assert.equal(await el.getAttribute('data-home-pressed'),'false');await page.mouse.move(2,2);await page.mouse.up();ok('Window blur clears held press')
  await page.emulateMedia({reducedMotion:'reduce'});el=await press('.hh-home-banner')
  assert.equal(await style(el,'transform'),'none');assert.equal(await style(el,'transitionDuration'),'0s');assert.equal(await style(el,'filter'),'brightness(0.94)')
  await page.mouse.move(2,2);await page.mouse.up();ok('Reduced motion keeps state color without movement')
  await page.emulateMedia({reducedMotion:'no-preference'})
  for(const width of [360,412,768]){await page.setViewportSize({width,height:915});await home();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true)}
  ok('360 / 412 / 768 px no horizontal overflow')
  assert.deepEqual(errors,[]);ok('No browser runtime errors')
  writeFileSync('docs/microinteraction/verification.json',JSON.stringify({date:'2026-11-22',checks,limitations:['Android physical device not tested','Pointer cancellation includes synthetic event coverage']},null,2))
} finally {await browser.close()}



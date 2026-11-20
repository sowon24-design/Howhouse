import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { createCapstoneWebHandler } from '../server/analysis/capstone-web.mjs'

test('web serves only built HTML/assets and rejects repository traversal, secrets and source maps', t => {
  // The managed Windows environment permits realpath inside the workspace.
  const workspace = resolve(import.meta.dirname, '..')
  const root = mkdtempSync(join(workspace, 'capstone-web-test.local-'))
  t.after(()=>{if(dirname(resolve(root))!==workspace)throw Error('Unexpected test path');rmSync(root,{recursive:true,force:true})})
  mkdirSync(join(root,'assets')); writeFileSync(join(root,'capstone.html'),'<main>Demo</main>'); writeFileSync(join(root,'assets/app.js'),'console.log("demo")')
  mkdirSync(join(root,'components/figma'),{recursive:true});writeFileSync(join(root,'components/figma/checkbox-stroke-off.svg'),'<svg/>')
  writeFileSync(join(root,'.env'),'test-only');writeFileSync(join(root,'assets/app.js.map'),'private source')
  const serve=createCapstoneWebHandler(root)
  const call=(url,method='GET')=>{const res={status:0,headers:{},body:null,writeHead(status,headers){this.status=status;this.headers=headers},end(body){this.body=body}};return {handled:serve({url,method,resume(){}},res),res}}
  assert.equal(call('/').res.status,200);assert.equal(call('/capstone.html').res.headers['Content-Type'],'text/html; charset=utf-8')
  assert.equal(call('/assets/app.js').res.status,200)
  assert.equal(call('/components/figma/checkbox-stroke-off.svg').res.status,200)
  for(const path of ['/.env','/server/analysis/server.mjs','/assets/../.env','/assets/%2e%2e/.env','/assets/app.js.map','/assets/%252e%252e/private.js','/assets/%ZZ'])assert.equal(call(path).handled,false,path)
  assert.equal(call('/assets/missing.js').res.status,404)
  assert.equal(call('/','POST').res.status,405);assert.equal(call('/','HEAD').res.body,undefined)
})

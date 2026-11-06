import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import {releasePage} from './release-pages.mjs'
test('unapproved public policy and deletion pages never look ready',()=>{
 for(const path of ['/privacy','/terms','/data-deletion'])assert.equal(releasePage(path,{documentsReady:false}).status,503)
 assert.equal(releasePage('/privacy',{documentsReady:true}).status,503)
})
test('operator page keeps authentication in memory, has a nonce CSP and safe DOM output',()=>{
 const page=releasePage('/ops',{authUrl:'https://project.supabase.co',publishableKey:'sb_publishable_test'})
 assert.equal(page.status,200);assert.match(page.headers['Content-Security-Policy'],/frame-ancestors 'none'/)
 assert.equal(page.headers['Cache-Control'],'no-store')
 const script=page.body.match(/<script nonce="[^"]+">([\s\S]*?)<\/script>/)[1]
 assert.doesNotThrow(()=>new vm.Script(script));assert.doesNotMatch(script,/localStorage|innerHTML|sb_secret_/)
})
test('external deletion persists a private receipt and never stores the deletion code',()=>{
 const page=releasePage('/data-deletion',{documentsReady:true})
 const script=page.body.match(/<script nonce="[^"]+">([\s\S]*?)<\/script>/)[1]
 assert.doesNotThrow(()=>new vm.Script(script));assert.match(script,/sessionStorage.setItem/)
 assert.match(script,/data.operationId!==pending.operationId/)
 assert.match(script,/sessionStorage.setItem\(receiptKey,JSON.stringify\(pending\)\)/)
})

import test from 'node:test'
import assert from 'node:assert/strict'
import {analysisConsentReady,createAnalysisConsentFlow} from './consent-flow.ts'
const acceptance={ageAtLeast14:true,processingAccepted:true,overseasAccepted:true}
test('draft policy and unapproved flags cannot send consent',async()=>{
 assert.equal(analysisConsentReady(undefined,{paragraphs:['완료']}),false)
 assert.equal(analysisConsentReady('1',{paragraphs:['[출시 전 제공업체별 확정]']}),false)
 assert.equal(analysisConsentReady('1',{paragraphs:['검토 중']}),false)
 assert.equal(analysisConsentReady('1',{paragraphs:['[선택] 개인정보 수집·이용 동의']}),true)
 let saves=0
 const flow=createAnalysisConsentFlow({isReady:()=>false,save:async()=>{saves++}})
 assert.equal(await flow.submit(acceptance,()=>assert.fail('must not analyze')),false);assert.equal(saves,0)
})
test('each affirmative choice and age confirmation are required before saving',async()=>{
 let saves=0
 const flow=createAnalysisConsentFlow({isReady:()=>true,save:async()=>{saves++}})
 for(const key of Object.keys(acceptance))assert.equal(await flow.submit({...acceptance,[key]:false},()=>assert.fail()),false)
 assert.equal(saves,0)
})
test('server save finishes before continuation, and fast duplicate clicks save only once',async()=>{
 let resolve,saves=0,starts=0
 const flow=createAnalysisConsentFlow({isReady:()=>true,save:()=>{saves++;return new Promise(r=>{resolve=r})}})
 const job=flow.submit(acceptance,()=>{starts++})
 assert.equal(starts,0);assert.equal(await flow.submit(acceptance,()=>{starts++}),false)
 resolve();assert.equal(await job,true);assert.equal(saves,1);assert.equal(starts,1)
})
test('save failure preserves the draft and permits explicit retry without starting analysis',async()=>{
 let fail=true,starts=0
 const flow=createAnalysisConsentFlow({isReady:()=>true,save:async()=>{if(fail)throw Error('storage unavailable')}})
 await assert.rejects(flow.submit(acceptance,()=>{starts++}));assert.equal(starts,0)
 fail=false;assert.equal(await flow.submit(acceptance,()=>{starts++}),true);assert.equal(starts,1)
})
test('closing or unmounting while saving ignores a late success and never starts analysis',async()=>{
 let resolve,starts=0
 const flow=createAnalysisConsentFlow({isReady:()=>true,save:()=>new Promise(r=>{resolve=r})})
 const job=flow.submit(acceptance,()=>{starts++});flow.cancel();resolve()
 assert.equal(await job,false);assert.equal(starts,0)
})

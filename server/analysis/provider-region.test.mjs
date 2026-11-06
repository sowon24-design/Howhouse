import test from 'node:test'
import assert from 'node:assert/strict'
import {randomUUID} from 'node:crypto'
import {providerBaseUrl,readProcessingRegion} from './provider-region.mjs'
import {matchCase,MatchError} from './matcher.mjs'
import {runConnectionCheck} from './verify-openai.mjs'
import {createAnalysisService} from './service.mjs'
import {inputFingerprint} from './answer-cache.mjs'
import {createAnalysisServer} from './server.mjs'
const config={apiKey:'mock-key-never-used-for-network',model:'gpt-6.1-terra',processingRegion:'us'}
test('US requests never fall back to a global endpoint after a provider failure',async()=>{
 assert.equal(providerBaseUrl('us'),'https://us.api.openai.com/v1');assert.equal(readProcessingRegion(),'global')
 assert.throws(()=>providerBaseUrl('https://untrusted.example'))
 const calls=[]
 await assert.rejects(matchCase({...config,catalog:{serialized:'[]',cases:[]},text:'fixed test',photos:[],signal:new AbortController().signal,fetchImpl:async url=>{calls.push(url);return Response.json({error:{message:'never expose private error'}},{status:403})}}),{code:'api-error',diagnostic:'provider-http-403'})
 assert.deepEqual(calls,['https://us.api.openai.com/v1/responses'])
})
test('fixed US capability check sends no user input or photo and reports the regional reference uplift',async()=>{
 const result=await runConnectionCheck({...config,fetchImpl:async(url,options)=>{
  assert.equal(url,'https://us.api.openai.com/v1/responses');const body=JSON.parse(options.body)
  assert.equal(typeof body.input,'string');assert.equal(body.store,false);assert.equal(body.max_output_tokens,128);assert.equal(body.tools,undefined)
  return Response.json({status:'completed',output:[{type:'message',content:[{type:'output_text',text:'HOWHOUSE_CONNECTION_OK'}]}],usage:{input_tokens:20,output_tokens:8}})
 }})
 assert.equal(result.success,true);assert.equal(result.processingRegion,'us');assert.ok(Math.abs(result.referenceCostUsd-0.000066)<1e-12)
})
test('changing processing region does not reuse a global cached answer',async()=>{
 const values=new Map(),secret=Buffer.alloc(32,1);let calls=0
 const catalog={version:'v1',cases:[{id:'test:1'}]},cache={key:(input,context)=>inputFingerprint(input,context,secret),get:key=>values.get(key),set:(key,value)=>values.set(key,value)}
 const shared={catalog,cache,ledger:{reserve(){},finish(){}},matchImpl:async()=>{calls++;return {result:{source:'existing',caseId:'test:1'}}}}
 const global=createAnalysisService({...shared,config:{...config,processingRegion:'global'}}),us=createAnalysisService({...shared,config})
 const input={text:'test',photos:[]},ctx=()=>({requestId:randomUUID(),signal:new AbortController().signal})
 assert.equal((await global(input,ctx())).reuse,'new');assert.equal((await us(input,ctx())).reuse,'new');assert.equal((await global(input,ctx())).reuse,'saved');assert.equal(calls,2)
})
test('only the approved operator can request a single ledger-reserved check before release data is enabled',async t=>{
 let paid=0,reservations=0;const reserved=new Set()
 const trial={host:'localhost',origins:['https://localhost'],authenticate:async header=>({id:'owner',reviewer:header==='Bearer operator'}),forUser:()=>({ledger:{reserve(id){if(reserved.has(id))throw new MatchError('invalid-input');reserved.add(id);reservations++},finish(){},remaining:()=>null}})}
 const server=createAnalysisServer({config,catalog:{serialized:'[]',version:'test',cases:[]},trial,providerCheckImpl:async()=>{paid++;return {success:true,processingRegion:'us'}}})
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>server.close(resolve)));const base='http://127.0.0.1:'+server.address().port;trial.host=new URL(base).host
 const post=(route,body,operator=true)=>fetch(base+route,{method:'POST',headers:{Origin:'https://localhost',Authorization:'Bearer '+(operator?'operator':'normal'),'Content-Type':'application/json'},body:JSON.stringify(body)})
 assert.equal((await post('/api/ops/provider-check',{confirm:'check-processing-region',operationId:randomUUID()},false)).status,403);assert.equal(paid,0)
 const access=await post('/api/ops/access',{});assert.equal((await access.json()).releaseDataEnabled,false)
 const body={confirm:'check-processing-region',operationId:randomUUID()}
 assert.equal((await post('/api/ops/provider-check',body)).status,200);assert.equal(paid,1);assert.equal(reservations,1)
 await post('/api/ops/provider-check',body);assert.equal(paid,1)
})

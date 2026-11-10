import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { createFeedbackClient, feedbackTarget } from './feedback-client.ts'

test('fresh case viewer makes no authentication or feedback request', async () => {
 let authCalls=0,requests=0
 const client=createFeedbackClient({baseUrl:'https://server.example',target:{source:'existing',caseId:'욕실·수도:1'},
  getAccessToken:async()=>{authCalls++;return 'new-token'},getExistingAccessToken:()=>undefined,
  fetchImpl:async()=>{requests++;assert.fail('view must remain local')}})
 assert.equal(await client.getStateIfAuthenticated(),undefined)
 assert.equal(authCalls,0);assert.equal(requests,0)
})

test('case viewer restores an existing rating using only an already-valid session', async () => {
 let authCalls=0,requests=0
 const client=createFeedbackClient({baseUrl:'https://server.example',target:{source:'existing',caseId:'욕실·수도:1'},
  getAccessToken:async()=>{authCalls++;assert.fail('view must not authenticate')},getExistingAccessToken:()=> 'cached-token',
  fetchImpl:async(url,options)=>{requests++;assert.ok(url.endsWith('/state'));assert.equal(options.headers.Authorization,'Bearer cached-token')
   return Response.json({rating:'like',revision:4,updatedAt:null})}})
 assert.deepEqual(await client.getStateIfAuthenticated(),{rating:'like',revision:4,updatedAt:null})
 assert.equal(authCalls,0);assert.equal(requests,1)
})

test('rejected view-only session never falls back to signup or refresh', async () => {
 let authCalls=0,requests=0
 const client=createFeedbackClient({baseUrl:'https://server.example',target:{source:'existing',caseId:'욕실·수도:1'},
  getAccessToken:async()=>{authCalls++;return 'replacement-token'},getExistingAccessToken:()=> 'revoked-token',
  fetchImpl:async()=>{requests++;return Response.json({code:'auth-required'},{status:401})}})
 await assert.rejects(client.getStateIfAuthenticated(),{code:'auth-required'})
 assert.equal(authCalls,0);assert.equal(requests,1)
})

test('explicit rating after local viewing can authenticate and persist its first selection', async () => {
 let authCalls=0;const calls=[]
 const client=createFeedbackClient({baseUrl:'https://server.example',target:{source:'existing',caseId:'욕실·수도:1'},
  getAccessToken:async()=>{authCalls++;return 'user-token'},getExistingAccessToken:()=>undefined,
  fetchImpl:async(url,options)=>{calls.push(url);const body=JSON.parse(options.body)
   if(url.endsWith('/state'))return Response.json({rating:null,revision:0,updatedAt:null})
   return Response.json({operationId:body.operationId,saved:true,duplicate:false,revision:1,submittedAt:'2026-11-10T00:00:00Z'})}})
 await client.getStateIfAuthenticated();assert.equal(authCalls,0)
 assert.equal((await client.setRating('like')).saved,true)
 assert.equal(authCalls,2);assert.equal(calls.length,2)
})
function fixture(source='existing') {
 const calls=[];let fail=false,saved=false,rev=0,rating=null;const receipts=new Map();let requests=0
 const target=source==='existing'?{source,caseId:'욕실·수도:1'}:{source,resultId:`generated:${randomUUID()}`}
 const client=createFeedbackClient({baseUrl:'https://server.example',target,getAccessToken:async()=> 'user-token',fetchImpl:async(url,options)=>{
  assert.ok(url.startsWith('https://server.example/api/feedback/'));assert.equal(options.headers.Authorization,'Bearer user-token')
  const body=JSON.parse(options.body);calls.push({url,body});requests++
  if(url.endsWith('/state'))return Response.json({rating,revision:rev,updatedAt:null})
  if(saved)return Response.json({saved:false})
  const prior=receipts.get(body.operationId)
  const result=prior??{operationId:body.operationId,saved:true,duplicate:false,submittedAt:new Date().toISOString(),...(url.endsWith('/rating')?{revision:body.revision}:{})}
  receipts.set(body.operationId,result)
  if(url.endsWith('/rating')){rev=body.revision;rating=body.rating}
  if(fail){fail=false;throw Error('Response lost after persistence')}
  return Response.json({...result,duplicate:!!prior})
 }})
 return {client,calls,setFail:()=>{fail=true},setInvalid:()=>{saved=true},requests:()=>requests}
}
for(const source of ['existing','generated']) {
 test(`${source}: selection, clear, switch and repeated click keep one request per intent`,async()=>{
  const f=fixture(source);await f.client.getState()
  const a=f.client.setRating('like'),b=f.client.setRating('like');assert.equal(a,b);await a
  await f.client.setRating(null);await f.client.setRating('dislike')
  const writes=f.calls.filter(c=>c.url.endsWith('/rating')).map(c=>c.body)
  assert.deepEqual(writes.map(x=>x.rating),['like',null,'dislike']);assert.deepEqual(writes.map(x=>x.revision),[1,2,3])
  assert.equal(new Set(writes.map(x=>x.operationId)).size,3)
  assert.ok(writes.every(x=>x.result.source===source&&!('ownerId'in x)))
 })
 test(`${source}: a lost save response retries the same operation, no duplicate opinion`,async()=>{
  const f=fixture(source);f.setFail()
  await assert.rejects(f.client.submitOpinion('custom','  설명이 어려워요.  '),{code:'connection-error'})
  const result=await f.client.submitOpinion('custom','  설명이 어려워요.  ')
  assert.equal(result.duplicate,true);assert.equal(f.calls[0].body.operationId,f.calls[1].body.operationId)
  assert.equal(f.calls[0].body.text,'설명이 어려워요.');assert.equal(f.calls.length,2)
 })
 test(`${source}: blank opinions and unsuccessful storage never count as success`,async()=>{
  const f=fixture(source)
  await assert.rejects(f.client.submitOpinion('custom',' \u200b '),{code:'invalid-input'});assert.equal(f.requests(),0)
  f.setInvalid();await assert.rejects(f.client.submitOpinion('unsafe-method',''),{code:'invalid-response'})
 })
}
test('rating receipt loss retains operation and revision for manual retry',async()=>{
 const f=fixture();await f.client.getState();f.setFail()
 await assert.rejects(f.client.setRating('dislike'),{code:'connection-error'});await f.client.setRating('dislike')
 const writes=f.calls.filter(c=>c.url.endsWith('/rating'));assert.deepEqual(writes[0].body,writes[1].body)
})
test('old revision rejection never auto-writes; explicit retry reads latest revision first',async()=>{
 let writes=0,reads=0
 const client=createFeedbackClient({baseUrl:'https://server.example',target:{source:'existing',caseId:'욕실·수도:1'},getAccessToken:async()=> 'token',fetchImpl:async(url,options)=>{
  if(url.endsWith('/state'))return Response.json({rating:null,revision:reads++?7:0,updatedAt:null})
  const b=JSON.parse(options.body);writes++
  return writes===1?Response.json({code:'stale-selection'},{status:409}):Response.json({operationId:b.operationId,saved:true,duplicate:false,revision:b.revision,submittedAt:new Date().toISOString()})
 }})
 await assert.rejects(client.setRating('like'),{code:'stale-selection'});assert.equal(writes,1)
 assert.equal((await client.setRating('like')).revision,8);assert.equal(writes,2)
})
test('sample IDs never masquerade as a real generated result or existing case',()=>{
 assert.equal(feedbackTarget('generated','generated:sample-only'),undefined)
 assert.equal(feedbackTarget('generated','욕실·수도:1'),undefined)
 assert.equal(feedbackTarget('existing','generated:'+randomUUID()),undefined)
})

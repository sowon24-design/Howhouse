import test from 'node:test'
import assert from 'node:assert/strict'
import {createPrivacyClient,privacyVersion} from './privacy-client.ts'
import {privacyVersion as serverPrivacyVersion} from '../../server/analysis/release-store.mjs'

test('legacy combined consent never skips the separate choices in the new client',()=>{
 const saved=new Map([['howhouse:ai-consent:https://service.example','2026-11-06-v1']])
 const client=createPrivacyClient({baseUrl:'https://service.example',getAccessToken:async()=>{throw Error('No network needed')},storage:{getItem:k=>saved.get(k)??null,setItem:(k,v)=>saved.set(k,v),removeItem:k=>saved.delete(k)}})
 assert.equal(privacyVersion,serverPrivacyVersion)
 assert.equal(client.consentRecorded(),false)
 assert.equal(saved.size,1)
})
import {aiReportText} from './ai-report.ts'
const id='11111111-1111-4111-8111-111111111111'
const userToken='e30.'+Buffer.from(JSON.stringify({sub:id})).toString('base64url')+'.signature'
function fixture(){const saved=new Map(),calls=[];let lose=false,deleted=false;const client=createPrivacyClient({baseUrl:'https://service.example',getAccessToken:async()=>{if(deleted)throw Error('Account gone');return userToken},storage:{getItem:k=>saved.get(k)??null,setItem:(k,v)=>saved.set(k,v),removeItem:k=>saved.delete(k)},makeId:()=>id,makeSecret:()=> 'a'.repeat(64),fetchImpl:async(url,options)=>{const body=JSON.parse(options.body);calls.push({url,body,headers:options.headers});if(url.endsWith('identity'))return Response.json({registered:true});if(url.endsWith('consent'))return Response.json({accepted:body.version===privacyVersion,documentHash:body.documentHash,eventId:'1',recordedAt:'2026-11-10T00:00:00Z'});if(url.endsWith('delete-status'))return Response.json({deleted:true,operationId:id});if(url.endsWith('/delete')){deleted=true;if(lose){lose=false;throw Error('lost receipt')}return Response.json({deleted:true,operationId:id})}}});return {client,saved,calls,lose:()=>{lose=true}}}
test('AI consent is recorded only after a confirmed server receipt; withdrawal preserves deletion code',async()=>{const f=fixture();assert.equal(f.client.consentRecorded(),false);await f.client.consent({ageAtLeast14:true,processingAccepted:true,overseasAccepted:true});assert.equal(f.client.consentRecorded(),true);await f.client.withdraw();assert.equal(f.client.consentRecorded(),false);assert.ok([...f.saved.keys()].some(k=>k.includes('delete-code')));assert.ok(f.calls.every(c=>!('photos'in c.body)&&!('analysisUserText'in c.body)))})
test('lost deletion response is recovered using the same proof without creating a new anonymous user',async()=>{const f=fixture();f.lose();await assert.rejects(f.client.deleteMine());const result=await f.client.deleteMine();assert.equal(result.deleted,true);assert.equal(f.calls.filter(c=>c.url.endsWith('/delete')).length,1);const poll=f.calls.find(c=>c.url.endsWith('delete-status'));assert.equal(poll.headers.Authorization,undefined);assert.equal(poll.body.operationId,id);f.client.clear();assert.equal(f.saved.size,0)})
test('unsuccessful delete receipt never clears local profile or pending intent',async()=>{const saved=new Map();const c=createPrivacyClient({baseUrl:'https://service.example',getAccessToken:async()=> userToken,storage:{getItem:k=>saved.get(k)??null,setItem:(k,v)=>saved.set(k,v),removeItem:k=>saved.delete(k)},makeId:()=>id,makeSecret:()=> 'a'.repeat(64),fetchImpl:async()=>Response.json({deleted:false,operationId:id})});await assert.rejects(c.deleteMine(),{code:'invalid-response'});assert.ok([...saved.keys()].some(k=>k.includes('pending')))})
test('clear report format fits feedback storage and contains only user comment plus displayed output excerpt',()=>{const report=aiReportText('따라하기 위험해요.','의견'.repeat(500),'표시된 답변'.repeat(500));assert.ok(report.startsWith('[AI 답변 신고 v1]'));assert.ok(report.length<=2000);assert.throws(()=>aiReportText('직접 입력하기',' \u200b ',''));assert.throws(()=>aiReportText('unknown','',''));assert.throws(()=>aiReportText('직접 입력하기','x'.repeat(1001),''))})

test('under-age consent sends no registration or analysis input',async()=>{const f=fixture();await assert.rejects(f.client.consent({ageAtLeast14:false,processingAccepted:true,overseasAccepted:true}),{code:'age-required'});assert.equal(f.calls.length,0)})

test('a pending deletion never switches to a different user after lost receipt',async()=>{
 const saved=new Map();let owner=id,calls=0
 const client=createPrivacyClient({baseUrl:'https://service.example',getAccessToken:async()=> 'e30.'+Buffer.from(JSON.stringify({sub:owner})).toString('base64url')+'.sig',storage:{getItem:k=>saved.get(k)??null,setItem:(k,v)=>saved.set(k,v),removeItem:k=>saved.delete(k)},makeId:()=>id,makeSecret:()=> 'a'.repeat(64),fetchImpl:async(url)=>{if(url.endsWith('delete-status'))return Response.json({code:'not-found'},{status:404});calls++;throw Error('lost')}})
 await assert.rejects(client.deleteMine());owner='22222222-2222-4222-8222-222222222222'
 await assert.rejects(client.deleteMine(),{code:'identity-changed'});assert.equal(calls,1)
})

test('processing and overseas transfer each need their own affirmative choice',async()=>{for(const choice of [{processingAccepted:false,overseasAccepted:true},{processingAccepted:true,overseasAccepted:false}]){const f=fixture();await assert.rejects(f.client.consent({ageAtLeast14:true,...choice}),{code:'consent-required'});assert.equal(f.calls.length,0)}})

test('incomplete or mismatched evidence receipt never marks consent as saved',async()=>{
 for(const receipt of [{accepted:true},{accepted:true,documentHash:'a'.repeat(64),eventId:'1',recordedAt:'2026-11-10T00:00:00Z'}]){
  const saved=new Map();const client=createPrivacyClient({baseUrl:'https://service.example',getAccessToken:async()=>userToken,storage:{getItem:k=>saved.get(k)??null,setItem:(k,v)=>saved.set(k,v),removeItem:k=>saved.delete(k)},makeSecret:()=> 'a'.repeat(64),fetchImpl:async(url)=>Response.json(url.endsWith('identity')?{registered:true}:receipt)})
  await assert.rejects(client.consent({ageAtLeast14:true,processingAccepted:true,overseasAccepted:true}),{code:'invalid-response'});assert.equal(client.consentRecorded(),false)
 }
})

test('E03 sends its own disclosure fingerprint rather than the A02 wording',async()=>{const {consentEvidenceHash}=await import('./consent-document.ts');const f=fixture();await f.client.consent({ageAtLeast14:true,processingAccepted:true,overseasAccepted:true,documentSurface:'onboarding'});const body=f.calls.find(c=>c.url.endsWith('/consent')).body;assert.equal(body.documentSurface,'onboarding');assert.equal(body.documentHash,await consentEvidenceHash('onboarding'));assert.notEqual(body.documentHash,await consentEvidenceHash('analysis'))})

import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {randomUUID,createHash} from 'node:crypto'
import {pathToFileURL} from 'node:url'
import {createAnalysisServer} from './server.mjs'
import {createReleaseStore,privacyVersion,consentEvidenceSnapshots} from './release-store.mjs'
import {MatchError} from './matcher.mjs'
import {createPrivacyClient} from '../../src/analysis/privacy-client.ts'
import approval from '../../src/analysis/policy-approval.json' with {type:'json'}

// In-memory PostgreSQL and loopback HTTP only. No hosted Auth, provider, keys or real photos.
const modulePath=process.env.FEEDBACK_PGLITE_MODULE
test('v5 client receipt → HTTP consent → SQL history → photo analysis → withdrawal → deletion', {skip:!modulePath}, async t=>{
 const {PGlite}=await import(pathToFileURL(modulePath).href),db=await PGlite.create()
 t.after(()=>db.close())
 const owner=randomUUID(),other=randomUUID()
 await db.exec('create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key,is_anonymous boolean default true,created_at timestamptz default now(),last_sign_in_at timestamptz);')
 for(const id of [owner,other])await db.query('insert into auth.users(id) values($1)',[id])
 for(const file of ['trial-schema.sql','feedback-schema.sql','release-data.sql','consent-evidence.sql'])await db.exec(await readFile(new URL(file,import.meta.url),'utf8'))
 const dbFetch=async(raw,options={})=>{
  const url=new URL(raw);assert.equal(url.origin,'https://database.fixture.invalid')
  const b=JSON.parse(options.body??'{}');let sql,args
  if(url.pathname==='/rest/v1/rpc/howhouse_release_data'){sql='select public.howhouse_release_data($1,$2,$3::jsonb) as r';args=[b.p_owner,b.p_kind,JSON.stringify(b.p_payload)]}
  else if(url.pathname==='/rest/v1/rpc/howhouse_record_consent'){sql='select public.howhouse_record_consent($1,$2,$3,$4,$5,$6,$7,$8) as r';args=[b.p_owner,b.p_version,b.p_age,b.p_processing,b.p_overseas,b.p_document_hash,b.p_document_text,b.p_surface]}
  else if(url.pathname==='/rest/v1/rpc/howhouse_consent_evidence_state'){sql='select public.howhouse_consent_evidence_state($1,$2,$3) as r';args=[b.p_owner,b.p_version,b.p_document_hashes]}
  else if(url.pathname==='/auth/v1/admin/users/'+owner&&options.method==='DELETE'){await db.query('delete from auth.users where id=$1',[owner]);return new Response(null,{status:204})}
  else throw Error('Unexpected database endpoint')
  return Response.json((await db.query(sql,args)).rows[0].r)
 }
 const storeOptions={supabaseUrl:'https://database.fixture.invalid',secretKey:'sb_secret_synthetic_fixture',encryptionKey:Buffer.alloc(32,4).toString('base64'),fetchImpl:dbFetch}
 // Explicit dependency injection only for this synthetic test; production approval stays false.
 const store=createReleaseStore({...storeOptions,consentApproved:true})
 const blocked=createReleaseStore(storeOptions)
 assert.equal(approval.analysisConsentApproved,false)
 let modelCalls=0,dbDeleted=false
 const catalogText='[]',catalogVersion=createHash('sha256').update(catalogText).digest('hex'),caseId='욕실·수도:1'
 const trial={host:'localhost',origins:['https://localhost'],authenticate:async()=>{
  if(!(await db.query('select 1 from auth.users where id=$1',[owner])).rows.length)throw new MatchError('auth-required')
  return {id:owner}
 },forUser:()=>({ledger:{reserve(){},finish(){},remaining:()=>null}})}
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aN6cAAAAASUVORK5CYII=','base64')
 const server=createAnalysisServer({config:{apiKey:'synthetic-no-provider',model:'gpt-6.1-terra',processingRegion:'us'},catalog:{cases:[{id:caseId}],serialized:catalogText,version:catalogVersion},trial,releaseStore:store,matchImpl:async input=>{
  modelCalls++;assert.equal(input.text,'합성 누수 상황');assert.equal(input.photos.length,1);assert.deepEqual(input.photos[0].bytes,png)
  return {result:{source:'existing',caseId},usage:{}}
 }})
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
 t.after(()=>new Promise(resolve=>server.close(resolve)))
 const base='http://127.0.0.1:'+server.address().port;trial.host=new URL(base).host
 const token='e30.'+Buffer.from(JSON.stringify({sub:owner})).toString('base64url')+'.synthetic'
 const localFetch=(url,options={})=>{assert.equal(new URL(url).origin,base);return fetch(url,{...options,headers:{...options.headers,Origin:'https://localhost'}})}
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}
 const client=createPrivacyClient({baseUrl:base,getAccessToken:async()=>token,storage,fetchImpl:localFetch})
 const session=await(await localFetch(base+'/session',{headers:{Authorization:'Bearer '+token}})).json()
 async function analyze(){const form=new FormData();form.set('requestId',randomUUID());form.set('catalogVersion',catalogVersion);form.set('analysisUserText','합성 누수 상황');form.set('analysisUserPhotos',new File([png],'synthetic.png',{type:'image/png'}));return localFetch(base+'/api/analysis/match',{method:'POST',headers:{Authorization:'Bearer '+token,'X-Howhouse-Session':session.token},body:form})}
 await t.test('refusal/partial choices send no consent and invoke no model',async()=>{
  await assert.rejects(client.consent({ageAtLeast14:true,processingAccepted:true,overseasAccepted:false}),{code:'consent-required'})
  assert.equal((await analyze()).status,428);assert.equal(modelCalls,0);assert.equal(client.consentRecorded(),false)
 })
 await t.test('onboarding and analysis persist exact v5 bodies and allow the synthetic photo path',async()=>{
  for(const surface of ['onboarding','analysis']){
   await client.consent({ageAtLeast14:true,processingAccepted:true,overseasAccepted:true,documentSurface:surface})
   assert.equal(client.consentRecorded(),true)
   const row=(await db.query('select e.document_version,e.document_hash,e.recorded_at,d.document_text from public.howhouse_consent_events e join public.howhouse_consent_documents d using(document_hash) where e.owner_id=$1 order by event_id desc limit 1',[owner])).rows[0]
   assert.equal(row.document_version,privacyVersion);assert.equal(row.document_hash,consentEvidenceSnapshots[surface].hash);assert.equal(row.document_text,consentEvidenceSnapshots[surface].text);assert.ok(row.recorded_at)
   const r=await analyze();assert.equal(r.status,200);assert.equal((await r.json()).result.caseId,caseId)
   await client.withdraw();assert.equal(client.consentRecorded(),false);assert.equal((await analyze()).status,428)
  }
  assert.equal(modelCalls,2)
 })
 await t.test('unapproved production dependency still refuses new consent even when DB evidence exists',async()=>{
  const snapshot=consentEvidenceSnapshots.analysis
  await assert.rejects(blocked.acceptConsent(owner,privacyVersion,true,true,true,snapshot.hash,'analysis'),{code:'policy-not-approved'})
  assert.equal(await blocked.hasConsent(owner),false)
 })
 await t.test('deletion clears only the test owner history; shared document and other user survive',async()=>{
  await client.consent({ageAtLeast14:true,processingAccepted:true,overseasAccepted:true})
  await client.deleteMine();dbDeleted=true
  assert.equal((await db.query('select count(*)::int n from public.howhouse_consent_events where owner_id=$1',[owner])).rows[0].n,0)
  assert.equal((await db.query('select count(*)::int n from auth.users where id=$1',[owner])).rows[0].n,0)
  assert.equal((await db.query('select count(*)::int n from auth.users where id=$1',[other])).rows[0].n,1)
  assert.equal((await db.query('select count(*)::int n from public.howhouse_consent_documents')).rows[0].n,2)
  assert.equal(modelCalls,2)
 })
 assert.equal(dbDeleted,true);assert.equal(approval.analysisConsentApproved,false)
})

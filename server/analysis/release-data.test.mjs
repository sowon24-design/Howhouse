import test from 'node:test'
import assert from 'node:assert/strict'
import {randomUUID} from 'node:crypto'
import {readFile} from 'node:fs/promises'
import {pathToFileURL} from 'node:url'
import {createReleaseStore,privacyVersion,consentEvidenceSnapshots} from './release-store.mjs'
const modulePath=process.env.FEEDBACK_PGLITE_MODULE
test('release privacy SQL: ownership, deletion retry, retention, idle queues and permissions',{skip:!modulePath},async t=>{
 const {PGlite}=await import(pathToFileURL(modulePath).href),db=await PGlite.create();t.after(()=>db.close())
 const owner=randomUUID(),other=randomUUID(),inactive=randomUUID()
 await db.exec('create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key,is_anonymous boolean default true,created_at timestamptz default now(),last_sign_in_at timestamptz);')
 for(const id of [owner,other,inactive])await db.query('insert into auth.users(id) values($1)',[id])
 await db.exec(await readFile(new URL('./trial-schema.sql',import.meta.url),'utf8'));await db.exec(await readFile(new URL('./feedback-schema.sql',import.meta.url),'utf8'));await db.exec(await readFile(new URL('./release-data.sql',import.meta.url),'utf8'))
 const call=async(owner,kind,payload={})=>(await db.query('select public.howhouse_release_data($1,$2,$3::jsonb) as r',[owner,kind,JSON.stringify(payload)])).rows[0].r
 await t.test('separate consent receipts reject partial acceptance, legacy receipts require consent again, and withdrawal clears both',async()=>{
  assert.equal((await call(owner,'touch')).ok,true)
  assert.equal((await call(owner,'identity',{deleteHash:'a'.repeat(64)})).ok,true)
  // A legacy combined receipt must not silently count as either separate consent.
  await db.query("update public.howhouse_release_users set consent_version='v1',age_at_least_14=true where owner_id=$1",[owner])
  assert.equal((await call(owner,'consent-state',{version:'v1'})).data.accepted,false)
  for(const flags of [{},{processingAccepted:true},{overseasAccepted:true},{processingAccepted:true,overseasAccepted:false}]){
   assert.equal((await call(owner,'consent',{version:'v1',ageAtLeast14:true,...flags})).code,'consent-required')
  }
  assert.equal((await call(owner,'consent',{version:'v1',ageAtLeast14:true,processingAccepted:true,overseasAccepted:true})).data.accepted,true)
  let row=(await db.query('select * from public.howhouse_release_users where owner_id=$1',[owner])).rows[0]
  assert.equal(row.processing_accepted,true);assert.equal(row.overseas_accepted,true)
  assert.equal(row.processing_consent_version,'v1');assert.equal(row.overseas_consent_version,'v1')
  assert.ok(row.processing_consent_at);assert.ok(row.overseas_consent_at)
  assert.equal((await call(owner,'consent-state',{version:'v1'})).data.accepted,true)
  assert.equal((await call(owner,'consent-state',{version:'v2'})).data.accepted,false)
  assert.equal((await call(owner,'consent',{version:null})).data.accepted,false)
  row=(await db.query('select * from public.howhouse_release_users where owner_id=$1',[owner])).rows[0]
  assert.equal(row.processing_accepted,false);assert.equal(row.overseas_accepted,false)
  assert.equal(row.processing_consent_version,null);assert.equal(row.overseas_consent_version,null)
  assert.equal((await call(owner,'consent-state',{version:'v1'})).data.accepted,false)
 })
 await t.test('own rows are deleted atomically, another user survives and deletion receipts have no public owner leak',async()=>{
  for(const id of [owner,other])await db.query("insert into public.howhouse_trial_calls(request_id,owner_id,state) values($1,$2,'completed')",[randomUUID(),id])
  const operationId=randomUUID(),proof='b'.repeat(64),payload={operationId,proof,confirm:'delete-my-data'}
  assert.equal((await call(owner,'begin-delete',payload)).data.state,'data-deleted');assert.equal((await call(owner,'touch')).code,'auth-required')
  assert.equal((await db.query('select count(*)::int as n from public.howhouse_trial_calls where owner_id=$1',[owner])).rows[0].n,0)
  assert.equal((await db.query('select count(*)::int as n from public.howhouse_trial_calls where owner_id=$1',[other])).rows[0].n,1)
  assert.equal((await call(other,'begin-delete',payload)).code,'conflict');assert.equal((await call(null,'delete-status',{operationId,proof:'c'.repeat(64)})).code,'not-found')
  await db.query("update public.howhouse_deletion_jobs set expires_at=now()-interval '2 days' where operation_id=$1",[operationId]);assert.equal((await call(null,'delete-status',{operationId,proof})).data.state,'data-deleted');assert.equal((await call(null,'finish-delete',{operationId,proof})).data.state,'completed');assert.equal((await db.query('select owner_id from public.howhouse_deletion_jobs where operation_id=$1',[operationId])).rows[0].owner_id,null);assert.equal((await db.query('select expires_at>now() as recoverable from public.howhouse_deletion_jobs where operation_id=$1',[operationId])).rows[0].recoverable,true)
 })
 await t.test('expired cached answers and old call records are purged; inactive Auth accounts are queued, not directly deleted',async()=>{
  await db.query("insert into public.howhouse_trial_answers(owner_id,input_key,encrypted_value,expires_at) values($1,$2,'{}',now()-interval '1 second')",[other,'a'.repeat(64)])
  await db.query("insert into public.howhouse_trial_calls(request_id,owner_id,state,created_at) values($1,$2,'completed',now()-interval '31 days')",[randomUUID(),other])
  await db.query("update auth.users set created_at=now()-interval '91 days' where id=$1",[inactive]);await db.exec('select public.howhouse_release_cleanup()')
  assert.equal((await db.query('select count(*)::int as n from public.howhouse_trial_answers')).rows[0].n,0)
  assert.equal((await db.query('select count(*)::int as n from public.howhouse_trial_calls where owner_id=$1',[other])).rows[0].n,1)
  assert.equal((await db.query('select count(*)::int as n from public.howhouse_deletion_jobs where owner_id=$1',[inactive])).rows[0].n,1)
  assert.equal((await db.query('select count(*)::int as n from auth.users where id=$1',[inactive])).rows[0].n,1)
 })
 await t.test('application roles cannot inspect receipts or run deletion/cleanup RPC',async()=>{for(const role of ['anon','authenticated']){await db.exec('set role '+role);await assert.rejects(db.exec('select * from public.howhouse_deletion_jobs'));await assert.rejects(call(other,'begin-delete',{}));await db.exec('reset role')}})
})
test('store forwards both separately checked choices to the database, including withdrawal',async()=>{
 const owner=randomUUID(),payloads=[]
 const store=createReleaseStore({consentApproved:true,supabaseUrl:'https://project.supabase.co',secretKey:'sb_secret_mock',encryptionKey:Buffer.alloc(32,7).toString('base64'),fetchImpl:async(_url,options)=>{
  payloads.push(JSON.parse(options.body))
  return Response.json({ok:true,data:{accepted:true}})
 }})
 await assert.rejects(store.acceptConsent(owner,privacyVersion,true,true,false),{code:'invalid-input'})
 assert.equal(payloads.length,0)
 await store.acceptConsent(owner,privacyVersion,true,true,true,consentEvidenceSnapshots.analysis.hash,'analysis')
 assert.equal(payloads[0].p_version,privacyVersion);assert.equal(payloads[0].p_age,true);assert.equal(payloads[0].p_processing,true);assert.equal(payloads[0].p_overseas,true);assert.equal(payloads[0].p_document_hash,consentEvidenceSnapshots.analysis.hash)
 await store.acceptConsent(owner,null,undefined,undefined,undefined)
 assert.equal(payloads[1].p_processing,false);assert.equal(payloads[1].p_overseas,false)
})

test('Auth deletion failure never reports success; private receipt retry completes without a live user token',async()=>{
 let fail=true,state='data-deleted',deletes=0;const owner=randomUUID(),op=randomUUID(),proof='a'.repeat(64)
 const store=createReleaseStore({consentApproved:true,supabaseUrl:'https://project.supabase.co',secretKey:'sb_secret_mock',encryptionKey:Buffer.alloc(32,7).toString('base64'),fetchImpl:async(url,options)=>{
  assert.equal(options.headers.Authorization,undefined)
  if(url.includes('/auth/v1/admin/users/')){deletes++;if(fail){fail=false;return Response.json({}, {status:503})}return Response.json({})}
  const body=JSON.parse(options.body);if(body.p_kind==='finish-delete')state='completed'
  return Response.json({ok:true,data:{state,owner}})
 }})
 await assert.rejects(store.deleteMine(owner,{operationId:op,proof,confirm:'delete-my-data'}),{code:'storage-unavailable'})
 assert.equal((await store.deletionStatus({operationId:op,proof})).deleted,true);assert.equal(deletes,2)
})

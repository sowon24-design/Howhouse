import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {randomUUID,createHash} from 'node:crypto'
import {pathToFileURL} from 'node:url'
import {createReleaseStore,consentEvidenceSnapshots,privacyVersion} from './release-store.mjs'
import {consentEvidenceJson,consentEvidenceHash,consentEvidenceDocument} from '../../src/analysis/consent-document.ts'
const currentConsentHash=consentEvidenceSnapshots.analysis.hash,consentDocumentJson=consentEvidenceJson('analysis')

test('browser and server hash the same displayed disclosure including checkbox wording',async()=>{
 assert.equal(await consentEvidenceHash('analysis'),currentConsentHash)
 assert.equal(await consentEvidenceHash('onboarding'),consentEvidenceSnapshots.onboarding.hash)
 assert.notEqual(consentEvidenceSnapshots.onboarding.hash,currentConsentHash)
 assert.equal(consentEvidenceDocument('onboarding').checkboxLabels.processing,'[선택] 개인정보 수집·이용 동의')
 const snapshot=JSON.parse(consentDocumentJson)
 assert.equal(snapshot.version,privacyVersion)
 assert.ok(snapshot.checkboxLabels.processing&&snapshot.checkboxLabels.overseas&&snapshot.documents.processing.length)
})

test('RPC receives explicit choices and server-owned snapshot; changed or missing app hash is rejected',async()=>{
 const calls=[],owner=randomUUID()
 const store=createReleaseStore({consentApproved:true,supabaseUrl:'https://project.supabase.co',secretKey:'sb_secret_test',encryptionKey:Buffer.alloc(32,7).toString('base64'),fetchImpl:async(url,options)=>{calls.push({url,body:JSON.parse(options.body)});return Response.json({ok:true,data:{accepted:true}})}})
 for(const args of [[privacyVersion,true,true,true,undefined],[privacyVersion,true,true,true,'a'.repeat(64)],[privacyVersion,true,false,true,currentConsentHash],['old',true,true,true,currentConsentHash]])await assert.rejects(store.acceptConsent(owner,...args,'analysis'),{code:'invalid-input'})
 assert.equal(calls.length,0)
 await store.acceptConsent(owner,privacyVersion,true,true,true,currentConsentHash,'analysis')
 assert.ok(calls[0].url.endsWith('/howhouse_record_consent'))
 assert.deepEqual(calls[0].body,{p_owner:owner,p_version:privacyVersion,p_age:true,p_processing:true,p_overseas:true,p_document_hash:currentConsentHash,p_document_text:consentDocumentJson,p_surface:'analysis'})
 await store.acceptConsent(owner,null)
 assert.equal(calls[1].body.p_document_text,null)
})

const modulePath=process.env.FEEDBACK_PGLITE_MODULE
test('additive consent migration: immutable disclosure, history, rollback, legacy state, ownership and deletion',{skip:!modulePath},async t=>{
 const {PGlite}=await import(pathToFileURL(modulePath).href),db=await PGlite.create();t.after(()=>db.close())
 const owner=randomUUID(),other=randomUUID()
 await db.exec('create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key,is_anonymous boolean default true,created_at timestamptz default now(),last_sign_in_at timestamptz);')
 for(const id of [owner,other])await db.query('insert into auth.users(id) values($1)',[id])
 for(const name of ['trial-schema.sql','feedback-schema.sql','release-data.sql'])await db.exec(await readFile(new URL(name,import.meta.url),'utf8'))
 const legacy=async(id,kind,payload)=>(await db.query('select public.howhouse_release_data($1,$2,$3::jsonb) r',[id,kind,JSON.stringify(payload)])).rows[0].r
 for(const id of [owner,other])await legacy(id,'identity',{deleteHash:id===owner?'a'.repeat(64):'b'.repeat(64)})
 await legacy(owner,'consent',{version:'2026-11-10-v2',ageAtLeast14:true,processingAccepted:true,overseasAccepted:true})
 const migration=await readFile(new URL('consent-evidence.sql',import.meta.url),'utf8');await db.exec(migration);await db.exec(migration)
 const record=async(id,version=privacyVersion,hash=currentConsentHash,text=consentDocumentJson,processing=true,overseas=true,surface='analysis')=>(await db.query('select public.howhouse_record_consent($1,$2,true,$3,$4,$5,$6,$7) r',[id,version,processing,overseas,hash,text,surface])).rows[0].r
 const state=async(id,version=privacyVersion,hash=currentConsentHash)=>(await db.query('select public.howhouse_consent_evidence_state($1,$2,$3) r',[id,version,[hash]])).rows[0].r.accepted
 await t.test('legacy consent is preserved but never fabricated into new evidence',async()=>{
  assert.equal(await state(owner),false)
  assert.equal((await db.query('select consent_version from public.howhouse_release_users where owner_id=$1',[owner])).rows[0].consent_version,'2026-11-10-v2')
  assert.equal((await db.query('select count(*)::int n from public.howhouse_consent_events')).rows[0].n,0)
 })
 await t.test('missing choice/hash fails without changing state; successful receipt identifies exact document and server time',async()=>{
  assert.equal((await record(owner,privacyVersion,currentConsentHash,consentDocumentJson,false)).ok,false)
  assert.equal((await record(owner,privacyVersion,'a'.repeat(64))).ok,false)
  const receipt=(await record(owner)).data;assert.equal(receipt.accepted,true);assert.equal(receipt.documentHash,currentConsentHash);assert.ok(receipt.eventId&&receipt.recordedAt)
  assert.equal(await state(owner),true);assert.equal(await state(other),false)
  assert.equal((await db.query('select state from public.howhouse_legacy_consent_states where owner_id=$1',[owner])).rows[0].state.consent_version,'2026-11-10-v2')
  assert.equal((await db.query('select document_text from public.howhouse_consent_documents')).rows[0].document_text,consentDocumentJson)
 })
 await t.test('changing body without a new version rolls back both current state and event',async()=>{
  const text=consentDocumentJson+' ',hash=createHash('sha256').update(text).digest('hex')
  await assert.rejects(record(owner,privacyVersion,hash,text))
  assert.equal(await state(owner),true)
  assert.equal((await db.query('select count(*)::int n from public.howhouse_consent_events')).rows[0].n,1)
 })
 await t.test('withdrawal keeps previous evidence; a new acceptance appends rather than overwrites',async()=>{
  assert.equal((await record(owner,null,null,null)).data.accepted,false);assert.equal(await state(owner),false)
  const rows=(await db.query('select * from public.howhouse_consent_events where owner_id=$1 order by event_id',[owner])).rows
  assert.deepEqual(rows.map(r=>r.action),['accepted','withdrawn']);assert.equal(rows[1].document_hash,currentConsentHash)
  assert.equal(rows[0].processing_accepted,true);assert.equal(rows[1].overseas_accepted,false)
  await record(owner);await record(other)
 })
 await t.test('onboarding and analysis snapshots both authorize analysis while retaining their own wording',async()=>{
  const document=consentEvidenceSnapshots.onboarding
  await record(other,privacyVersion,document.hash,document.text,true,true,'onboarding')
  assert.equal(await state(other,privacyVersion,document.hash),true)
  assert.equal(await state(other),false)
  const allHashes=Object.values(consentEvidenceSnapshots).map(d=>d.hash)
  assert.equal((await db.query('select public.howhouse_consent_evidence_state($1,$2,$3) r',[other,privacyVersion,allHashes])).rows[0].r.accepted,true)
  await db.query('update public.howhouse_release_users set overseas_accepted=false where owner_id=$1',[other])
  assert.equal((await db.query('select public.howhouse_consent_evidence_state($1,$2,$3) r',[other,privacyVersion,allHashes])).rows[0].r.accepted,false)
  await record(other)
 })
 await t.test('app roles cannot inspect evidence or call RPC; service role cannot rewrite history',async()=>{
  for(const role of ['anon','authenticated']){
   await db.exec('set role '+role)
   await assert.rejects(db.exec('select * from public.howhouse_consent_events'));await assert.rejects(db.exec('select * from public.howhouse_legacy_consent_states'))
   await assert.rejects(record(owner));await db.exec('reset role')
  }
  await db.exec('set role service_role');await assert.rejects(db.exec("update public.howhouse_consent_events set action='withdrawn'"));await db.exec('reset role')
 })
 await t.test('Auth deletion cascades only that users evidence, keeping shared disclosure and other users',async()=>{
  await db.query('delete from auth.users where id=$1',[owner])
  assert.equal((await db.query('select count(*)::int n from public.howhouse_consent_events where owner_id=$1',[owner])).rows[0].n,0)
  assert.equal(await state(other),true)
  assert.equal((await db.query('select count(*)::int n from public.howhouse_legacy_consent_states where owner_id=$1',[owner])).rows[0].n,0)
  assert.equal((await db.query('select count(*)::int n from public.howhouse_consent_documents')).rows[0].n,2)
 })
})

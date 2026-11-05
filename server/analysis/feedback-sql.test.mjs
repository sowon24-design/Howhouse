import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { randomUUID } from 'node:crypto'
import { createFeedbackStore } from './feedback-store.mjs'
import { createFeedbackService, FeedbackError } from './feedback.mjs'

// Optional separate validation engine. Never added to the application's dependencies or connected to Supabase.
const modulePath = process.env.FEEDBACK_PGLITE_MODULE
test('actual PostgreSQL feedback SQL: transactions, ordering, deduplication, source ownership, RLS and expiry', { skip: !modulePath }, async t => {
  const { PGlite } = await import(pathToFileURL(modulePath).href)
  const db = await PGlite.create(); t.after(() => db.close())
  const owner = '11111111-1111-4111-8111-111111111111', other = '33333333-3333-4333-8333-333333333333'
  const generatedId = '22222222-2222-4222-8222-222222222222'
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create table auth.users(id uuid primary key);
    insert into auth.users(id) values('${owner}'),('${other}');`)
  await db.exec(await readFile(new URL('./feedback-schema.sql',import.meta.url),'utf8'))
  const store = createFeedbackStore({ supabaseUrl:'https://mock.supabase.co',secretKey:'sb_secret_mock',encryptionKey:Buffer.alloc(32,7).toString('base64'),retentionDays:30,
    fetchImpl: async (_,options) => {
      const p=JSON.parse(options.body)
      const response=await db.query('select public.howhouse_feedback($1::uuid,$2::text,$3::jsonb,$4::text,$5::integer) as result',
        [p.p_owner,p.p_kind,JSON.stringify(p.p_payload),p.p_hash,p.p_days])
      return Response.json(response.rows[0].result)
    } })
  const service=createFeedbackService({store,catalog:{cases:[{id:'욕실·수도:1'}]}})
  const count=async table => (await db.query(`select count(*)::int as n from public.${table}`)).rows[0].n
  const expectCode=code=>error=>error instanceof FeedbackError&&error.code===code
  await t.test('no policy chosen means no writes, even with a server retention setting',async()=>{
    await assert.rejects(store.recordResult(owner,generatedId,{source:'generated'}),expectCode('feedback-not-configured'))
    assert.equal(await count('howhouse_feedback_results'),0)
  })
  // This is an isolated test fixture; no real product retention policy is selected.
  await db.exec('insert into public.howhouse_feedback_policy values(true,30,true);')
  await store.recordResult(owner,generatedId,{source:'generated'})
  for(const result of [{source:'existing',caseId:'욕실·수도:1'},{source:'generated',resultId:`generated:${generatedId}`}]) {
    await t.test(`${result.source}: select, switch, clear, reversed arrivals, fast duplicate and stable receipts`,async()=>{
      let revision=0
      for(const rating of ['like','dislike',null]) {
        const response=await service.handle('rating',owner,{result,operationId:randomUUID(),revision:++revision,rating})
        assert.equal(response.saved,true);assert.equal(typeof response.submittedAt,'string')
        const state=await service.handle('state',owner,{result});assert.equal(state.rating,rating);assert.equal(state.revision,revision)
      }
      const latest={result,operationId:randomUUID(),revision:10,rating:'dislike'}
      await service.handle('rating',owner,latest)
      await assert.rejects(service.handle('rating',owner,{result,operationId:randomUUID(),revision:9,rating:'like'}),expectCode('stale-selection'))
      assert.equal((await service.handle('state',owner,{result})).rating,'dislike')
      assert.equal((await service.handle('rating',owner,latest)).duplicate,true)
      await assert.rejects(service.handle('rating',owner,{...latest,revision:11,rating:'like'}),expectCode('idempotency-conflict'))
      const click={result,operationId:randomUUID(),revision:11,rating:'like'}
      const responses=await Promise.all([service.handle('rating',owner,click),service.handle('rating',owner,click)])
      assert.equal(responses.filter(r=>r.duplicate).length,1)
      assert.equal((await service.handle('state',owner,{result})).revision,11)
      const tombstone={result,operationId:randomUUID(),revision:12,rating:null}
      await service.handle('rating',owner,tombstone)
      await assert.rejects(service.handle('rating',owner,{result,operationId:randomUUID(),revision:11,rating:'dislike'}),expectCode('stale-selection'))
    })
    await t.test(`${result.source}: opinion submission is separate from rating and retry stores one encrypted opinion`,async()=>{
      const before=await service.handle('state',owner,{result})
      const payload={result,operationId:randomUUID(),reason:'custom',text:'  실제 SQL 검증용 의견  '}
      const n=await count('howhouse_feedback_opinions')
      const first=await service.handle('opinions',owner,payload), second=await service.handle('opinions',owner,payload)
      assert.equal(second.duplicate,true);assert.equal(first.submittedAt,second.submittedAt)
      assert.equal(await count('howhouse_feedback_opinions'),n+1)
      assert.deepEqual(await service.handle('state',owner,{result}),before)
      const rows=await db.query('select encrypted_comment from public.howhouse_feedback_opinions where operation_id=$1',[payload.operationId])
      assert.equal(JSON.stringify(rows.rows).includes('실제 SQL 검증용 의견'),false)
      for(const text of ['',' \t\n','\u200b'])await assert.rejects(service.handle('opinions',owner,{...payload,operationId:randomUUID(),text}),expectCode('invalid-input'))
      assert.equal(await count('howhouse_feedback_opinions'),n+1)
      await service.handle('opinions',owner,{result,operationId:randomUUID(),reason:'unsafe-method'})
      assert.equal(await count('howhouse_feedback_opinions'),n+2)
    })
    await t.test(`${result.source}: DB failure after writing a choice rolls back the entire operation`,async()=>{
      const before=await service.handle('state',owner,{result}), n=await count('howhouse_feedback_opinions')
      await db.exec(`create or replace function public.feedback_test_failure() returns trigger language plpgsql as $$begin raise exception 'mock storage failure';end$$;
        create trigger feedback_test_failure before insert on public.howhouse_feedback_operations for each row execute function public.feedback_test_failure();`)
      await assert.rejects(service.handle('rating',owner,{result,operationId:randomUUID(),revision:20,rating:'dislike'}),expectCode('storage-unavailable'))
      await assert.rejects(service.handle('opinions',owner,{result,operationId:randomUUID(),reason:'custom',text:'실패 검사'}),expectCode('storage-unavailable'))
      await db.exec('drop trigger feedback_test_failure on public.howhouse_feedback_operations;drop function public.feedback_test_failure();')
      assert.deepEqual(await service.handle('state',owner,{result}),before);assert.equal(await count('howhouse_feedback_opinions'),n)
    })
  }
  await t.test('different users and existing-result requests cannot forge generated ownership',async()=>{
    const result={source:'generated',resultId:`generated:${generatedId}`}
    await assert.rejects(service.handle('state',other,{result}),expectCode('result-unavailable'))
    const existingRequest=randomUUID();await store.recordResult(owner,existingRequest,{source:'existing',caseId:'욕실·수도:1'})
    await assert.rejects(service.handle('state',owner,{result:{source:'generated',resultId:`generated:${existingRequest}`}}),expectCode('result-unavailable'))
    assert.equal((await service.handle('state',other,{result:{source:'existing',caseId:'욕실·수도:1'}})).revision,0)
  })
  await t.test('RLS and privileges prevent direct reads/writes and RPC access by application users',async()=>{
    for(const role of ['anon','authenticated']) {
      for(const table of ['howhouse_feedback_results','howhouse_feedback_ratings','howhouse_feedback_opinions','howhouse_feedback_operations','howhouse_feedback_policy']) {
        const r=await db.query(`select c.relrowsecurity as rls,has_table_privilege($1,c.oid,'SELECT') as can_read,has_table_privilege($1,c.oid,'INSERT') as can_write
          from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname=$2`,[role,table])
        assert.deepEqual(r.rows[0],{rls:true,can_read:false,can_write:false})
      }
      await db.exec(`set role ${role};`)
      try {
        await assert.rejects(db.query('select * from public.howhouse_feedback_opinions'),/permission denied/)
        await assert.rejects(db.query('select public.howhouse_feedback($1,$2,$3,$4,$5)',[owner,'state','{}',null,30]),/permission denied/)
      } finally { await db.exec('reset role;') }
    }
  })
  await t.test('expired rows are not readable and purge deletes feedback without touching auth users',async()=>{
    const tables=['howhouse_feedback_results','howhouse_feedback_ratings','howhouse_feedback_opinions','howhouse_feedback_operations']
    for(const table of tables)await db.exec(`update public.${table} set expires_at=now()-interval '1 second';`)
    const state=await service.handle('state',owner,{result:{source:'existing',caseId:'욕실·수도:1'}})
    assert.equal(state.revision,0);assert.equal(state.rating,null)
    await db.query('select public.howhouse_feedback_purge();')
    for(const table of tables)assert.equal(await count(table),0)
    assert.equal((await db.query('select count(*)::int as n from auth.users')).rows[0].n,2)
  })
})

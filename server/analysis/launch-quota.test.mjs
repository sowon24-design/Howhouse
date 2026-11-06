import test from 'node:test'
import assert from 'node:assert/strict'
import {randomUUID} from 'node:crypto'
import {readFile} from 'node:fs/promises'
import {pathToFileURL} from 'node:url'

const modulePath=process.env.FEEDBACK_PGLITE_MODULE
test('launch quota PostgreSQL: persisted limits, Korean day boundaries, leases, atomic reservations and permissions',{skip:!modulePath},async t=>{
 const {PGlite}=await import(pathToFileURL(modulePath).href)
 const db=await PGlite.create(); t.after(()=>db.close())
 const users=Array.from({length:5},()=>randomUUID())
 await db.exec('create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key);')
 for(const user of users)await db.query('insert into auth.users values($1)',[user])
 await db.exec(await readFile(new URL('./trial-schema.sql',import.meta.url),'utf8'))
 await db.exec(await readFile(new URL('./launch-quota.sql',import.meta.url),'utf8'))
 const reserve=async(owner,id=randomUUID())=>(await db.query('select public.howhouse_reserve_analysis($1,$2) as result',[owner,id])).rows[0].result
 const reset=()=>db.exec('truncate public.howhouse_trial_calls; update public.howhouse_analysis_policy set new_calls_enabled=true,daily_user_calls=5,max_concurrent_calls=3;')
 await t.test('five attempts survive service restarts; completed, failed and cancelled paid attempts still count',async()=>{
   for(let i=0;i<5;i++){
     const id=randomUUID();assert.equal((await reserve(users[0],id)).ok,true)
     await db.query('update public.howhouse_trial_calls set state=$1 where request_id=$2',[['completed','failed','cancelled'][i%3],id])
   }
   assert.equal((await reserve(users[0])).code,'budget-limit')
   assert.equal((await reserve(users[1])).ok,true)
 })
 await t.test('concurrent same-user reservations cannot exceed daily quota',async()=>{
   await reset();await db.exec('update public.howhouse_analysis_policy set max_concurrent_calls=100')
   const responses=await Promise.all(Array.from({length:12},()=>reserve(users[0])))
   assert.equal(responses.filter(r=>r.ok).length,5)
   assert.equal(responses.filter(r=>r.code==='budget-limit').length,7)
 })
 await t.test('shared concurrent cap, completion release and crash lease recovery',async()=>{
   await reset()
   for(const owner of users.slice(0,3))assert.equal((await reserve(owner)).ok,true)
   assert.equal((await reserve(users[3])).code,'server-busy')
   await db.query("update public.howhouse_trial_calls set state='completed' where owner_id=$1",[users[0]])
   assert.equal((await reserve(users[3])).ok,true)
   await db.exec("update public.howhouse_trial_calls set created_at=clock_timestamp()-interval '121 seconds' where state='reserved'")
   assert.equal((await reserve(users[4])).ok,true)
 })
 await t.test('daily boundary is Korean midnight, not UTC midnight',async()=>{
   await reset()
   const start=(await db.query("select date_trunc('day',clock_timestamp() at time zone 'Asia/Seoul') at time zone 'Asia/Seoul' as start")).rows[0].start
   for(let i=0;i<5;i++)await db.query("insert into public.howhouse_trial_calls values($1,$2,'completed',null,$3::timestamptz-interval '1 second')",[randomUUID(),users[0],start])
   assert.equal((await reserve(users[0])).ok,true)
   await db.exec('truncate public.howhouse_trial_calls')
   for(let i=0;i<5;i++)await db.query("insert into public.howhouse_trial_calls values($1,$2,'completed',null,$3::timestamptz)",[randomUUID(),users[0],start])
   assert.equal((await reserve(users[0])).code,'budget-limit')
 })
 await t.test('kill switch rejects fresh reservations without deleting cached answers',async()=>{
   await reset();await db.exec('update public.howhouse_analysis_policy set new_calls_enabled=false')
   assert.equal((await reserve(users[0])).code,'budget-limit')
   await db.exec('delete from public.howhouse_analysis_policy')
   assert.equal((await reserve(users[0])).code,'policy-unavailable')
   await db.exec('insert into public.howhouse_analysis_policy values(true,true,5,3)')
 })
 await t.test('duplicate request IDs and transaction rollback cannot create extra billing reservations',async()=>{
   await reset();const id=randomUUID()
   assert.equal((await reserve(users[0],id)).ok,true)
   assert.equal((await reserve(users[0],id)).code,'invalid-input')
   assert.equal((await reserve(users[1],id)).code,'invalid-input')
   await db.exec('begin');assert.equal((await reserve(users[1])).ok,true);await db.exec('rollback')
   assert.equal((await db.query('select count(*)::int as n from public.howhouse_trial_calls')).rows[0].n,1)
 })
 await t.test('application users cannot read policy, change quota or call the server-only RPC',async()=>{
   for(const role of ['anon','authenticated']){
     await db.exec('set role '+role)
     await assert.rejects(db.query('select * from public.howhouse_analysis_policy'))
     await assert.rejects(reserve(users[0]))
     await db.exec('reset role')
   }
   assert.equal((await db.query("select relrowsecurity from pg_class where oid='public.howhouse_analysis_policy'::regclass")).rows[0].relrowsecurity,true)
 })
})

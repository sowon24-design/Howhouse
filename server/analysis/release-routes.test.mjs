import test from 'node:test'
import assert from 'node:assert/strict'
import {createAnalysisServer} from './server.mjs'
import {MatchError} from './matcher.mjs'
import {createTrialAccess} from './trial-access.mjs'
test('reviewer authorization comes only from verified Auth app_metadata',async()=>{
 const owner='11111111-1111-4111-8111-111111111111'
 const base={id:owner,role:'authenticated',email_confirmed_at:'2026-11-06',is_anonymous:false}
 for(const [extra,allowed] of [[{user_metadata:{howhouse_reviewer:true}},false],[{app_metadata:{howhouse_reviewer:true}},true],[{is_anonymous:true,app_metadata:{howhouse_reviewer:true}},false]]){
  const authenticate=createTrialAccess({supabaseUrl:'https://project.supabase.co',publishableKey:'sb_publishable_test',fetchImpl:async()=>Response.json({...base,...extra})})
  const user=await authenticate('Bearer '+'x'.repeat(32));assert.equal(user.reviewer===true,allowed)
 }
})
test('private operations deny normal users; missing consent prevents any provider call; deletion polls need no stale JWT',async t=>{
 let modelCalls=0,polls=0
 const trial={host:'localhost',origins:['https://localhost'],authenticate:async auth=>{if(!auth)throw new MatchError('auth-required');return {id:'11111111-1111-4111-8111-111111111111',...(auth==='Bearer admin'?{reviewer:true}:{})}},forUser:()=>({ledger:{reserve(){},finish(){},remaining:()=>null}})}
 const releaseStore={touch:async()=>{},hasConsent:async()=>false,listFeedback:async()=>({items:[],next:null}),deletionStatus:async()=>{polls++;return {operationId:'test',deleted:true}}}
 const server=createAnalysisServer({config:{apiKey:'mock',model:'gpt-6.1-terra'},catalog:{cases:[],serialized:'[]',version:'x'},trial,releaseStore,matchImpl:async()=>{modelCalls++}})
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>server.close(resolve)))
 const url='http://127.0.0.1:'+server.address().port;trial.host=new URL(url).host
 const headers={Origin:'https://localhost','Content-Type':'application/json',Authorization:'Bearer user'}
 const denied=await fetch(url+'/api/ops/feedback',{method:'POST',headers,body:JSON.stringify({reviewer:true})});assert.equal(denied.status,403)
 assert.equal((await fetch(url+'/api/ops/feedback',{method:'POST',headers:{...headers,Authorization:'Bearer admin'},body:'{}'})).status,200)
 const session=await (await fetch(url+'/session',{headers})).json()
 const gated=await fetch(url+'/api/analysis/match',{method:'POST',headers:{...headers,'X-Howhouse-Session':session.token},body:'{}'});assert.equal(gated.status,428);assert.equal((await gated.json()).code,'consent-required');assert.equal(modelCalls,0)
 assert.equal((await fetch(url+'/api/privacy/delete-status',{method:'POST',headers:{Origin:'https://localhost','Content-Type':'application/json'},body:'{}'})).status,200);assert.equal(polls,1)
})

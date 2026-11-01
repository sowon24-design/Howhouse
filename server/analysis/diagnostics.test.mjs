import test from 'node:test'
import assert from 'node:assert/strict'
import {createAnalysisService} from './service.mjs'
import {MatchError,matchCase} from './matcher.mjs'
const config={apiKey:'not-a-real-key',model:'gpt-6.1-terra'},catalog={version:'test',cases:[{id:'test:1'}]}
const result={source:'existing',caseId:'test:1'}
for(const stage of ['answer-read','call-reserve','call-finish'])test(`diagnostic distinguishes ${stage} without leaking original error`,async()=>{
 const privateError=()=>{throw new Error('private database details')}
 const service=createAnalysisService({config,catalog,cache:{key:()=> 'test',get:stage==='answer-read'?privateError:()=>undefined},ledger:{reserve:stage==='call-reserve'?privateError:()=>{},finish:stage==='call-finish'?privateError:()=>{}},matchImpl:async()=>({result,usage:{}})})
 await assert.rejects(service({text:'not logged',photos:[]},{requestId:'test',signal:new AbortController().signal}),error=>error instanceof MatchError&&error.code==='api-error'&&error.diagnostic===`${stage}-failed`&&!error.message.includes('private'))
})
test('incomplete provider response has a fixed diagnostic and no raw provider text',async()=>{
 await assert.rejects(matchCase({...config,catalog,text:'not logged',photos:[],signal:new AbortController().signal,fetchImpl:async()=>Response.json({status:'incomplete',output:[],private:'never expose'})}),{code:'api-error',diagnostic:'provider-incomplete'})
})

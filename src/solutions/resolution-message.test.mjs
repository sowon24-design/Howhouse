import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {stripTypeScriptTypes} from 'node:module'
import {messageBody,editDraft} from './message-model.ts'
const source=readFileSync(new URL('./resolution-message.ts',import.meta.url),'utf8').replace("from './message-model'",`from '${new URL('./message-model.ts',import.meta.url).href}'`)
const {resolutionDraft}=await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source)).toString('base64')}`)
const recipient={id:'landlord',label:'집주인',title:'집주인',sentences:['안녕하세요.','싱크대 아래에서 누수가 발생했습니다.','점검이 가능한지 문의드립니다.','회신 부탁드립니다.']}
test('solved and unsolved drafts keep four sentences, observations and source unchanged',()=>{
 const original=[...recipient.sentences]
 for(const status of ['solved','unsolved']){
  const draft=resolutionDraft(recipient,status)
  assert.equal(draft.catalog.length,4);assert.equal(draft.catalog[1].original,original[1])
  assert.match(messageBody(draft),status==='solved'?/현재는 해결됐지만/:/직접 해결하기 어려워/)
 }
 assert.deepEqual(recipient.sentences,original)
})
test('user edits remain independent of recalculated state-specific drafts',()=>{
 const first=resolutionDraft(recipient,'solved'),edited=editDraft(first,'사용자가 직접 수정한 내용입니다.')
 resolutionDraft(recipient,'unsolved')
 assert.equal(messageBody(edited),'사용자가 직접 수정한 내용입니다.')
 assert.equal(resolutionDraft({...recipient,sentences:recipient.sentences.slice(0,2)},'solved').catalog.length,3)
})

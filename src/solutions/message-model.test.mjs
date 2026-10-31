import {test} from 'node:test'
import assert from 'node:assert/strict'
import {initialDraft,applySentences,toMessageRecipients,copyMessage,copyMessageResult,editDraft,messageBody,selectedIndexes} from './message-model.ts'
const r={id:'landlord',label:'집주인',title:'집주인',sentences:['인사말 원문','문제 설명 원문','요청 원문','마무리 원문']}
test('required full scenario: edit, add, remove, restore original at fixed position',()=>{
  let d=applySentences(initialDraft(r),[0,1],r.sentences)
  d=editDraft(d,'수정한 인사말\n\n수정한 문제 설명')
  assert.equal(d.sentences[0].blockId,'landlord:block:0')
  d=applySentences(d,[0,1,2],r.sentences)
  assert.equal(messageBody(d),'수정한 인사말\n\n수정한 문제 설명\n\n요청 원문')
  d=applySentences(d,[1,2],r.sentences)
  assert.equal(messageBody(d),'수정한 문제 설명\n\n요청 원문')
  d=applySentences(d,[2,0,1,0],r.sentences)
  assert.equal(messageBody(d),'인사말 원문\n\n수정한 문제 설명\n\n요청 원문')
  assert.equal(d.sentences.filter(s=>s.blockId==='landlord:block:0').length,1)
  assert.deepEqual(applySentences(d,[0,1,2],r.sentences),d)
})
test('direct sentence keeps identity and placement while source blocks change',()=>{
  let d=editDraft(initialDraft(r),'인사말 원문\n\n직접 작성 메모\n\n문제 설명 원문\n\n요청 원문\n\n마무리 원문')
  const direct=d.sentences.find(s=>s.direct)
  assert.ok(direct)
  assert.equal(direct.blockId,null)
  d=applySentences(d,[1,2,3],r.sentences)
  assert.equal(d.sentences[0].text,'직접 작성 메모')
  d=applySentences(d,[0,1,2,3],r.sentences)
  assert.equal(messageBody(d),'인사말 원문\n\n직접 작성 메모\n\n문제 설명 원문\n\n요청 원문\n\n마무리 원문')
  assert.deepEqual(d.sentences.find(s=>s.id===direct.id),direct)
  assert.equal(messageBody(applySentences(d,[],r.sentences)),'직접 작성 메모')
})
test('every source block reselects in fixed order, preserves unmodified other records',()=>{
  for(let i=0;i<4;i++){
    const start=editDraft(initialDraft(r),r.sentences.map((s,j)=>`수정 ${j}`).join('\n\n'))
    const removed=applySentences(start,[0,1,2,3].filter(j=>j!==i),r.sentences)
    const restored=applySentences(removed,[3,2,1,0],r.sentences)
    assert.equal(restored.sentences[i].text,r.sentences[i])
    for(let j=0;j<4;j++)if(i!==j)assert.equal(restored.sentences[j].text,`수정 ${j}`)
    assert.deepEqual(selectedIndexes(restored),[0,1,2,3])
  }
})
test('target availability and clipboard outcomes remain correct',async()=>{
  const targets=toMessageRecipients({contacts:{landlord:{label:'집주인',sentences:['인사','','증상']},company:{label:'',sentences:[]}}})
  assert.equal(targets.length,1)
  assert.equal(messageBody(initialDraft(targets[0])),'인사\n\n증상')
  assert.equal(await copyMessage('본문',async()=>{}),'메시지를 복사했어요')
  assert.equal(await copyMessage('본문',async()=>{throw Error()}),'복사하지 못했어요. 다시 시도해 주세요.')
  assert.equal(await copyMessage(' ',async()=>{throw Error()}),'메시지 내용을 입력한 후 다시 시도해 주세요.')
})

test('paragraphs inserted inside an edited block retain its identity and are removed together',()=>{
  let d=initialDraft(r)
  d=editDraft(d,'인사말 추가\n\n부연 설명 원문\n\n문제 설명 원문\n\n요청 원문\n\n마무리 원문')
  assert.equal(d.sentences[0].text,'인사말 추가\n\n부연 설명 원문')
  assert.equal(d.sentences[0].blockId,'landlord:block:0')
  d=applySentences(d,[1,2,3],r.sentences)
  assert.equal(messageBody(d),'문제 설명 원문\n\n요청 원문\n\n마무리 원문')
})

test('copy result distinguishes navigation success from empty and failed writes',async()=>{
  let writes=0
  assert.equal((await copyMessageResult('   ',async()=>{writes++})).status,'empty')
  assert.equal(writes,0)
  assert.equal((await copyMessageResult('본문',async()=>{throw Error('denied')})).status,'failed')
  assert.equal((await copyMessageResult('본문',async()=>{writes++})).status,'success')
  assert.equal(writes,1)
})

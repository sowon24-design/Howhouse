import test from 'node:test'
import assert from 'node:assert/strict'
import { searchCases } from './search-cases.ts'
import dictionary from './search-dictionary.json' with {type:'json'}
const cases = [
  {id:'a', title:'배수구 막힘',symptom:'물이 안 내려가요',category:'화장실',description:'욕실 배수구 확인'},
  {id:'b', title:'난방 불량',symptom:'방이 추워요',category:'보일러',description:'난방 확인'},
]
test('local search combines terms, normalizes Korean, and leaves source unchanged',()=>{
  const before=structuredClone(cases)
  assert.deepEqual(searchCases(cases,'  배수구   욕실 ').map(x=>x.id),['a'])
  assert.deepEqual(searchCases(cases,'보일러'.normalize('NFD')).map(x=>x.id),['b'])
  assert.deepEqual(cases,before)
})
test('empty search lists all cases; unmatched input returns no invented solution',()=>{
  assert.equal(searchCases(cases,'   ').length,2)
  assert.deepEqual(searchCases(cases,'없는 증상'),[])
  assert.deepEqual(searchCases(cases,'<script>'),[])
})
const entries=Object.entries(dictionary).map(([id,entry])=>({id,title:entry.symptom,symptom:entry.symptom,category:'',description:''}))
test('specific appliance and drainage rank ahead of unrelated bathroom cases',()=>{
  assert.equal(searchCases(entries,'세탁기 물이 안 빠져요')[0].id,'가전:30')
  assert.ok(searchCases(entries,'세탁기').every(item=>item.id.startsWith('가전:')))
  assert.equal(searchCases(entries,'변기 물이 안 내려가요')[0].id,'욕실·수도:5')
})
test('negative context does not reward drainage or a smell that is denied',()=>{
  assert.equal(searchCases(entries,'세탁기 물은 잘 빠지는데 안 들어와요')[0].id,'가전:31')
  assert.equal(searchCases(entries,'배수구 냄새는 안 나고 물이 안 빠져요')[0].id,'욕실·수도:2')
})
test('unknown topics do not fabricate a repair and repeated synonyms do not boost score',()=>{
  assert.deepEqual(searchCases(entries,'도어락 배터리'),[])
  assert.deepEqual(searchCases(entries,'인터넷 연결'),[])
  assert.deepEqual(searchCases(entries,'세탁기').map(x=>x.id),searchCases(entries,'세탁기 세탁기').map(x=>x.id))
})

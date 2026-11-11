import test from 'node:test'
import assert from 'node:assert/strict'
import { searchCases } from './search-cases.ts'
import dictionary from './search-dictionary.json' with {type:'json'}
import examples from './search-examples.json' with {type:'json'}
import { readFileSync } from 'node:fs'
import { convertCsv } from '../solutions/data/convert.ts'
import { isActiveCase } from '../solutions/data/deleted-cases.ts'
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
  assert.equal(searchCases(entries,'도어락 배터리')[0].id,'난방·전기:G61')
  assert.deepEqual(searchCases(entries,'인터넷 연결'),[])
  assert.deepEqual(searchCases(entries,'세탁기').map(x=>x.id),searchCases(entries,'세탁기 세탁기').map(x=>x.id))
})

const fields=['난방·전기','해충·곰팡이','욕실·수도','가전']
const added=fields.flatMap((field,i)=>convertCsv(field,readFileSync(new URL(`../solutions/data/additional62/cases${i}.csv`,import.meta.url),'utf8'),{}))
const originals=[['욕실·수도','욕실·수도 (1)'],['난방·전기','난방·전기'],['가전','가전'],['해충·곰팡이','해충·곰팡이 (1)']].flatMap(([field,file])=>convertCsv(field,readFileSync(new URL(`../solutions/data/raw/${file}.csv`,import.meta.url),'utf8'),{}))
const actualCases=[...originals,...added].filter(isActiveCase)
test('all 62 additional dictionary IDs correspond to real cases and have a query example',()=>{
  assert.equal(added.length,62)
  assert.equal(new Set(examples.map(x=>x.id)).size,62)
  assert.deepEqual(examples.map(x=>x.id).sort(),added.map(x=>x.id).sort())
  for(const item of added) assert.equal(dictionary[item.id].symptom,item.symptom,item.id)
})
for(const {id,query} of examples) test(`additional case ranking: ${query}`,()=>{
  assert.equal(searchCases(actualCases,query)[0]?.id,id)
})
for(const query of ['에어컨 물 떨어짐','에어컨에서 물이 떨어져요','에어컨물떨어짐','에어컨 물 새요','벽걸이 에어컨 누수']) test(`AC leak ranks first: ${query}`,()=>{
  assert.equal(searchCases(actualCases,query)[0]?.id,'가전:G66')
})
test('specific AC symptoms outrank other AC topics, without synonym-count bias',()=>{
  assert.equal(searchCases(actualCases,'에어컨 리모컨 건전지')[0]?.id,'가전:G71')
  assert.equal(searchCases(actualCases,'에어컨 냄새')[0]?.id,'가전:G43')
  assert.equal(searchCases(actualCases,'에어컨 냉방 불량')[0]?.id,'가전:G67')
  assert.deepEqual(searchCases(actualCases,'에어컨 물 떨어짐').map(x=>x.id),searchCases(actualCases,'에어컨 물 떨어짐 물 떨어짐').map(x=>x.id))
})

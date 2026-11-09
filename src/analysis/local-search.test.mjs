import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {convertCsv} from '../solutions/data/convert.ts'
import {isActiveCase} from '../solutions/data/deleted-cases.ts'
import {findLocalCases} from './local-search.ts'
const files={'욕실·수도':'욕실·수도 (1)','난방·전기':'난방·전기','가전':'가전','해충·곰팡이':'해충·곰팡이 (1)'}
const cases=Object.entries(files).flatMap(([field,file])=>convertCsv(field,readFileSync(new URL(`../solutions/data/raw/${file}.csv`,import.meta.url),'utf8'),{})).filter(isActiveCase)
test('natural phrases find the correct stored symptoms without generating answers',()=>{
 for(const [query,id] of [['변기 물이 안 내려가요','욕실·수도:5'],['하수구 냄새가 심해요','욕실·수도:1'],['세탁기에서 냄새가 나요','가전:34'],['냉장고가 시끄러워요','가전:43'],['냉장고 아래에서 물이 새요','가전:41'],['개미가 보여요','해충·곰팡이:56']])assert.equal(findLocalCases(query,cases)[0]?.id,id,query)
})
test('unavailable objects and symptoms do not become unrelated repairs',()=>{
 for(const query of ['싱크대 아래에서 물이 새요','바퀴벌레가 나왔어요','스마트폰 화면이 깨졌어요','보일러가 안 켜져요','','   ','안녕하세요'])assert.deepEqual(findLocalCases(query,cases),[],query)
})
test('all stored titles are discoverable and search leaves data unchanged',()=>{
 const before=JSON.stringify(cases)
 for(const item of cases)assert.ok(findLocalCases(item.title,cases).some(result=>result.id===item.id),item.title)
 assert.equal(JSON.stringify(cases),before)
})

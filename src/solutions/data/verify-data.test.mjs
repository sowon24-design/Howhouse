import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { parseCsv, convertCsv, createCaseLookup, splitSupplies } from './convert.ts'
import { videoSupplements } from './video-supplements.ts'
import { isActiveCase } from './deleted-cases.ts'

import { categories, getCategoryCases } from './categories.ts'
import { displayResponsibility } from './presentation.ts'
import { toMessageRecipients } from '../message-model.ts'
const files = {'욕실·수도':'욕실·수도 (1)', '난방·전기':'난방·전기', '가전':'가전', '해충·곰팡이':'해충·곰팡이 (1)'}
const raw = Object.entries(files).map(([field,file]) => ({field, csv:readFileSync(new URL(`./raw/${file}.csv`,import.meta.url),'utf8')}))
const cases = raw.flatMap(({field,csv})=>convertCsv(field,csv,videoSupplements)).filter(isActiveCase)
const get = createCaseLookup(cases)

test('each stored case replaces landlord content by outcome and preserves company drafts',()=>{
  const twoBlocks=new Set(['3','8','9','11','14','21','34','36','44','45','47','48','49','52'])
  for(const c of cases){
    const unresolved=toMessageRecipients(c,false),solved=toMessageRecipients(c,true)
    assert.deepEqual(solved.find(r=>r.id==='company'),unresolved.find(r=>r.id==='company'),c.id)
    const draft=solved.find(r=>r.id==='landlord').sentences
    assert.equal(draft.length,twoBlocks.has(c.number)?2:3,c.id)
    assert.deepEqual(draft,c.contacts.landlord.solvedSentences,c.id)
    assert.notDeepEqual(draft,unresolved[0].sentences,c.id)
    assert.ok(draft.every(s=>!s.includes('다만')&&!s.includes('지금은 보이지 않지만')),c.id)
  }
})

test('53 current unique IDs all resolve; raw text, all step pairs and source fields are retained',()=>{
  assert.equal(cases.length,53)
  assert.equal(new Set(cases.map(c=>c.id)).size,53)
  for(const {field,csv} of raw) for(const row of parseCsv(csv).slice(1).filter(r=>r.some(c=>c.trim()))) {
    const c=get(`${field}:${row[0]}`)
    if (field === '가전' && row[0] === '32') {assert.equal(c,undefined);continue}
    assert.ok(c)
    assert.deepEqual([c.number,c.category,c.symptom,c.description,c.title,c.duration,c.responsibility,c.reference],[row[0],row[1],row[2],row[3],row[4],row[6],row[7],row[8]])
    assert.deepEqual(c.steps.map(s=>[s.title,s.description]),[row.slice(9,11),row.slice(11,13),row.slice(13,15),row.slice(15,17)])
    assert.deepEqual(c.contacts.landlord.sentences,row.slice(20,24))
    assert.deepEqual(c.contacts.company.sentences,row.slice(24,28))
  }
  assert.equal(get('가전:999'),undefined)
  assert.equal(get('욕실·수도:15'),undefined)
  assert.throws(()=>createCaseLookup([cases[0],cases[0]]),/중복/)
})
test('case 9 has searchable supplies; parser still preserves nested parenthetical commas',()=>{
  assert.deepEqual(get('욕실·수도:9').supplies,['구연산','식초','키친타월','식품용 랩','칫솔','수건'])
  assert.deepEqual(splitSupplies('A(설명(안쪽, 내용), 이어서), B'),['A(설명(안쪽, 내용), 이어서)','B'])
})

test('all active cases support landlord contact; previously empty cases have complete drafts',()=>{
  for(const c of cases){assert.ok(c.canContact,c.id);assert.equal(c.contacts.landlord.label,'집주인');assert.equal(c.contacts.landlord.sentences.filter(s=>s.trim()).length,3,c.id);assert.ok([2,3].includes(c.contacts.landlord.solvedSentences.length),c.id)}
  for(const id of ['욕실·수도:9','가전:34','가전:36','해충·곰팡이:45','해충·곰팡이:47','해충·곰팡이:48','해충·곰팡이:52']) {
    const c=get(id);assert.equal(c.contacts.company.label,'');assert.ok(c.contacts.company.sentences.every(s=>!s.trim()))
  }
  assert.ok(get('난방·전기:16').supplies.length===0)
})
test('case 10 stores both videos in source order; first displayed by B02',()=>{
  assert.equal(get('욕실·수도:10').videos.length,2)
  assert.equal(get('욕실·수도:10').videos[0].url,'https://www.youtube.com/watch?v=7l0I3PLyTtM')
  assert.equal(get('욕실·수도:10').videos[1].url,'https://www.youtube.com/watch?v=vFIuUNMPivs')
})
test('all six rich-link supplements resolve to verified URLs and thumbnails',()=>{
  assert.equal(Object.keys(videoSupplements).length,6)
  for(const [id,urls] of Object.entries(videoSupplements)) {
    assert.equal(get(id).videos[0].url,urls[0])
    assert.match(get(id).videos[0].thumbnail,/^https:\/\/i\.ytimg\.com\/vi\/[\w-]{11}\/hqdefault\.jpg$/)
  }
})
test('blank video is empty array, absent steps are not invented; CSV quoting works',()=>{
  assert.equal(get('가전:32'),undefined)
  const [head,first] = parseCsv(raw[0].csv)
  first[5]=''; first[9]=''; first[10]=''; first[17]=''
  const encode = rows => rows.map(r=>r.map(c=>'"'+c.replaceAll('"','""')+'"').join(',')).join('\r\n')
  const c=convertCsv('욕실·수도',encode([head,first]),{})[0]
  assert.deepEqual(c.supplies,[])
  assert.equal(c.steps.length,3)
  assert.equal(c.steps[0].number,2)
  assert.deepEqual(c.videos,[])
  assert.deepEqual(parseCsv('a,b\r\n"x,y","line1\nline2 ""quoted"""'),[['a','b'],['x,y','line1\nline2 "quoted"']])
})
test('all active cases have exactly one planned image, all planned local files exist',()=>{
  const source=readFileSync(new URL('./photos.ts',import.meta.url),'utf8')
  const rows=[...source.matchAll(/'([^']+)': \[\{src:(P\d+)/g)].map(m=>[m[1],m[2]])
  const plan=JSON.parse(readFileSync(new URL('../assets/cases/image-plan.json',import.meta.url),'utf8').replace(/^\uFEFF/,''))
  assert.equal(rows.length,53)
  assert.equal(new Set(rows.map(r=>r[0])).size,53)
  for(const [id,image] of rows){assert.ok(get(id));assert.ok(plan.images.find(p=>p.imageId===image).caseIds.includes(id))}
  for(const image of plan.images)assert.ok(readFileSync(new URL('../assets/cases/'+(image.generatedFile??'p01-drain.jpg'),import.meta.url)).length>0)
  assert.equal(get('욕실·수도:1').reference,'평소 청소로 해결되는 관리 영역이에요.')
  assert.ok(readFileSync(new URL('./raw/책임 판단 기준.csv',import.meta.url),'utf8').startsWith('구분,내용'))
})

test('eight Figma categories partition 53 cases once, with deleted IDs absent',()=>{
  assert.deepEqual(categories.map(c=>c.id),['화장실','보일러','수도·수질','세탁기','전기·조명','냉장고','해충','곰팡이'])
  const counts=[7,7,7,8,7,6,5,6]
  const assigned=categories.flatMap((category,i)=>{
    const items=getCategoryCases(cases,category.id)
    assert.equal(items.length,counts[i],category.id)
    assert.ok(items.every(c=>c.category.trim()===category.csvCategory))
    return items.map(c=>c.id)
  })
  assert.equal(new Set(assigned).size,cases.length)
  assert.equal(assigned.length,cases.length)
  assert.deepEqual(getCategoryCases(cases,'해충').map(c=>c.number),['44','48','50','52','56'])
  assert.deepEqual(getCategoryCases(cases,'곰팡이').map(c=>c.number),['45','47','49','51','55','57'])
  for(const number of ['46','53','54'])assert.equal(get(`해충·곰팡이:${number}`),undefined)
})
test('dash responsibility explanation is hidden only in presentation, raw text retained',()=>{
  const raw=get('욕실·수도:3').responsibility
  assert.equal(raw,'- (원인이 환기 부족과 건물 하자로 갈려서)')
  assert.equal(displayResponsibility(raw),'-')
  assert.equal(displayResponsibility('-'),'-')
  assert.equal(displayResponsibility('세입자'),'세입자')
  assert.equal(displayResponsibility('집주인 (참고)'),'집주인 (참고)')
})



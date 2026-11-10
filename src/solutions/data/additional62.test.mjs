import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { convertCsv, parseCsv } from './convert.ts'
import { applyAdditionalGuides } from './additional-guides.ts'
import { categories, getCategoryCases } from './categories.ts'
import guides from './additional62/refined-guides.json' with {type:'json'}
import videos from './additional62/videos.json' with {type:'json'}
const fields=['난방·전기','해충·곰팡이','욕실·수도','가전']
const raw=fields.map((field,i)=>({field,csv:readFileSync(new URL(`./additional62/cases${i}.csv`,import.meta.url),'utf8')}))
const cases=applyAdditionalGuides(raw.flatMap(({field,csv})=>convertCsv(field,csv,{})),guides,videos)
test('62 unique additions preserve 31 columns and complete 4–8 steps',()=>{
  assert.equal(cases.length,62)
  assert.equal(new Set(cases.map(c=>c.id)).size,62)
  for(const {csv} of raw) for(const row of parseCsv(csv)) assert.equal(row.length,31)
  for(const c of cases){
    assert.match(c.number,/^G\d+$/)
    assert.match(c.duration,/^약 \d+분$/)
    assert.ok(c.steps.length>=4&&c.steps.length<=8,c.id)
    assert.ok(c.steps.every(s=>s.title.trim()&&s.description.trim()),c.id)
    assert.ok(c.supplies.every(s=>s.trim()),c.id)
  }
})
test('23 home additions route exactly once; 39 remain searchable only',()=>{
  const home=categories.flatMap(c=>getCategoryCases(cases,c.id))
  assert.equal(home.length,23)
  assert.equal(new Set(home.map(c=>c.id)).size,23)
  assert.equal(cases.length-home.length,39)
})
test('33 approved videos have packaged thumbnails; 29 have no video area',()=>{
  assert.equal(cases.filter(c=>c.videos.length).length,33)
  for(const c of cases) for(const v of c.videos){
    const id=/\/vi\/([^/]+)/.exec(v.thumbnail)[1]
    assert.ok(existsSync(new URL(`../assets/video-thumbnails/${id}.jpg`,import.meta.url)),c.id)
  }
  for(const number of ['G34','G63']) assert.equal(cases.find(c=>c.number===number).videos.length,0)
})

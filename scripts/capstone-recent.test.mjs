import test from 'node:test'
import assert from 'node:assert/strict'
import {generatedRecent,readRecent,rememberRecent,restoreGenerated} from '../src/capstone/complete/recent-history.ts'
import {toGeneratedSolution} from '../src/analysis/solution.ts'
import {generatedSampleContent} from '../src/analysis/samples.ts'
import {initialPosts} from '../src/capstone/complete/model.ts'
import {caseIdPart,isRecentCaseHash,recentCasePath,recentListPath} from '../src/capstone/complete/recent-navigation.ts'

test('recent case links keep their result ID and return destination distinct from search',()=>{
 const id='욕실·수도:2',hash='#'+recentCasePath(id)
 assert.equal(decodeURIComponent(caseIdPart(hash)),id)
 assert.equal(isRecentCaseHash(hash),true)
 assert.equal(recentListPath,'screen/336:31416')
 const searchCase='#case/'+encodeURIComponent(id)
 assert.equal(decodeURIComponent(caseIdPart(searchCase)),id)
 assert.equal(isRecentCaseHash(searchCase),false)
 assert.equal(isRecentCaseHash('#search?from=recent'),false)
})

test('four distinct own posts belong to the current owner',()=>{
 const mine=initialPosts('소원').filter(post=>post.mine)
 assert.equal(mine.length,4);assert.equal(new Set(mine.map(post=>post.title)).size,4)
 assert.ok(mine.every(post=>post.author==='소원'))
})
test('recent views keep ten unique results with the last viewed first',()=>{
 let entries=[]
 for(let i=0;i<12;i++)entries=rememberRecent(entries,{source:'existing',id:`욕실·수도:${i}`,viewedAt:i})
 assert.equal(entries.length,10);assert.equal(entries[0].id,'욕실·수도:11');assert.equal(entries.at(-1).id,'욕실·수도:2')
 entries=rememberRecent(entries,{source:'existing',id:'욕실·수도:5',viewedAt:13})
 assert.equal(entries.length,10);assert.equal(entries[0].id,'욕실·수도:5');assert.equal(entries.filter(e=>e.id==='욕실·수도:5').length,1)
})
test('generated results survive storage and reopen without an existing case or AI request',()=>{
 const original=toGeneratedSolution(generatedSampleContent,'history-fixture')
 const entry=generatedRecent({...original,analysisUserText:'must not persist',photos:[{src:'private-photo'}]},123)
 assert.ok(entry)
 const serialized=JSON.stringify([entry]);assert.ok(!serialized.includes('must not persist'));assert.ok(!serialized.includes('private-photo'))
 const [restored]=readRecent(serialized)
 assert.deepEqual(restoreGenerated(restored),original)
 assert.equal(restored.id,'generated:history-fixture')
})
test('invalid or corrupt history is ignored without breaking startup',()=>{
 assert.deepEqual(readRecent('not json'),[]);assert.deepEqual(readRecent('{}'),[])
 assert.deepEqual(readRecent(JSON.stringify([{source:'generated',id:'generated:bad',viewedAt:1,content:{title:'bad'}},null])),[])
 const good={source:'existing',id:'욕실·수도:1',viewedAt:1}
 assert.deepEqual(readRecent(JSON.stringify([good,good])),[good])
})

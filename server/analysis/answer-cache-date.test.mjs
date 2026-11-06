import test from 'node:test'
import assert from 'node:assert/strict'
import {inputFingerprint} from './answer-cache.mjs'
test('relative-date cache invalidates at Korean midnight; ordinary input stays reusable',()=>{
 const secret=Buffer.alloc(32,9),before=Date.parse('2026-11-06T14:59:59Z'),after=Date.parse('2026-11-06T15:00:00Z')
 const key=(text,now)=>inputFingerprint({text,photos:[]},{model:'test',now},secret)
 assert.notEqual(key('오늘 물이 잘 안 내려가요',before),key('오늘 물이 잘 안 내려가요',after))
 assert.equal(key('오늘 물이 잘 안 내려가요',before),key('오늘 물이 잘 안 내려가요',before-3600000))
 assert.equal(key('물이 잘 안 내려가요',before),key('물이 잘 안 내려가요',after))
})

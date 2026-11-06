import {test} from 'node:test'
import assert from 'node:assert/strict'
import {coupangSearchUrl} from './supply-links.ts'

test('Korean and URL syntax remain a single search term, with no affiliate parameters',()=>{
  for(const label of ['변기용 뚫어뻥','고무장갑','필터 & 호스 #1?x=2','식초/구연산']){
    const url=new URL(coupangSearchUrl(label))
    assert.equal(url.origin,'https://www.coupang.com')
    assert.equal(url.pathname,'/np/search')
    assert.deepEqual([...url.searchParams],[['q',label]])
  }
  assert.equal(coupangSearchUrl('  고무장갑  '),coupangSearchUrl('고무장갑'))
  assert.equal(coupangSearchUrl('  '),null)
})

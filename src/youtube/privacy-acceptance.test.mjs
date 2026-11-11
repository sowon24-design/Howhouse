import test from 'node:test'
import assert from 'node:assert/strict'
import { readYoutubePrivacyAcceptance } from './privacy-acceptance.ts'
import { catalogPolicy } from '../catalog/policy.ts'
const storage = value => ({getItem:()=>JSON.stringify(value)})
test('old onboarding and invalid data do not authorize the new thumbnail connection',()=>{
  for(const value of [null,{}, {ageConfirmed:true}, {ageConfirmed:true,policyVersion:'old'}, {policyVersion:catalogPolicy.version}]) {
    assert.equal(readYoutubePrivacyAcceptance(storage(value)),false)
  }
  assert.equal(readYoutubePrivacyAcceptance({getItem:()=>'{'}),false)
  assert.equal(readYoutubePrivacyAcceptance({getItem:()=>{throw Error('blocked')}}),false)
})
test('only current policy acceptance enables thumbnails; clearing settings disables them',()=>{
  assert.equal(readYoutubePrivacyAcceptance(storage({ageConfirmed:true,policyVersion:catalogPolicy.version})),true)
  assert.equal(readYoutubePrivacyAcceptance(storage(null)),false)
})

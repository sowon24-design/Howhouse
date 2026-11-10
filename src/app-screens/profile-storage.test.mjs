import test from 'node:test'
import assert from 'node:assert/strict'
import { readProfile, writeProfile, resetProfile, profileKey, introductionKey } from './profile-storage.ts'
function storage() {
  const data = new Map()
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) }
}
test('completed profile survives reload and edits', () => {
  const store = storage()
  writeProfile(store, { nickname: '예슬', setupComplete: true })
  assert.deepEqual(readProfile(store), { nickname: '예슬', setupComplete: true })
  writeProfile(store, { ...readProfile(store), nickname: '새이름' })
  assert.deepEqual(readProfile(store), { nickname: '새이름', setupComplete: true })
})
test('corrupt or invalid records do not complete setup', () => {
  const store = storage()
  for (const raw of ['{', 'null', '{"nickname":" ","setupComplete":true}', '{"nickname":"이름","setupComplete":"true"}']) {
    store.setItem(profileKey, raw)
    assert.equal(readProfile(store), undefined)
  }
})
test('reset removes only owned profile and introduction records', () => {
  const store = storage()
  writeProfile(store, { nickname: '예슬', setupComplete: true })
  store.setItem(introductionKey, '3')
  store.setItem('unrelated', 'keep')
  assert.equal(resetProfile(store), true)
  assert.equal(readProfile(store), undefined)
  assert.equal(store.getItem(introductionKey), null)
  assert.equal(store.getItem('unrelated'), 'keep')
})
test('unavailable storage returns explicit failure without crashing', () => {
  const fail = () => { throw new Error('blocked') }
  const store = {getItem: fail, setItem: fail, removeItem: fail}
  assert.equal(readProfile(store), undefined)
  assert.equal(writeProfile(store, {nickname:'예슬',setupComplete:true}), false)
  assert.equal(resetProfile(store), false)
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { isGeneratedContent, toGeneratedSolution } from './solution.ts'
import { generatedSampleContent } from './samples.ts'
import { toMessageRecipients, initialDraft, messageBody, editDraft, copyMessageResult } from '../solutions/message-model.ts'

const landlord = ['안녕하세요.', '문 경첩에서 소리가 나 점검을 부탁드립니다.']
const company = ['안녕하세요.', '문 경첩의 상태를 점검할 수 있는지 문의드립니다.']

for (const [name, contacts, expectedTargets] of [
  ['집주인만', { landlord, company: [] }, ['landlord']],
  ['업체만', { landlord: [], company }, ['company']],
  ['둘 다', { landlord, company }, ['landlord', 'company']],
  ['문의 불필요', { landlord: [], company: [] }, []],
]) test(`generated inquiry: ${name} follows AI sentences without an extra model call`, () => {
  const content = { ...generatedSampleContent, contacts }
  assert.ok(isGeneratedContent(content))
  const solution = toGeneratedSolution(content, 'generated-contact-test')
  assert.equal(solution.canContact, expectedTargets.length > 0)
  const recipients = toMessageRecipients(solution)
  assert.deepEqual(recipients.map(r => r.id), expectedTargets)
  for (const recipient of recipients) {
    assert.deepEqual(recipient.sentences, contacts[recipient.id])
    assert.equal(messageBody(initialDraft(recipient)), contacts[recipient.id].join('\n\n'))
  }
})

test('generated inquiry missing fields, blank sentences and wrong types are rejected', () => {
  for (const contacts of [undefined, {}, { landlord }, { landlord: [' '], company: [] },
    { landlord: '본문', company: [] }, { landlord: [], company: [null] },
    { landlord: Array(5).fill('문장'), company: [] }]) {
    assert.equal(isGeneratedContent({ ...generatedSampleContent, contacts }), false)
  }
})

test('generated inquiry stays editable/copyable and editing does not mutate original AI result', async () => {
  const content = { ...generatedSampleContent, contacts: { landlord, company } }
  const solution = toGeneratedSolution(content, 'test')
  const recipients = toMessageRecipients(solution)
  const original = initialDraft(recipients[0])
  const changed = editDraft(original, '사용자가 직접 보완한 문의 문장')
  let clipboard
  assert.equal((await copyMessageResult(messageBody(changed), async body => { clipboard = body })).status, 'success')
  assert.equal(clipboard, '사용자가 직접 보완한 문의 문장')
  assert.equal(messageBody(original), landlord.join('\n\n'))
  assert.deepEqual(content.contacts.landlord, landlord)
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { generatedSampleContent } from './samples.ts'
import { isGeneratedContent, readGeneratedContent, splitGeneratedSentences, toGeneratedSolution, toLegacyGeneratedContent } from './solution.ts'
import { applySentences, editDraft, initialDraft, messageBody, toMessageRecipients } from '../solutions/message-model.ts'

const sentenceList = ['안녕하세요.', '창문 안쪽에 물방울이 맺힙니다.', '점검이 가능한지 문의드립니다.', '확인 후 회신 부탁드립니다.']
const content = { ...generatedSampleContent, duration: '약 5~10분(표면 물기 관리 기준)', responsibility: '-',
  reference: '결로의 원인·창호 상태·생활 환경이 확인되지 않아 책임은 단정할 수 없어요.',
  contacts: { landlord: [sentenceList.join(' ')], company: [] } }

test('generated estimates and unknown responsibility/reference reach B02 without invented liability', () => {
  assert.ok(isGeneratedContent(content))
  const view = toGeneratedSolution(readGeneratedContent(content), 'condensation-test')
  assert.equal(view.duration, content.duration)
  assert.equal(view.responsibility, '-')
  assert.equal(view.reference, content.reference)
  assert.deepEqual(view.videos, []); assert.deepEqual(view.photos, [])
  for (const invalid of [{ ...content, reference: '' }, { ...content, duration: '' }, { ...content, responsibility: '세입자 100% 과실' }]) assert.equal(isGeneratedContent(invalid), false)
  for (const subject of ['집주인', '세입자']) {
    const named = { ...content, responsibility: subject, reference: '책임 주체 표시의 근거와 추가 확인 조건을 설명하는 검증용 문장입니다.' }
    assert.ok(isGeneratedContent(named))
    assert.equal(toGeneratedSolution(named, subject).reference, named.reference)
    assert.equal(isGeneratedContent({ ...named, reference: '' }), false)
  }
})

test('one combined model string becomes four independent sentence blocks, preserving decimal numbers', () => {
  const normalized = readGeneratedContent(content)
  assert.deepEqual(normalized.contacts.landlord, sentenceList)
  assert.deepEqual(splitGeneratedSentences(['틈이 약 1.5mm로 보여요. 점검을 부탁드립니다.']), ['틈이 약 1.5mm로 보여요.', '점검을 부탁드립니다.'])
  const recipient = toMessageRecipients(toGeneratedSolution(normalized, 'blocks'))[0]
  const initial = initialDraft(recipient)
  assert.equal(initial.catalog.length, 4)
  const edited = editDraft(initial, messageBody(initial).replace(sentenceList[0], '안녕하세요, 세입자입니다.'))
  const removed = applySentences(edited, [1, 2, 3], recipient.sentences)
  assert.equal(messageBody(removed).includes('세입자입니다'), false)
  const restored = applySentences(removed, [0, 1, 2, 3], recipient.sentences)
  assert.equal(messageBody(restored), sentenceList.join('\n\n'))
  assert.equal(initial.catalog.length, 4) // Normalization never rewrites a user's later edits.
})

test('excess sentence count is rejected instead of truncating or merging messages', () => {
  const tooMany = { ...content, contacts: { landlord: [[...sentenceList, '다섯 번째 문장입니다.'].join(' ')], company: [] } }
  assert.equal(readGeneratedContent(tooMany), undefined)
})

test('legacy server output is accepted only at the compatibility boundary and has honest unknown metadata', () => {
  const legacy = toLegacyGeneratedContent(content)
  assert.equal(isGeneratedContent(legacy), false)
  assert.equal(readGeneratedContent(legacy), undefined)
  const compatible = readGeneratedContent(legacy, { allowLegacy: true })
  assert.equal(compatible.duration, '-')
  assert.equal(compatible.responsibility, '-')
  assert.match(compatible.reference, /이전 버전/)
  assert.deepEqual(compatible.contacts.landlord, sentenceList)
})

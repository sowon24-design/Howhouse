import { initialDraft } from './message-model'
import type { Recipient, MessageDraft } from './message-model'
export type ResolutionStatus = 'solved' | 'unsolved'
export function resolutionDraft(recipient: Recipient, status?: ResolutionStatus): MessageDraft {
  if (!status) return initialDraft(recipient)
  const sentences = [...recipient.sentences]
  const purpose = status === 'solved'
    ? '현재는 해결됐지만 같은 문제가 반복될 때 점검을 받을 수 있는지 문의드립니다.'
    : '직접 해결하기 어려워 점검이 가능한지 문의드립니다.'
  // Newly generated four-sentence drafts reserve the third slot for the request.
  // Shorter drafts retain their original blocks and add one purpose sentence.
  if (sentences.length >= 4) sentences[2] = purpose
  else sentences.push(purpose)
  return initialDraft({ ...recipient, sentences })
}

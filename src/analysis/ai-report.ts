import { aiReportReasons } from '../solutions/opinion-reasons.ts'
export { aiReportReasons } from '../solutions/opinion-reasons.ts'
export function aiReportText(reason: string, comment: string, context: string): string {
  if (!(aiReportReasons as readonly string[]).includes(reason) || reason === '직접 입력하기' && !comment.replace(/[\s\p{Cf}]/gu, '')) throw new Error('신고 사유를 확인해 주세요.')
  if (comment.length > 1000) throw new Error('신고 의견은 1,000자 이내로 작성해 주세요.')
  return `[AI 답변 신고 v1]\n사유: ${reason}\n의견: ${comment.trim()}\n표시된 답변 일부: ${context.slice(0,700)}`
}

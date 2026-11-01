import type { SolutionView } from '../solutions/data/types'

/** Display estimates and qualified responsibility guidance, never a binding liability decision. */
export type GeneratedContent = {
  title: string; description: string; supplies: string[]
  duration: string; responsibility: '-' | '집주인' | '세입자'; reference: string
  steps: { title: string; description: string }[]
  contacts: { landlord: string[]; company: string[] }
}
export type GeneratedSolution = Omit<SolutionView, 'id' | 'field' | 'number' | 'category' | 'symptom'> & { id: string }
const text = { type: 'string' }
const strings = { type: 'array', items: text }
export const generatedStepLimits = { min: 1, max: 8 } as const
export const generatedContentVersion = '2'
const segmenter = new Intl.Segmenter('ko', { granularity: 'sentence' })
/** Only original generated contact text is split; user edits and CSV source blocks are untouched. */
export function splitGeneratedSentences(blocks: readonly string[]): string[] {
  return blocks.flatMap(block => block.split(/\r?\n+/).flatMap(line =>
    Array.from(segmenter.segment(line), part => part.segment.trim()).filter(Boolean)))
}
export const generatedContentSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    title: text, description: text, supplies: strings,
    duration: text, responsibility: { type: 'string', enum: ['-', '집주인', '세입자'] }, reference: text,
    steps: { type: 'array', minItems: generatedStepLimits.min, maxItems: generatedStepLimits.max, items: { type: 'object', additionalProperties: false,
      properties: { title: text, description: text }, required: ['title', 'description'] } },
    contacts: { type: 'object', additionalProperties: false,
      properties: { landlord: strings, company: strings }, required: ['landlord', 'company'] },
  }, required: ['title', 'description', 'duration', 'responsibility', 'reference', 'supplies', 'steps', 'contacts'],
}
const object = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x)
const keys = (x: Record<string, unknown>, names: string[]) => Object.keys(x).sort().join() === names.sort().join()
const nonempty = (x: unknown, max: number): x is string => typeof x === 'string' && !!x.trim() && x.length <= max
const list = (x: unknown, max: number): x is string[] => Array.isArray(x) && x.length <= max && x.every(s => nonempty(s, 1000))
const contacts = (x: unknown): x is string[] => list(x, 4) && splitGeneratedSentences(x).length <= 4
export function isGeneratedContent(value: unknown): value is GeneratedContent {
  return object(value) && keys(value, ['title', 'description', 'duration', 'responsibility', 'reference', 'supplies', 'steps', 'contacts'])
    && nonempty(value.title, 160) && nonempty(value.description, 2000) && list(value.supplies, 15)
    && nonempty(value.duration, 160) && ['-', '집주인', '세입자'].includes(value.responsibility as string) && nonempty(value.reference, 2000)
    && Array.isArray(value.steps) && value.steps.length >= generatedStepLimits.min && value.steps.length <= generatedStepLimits.max
    && value.steps.every(s => object(s) && keys(s, ['title', 'description']) && nonempty(s.title, 160) && nonempty(s.description, 2000))
    && object(value.contacts) && keys(value.contacts, ['landlord', 'company'])
    && contacts(value.contacts.landlord) && contacts(value.contacts.company)
}
/** New app accepts older servers without inventing an estimate or liability finding. */
export function readGeneratedContent(value: unknown, { allowLegacy = false } = {}): GeneratedContent | undefined {
  const candidate = allowLegacy && object(value) && keys(value, ['title', 'description', 'supplies', 'steps', 'contacts'])
    ? { ...value, duration: '-', responsibility: '-', reference: '이전 버전 결과에는 책임 판단 참고가 제공되지 않았어요. 원인과 계약 조건은 별도 확인이 필요해요.' }
    : value
  if (!isGeneratedContent(candidate)) return undefined
  return { ...candidate, contacts: { landlord: splitGeneratedSentences(candidate.contacts.landlord), company: splitGeneratedSentences(candidate.contacts.company) } }
}
/** Keep older installed apps working while the server and APK are rolled out separately. */
export function toLegacyGeneratedContent(content: GeneratedContent) {
  return { title: content.title, description: content.description, supplies: content.supplies, steps: content.steps, contacts: content.contacts }
}
export function toGeneratedSolution(content: GeneratedContent, requestId: string): GeneratedSolution {
  return {
    id: `generated:${requestId}`, source: 'generated', title: content.title, description: content.description,
    supplies: [...content.supplies], steps: content.steps.map((s, i) => ({ ...s, number: i + 1 })),
    duration: content.duration, responsibility: content.responsibility, reference: content.reference, videos: [], photos: [],
    contacts: {
      landlord: { label: content.contacts.landlord.length ? '집주인' : '', sentences: splitGeneratedSentences(content.contacts.landlord) },
      company: { label: content.contacts.company.length ? '전문 업체' : '', sentences: splitGeneratedSentences(content.contacts.company) },
    }, canContact: content.contacts.landlord.length > 0 || content.contacts.company.length > 0,
  }
}

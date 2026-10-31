import type { SolutionView } from '../solutions/data/types'

/** Only fields the model is allowed to author. No IDs, URLs or liability decisions. */
export type GeneratedContent = {
  title: string; description: string; supplies: string[]
  steps: { title: string; description: string }[]
  contacts: { landlord: string[]; company: string[] }
}
export type GeneratedSolution = Omit<SolutionView, 'id' | 'field' | 'number' | 'category' | 'symptom'> & { id: string }
const text = { type: 'string' }
const strings = { type: 'array', items: text }
export const generatedContentSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    title: text, description: text, supplies: strings,
    steps: { type: 'array', items: { type: 'object', additionalProperties: false,
      properties: { title: text, description: text }, required: ['title', 'description'] } },
    contacts: { type: 'object', additionalProperties: false,
      properties: { landlord: strings, company: strings }, required: ['landlord', 'company'] },
  }, required: ['title', 'description', 'supplies', 'steps', 'contacts'],
}
const object = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x)
const keys = (x: Record<string, unknown>, names: string[]) => Object.keys(x).sort().join() === names.sort().join()
const nonempty = (x: unknown, max: number): x is string => typeof x === 'string' && !!x.trim() && x.length <= max
const list = (x: unknown, max: number): x is string[] => Array.isArray(x) && x.length <= max && x.every(s => nonempty(s, 1000))
export function isGeneratedContent(value: unknown): value is GeneratedContent {
  return object(value) && keys(value, ['title', 'description', 'supplies', 'steps', 'contacts'])
    && nonempty(value.title, 160) && nonempty(value.description, 2000) && list(value.supplies, 15)
    && Array.isArray(value.steps) && value.steps.length >= 1 && value.steps.length <= 8
    && value.steps.every(s => object(s) && keys(s, ['title', 'description']) && nonempty(s.title, 160) && nonempty(s.description, 2000))
    && object(value.contacts) && keys(value.contacts, ['landlord', 'company'])
    && list(value.contacts.landlord, 4) && list(value.contacts.company, 4)
}
export function toGeneratedSolution(content: GeneratedContent, requestId: string): GeneratedSolution {
  return {
    id: `generated:${requestId}`, source: 'generated', title: content.title, description: content.description,
    supplies: [...content.supplies], steps: content.steps.map((s, i) => ({ ...s, number: i + 1 })),
    duration: '', responsibility: '', reference: '', videos: [], photos: [],
    contacts: {
      landlord: { label: content.contacts.landlord.length ? '집주인' : '', sentences: [...content.contacts.landlord] },
      company: { label: content.contacts.company.length ? '전문 업체' : '', sentences: [...content.contacts.company] },
    }, canContact: content.contacts.landlord.length > 0 || content.contacts.company.length > 0,
  }
}

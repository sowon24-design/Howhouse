import type { Field, SolutionCase } from './types'

/** Product categories follow supplied Figma frames. CSV field names remain ID namespaces. */
export const categories = [
  { id: '화장실', csvCategory: '욕실', field: '욕실·수도', figmaNodeId: '463:10597' },
  { id: '보일러', csvCategory: '보일러', field: '난방·전기', figmaNodeId: '336:27636' },
  { id: '수도·수질', csvCategory: '수도', field: '욕실·수도', figmaNodeId: '336:27680' },
  { id: '세탁기', csvCategory: '세탁기', field: '가전', figmaNodeId: '336:27724' },
  { id: '전기·조명', csvCategory: '전기', field: '난방·전기', figmaNodeId: '336:27769' },
  { id: '냉장고', csvCategory: '냉장고', field: '가전', figmaNodeId: '336:27813' },
  { id: '해충', csvCategory: '해충', field: '해충·곰팡이', figmaNodeId: '336:27857' },
  { id: '곰팡이', csvCategory: '곰팡이', field: '해충·곰팡이', figmaNodeId: '336:27901' },
] as const satisfies readonly { id:string; csvCategory:string; field:Field; figmaNodeId:string }[]
export type CategoryId = typeof categories[number]['id']
export function getCategoryCases(cases: readonly SolutionCase[], categoryId: CategoryId) {
  const category = categories.find(c => c.id === categoryId)!
  return cases.filter(c => c.field === category.field && c.category.trim() === category.csvCategory)
}

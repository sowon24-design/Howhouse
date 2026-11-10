import temporaryCommon from '../assets/cases/temporary-common.png'
const temporaryCasePhotos = [{src:temporaryCommon,alt:'이미지 영역 확인용 임시 공통 일러스트'}]
import bathroom from './raw/욕실·수도 (1).csv?raw'
import heating from './raw/난방·전기.csv?raw'
import appliances from './raw/가전.csv?raw'
import pests from './raw/해충·곰팡이 (1).csv?raw'
import { convertCsv, createCaseLookup } from './convert'
import { videoSupplements } from './video-supplements'
import { casePhotos } from './photos'
import { isActiveCase } from './deleted-cases'
import type { SolutionView } from './types'
export { categories, getCategoryCases } from './categories'
export type { CategoryId } from './categories'
export type { CaseId, Field, SolutionCase, SolutionView } from './types'

export const solutionCases = [
  ...convertCsv('욕실·수도', bathroom, videoSupplements),
  ...convertCsv('난방·전기', heating, videoSupplements),
  ...convertCsv('가전', appliances, videoSupplements),
  ...convertCsv('해충·곰팡이', pests, videoSupplements),
].filter(isActiveCase)
const lookup = createCaseLookup(solutionCases)
export function getSolutionById(id: string): SolutionView | undefined {
  const item = lookup(id)
  return item ? {...item, photos: casePhotos[item.id] ?? temporaryCasePhotos} : undefined
}
// 책임 판단 기준.csv is deliberately not imported or merged into case reference text.




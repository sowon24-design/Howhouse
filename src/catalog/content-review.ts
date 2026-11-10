import type { SolutionView } from '../solutions/data/types'

// Catalog-only editorial corrections. Preserve the team's raw case data.
const electricalSteps = [
  { number: 1, title: '사용을 멈추고 거리를 둬요', description: '젖었거나 뜨거운 기기·콘센트·플러그는 만지거나 닦지 마세요. 다시 작동시켜 확인하지 마세요.' },
  { number: 2, title: '안전한 곳으로 이동해요', description: '물기가 있는 바닥이나 전기 설비에서 떨어지세요. 연기·불꽃·감전 위험이 있으면 안전한 곳으로 대피한 뒤 119에 신고하세요.' },
  { number: 3, title: '직접 분해하거나 전원을 다시 올리지 않아요', description: '안전하게 접근할 수 없다면 차단기에도 손대지 마세요. 내려간 차단기를 반복해서 올리거나 젖은 부품을 말린 뒤 바로 재사용하지 마세요.' },
  { number: 4, title: '전문가에게 점검을 요청해요', description: '집주인·관리사무소나 전기 전문가에게 상황을 알리고 점검을 받으세요. 안전 확인 전에는 해당 설비를 사용하지 마세요.' },
]
const electricalIds = new Set(['난방·전기:26', '난방·전기:27', '난방·전기:28'])
export function reviewedCatalogCase(item: SolutionView): SolutionView {
  // The additional guides already contain the reviewed concise cost conditions.
  // Keep their preview-approved copy instead of appending a second qualification.
  if (/^G\d+$/.test(item.number)) return item
  const cost = '수리 비용 부담은 계약·원인·현장 상태에 따라 확인해야 해요. 표시된 주체는 참고이며 확정 판정이 아니에요.'
  const safety = electricalIds.has(item.id)
  return {
    ...item,
    description: `${safety ? '전기 안전을 먼저 확보하세요. 위험한 설비를 직접 만지지 마세요. ' : ''}${item.description}\n${cost}`,
    reference: `${cost}${item.reference ? ` ${item.reference}` : ''}`,
    ...(safety ? { steps: electricalSteps.map(step => ({ ...step })), supplies: [], videos: [], duration: '전문가 점검 필요' } : {}),
  }
}

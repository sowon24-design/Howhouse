import type { AnalysisFailure } from './client'

/** Fixed, non-sensitive A05 copy; provider diagnostics are never rendered. */
export function getAnalysisFailureCopy(code: AnalysisFailure['code']): readonly string[] {
  switch (code) {
    case 'budget-limit': return ['현재 분석 이용 한도에 도달했어요.', '입력한 내용은 유지돼요. 나중에 다시 이용해 주세요.']
    case 'server-busy': return ['현재 분석 요청이 많아요.', '입력한 내용은 유지돼요. 잠시 후 다시 시도해 주세요.']
    case 'insufficient-input': return ['상황을 파악할 정보가 부족해요.', '문제가 생긴 곳과 증상을 조금 더 알려 주세요.']
    case 'unsupported-input': return ['현재 주거 문제 안내 범위에 해당하지 않아요.', '집에서 발생한 시설·설비 문제와 증상을 알려 주세요.']
    case 'unsafe-input': return ['안전한 대응 방법을 안내하기 어려운 상황이에요.', '직접 작업을 진행하지 말고 관리 담당자나 전문가에게 확인해 주세요.']
    case 'model-refusal': return ['요청한 내용에 대한 안내를 제공할 수 없어요.', '위험한 작업 방법 대신 현재 증상과 필요한 도움을 알려 주세요.']
    case 'analysis-timeout': return ['분석 대기 시간이 초과됐어요.', '입력한 내용은 유지돼요. 잠시 후 다시 시도해 주세요.']
    default: return ['문제 분석에 실패했어요.', '내용을 보완해 다시 시도해 주세요.']
  }
}

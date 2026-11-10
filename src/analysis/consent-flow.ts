export type AnalysisConsentChoices = { processing: boolean; overseas: boolean }
export type AnalysisConsentAcceptance = { ageAtLeast14: boolean; processingAccepted: boolean; overseasAccepted: boolean }

export function analysisConsentReady(flag: string | undefined, document: unknown): boolean {
  const strings = (value: unknown): string[] => typeof value === 'string' ? [value] : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : []
  return flag === '1' && !strings(document).some(text => /검토 초안|확정 필요|출시 전 확정|출시 전 제공업체별 확정|검토 중|\[(?!선택\]|필수\])[^\]]+\]/.test(text))
}

/** A checked UI choice is not a receipt. Only the confirmed save may continue. */
export function createAnalysisConsentFlow(options: { isReady: () => boolean; save: (acceptance: AnalysisConsentAcceptance) => Promise<void> }) {
  let generation = 0
  let pending = false
  return {
    cancel() { generation++ },
    async submit(acceptance: AnalysisConsentAcceptance, onAccepted: () => void): Promise<boolean> {
      if (pending || !options.isReady() || !acceptance.ageAtLeast14 || !acceptance.processingAccepted || !acceptance.overseasAccepted) return false
      pending = true
      const current = generation
      try {
        await options.save(acceptance)
        if (current !== generation) return false
        onAccepted()
        return true
      } finally { pending = false }
    },
  }
}

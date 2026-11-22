/** Display-only rule; preserve the raw CSV responsibility for future data integrations. */
export function displayResponsibility(raw: string, caseId?: string): string {
  const value = raw.trim()
  const unspecified = !value || /^[-–—](?:\s*[（(][\s\S]*[）)])?$/.test(value)
  if (!unspecified) return raw
  // This case's existing reference explicitly says there is no responsible party.
  // Do not infer “no repair cost” from an absent payer in other cases.
  return caseId === '욕실·수도:11' ? '해당 없음' : '부담 주체 확인 필요'
}

/** Omit parenthetical timing notes in the UI while retaining source case data. */
export function displayDuration(raw: string): string {
  let value = raw
  let previous: string
  do { previous = value; value = value.replace(/\([^()]*\)|（[^（）]*）/g, '') } while (value !== previous)
  return value.replace(/\s+/g, ' ').trim()
}

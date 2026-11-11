/** Display-only rule; preserve the raw CSV responsibility for future data integrations. */
export function displayResponsibility(raw: string): string {
  return /^\s*-\s*[（(][\s\S]*[）)]\s*$/.test(raw) ? '-' : raw
}

/** Omit parenthetical timing notes in the UI while retaining source case data. */
export function displayDuration(raw: string): string {
  let value = raw
  let previous: string
  do { previous = value; value = value.replace(/\([^()]*\)|（[^（）]*）/g, '') } while (value !== previous)
  return value.replace(/\s+/g, ' ').trim()
}

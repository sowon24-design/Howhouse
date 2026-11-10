/** Display-only rule; preserve the raw CSV responsibility for future data integrations. */
export function displayResponsibility(raw: string): string {
  return /^\s*-\s*[（(][\s\S]*[）)]\s*$/.test(raw) ? '-' : raw
}

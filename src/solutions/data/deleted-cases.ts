import type { SolutionCase } from './types'
// Confirmed deleted in shared Sheet 가전!A5:C5 on 2026-10-31.
// Keep attached raw CSV intact; remove this override when refreshed source omits the row.
export const deletedCaseIds: ReadonlySet<string> = new Set(['가전:32'])
export function isActiveCase(item: SolutionCase) { return !deletedCaseIds.has(item.id) }

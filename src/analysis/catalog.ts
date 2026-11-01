import type { SolutionCase } from '../solutions/data/types'

/** Same canonical search data in browser and server. No management/contact columns. */
export function serializeCatalog(cases: readonly SolutionCase[]): string {
  return JSON.stringify(cases.map(({ id, symptom, description, steps }) => ({
    id, symptom, description, steps,
  })).sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
}

import type { CaseId, CasePhoto } from './types'

// Add imports from ../assets/cases/ and register arrays here later.
// Example shape only: { '욕실·수도:1': [{src: importedPhoto, alt: suppliedDescription}] }
// No example/Figma photo is assigned to a real case.
export const casePhotos: Partial<Record<CaseId, readonly CasePhoto[]>> = {}

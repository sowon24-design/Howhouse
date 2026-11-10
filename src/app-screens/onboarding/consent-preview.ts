export type ConsentChoices = { processing: boolean; overseas: boolean }
// UI-only choices, never a server receipt or persisted legal consent.
let choices: ConsentChoices = { processing: false, overseas: false }
export const readConsentChoices = (): ConsentChoices => ({ ...choices })
export function setConsentChoices(next: ConsentChoices) { choices = { ...next } }
export function clearConsentChoices() { choices = { processing: false, overseas: false } }

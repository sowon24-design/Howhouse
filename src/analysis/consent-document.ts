import information from '../app-screens/my/information-draft.json' with {type:'json'}
import publication from './policy-publication.json' with {type:'json'}

// Shared rendering/evidence source. Change the version when any disclosure wording changes.
export const privacyVersion = publication.consentVersion
export type ConsentDocumentKind = 'service' | 'processing' | 'overseas'
export const consentTitles = { service: '서비스 이용약관', processing: '개인정보 수집·이용 동의', overseas: '개인정보 국외 이전 동의' }
export const consentDocuments = {
 service: information.terms,
 processing: information.processingConsent,
 overseas: information.overseasConsent,
}

export type ConsentSurface = 'onboarding' | 'analysis'
export function consentCheckboxLabels(surface: ConsentSurface) {
 return {processing:(surface==='onboarding'?'[선택] ':'')+consentTitles.processing,overseas:(surface==='onboarding'?'[선택] ':'')+consentTitles.overseas}
}
export function consentEvidenceDocument(surface: ConsentSurface) {
 return {
  version: privacyVersion, surface,
  documents: {processing:consentDocuments.processing,overseas:consentDocuments.overseas},
  checkboxLabels: consentCheckboxLabels(surface),
  ageConfirmation: surface==='onboarding'?'[필수] 만 14세 이상입니다.':'처음 이용 화면에서 확인한 만 14세 이상 여부',
 }
}
export function consentEvidenceJson(surface: ConsentSurface) {return JSON.stringify(consentEvidenceDocument(surface))}
export async function consentEvidenceHash(surface: ConsentSurface) {
 const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(consentEvidenceJson(surface)))
 return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('')
}

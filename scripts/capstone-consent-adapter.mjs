import { readFileSync,writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
const root=resolve(import.meta.dirname,'..'),folder=resolve(root,'src/capstone/complete')
let document=readFileSync(resolve(root,'src/app-screens/onboarding/ConsentDocument.tsx'),'utf8')
document=document.replace("import {consentDocuments,consentTitles} from '../../analysis/consent-document'","import {consentTitles} from '../../analysis/consent-document'\nimport {prototypeConsentDocuments as consentDocuments} from './prototype-policy'")
document=document.replace("export {consentDocuments,consentTitles,consentCheckboxLabels} from '../../analysis/consent-document'","export {consentTitles,consentCheckboxLabels} from '../../analysis/consent-document'\nexport {prototypeConsentDocuments as consentDocuments} from './prototype-policy'")
writeFileSync(resolve(folder,'PrototypeConsentDocument.tsx'),'// Original AI consent document interactions; prototype disclosure source only.\n'+document)
let terms=readFileSync(resolve(root,'src/app-screens/onboarding/TermsScreen.tsx'),'utf8')
terms=terms.replace("import { ageConfirmationKey } from '../../analysis/release-mode'","const ageConfirmationKey='howhouse.capstone.age-confirmed.v1'")
terms=terms.replaceAll("from './ConsentDocument'","from './PrototypeConsentDocument'")
terms=terms.replace("from './consent-preview'","from '../../app-screens/onboarding/consent-preview'")
terms=terms.replace('useEffect, useState','useState').replace('consentTitles, consentDocuments, consentCheckboxLabels','consentTitles, consentCheckboxLabels')
terms=terms.replace("import information from '../my/information-draft.json'",'')
terms=terms.replace("import { configuredPrivacyClient } from '../../analysis/PrivacyActions'",'')
terms=terms.replace("import { analysisConsentReady, createAnalysisConsentFlow } from '../../analysis/consent-flow'",'')
terms=terms.replace("import './terms.css'","import '../../app-screens/onboarding/terms.css'")
terms=terms.replace('export function TermsScreen(','export function PrototypeTermsScreen(')
const begin=terms.indexOf('  const ready ='),end=terms.indexOf('  const all =')
if(begin<0||end<begin)throw Error('AI consent source structure changed; review needed.')
terms=terms.slice(0,begin)+`  const ready = false // UI review only: no server consent, authentication or AI activation.
  function leave(action:()=>void){ action() }
  async function proceed(){
    if(!service||!age||busy)return
    setBusy(true);setError('')
    try{localStorage.setItem(ageConfirmationKey,'yes');setConsentChoices(choices);onContinue()}
    catch{setError('동의 내용을 저장하지 못했어요. 연결과 기기 저장 설정을 확인한 뒤 다시 시도해 주세요.')}
    finally{setBusy(false)}
  }
`+terms.slice(end)
terms+='\nexport function PrototypeTermsView({onBack,onClose,onContinue}:{onBack:()=>void;onClose:()=>void;onContinue:()=>void;documents?:unknown}){return <PrototypeTermsScreen onBack={onBack} onClose={onClose} onContinue={onContinue}/> }\n'
writeFileSync(resolve(folder,'PrototypeTermsScreen.tsx'),'// Original AI consent UI; all submission stays local and never grants server access.\n'+terms)

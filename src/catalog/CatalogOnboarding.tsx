import { useState } from 'react'
import { OnboardingScreen } from '../app-screens/onboarding/OnboardingScreen'
import { TermsView } from '../app-screens/onboarding/TermsView'
import { NicknameScreen } from '../app-screens/onboarding/NicknameScreen'
import { minimizeAndroidApp, useAndroidBack } from '../app-screens/android-back'
import { catalogPolicy } from './policy'
import { PolicyBody } from './PolicyBody'
import { readIntroduction, saveIntroduction } from './onboarding-progress'

// Change only the onboarding sheets' display order, not shared policy sources.
function withEffectiveDateAtEnd(paragraphs: readonly string[]) {
  const dates: string[] = []
  const body = paragraphs.map(block => block.split('\n').filter(line => {
    if (line.startsWith('시행일:')) { dates.push(line); return false }
    if (line.startsWith('문구 정리일:')) return false
    return true
  }).join('\n')).filter(block => block.trim())
  return [...body, ...dates]
}

/** Only final nickname submission completes setup; closing a sheet never accepts it. */
export function CatalogOnboarding({ onComplete }: { onComplete: (nickname: string) => void }) {
  const [step, updateStep] = useState(() => { try { return readIntroduction(localStorage) } catch { return 0 } })
  const setStep = (next: number) => { updateStep(next); try { saveIntroduction(localStorage, next) } catch { /* Storage unavailable. */ } }
  const [stage, setStage] = useState<'intro' | 'terms' | 'nickname'>('intro')
  const [nickname, setNickname] = useState('')
  const start = () => { setStage('intro'); setStep(0) }
  const back = () => {
    if (stage === 'nickname') setStage('terms')
    else if (stage === 'terms') { setStage('intro'); setStep(3) }
    else if (step > 0) setStep(step - 1)
    else minimizeAndroidApp()
  }
  useAndroidBack(back)
  return <div className="hh-home-preview"><div className="hh-home-preview-frame hh-onboarding-frame">
    {stage === 'nickname' && <NicknameScreen initialValue={nickname} onBack={back} onClose={start} onComplete={onComplete} onDraftChange={setNickname}/>}
    <div hidden={stage !== 'terms'} style={{height:'100%'}}><TermsView onBack={back} onClose={start} onContinue={() => setStage('nickname')}
        documents={{service:<PolicyBody paragraphs={withEffectiveDateAtEnd(catalogPolicy.terms)}/>, privacy:<PolicyBody paragraphs={withEffectiveDateAtEnd(catalogPolicy.privacy)}/>}}/></div>
    {stage === 'intro' && <OnboardingScreen catalogOnly step={step} onStepChange={setStep} onContinue={() => setStage('terms')}/>}
  </div></div>
}

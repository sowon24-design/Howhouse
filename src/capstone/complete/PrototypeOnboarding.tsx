import { useState } from 'react'
import { OnboardingScreen } from '../../app-screens/onboarding/OnboardingScreen'
import { NicknameScreen } from '../../app-screens/onboarding/NicknameScreen'
import { minimizeAndroidApp, useAndroidBack } from '../../app-screens/android-back'
import { readIntroduction, saveIntroduction } from '../../catalog/onboarding-progress'
import { PrototypeTermsScreen } from './PrototypeTermsScreen'

/** Original onboarding screens, with the owner-requested AI consent surface. */
export function PrototypeOnboarding({onComplete}:{onComplete:(nickname:string)=>void}){
 const [step,updateStep]=useState(()=>{try{if(import.meta.env.DEV&&new URLSearchParams(location.search).get('reset-onboarding')==='1'){saveIntroduction(localStorage,0);const url=new URL(location.href);url.searchParams.delete('reset-onboarding');history.replaceState(history.state,'',url);return 0}return readIntroduction(localStorage)}catch{return 0}})
 const [stage,setStage]=useState<'intro'|'terms'|'nickname'>('intro'),[nickname,setNickname]=useState('')
 const setStep=(next:number)=>{updateStep(next);try{saveIntroduction(localStorage,next)}catch{}}
 const start=()=>{setStage('intro');setStep(0)}
 const back=()=>{if(stage==='nickname')setStage('terms');else if(stage==='terms'){setStage('intro');setStep(3)}else if(step>0)setStep(step-1);else minimizeAndroidApp()}
 useAndroidBack(back)
 return <div className="hh-home-preview"><div className="hh-home-preview-frame hh-onboarding-frame">
  {stage==='nickname'&&<NicknameScreen initialValue={nickname} onBack={back} onClose={start} onComplete={onComplete} onDraftChange={setNickname}/>}
  <div hidden={stage!=='terms'} style={{height:'100%'}}><PrototypeTermsScreen onBack={back} onClose={start} onContinue={()=>setStage('nickname')}/></div>
  {stage==='intro'&&<OnboardingScreen step={step} onStepChange={setStep} onContinue={()=>setStage('terms')}/>}
 </div></div>
}

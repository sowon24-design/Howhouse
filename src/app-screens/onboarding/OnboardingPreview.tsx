import { useEffect, useState } from 'react'
import { minimizeAndroidApp, useAndroidBack } from '../android-back'
import { Button, GNB } from '../../components/ui'
import { TermsScreen } from './TermsScreen'
import { NicknameScreen } from './NicknameScreen'
import welcome from './assets/welcome.png'
import intro1 from './assets/intro-1.png'
import intro2 from './assets/intro-2.png'
import intro3 from './assets/intro-3.png'
import '../home/home-preview.css'
import './onboarding.css'

import { introductionKey as progressKey } from '../profile-storage'
const pages = [
  { image: intro1, title: '혼자 고민하지 마세요', lines: ['갑자기 생긴 문제도, 사소한 불편도.', '어쩌집에서 함께 방법을 찾아봐요.'] },
  { image: intro2, title: '말해주면, 방법을 찾아드려요', lines: ['사진·글로 상황을 알려주세요.', 'AI가 문제에 맞는 해결 방법을 제안해요.'] },
  { image: intro3, title: '혼자 사는 마음까지 든든하게', lines: ['어디에 물어보고 무엇부터 할지.', '어쩌집과 하나씩 알아가요.'] },
] as const
function readStep() {
  try {
    const saved = localStorage.getItem(progressKey)
    return saved && /^[0-3]$/.test(saved) ? Number(saved) : 0
  } catch { return 0 }
}

export function OnboardingScreen({ step, onStepChange, onContinue }: {
  step: number; onStepChange: (step: number) => void; onContinue: () => void
}) {
  const page = pages[step - 1]
  return <main className={`hh-onboarding${step === 0 ? ' hh-onboarding--welcome' : ''}`} aria-label={step === 0 ? '환영' : `서비스 소개 ${step}`}>
    <GNB onBack={step > 0 ? () => onStepChange(step - 1) : undefined} onClose={step > 0 ? () => onStepChange(0) : undefined} />
    {step === 0 ? <div className="hh-welcome-content">
      <div className="hh-welcome-copy"><h1>반가워요,<br />집 문제는 맡겨주세요!</h1><p>어쩌집이 평온한 자취를 위해 도와줄게요.</p></div>
      <div className="hh-welcome-art-space"><div className="hh-welcome-art"><img src={welcome} alt="" /></div></div>
    </div> : <div className="hh-intro-content">
      <div className="hh-intro-story" key={step}>
        <div className={`hh-intro-art hh-intro-art--${step}`}><img src={page.image} alt="" /></div>
        <div className="hh-intro-copy"><h1>{page.title}</h1><p>{page.lines[0]}<br />{page.lines[1]}</p></div>
      </div>
      <div className="hh-intro-progress" role="img" aria-label={`소개 3개 중 ${step}번째`}>
        {[1, 2, 3].map(value => <span key={value} data-active={step === value} />)}
      </div>
    </div>}
    <footer className="hh-onboarding-next"><Button onClick={() => step < 3 ? onStepChange(step + 1) : onContinue()}>{step === 0 ? '시작하기' : '다음으로'}</Button></footer>
  </main>
}

export function OnboardingPreview({ onComplete, storageStatus, onResetSetup }: { onComplete: (nickname: string) => void; storageStatus?: string; onResetSetup?: () => void }) {
  useEffect(() => {
    // Load all introduction artwork before it is needed on the next page.
    pages.forEach(page => { const image = new Image(); image.src = page.image })
  }, [])
  const [step, setStep] = useState(readStep)
  const [termsOpen, setTermsOpen] = useState(false)
  const [nicknameOpen, setNicknameOpen] = useState(false)
  const [status, setStatus] = useState('소개 단계를 기기에 저장합니다. 새로고침 후 같은 단계에서 이어집니다.')
  function changeStep(next: number) {
    setNicknameOpen(false)
    setTermsOpen(false)
    setStep(next)
    try {
      localStorage.setItem(progressKey, String(next))
      setStatus('소개 진행 위치를 저장했습니다. 문제 입력 초안과는 별도로 유지됩니다.')
    } catch { setStatus('이 브라우저에서 저장할 수 없어, 종료 후 소개 이어보기가 유지되지 않을 수 있습니다.') }
  }
  useAndroidBack(() => {
    if (nicknameOpen) setNicknameOpen(false)
    else if (termsOpen) changeStep(3)
    else if (step > 0) changeStep(step - 1)
    else minimizeAndroidApp()
  })
  return <div className="hh-home-preview">
    <div className="hh-home-preview-frame hh-onboarding-frame">{nicknameOpen
      ? <NicknameScreen onBack={() => { setNicknameOpen(false); setStatus('약관 동의 화면으로 돌아왔습니다. 실제 동의 기록은 저장하지 않습니다.') }} onClose={() => changeStep(0)} onComplete={onComplete} />
      : termsOpen
      ? <TermsScreen onBack={() => changeStep(3)} onClose={() => changeStep(0)} onContinue={() => { setNicknameOpen(true); setStatus('닉네임은 완료 후 홈에 표시됩니다. 완료 시 닉네임과 설정 완료 여부를 기기에 저장합니다. 실제 약관 동의 기록은 저장하지 않습니다.') }} />
      : <OnboardingScreen step={step} onStepChange={changeStep} onContinue={() => { setTermsOpen(true); setStatus('약관은 Figma의 임시 원문입니다. 개인정보 처리방침에는 ‘내용바꿔야함’이 남아 있으며 최종 정책이 아닙니다. 동의 기록은 저장하지 않습니다.') }} />}</div>
    <details className="hh-home-preview-tools hh-preview-disclosure" aria-label="최초 시작·소개 미리보기 안내"><summary>개발용 안내·테스트 도구</summary><div className="hh-preview-disclosure-panel">
      <a href="#home">홈 미리보기</a> · <a href="#components">공통 컴포넌트 보기</a>
      <p role="status">{status}</p>
      <p role="status">{storageStatus}</p>
      {onResetSetup && <button type="button" onClick={onResetSetup}>테스트 초기화 · 처음부터 시작</button>}
      <button type="button" onClick={() => changeStep(0)}>환영 화면부터 다시 확인</button>
    </div></details>
  </div>
}

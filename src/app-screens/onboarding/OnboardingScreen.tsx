import { Button, GNB } from '../../components/ui'
import welcome from './assets/welcome.png'
import welcomeOverlay from './assets/welcome-overlay.png'
import intro1 from './assets/intro-1.svg'
import intro2 from './assets/intro-2.svg'
import intro3 from './assets/intro-3.svg'
import './onboarding.css'

const pages = [
  { image: intro1, title: '혼자 고민하지 마세요', lines: ['갑자기 생긴 문제도, 사소한 불편도.', '어쩌집에서 함께 방법을 찾아봐요.'] },
  { image: intro2, title: '말해주면, 방법을 찾아드려요', lines: ['사진·글로 상황을 알려주세요.', 'AI가 문제에 맞는 해결 방법을 제안해요.'] },
  { image: intro3, title: '혼자 사는 마음까지 든든하게', lines: ['어디에 물어보고 무엇부터 할지.', '어쩌집과 하나씩 알아가요.'] },
] as const
const catalogPages = [
  { image: intro1, title: '혼자 고민하지 마세요', lines: ['갑자기 생긴 문제도, 사소한 불편도.', '어쩌집에서 함께 방법을 찾아봐요.'] },
  { image: intro2, title: '비슷한 사례를 찾아보세요', lines: ['문제가 생긴 곳이나 증상을 검색해보세요.', '해결 방법을 확인할 수 있어요.'] },
  { image: intro3, title: '혼자 사는 마음까지 든든하게', lines: ['어디에서 찾고 무엇부터 할지,', '어쩌집과 하나씩 알아가요.'] },
] as const

export function OnboardingScreen({ step, onStepChange, onContinue, catalogOnly = false }: {
  catalogOnly?: boolean; step: number; onStepChange: (step: number) => void; onContinue: () => void
}) {
  const page = (catalogOnly ? catalogPages : pages)[step - 1]
  return <main className={`hh-onboarding${step === 0 ? ' hh-onboarding--welcome' : ''}`} aria-label={step === 0 ? '환영' : `서비스 소개 ${step}`}>
    <GNB onBack={step > 1 ? () => onStepChange(step - 1) : undefined} onClose={step > 0 ? () => onStepChange(0) : undefined} />
    {step === 0 ? <div className="hh-welcome-content">
      <div className="hh-welcome-copy"><h1><>우리 집 문제,<br />혼자 고민하지 마세요</></h1><p>상황에 맞는 해결 방법을 찾아드릴게요.</p></div>
      <div className="hh-welcome-art-space"><div className="hh-welcome-art"><img src={welcome} alt="" /><div className="hh-welcome-art-crop"><img src={welcomeOverlay} alt="" /></div></div></div>
    </div> : <div className="hh-intro-content">
      <div className="hh-intro-story" key={step}>
        <div className={`hh-intro-art hh-intro-art--${step}`}><img src={page.image} alt="" /></div>
        <div className="hh-intro-copy"><h1>{page.title}</h1><p>{page.lines[0]}<br />{page.lines[1]}</p></div>
      </div>
      <div className="hh-intro-progress" role="img" aria-label={`소개 3개 중 ${step}번째`}>
        {[1, 2, 3].map(value => <span key={value} data-active={step === value} />)}
      </div>
    </div>}
    <footer className="hh-onboarding-next"><Button onClick={() => step < 3 ? onStepChange(step + 1) : onContinue()}>{step === 0 ? '시작하기' : step === 3 ? '약관 동의하러 가기' : '다음으로'}</Button></footer>
  </main>
}


import { useState } from 'react'
import { Button } from '../../components/ui'
import symbol from './assets/logo-symbol.svg'
import wordmark from './assets/logo-wordmark.svg'
import offline from './assets/offline.png'
import '../home/home-preview.css'
import './system.css'

export function LaunchScreen() {
  return <main className="hh-launch" aria-label="어쩌집 접속 로딩" aria-busy="true">
    <div className="hh-launch-brand"><img src={symbol} alt="" /><img src={wordmark} alt="어쩌집" /></div>
    <span className="ui-sr-only" role="status">앱을 준비하고 있어요.</span>
  </main>
}

export function OfflineScreen({ retrying, onRetry }: { retrying: boolean; onRetry: () => void }) {
  return <main className="hh-offline" aria-label="오프라인">
    <div className="hh-offline-header" aria-hidden="true" />
    <div className="hh-offline-content">
      <h1>정보를 불러오지 못했어요.<br />네트워크를 다시 확인해 주세요.</h1>
      <div className="hh-offline-art"><img src={offline} alt="문제를 찾지 못해 난감해하는 소라게" /></div>
      <footer><Button loading={retrying} onClick={onRetry}>다시 시도하기</Button></footer>
    </div>
  </main>
}

type PreviewScreen = 'launch' | 'offline'
export function SystemPreview() {
  const [screen, setScreen] = useState<PreviewScreen>('launch')
  const [retrying, setRetrying] = useState(false)
  const [previous, setPrevious] = useState<PreviewScreen>('launch')
  const [status, setStatus] = useState('F01 화면 확인 중 · 실제 초기화는 연결하지 않았습니다.')
  return <div className="hh-home-preview">
    <div className="hh-home-preview-frame hh-system-frame">
      {screen === 'launch' ? <LaunchScreen /> : <OfflineScreen retrying={retrying} onRetry={() => { setRetrying(true); setStatus('재연결 대기 예시 · 아래 연결 회복 버튼으로 복귀를 확인하세요.') }} />}
    </div>
    <aside className="hh-home-preview-tools" aria-label="F 화면 미리보기 조작">
      <a href="#home">홈 미리보기</a> · <a href="#components">공통 컴포넌트 보기</a>
      <p>아래 버튼은 테스트용입니다. 실제 네트워크 감지·자동 진입·분석 복구는 연결하지 않았습니다.</p>
      <div className="hh-system-controls">
        <button onClick={() => { setScreen('launch'); setRetrying(false); setStatus('F01 화면 확인 중') }}>F01 다시 보기</button>
        <button disabled={screen !== 'launch'} onClick={() => { window.location.hash = 'onboarding' }}>로딩 완료 → 온보딩</button>
        <button disabled={screen !== 'launch'} onClick={() => { window.location.hash = 'home' }}>로딩 완료 → 홈</button>
        <button disabled={screen === 'offline'} onClick={() => { setPrevious(screen); setRetrying(false); setScreen('offline'); setStatus('연결 끊김 예시 · 앱의 다시 시도하기를 눌러 보세요.') }}>연결 끊김 → F02</button>
        <button disabled={screen !== 'offline'} onClick={() => { setScreen(previous); setRetrying(false); setStatus('연결 회복 예시 · 끊기기 직전의 F01로 복귀했습니다.') }}>연결 회복</button>
        <button disabled={!retrying} onClick={() => { setRetrying(false); setStatus('연결 미회복 예시 · 다시 시도할 수 있습니다. 실제 대기 종료 기준은 통합 때 확정합니다.') }}>미회복 상태 확인</button>
      </div>
      <p role="status">{status}</p>
    </aside>
  </div>
}

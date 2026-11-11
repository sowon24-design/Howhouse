import symbol from './assets/logo-symbol.svg'
import wordmark from './assets/logo-wordmark.svg'
import './system.css'

export function LaunchScreen() {
  return <main className="hh-launch" aria-label="어쩌집 접속 로딩" aria-busy="true">
    <div className="hh-launch-brand"><img src={symbol} alt="" /><img src={wordmark} alt="어쩌집" /></div>
    <span className="ui-sr-only" role="status">앱을 준비하고 있어요.</span>
  </main>
}

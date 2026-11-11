import { useEffect, useRef, useState } from 'react'
import { Button, GNB } from '../components/ui'
import { catalogPolicy } from './policy'
import contactCrab from '../app-screens/my/assets/contact-w10.png'
import '../app-screens/my/information.css'

export function CatalogContact({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState('')
  const [sequence, setSequence] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  async function copyEmail() {
    let copied = false
    try { await navigator.clipboard.writeText(catalogPolicy.email); copied = true } catch { /* HTTP preview fallback below. */ }
    if (!copied) {
      const previous = document.activeElement as HTMLElement | null
      const field = document.createElement('textarea')
      field.value = catalogPolicy.email
      field.readOnly = true
      field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'
      document.body.append(field)
      field.select()
      try { copied = document.execCommand('copy') } catch { copied = false }
      finally { field.remove(); previous?.focus({ preventScroll: true }) }
    }
    if (timer.current) clearTimeout(timer.current)
    setSequence(value => value + 1)
    setStatus(copied ? '이메일을 복사했어요.' : '복사하지 못했어요. 위 이메일 주소를 직접 복사해 주세요.')
    timer.current = setTimeout(() => setStatus(''), 1500)
  }
  return <main className="hh-information hh-information--contact" aria-label="문의하기">
    <div className="hh-information-header"><GNB title="문의하기" onBack={onBack} /></div>
    <div className="hh-information-scroll" role="region" aria-label="문의하기 본문" tabIndex={0}>
      <div className="hh-contact-content">
        <section><h1>어쩌집 운영팀 문의</h1><p>서비스 이용 중 불편한 점이나 개인정보 관련 요청이 있다면<br />{catalogPolicy.email}으로 문의해 주세요.</p></section>
        <ul><li>서비스 이용 및 오류 문의</li><li>사례 안내의 오류·안전 문제 관련 문의</li><li>개인정보 열람·정정·삭제·처리정지 요청</li><li>기타 서비스 개선 의견</li></ul>
        <div className="hh-contact-art"><img src={contactCrab} alt="" /></div>
      </div>
      <footer className="hh-information-actions">
        <div className="hh-contact-copy-action"><div role="status" aria-live="polite" aria-atomic="true" className="hh-contact-copy-status">{status && <span key={sequence}>{status}</span>}</div><Button onClick={copyEmail}>이메일 복사하기</Button></div>
        <p>문의 내용을 확인한 뒤 순차적으로 답변드립니다.</p>
      </footer>
    </div>
  </main>
}

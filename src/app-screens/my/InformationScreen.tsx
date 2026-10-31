import { useEffect, useRef, useState } from 'react'
import { Button, GNB } from '../../components/ui'
import draft from './information-draft.json'
import contactCrab from './assets/contact-crab.png'
import './information.css'

export type InformationPage = 'app' | 'data' | 'terms' | 'privacy' | 'contact'
export const policyLinks = {
  data: 'https://app.notion.com/p/xamxam33/40902821a7f380beb305dd0f095f5d79',
  terms: 'https://app.notion.com/p/xamxam33/40902821a7f38009a098dc50f64202c4?source=copy_link',
  privacy: 'https://app.notion.com/p/xamxam33/40902821a7f3809aa417d65279f87c37?source=copy_link',
} as const
const titles = { app: '앱 정보', data: '개인정보 및 데이터 관리', terms: '이용약관', privacy: '개인정보 처리방침', contact: '문의하기' }
const needsReview = (text: string) => /커뮤니티|음성|\[[^\]]+\]/.test(text)
const bulletText = /^(처리 정보:|이용 목적:|처리 방식:|보관 및 삭제:|AI 분석 입력 정보:|커뮤니티 게시글 및 댓글:|고객 문의 기록:|서비스 운영 기록:|AI 분석 서비스:|지도 및 장소 검색 서비스:|기타 외부 서비스:|서비스명:|운영자:|이메일:)/

export function InformationScreen({ page, onBack }: { page: InformationPage; onBack: () => void }) {
  const [headerHidden, setHeaderHidden] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const [copySequence, setCopySequence] = useState(0)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current) }, [])
  const scrollPosition = useRef(0)
  const scrollTravel = useRef(0)
  async function copyEmail() {
    const text = 'test.email.com'
    let copied = false
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); copied = true } catch { /* Fall back for restricted clipboard access. */ }
    }
    if (!copied) {
      const active = document.activeElement as HTMLElement | null
      const field = document.createElement('textarea')
      field.value = text
      field.readOnly = true
      field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'
      document.body.append(field)
      field.select()
      try { copied = document.execCommand('copy') } catch { copied = false }
      finally { field.remove(); active?.focus({ preventScroll: true }) }
    }
    if (copyTimer.current) clearTimeout(copyTimer.current)
    copyTimer.current = setTimeout(() => setCopyStatus(''), 1500)
    setCopySequence(sequence => sequence + 1)
    setCopyStatus(copied ? '이메일을 복사했어요.' : '복사하지 못했어요. test.email.com을 직접 복사해 주세요.')
  }
  const external = page === 'data' || page === 'terms' || page === 'privacy' ? policyLinks[page] : undefined
  return <main className={`hh-information hh-information--${page}`} aria-label={titles[page]}>
    <div className="hh-information-header" data-hidden={headerHidden} onFocusCapture={() => setHeaderHidden(false)}><GNB title={titles[page]} onBack={onBack} /></div>
    <div className="hh-information-scroll" onScroll={event => {
      const el = event.currentTarget
      const next = Math.max(0, Math.min(el.scrollTop, el.scrollHeight - el.clientHeight))
      const delta = next - scrollPosition.current
      scrollPosition.current = next
      if (next <= 0) { setHeaderHidden(false); scrollTravel.current = 0; return }
      if (!delta) return
      scrollTravel.current = Math.sign(delta) === Math.sign(scrollTravel.current) ? scrollTravel.current + delta : delta
      if (Math.abs(scrollTravel.current) >= 8) { setHeaderHidden(scrollTravel.current > 0); scrollTravel.current = 0 }
    }} tabIndex={0} role="region" aria-label={`${titles[page]} 본문`}>
      {page === 'contact' ? <div className="hh-contact-content">
        <section><h1>어쩌집 고객센터</h1><p>서비스 이용 중 불편한 점이나 개선 의견이 있다면<br /><span className="hh-information-review">[test.email.com]으로 문의해 주세요.</span></p></section>
        <ul><li>서비스 이용 및 오류 문의</li><li className="hh-information-review">게시글 신고 및 커뮤니티 관련 문의</li><li>개인정보 열람·삭제 및 처리 관련 문의</li><li>기타 서비스 개선 의견</li></ul>
        <div className="hh-contact-art"><img src={contactCrab} alt="전화로 문의를 받는 소라게" /></div>
      </div> : <div className="hh-information-sections">
        {draft[page].map((section, index) => {
          const communitySection = section.title.includes('커뮤니티')
          let communityGroup = false
          return <section className={page === 'privacy' && index === 0 ? 'hh-information-intro' : undefined} key={index}>
            {section.title && <h2 className={needsReview(section.title) ? 'hh-information-review' : undefined}>{section.title}</h2>}
            <div className="hh-information-paragraphs">{section.paragraphs.map((text, i) => {
              if (/^[①②③④]/.test(text)) communityGroup = text.includes('커뮤니티')
              const review = communitySection || communityGroup || needsReview(text)
              const bullet = page === 'privacy' && bulletText.test(text)
              return <p key={i} className={`${review ? 'hh-information-review' : ''}${bullet ? ' hh-information-bullet' : ''}`}>{text}</p>
            })}</div>
          </section>
        })}
      </div>}
      <footer className="hh-information-actions">
        {page === 'contact' ? <><div className="hh-contact-copy-action"><div role="status" aria-live="polite" aria-atomic="true" className="hh-contact-copy-status">{copyStatus && <span key={copySequence}>{copyStatus}</span>}</div><Button onClick={copyEmail}>이메일 복사하기</Button></div><p>문의 내용 확인 후 순차적으로 답변드리겠습니다.</p></> : <div className="hh-information-buttons">
          {external && <a className="ui-button ui-button--pale" href={external} target="_blank" rel="noopener noreferrer">외부 링크에서 보기<span className="ui-sr-only"> (새 탭)</span></a>}
          <Button onClick={onBack}>확인했어요</Button>
        </div>}
      </footer>
    </div>
  </main>
}

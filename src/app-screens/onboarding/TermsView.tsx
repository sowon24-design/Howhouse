import { useState, type ReactNode } from 'react'
import { Button, Checkbox, GNB } from '../../components/ui'
import { Dialog } from '../../components/ui/Dialogs'
import './terms.css'

export function TermsView({ onBack, onClose, onContinue, documents }: {
  onBack: () => void; onClose: () => void; onContinue: () => void
  documents: { service: ReactNode; privacy: ReactNode }
}) {
  const [service, setService] = useState(false)
  const [privacy, setPrivacy] = useState(false)
  const [age, setAge] = useState(false)
  const [sheet, setSheet] = useState<'service' | 'privacy'>('service')
  const [open, setOpen] = useState(false)
  const all = service && privacy && age
  const title = sheet === 'service' ? '서비스 이용약관' : '개인정보 처리방침'
  const show = (kind: 'service' | 'privacy') => { setSheet(kind); setOpen(true) }
  return <main className="hh-terms" aria-label="약관 동의">
    <GNB title="약관 동의" onBack={onBack} onClose={onClose}/>
    <div className="hh-terms-content">
      <h1>서비스를 이용하려면 약관에 동의해 주세요.</h1>
      <div className="hh-terms-checks">
        <div className="hh-terms-row hh-terms-all"><Checkbox label="전체 동의" checked={all} onChange={event => { setService(event.target.checked); setPrivacy(event.target.checked); setAge(event.target.checked) }}/></div>
        <div className="hh-terms-row"><Checkbox variant="stroke" label="[필수] 만 14세 이상이에요." checked={age} onChange={event => setAge(event.target.checked)}/></div>
        <div className="hh-terms-row"><Checkbox variant="stroke" label="[필수] 서비스 이용약관에 동의해요" checked={service} onChange={event => setService(event.target.checked)}/><button type="button" className="hh-terms-view" aria-label="서비스 이용약관 보기" onClick={() => show('service')}>보기</button></div>
        <div className="hh-terms-row"><Checkbox variant="stroke" label="[필수] 개인정보 처리방침을 확인했어요" checked={privacy} onChange={event => setPrivacy(event.target.checked)}/><button type="button" className="hh-terms-view" aria-label="개인정보 처리방침 보기" onClick={() => show('privacy')}>보기</button></div>
      </div>
    </div>
    <footer className="hh-onboarding-next"><Button disabled={!all} onClick={() => { if (all) onContinue() }}>동의하고 시작하기</Button></footer>
    <Dialog open={open} onClose={() => setOpen(false)} label={title} className="ui-action-sheet hh-terms-sheet" closeOnBackdrop swipeDismiss>
      <div className="ui-sheet-handle" aria-hidden="true"/>
      <div className="hh-terms-sheet-content">
        <h2>{title}</h2>
        <div className="hh-terms-document" key={sheet} tabIndex={0} role="region" aria-label={title + ' 전문'}>{documents[sheet]}</div>
        <Button onClick={() => setOpen(false)}>닫기</Button>
      </div>
    </Dialog>
  </main>
}

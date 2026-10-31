import { useState } from 'react'
import { Button, Checkbox, GNB } from '../../components/ui'
import { Dialog } from '../../components/ui/Dialogs'
import draft from './terms-draft.json'
import './terms.css'

export function TermsScreen({ onBack, onClose, onContinue }: { onBack: () => void; onClose: () => void; onContinue: () => void }) {
  const [service, setService] = useState(false)
  const [privacy, setPrivacy] = useState(false)
  const [sheet, setSheet] = useState<'service' | 'privacy'>('service')
  const [open, setOpen] = useState(false)
  const all = service && privacy
  function show(kind: 'service' | 'privacy') { setSheet(kind); setOpen(true) }
  const title = sheet === 'service' ? '서비스 이용약관' : '개인정보 처리방침'
  return <main className="hh-terms" aria-label="약관 동의">
    <GNB title="약관 동의" onBack={onBack} onClose={onClose} />
    <div className="hh-terms-content">
      <h1>약관 동의가 필요해요</h1>
      <div className="hh-terms-checks">
        <div className="hh-terms-row hh-terms-all"><Checkbox label="모두 동의" checked={all} onChange={event => { setService(event.target.checked); setPrivacy(event.target.checked) }} /></div>
        <div className="hh-terms-row"><Checkbox variant="stroke" label="[필수] 서비스 이용약관 동의" checked={service} onChange={event => setService(event.target.checked)} /><button type="button" className="hh-terms-view" aria-label="서비스 이용약관 보기" onClick={() => show('service')}>보기</button></div>
        <div className="hh-terms-row"><Checkbox variant="stroke" label="[필수] 개인정보 처리방침 동의" checked={privacy} onChange={event => setPrivacy(event.target.checked)} /><button type="button" className="hh-terms-view" aria-label="개인정보 처리방침 보기" onClick={() => show('privacy')}>보기</button></div>
      </div>
    </div>
    <footer className="hh-onboarding-next"><Button disabled={!all} onClick={() => { if (all) onContinue() }}>동의하고 시작하기</Button></footer>
    <Dialog open={open} onClose={() => setOpen(false)} label={title} className="ui-action-sheet hh-terms-sheet">
      <div className="ui-sheet-handle" aria-hidden="true" />
      <div className="hh-terms-sheet-content">
        <h2>{title}</h2>
        <div className="hh-terms-document" key={`${sheet}-${open}`} tabIndex={0} role="region" aria-label={`${title} 전문`}>
          {draft[sheet].map(section => <section key={section.title}><h3>{section.title}</h3>{section.paragraphs.map((text, index) => <p key={index}>{text}</p>)}</section>)}
        </div>
        <Button onClick={() => setOpen(false)}>닫기</Button>
      </div>
    </Dialog>
  </main>
}

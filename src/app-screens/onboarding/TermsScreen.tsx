import { ageConfirmationKey } from '../../analysis/release-mode'
import { useState } from 'react'
import { Button, Checkbox, GNB } from '../../components/ui'
import { Dialog } from '../../components/ui/Dialogs'
import { ConsentDocument, consentTitles } from './ConsentDocument'
import type { ConsentDocumentKind } from './ConsentDocument'
import { readConsentChoices, setConsentChoices } from './consent-preview'
import './terms.css'

export function TermsScreen({ onBack, onClose, onContinue }: { onBack: () => void; onClose: () => void; onContinue: () => void }) {
  const [service, setService] = useState(false)
  const [choices, setChoices] = useState(readConsentChoices)
  const [sheet, setSheet] = useState<ConsentDocumentKind>('service')
  const [open, setOpen] = useState(false)
  const [age, setAge] = useState(false)
  const [error, setError] = useState('')
  const all = service && age && choices.processing && choices.overseas
  function show(kind: ConsentDocumentKind) { setSheet(kind); setOpen(true) }
  return <main className="hh-terms" aria-label="이용 동의">
    <GNB title="이용 동의" onBack={onBack} onClose={onClose} />
    <div className="hh-terms-content">
      <h1>시작하기 전에 확인해 주세요</h1>
      <div className="hh-terms-checks">
        <div className="hh-terms-row hh-terms-all"><Checkbox label="모두 동의" checked={all} onChange={event => { const checked = event.target.checked; setService(checked); setAge(checked); setChoices({ processing: checked, overseas: checked }) }} /></div>
        <div className="hh-terms-row"><Checkbox variant="stroke" label="[필수] 만 14세 이상입니다." checked={age} onChange={event => setAge(event.target.checked)} /></div>
        <div className="hh-terms-row"><Checkbox variant="stroke" label="[필수] 서비스 이용약관 동의" checked={service} onChange={event => setService(event.target.checked)} /><button type="button" className="hh-terms-view" aria-label="서비스 이용약관 보기" onClick={() => show('service')}>보기</button></div>
        {(['processing', 'overseas'] as const).map(kind => <div className="hh-terms-row" key={kind}><Checkbox variant="stroke" label={`[선택] ${consentTitles[kind]}`} checked={choices[kind]} onChange={event => setChoices({ ...choices, [kind]: event.target.checked })} /><button type="button" className="hh-terms-view" aria-label={`${consentTitles[kind]} 보기`} onClick={() => show(kind)}>보기</button></div>)}
      </div>
      {error && <p role="alert">{error}</p>}
    </div>
    <footer className="hh-onboarding-next"><Button disabled={!service || !age} onClick={() => { try { localStorage.setItem(ageConfirmationKey, 'yes'); setConsentChoices(choices); onContinue() } catch { setError('기기에 확인 내용을 저장하지 못했어요. 저장 설정을 확인해 주세요.') } }}>동의하고 시작하기</Button></footer>
    <Dialog open={open} onClose={() => setOpen(false)} label={consentTitles[sheet]} className="ui-action-sheet hh-terms-sheet" closeOnBackdrop swipeDismiss>
      <div className="ui-sheet-handle" aria-hidden="true" />
      <ConsentDocument kind={sheet} onBack={() => setOpen(false)} />
    </Dialog>
  </main>
}

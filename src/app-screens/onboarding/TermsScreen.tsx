import { ageConfirmationKey } from '../../analysis/release-mode'
import { useEffect, useState } from 'react'
import { Button, Checkbox, GNB } from '../../components/ui'
import { Dialog } from '../../components/ui/Dialogs'
import { ConsentDocument, consentTitles, consentDocuments, consentCheckboxLabels } from './ConsentDocument'
import type { ConsentDocumentKind } from './ConsentDocument'
import { readConsentChoices, setConsentChoices } from './consent-preview'
import information from '../my/information-draft.json'
import { configuredPrivacyClient } from '../../analysis/PrivacyActions'
import { analysisConsentReady, createAnalysisConsentFlow } from '../../analysis/consent-flow'
import './terms.css'

export function TermsScreen({ onBack, onClose, onContinue }: { onBack: () => void; onClose: () => void; onContinue: () => void }) {
  const [service, setService] = useState(false)
  const [choices, setChoices] = useState(readConsentChoices)
  const [sheet, setSheet] = useState<ConsentDocumentKind>('service')
  const [open, setOpen] = useState(false)
  const [age, setAge] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const ready = analysisConsentReady(import.meta.env.VITE_RELEASE_PRIVACY_READY, { information, consentDocuments })
  const [flow] = useState(() => createAnalysisConsentFlow({
    isReady: () => analysisConsentReady(import.meta.env.VITE_RELEASE_PRIVACY_READY, { information, consentDocuments }),
    save: acceptance => configuredPrivacyClient().consent({...acceptance,documentSurface:'onboarding'}),
  }))
  useEffect(() => () => flow.cancel(), [flow])
  function leave(action: () => void) { flow.cancel(); action() }
  async function proceed() {
    if (!service || !age || busy) return
    setBusy(true); setError('')
    const complete = () => { setConsentChoices(choices); onContinue() }
    try {
      localStorage.setItem(ageConfirmationKey, 'yes')
      if (ready && choices.processing && choices.overseas) {
        await flow.submit({ageAtLeast14:age,processingAccepted:choices.processing,overseasAccepted:choices.overseas}, complete)
      } else complete() // Optional refusal/draft policy never creates an anonymous account.
    } catch { setError('동의 내용을 저장하지 못했어요. 연결과 기기 저장 설정을 확인한 뒤 다시 시도해 주세요.') }
    finally { setBusy(false) }
  }
  const all = service && age && choices.processing && choices.overseas
  function show(kind: ConsentDocumentKind) { setSheet(kind); setOpen(true) }
  return <main className="hh-terms" aria-label="이용 동의">
    <GNB title="이용 동의" onBack={() => leave(onBack)} onClose={() => leave(onClose)} />
    <div className="hh-terms-content">
      <h1>시작하기 전에 확인해 주세요</h1>
      <div className="hh-terms-checks">
        <div className="hh-terms-row hh-terms-all"><Checkbox disabled={busy} label="모두 동의" checked={all} onChange={event => { const checked = event.target.checked; setService(checked); setAge(checked); setChoices({ processing: checked, overseas: checked }) }} /></div>
        <div className="hh-terms-row"><Checkbox disabled={busy} variant="stroke" label="[필수] 만 14세 이상입니다." checked={age} onChange={event => setAge(event.target.checked)} /></div>
        <div className="hh-terms-row"><Checkbox disabled={busy} variant="stroke" label="[필수] 서비스 이용약관 동의" checked={service} onChange={event => setService(event.target.checked)} /><button type="button" className="hh-terms-view" aria-label="서비스 이용약관 보기" onClick={() => show('service')}>보기</button></div>
        {(['processing', 'overseas'] as const).map(kind => <div className="hh-terms-row" key={kind}><Checkbox disabled={busy} variant="stroke" label={consentCheckboxLabels('onboarding')[kind]} checked={choices[kind]} onChange={event => setChoices({ ...choices, [kind]: event.target.checked })} /><button type="button" className="hh-terms-view" aria-label={`${consentTitles[kind]} 보기`} onClick={() => show(kind)}>보기</button></div>)}
      </div>
      {error && <p role="alert">{error}</p>}
      {!ready && <p role="status">AI 분석은 최종 안내 준비 후 이용할 수 있어요. 지금은 기존 사례를 볼 수 있어요.</p>}
    </div>
    <footer className="hh-onboarding-next"><Button disabled={!service || !age || busy} onClick={() => { void proceed() }}>{busy ? '동의 확인 중' : '동의하고 시작하기'}</Button></footer>
    <Dialog open={open} onClose={() => setOpen(false)} label={consentTitles[sheet]} className="ui-action-sheet hh-terms-sheet" closeOnBackdrop swipeDismiss>
      <div className="ui-sheet-handle" aria-hidden="true" />
      <ConsentDocument kind={sheet} onBack={() => setOpen(false)} />
    </Dialog>
  </main>
}

import { useEffect, useRef, useState } from 'react'
import { Button, Checkbox } from '../../components/ui'
import { Dialog } from '../../components/ui/Dialogs'
import { ConsentDocument, consentTitles, consentDocuments, consentCheckboxLabels } from '../onboarding/ConsentDocument'
import type { ConsentDocumentKind } from '../onboarding/ConsentDocument'
import { readConsentChoices, setConsentChoices } from '../onboarding/consent-preview'
import { configuredPrivacyClient } from '../../analysis/PrivacyActions'
import { analysisConsentReady, createAnalysisConsentFlow } from '../../analysis/consent-flow'
import { ageConfirmationKey } from '../../analysis/release-mode'
import information from '../my/information-draft.json'
import '../onboarding/terms.css'

// The same UI is connected only after policy approval; draft text stays blocked.
export function AnalysisConsentSheet({ open, onClose, onContinue }: { open: boolean; onClose: () => void; onContinue: () => void }) {
  const [choices, setChoices] = useState(readConsentChoices)
  const [detail, setDetail] = useState<ConsentDocumentKind | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const continueRef = useRef(onContinue)
  continueRef.current = onContinue
  const ready = analysisConsentReady(import.meta.env.VITE_RELEASE_PRIVACY_READY, { information, consentDocuments })
  const [flow] = useState(() => createAnalysisConsentFlow({
    isReady: () => analysisConsentReady(import.meta.env.VITE_RELEASE_PRIVACY_READY, { information, consentDocuments }),
    save: acceptance => configuredPrivacyClient().consent(acceptance),
  }))
  useEffect(() => { if (!open) flow.cancel(); return () => flow.cancel() }, [open, flow])
  async function accept() {
    let age = false
    try { age = localStorage.getItem(ageConfirmationKey) === 'yes' } catch { /* Explicit error below. */ }
    if (!age) { setMessage('처음 이용 화면에서 만 14세 이상 확인을 완료해 주세요.'); return }
    if (!ready || busy) return
    setBusy(true); setMessage('')
    try {
      await flow.submit({ageAtLeast14:age,processingAccepted:choices.processing,overseasAccepted:choices.overseas}, () => {
        setConsentChoices(choices)
        continueRef.current()
      })
    } catch { setMessage('동의 저장을 확인하지 못했어요. 글·사진은 전송하지 않았어요. 다시 시도해 주세요.') }
    finally { setBusy(false) }
  }
  const wasOpen = useRef(false)
  if (open !== wasOpen.current) {
    wasOpen.current = open
    if (open) { setChoices(readConsentChoices()); setDetailOpen(false); setMessage('') }
  }
  function close() { flow.cancel(); onClose() }
  return <><Dialog open={open} onClose={close} label="분석을 위한 이용 동의" className="ui-action-sheet hh-terms-sheet hh-analysis-consent-sheet" closeOnBackdrop swipeDismiss>
    <div className="ui-sheet-handle" aria-hidden="true" />
    <div className="hh-terms-sheet-content">
      <h2>분석 전에 확인해 주세요</h2>
      <p className="hh-consent-description">글·사진 분석을 이용하려면 아래 두 항목에 동의해 주세요.</p>
      <div className="hh-terms-checks">
        <div className="hh-terms-row hh-terms-all"><Checkbox label="모두 동의" disabled={busy} checked={choices.processing && choices.overseas} onChange={e => setChoices({ processing: e.target.checked, overseas: e.target.checked })} /></div>
        {(['processing', 'overseas'] as const).map(kind => <div className="hh-terms-row" key={kind}><Checkbox variant="stroke" disabled={busy} label={consentCheckboxLabels('analysis')[kind]} checked={choices[kind]} onChange={e => setChoices({ ...choices, [kind]: e.target.checked })} /><button className="hh-terms-view" type="button" aria-label={`${consentTitles[kind]} 보기`} onClick={() => { setDetail(kind); setDetailOpen(true) }}>보기</button></div>)}
      </div>
      {message && <p role="status" className="hh-consent-notice">{message}</p>}
      {!ready && <p role="status" className="hh-consent-notice">개인정보 안내의 최종 검토 전이라 실제 분석을 시작할 수 없어요. 글과 사진은 유지돼요.</p>}
      <div className="hh-consent-actions"><Button variant="pale" onClick={close}>닫기</Button>
      <Button disabled={!ready || busy || !choices.processing || !choices.overseas} onClick={() => { void accept() }}>{busy ? '동의 확인 중' : '동의하고 분석하기'}</Button></div>
    </div>
  </Dialog>
  <Dialog open={open && detailOpen} onClose={() => setDetailOpen(false)} label={detail ? consentTitles[detail] : '약관 상세'} className="ui-action-sheet hh-terms-sheet hh-consent-detail-sheet" closeOnBackdrop swipeDismiss>
    <div className="ui-sheet-handle" aria-hidden="true" />
    {detail && <ConsentDocument kind={detail} onBack={() => setDetailOpen(false)} />}
  </Dialog></>
}

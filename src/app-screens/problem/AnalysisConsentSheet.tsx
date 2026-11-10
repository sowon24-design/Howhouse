import { useRef, useState } from 'react'
import { Button, Checkbox } from '../../components/ui'
import { Dialog } from '../../components/ui/Dialogs'
import { ConsentDocument, consentTitles } from '../onboarding/ConsentDocument'
import type { ConsentDocumentKind } from '../onboarding/ConsentDocument'
import { readConsentChoices, setConsentChoices } from '../onboarding/consent-preview'
import '../onboarding/terms.css'

// Screen-only staging. Do not call the analysis/privacy API with draft policy text.
export function AnalysisConsentSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [choices, setChoices] = useState(readConsentChoices)
  const [detail, setDetail] = useState<ConsentDocumentKind | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [message, setMessage] = useState('')
  const wasOpen = useRef(false)
  if (open !== wasOpen.current) {
    wasOpen.current = open
    if (open) { setChoices(readConsentChoices()); setDetailOpen(false); setMessage('') }
  }
  return <><Dialog open={open} onClose={onClose} label="분석을 위한 이용 동의" className="ui-action-sheet hh-terms-sheet hh-analysis-consent-sheet" closeOnBackdrop swipeDismiss>
    <div className="ui-sheet-handle" aria-hidden="true" />
    <div className="hh-terms-sheet-content">
      <h2>분석 전에 확인해 주세요</h2>
      <p className="hh-consent-description">글·사진 분석을 이용하려면 아래 두 항목에 동의해 주세요.</p>
      <div className="hh-terms-checks">
        <div className="hh-terms-row hh-terms-all"><Checkbox label="모두 동의" checked={choices.processing && choices.overseas} onChange={e => setChoices({ processing: e.target.checked, overseas: e.target.checked })} /></div>
        {(['processing', 'overseas'] as const).map(kind => <div className="hh-terms-row" key={kind}><Checkbox variant="stroke" label={consentTitles[kind]} checked={choices[kind]} onChange={e => setChoices({ ...choices, [kind]: e.target.checked })} /><button className="hh-terms-view" type="button" aria-label={`${consentTitles[kind]} 보기`} onClick={() => { setDetail(kind); setDetailOpen(true) }}>보기</button></div>)}
      </div>
      {message && <p role="status" className="hh-consent-notice">{message}</p>}
      <div className="hh-consent-actions"><Button variant="pale" onClick={onClose}>닫기</Button>
      <Button disabled={!choices.processing || !choices.overseas} onClick={() => { setConsentChoices(choices); setMessage('두 항목을 확인했어요. 최종 약관 적용 후 분석과 연결됩니다.') }}>동의하고 분석하기</Button></div>
    </div>
  </Dialog>
  <Dialog open={open && detailOpen} onClose={() => setDetailOpen(false)} label={detail ? consentTitles[detail] : '약관 상세'} className="ui-action-sheet hh-terms-sheet hh-consent-detail-sheet" closeOnBackdrop swipeDismiss>
    <div className="ui-sheet-handle" aria-hidden="true" />
    {detail && <ConsentDocument kind={detail} onBack={() => setDetailOpen(false)} />}
  </Dialog></>
}

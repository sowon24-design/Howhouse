import { useState } from 'react'
import { B02 } from '../solutions/B02'
import type { B02ViewData } from '../solutions/B02'
import { B03 } from '../solutions/B03'
import { toMessageRecipients } from '../solutions/message-model'
import type { ResolutionStatus } from '../solutions/resolution-message'
import { useAndroidBack } from '../app-screens/android-back'
import '../app-screens/solutions/solutions-flow.css'
import '../app-screens/home/home-preview.css'

/** Both origins use one in-memory view. Generated data never uses an existing ID lookup. */
export function AnalysisResultFlow({ data, onHome, onConnectionLost }: { data: B02ViewData; onHome: () => void; onConnectionLost?: () => void }) {
  const [contact, setContact] = useState(false)
  const [visited, setVisited] = useState(false)
  const [resolution, setResolution] = useState<ResolutionStatus | undefined>()
  useAndroidBack(() => contact ? setContact(false) : onHome())
  return <div className="hh-home-preview">
    <div className="hh-home-preview-frame hh-solutions-frame">
      <div className="hh-solutions-layer" inert={contact} aria-hidden={contact}>
        <B02 data={data} onBack={onHome} onComplete={onHome}
          onContact={status => { setResolution(status);setVisited(true);setContact(true) }} onOpenVideo={() => {}} onPreviewOpinion={() => {}} />
      </div>
      {visited && <div className="hh-solutions-layer hh-solutions-front" hidden={!contact} inert={!contact} aria-hidden={!contact}>
        <B03 recipients={toMessageRecipients(data)} resolution={resolution} contextual={data.source === 'generated'} onBack={() => setContact(false)} />
      </div>}
    </div>
    <details className="hh-home-preview-tools hh-preview-disclosure"><summary>개발용 안내·테스트 도구</summary><div className="hh-preview-disclosure-panel">
      <p>분석 결과를 메모리에서 표시합니다. 문의 문장 선택·수정·복사에는 추가 AI 호출이 없습니다.</p>
      {import.meta.env.DEV && onConnectionLost && <button type="button" onClick={onConnectionLost}>연결 끊김 재현 · API 호출 없음</button>}
    </div></details>
  </div>
}

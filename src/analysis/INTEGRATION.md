# 분석 호출·결과 연결

현재 동작은 [CURRENT.md](CURRENT.md), 팀 리뷰 범위는 [YESUL_HANDOFF.md](YESUL_HANDOFF.md).
실행 모듈과 샘플은 입력 흐름 하나당 한 번 만들고 언마운트 때 취소한다.

```ts
import { createHttpAnalysisClient, serializeCatalog } from './analysis'
import { solutionCases, getSolutionById } from './solutions/data'

const analysis = createHttpAnalysisClient({
  catalog: serializeCatalog(solutionCases), getSolutionById,
})
const handle = analysis.startAnalysis({
  analysisUserText: '문제 글', analysisUserPhotos: [], // File[], 최대 5장
}, event => {
  // running → A04
  // succeeded → event.result의 existing/generated에 따라 B02
  // failed → error.code로 A05/입력 오류/F02 구분 (YESUL_HANDOFF.md)
  // cancelled → 화면 이동을 요청한 콜백에서 목적지 처리
})
// 뒤로/X/연결 단절/언마운트:
handle.cancel()
// 또는 analysis.cancel()
// handle.completed는 succeeded/failed/cancelled 중 하나로 한 번 종료된다.
```

함수 안에서 화면 주소를 바꾸지 않는다. App은 result를 메모리에 보관하고 화면을 연결한다.
기존 결과는 `getSolutionById(result.caseId)`, 생성 결과는 `result.solution`을 B02/B03에 직접 전달한다.
서버의 GeneratedContent를 프론트의 `toGeneratedSolution`이 B 표시용 데이터로 변환한다.

## 무료 샘플

```ts
import { createSampleAnalysisClient, existingCaseSample, generatedSampleResult } from './analysis'
const sample = createSampleAnalysisClient({ result: generatedSampleResult, getSolutionById })
// result: existingCaseSample으로 바꾸면 기존 사례 샘플
const pending = sample.startAnalysis({analysisUserText: '[연결 테스트]', analysisUserPhotos: []}, onState)
sample.completeSample(pending.requestId, 'success') // 또는 'failure'
```

샘플은 수동 완료이며 실제 분석/사진 판단/네트워크/과금이 없다. 타이머로 성공을 흉내 내지 않는다.
`generatedResultDraft`는 이전 검토 초안 호환용 export이며 새 연결은 `generatedSampleResult`를 사용한다.

## 전송과 상태

- 로컬 개발 endpoint: POST `http://127.0.0.1:8787/api/analysis/match`.
- FormData: analysisUserText, analysisUserPhotos(반복), requestId, catalogVersion.
- 시작 전 GET /session으로 얻는 값은 임시 로컬 세션 토큰이며 OpenAI 키가 아니다.
- 응답 requestId/형식/필수 항목/ID를 검증한 뒤 상태를 알린다.
- 새 요청은 이전 요청을 취소한다. 늦은 응답은 현재 결과를 덮어쓰지 않는다.
- 프론트 전체 요청과 서버 모델 작업 각각 90초. 자동 재시도 없음.
- 실패 재입력/단절 복구는 글·사진 유지. 홈·새로고침·앱 종료는 메모리 입력 초기화.
- F02 다시 시도는 `checkAnalysisConnection({verifyUpstream:true})`만 수행하며 분석을 시작하지 않는다.

최종 성공은 existing/generated 두 종류다. `needs-generation`을 최종 결과로 반환하지 않는다.
신규 유료 분석 한도와 API 금액은 CURRENT/REMAINING 문서를 참고한다.

# 예슬·연우에게 전달할 분석 연결 안내

기준: 2026-10-31 사용자 전달 답변, 원격 main `7bc77420c8edb820db2b239c65e28bbc73934f7b`의 실제 타입·조회 함수·CSV.

## 완료와 미완료

- 완료: 샘플 분석 시작, 요청 ID, 상태 알림, 수동 성공/실패, 취소, 이전 요청의 늦은 성공·실패 무시, 글·사진 배열 스냅샷, 의미 있는 취소/상태 검사.
- 기존 사례 샘플: `욕실·수도:1`. 현재 CSV와 연우 변환 함수를 통해 ID·제목·4단계·대상별 4문장 존재 확인.
- 생성 샘플: `generatedResultDraft`. 실제 LLM 출력이 아닌 **연우 검토용 B 표시 데이터 초안**. 현재 `SolutionView` 타입과 컴파일 호환 확인. 필수 항목·빈 값·생성 ID·카테고리/분야/번호 의미에 대한 최종 합의는 미완료.
- 미완료: 실제 API·LLM·서버·사진 분석, 오프라인 판정·복구, 서버 작업 상태 조회·실제 비용 중단, 새 생성 결과의 최종 서버 형식, 실제 A→B 화면 연결.
- App·라우터·공통 컴포넌트·스타일·패키지·다른 팀원의 파일을 변경하지 않았음. commit·push·PR 없음.

현재 소원 로컬 브랜치에는 아직 최신 main의 `src/solutions`가 없습니다. 따라서 클라이언트가 B 코드를 직접 import하지 않고, 예슬의 최신 통합 브랜치에서 실제 `getSolutionById`를 주입합니다. 실제 데이터 없이 ID가 맞다고 간주하는 대체 조회 함수를 제품 코드에 넣지 마세요.

## 1. 시작 함수

`createSampleAnalysisClient`는 **입력 화면 흐름 하나당 한 번** 생성합니다. React에서는 useState 초기화 함수에 두고 재렌더 때 다시 만들지 않습니다.

아래 코드는 최신 main의 B 데이터와 함께 예슬 화면에서 사용할 연결 예시입니다. 이 문서의 콜백 코드는 아직 App에 적용하지 않았습니다.

```tsx
import { useEffect, useRef, useState } from 'react'
import {
  createSampleAnalysisClient, existingCaseSample,
} from '../../analysis'
import type { AnalysisHandle, AnalysisInput, AnalysisEvent } from '../../analysis'
import { getSolutionById } from '../../solutions/data'
import type { SolutionView } from '../../solutions/data'

// 입력 화면을 소유한 컴포넌트 내부:
const [analysis] = useState(() => createSampleAnalysisClient<SolutionView>({
  result: existingCaseSample,
  getSolutionById,
}))
const requestRef = useRef<AnalysisHandle<SolutionView> | null>(null)
useEffect(() => () => analysis.cancel(), [analysis])

function beginAnalysis(input: AnalysisInput) {
  requestRef.current = analysis.startAnalysis(input, onAnalysisState)
}

function onAnalysisState(event: AnalysisEvent<SolutionView>) {
  // running: A04 표시
  // succeeded: result.source로 기존/생성 분기 후 B02로 전달
  // failed: A05 표시. error는 개발용 정보이며 최종 화면 문구가 아님
  // cancelled: 요청 종료만 반영. 여기서 목적지를 임의 결정하지 않음
  // 취소 사유가 superseded면 새 요청 때문에 이전 요청이 종료된 것
  console.info(event.status, event.requestId) // 입력·사진 원문 로그 금지
}

// A02의 onAnalyze에서:
// beginAnalysis({ analysisUserText, analysisUserPhotos })

// 테스트 도구의 '샘플 성공' 버튼에서:
// if (requestRef.current) analysis.completeSample(requestRef.current.requestId)

// 테스트 도구의 '샘플 실패' 버튼에서:
// if (requestRef.current) analysis.completeSample(requestRef.current.requestId, 'failure')
```

샘플은 시작 직후 `running`이며 테스트 도구에서 완료하기 전까지 대기합니다. 임의의 분석 시간·시간 제한·재시도 횟수를 정하지 않기 위해 자동 타이머를 넣지 않았습니다. 실제 사용자 화면의 CTA를 추가하는 요구가 아니라 기존 미리보기 도구에서 호출할 테스트 제어입니다. 사진의 내용에 따라 결과가 달라지는 실제 분석이 아닙니다.

## 2. 상태와 완료 결과

모든 상태에 `requestId`와 `mode: 'sample' | 'api'`가 있습니다. 현재 샘플 경로는 반드시 `sample`입니다. `api`라는 타입이 존재한다고 실제 API가 구현된 것은 아닙니다.

| status | 추가 데이터 | 예슬 연결 |
| --- | --- | --- |
| running | 없음 | A04 |
| succeeded | result | 기존 사례 조회 또는 생성 내용으로 B02 |
| failed | error.code, error.message | A05. 세부 실패/오프라인 정책은 후속 합의 |
| cancelled | reason: user / superseded | 이동을 요청한 화면에서 목적지 처리 |

`startAnalysis`가 반환한 핸들의 `completed`는 종료 상태로 한 번만 resolve됩니다. 취소는 오류나 분석 실패로 취급하지 않습니다. 새 요청을 시작하면 같은 클라이언트의 이전 요청을 자동 취소합니다. 취소된 요청의 늦은 응답은 상태 콜백·완료 결과를 다시 바꾸지 않습니다. 화면 콜백은 전체 진행 상태를 다시 소유하기보다 전달받은 상태를 반영합니다.

## 3. 취소

```ts
requestRef.current?.cancel() // 해당 요청만 취소
analysis.cancel()           // 해당 클라이언트의 현재 요청 취소
```

- 뒤로·Android Back: 즉시 취소 → 예슬이 A02 복귀, 기존 입력 유지.
- X: 즉시 취소 → 예슬이 홈 이동 및 입력 초기화.
- A05 '다시 문제 알려주기': 기존 글·사진 유지, A02 복귀. 자동으로 새 요청하지 않음.
- 홈·새로고침·앱 종료: 예슬의 기존 메모리 입력 보관 규칙 유지. 언마운트에서 취소하되 화면 종료 시 React state를 변경하지 않도록 예슬 콜백의 언마운트 가드도 유지.
- 취소는 로컬 결과 반영을 막고 `AbortSignal`을 전달합니다. 서버 처리·제공사 과금 중단을 보장하지 않습니다.
- 오프라인 복구 시 자동 재요청하지 않습니다. 현재 서버 상태 조회 API가 없으므로 재개·복귀 화면을 임의 구현하지 않습니다.

## 4. 기존 사례 결과 샘플

```json
{ "source": "existing", "caseId": "욕실·수도:1" }
```

`getSolutionById(result.caseId)`로 원본 `SolutionView`를 얻어 B02/B03에 전달합니다. 본문·단계·문의 문장을 다시 생성하지 않습니다. 샘플 완료 시에도 주입된 조회 함수로 ID 존재를 확인하며 잘못된 ID는 `case-not-found`로 실패합니다. 조회 실패를 '적합한 사례 없음'으로 해석해 자동 생성하지 않습니다. 최종 오류 UI·필수 항목 정책은 합의가 남아 있습니다.

## 5. 생성 결과 샘플 — 연우 검토 후 사용

`samples.ts`의 `generatedResultDraft`는 `{ source: 'generated', solution: ... }`입니다. 검토 승인이 나면 샘플 생성 시 `result`에 명시적으로 지정하여 같은 시작·상태·취소 호출로 테스트할 수 있습니다. 기본 경로는 기존 사례 샘플입니다.

- 내용은 '[연결 테스트]' 문구이며 실제 수리 안내나 실제 LLM 결과가 아님.
- 현재 B 표시 타입 호환을 위해 `욕실·수도:preview-generated-001`이라는 표시용 ID를 사용한 **초안**. 기존 사례 조회·등록·저장에 사용하지 않음. 최종 생성 결과 ID 규칙은 미확정.
- `source: 'generated'`와 내용을 함께 유지하여 B02→B03에도 같은 객체 전달. B03 진입 때 기존 사례 ID 조회로 대체하면 안 됨.
- 준비물·예상 시간·책임·참고·영상·사진은 빈 예시이고 단계 1개, 문의 대상 2개와 테스트 문장을 포함. 빈 값 허용·필수 항목 목록과 문의 분기는 연우 검토 필요.
- 최신 B03은 대상별 문장을 순서대로 합치고 빈 문장을 제외하여 최초 본문을 만듦. 별도 본문이 필요하다는 과거 README 기록을 대체. 공통 기능정의는 수정하지 않았음.
- 이 표시용 객체를 그대로 LLM이 생성하도록 요청하지 않음. 관리/표시용 ID·분야·번호와 모델 출력 항목은 서버 설계 때 분리.

연우에게 확인할 최소 항목: 생성 결과의 표시 ID/분야/번호 처리, 필수 항목·빈 단계 처리, 문의 대상·문장 필수 조건, 생성 결과 객체를 B03까지 보존하는 방식. 타입 검사를 통과한 사실은 이 정책의 합의나 내용의 안전성을 보장하지 않습니다.

## 6. 검사

저장소 루트, Node.js 24.15.0·npm 11.12.1 환경:

```powershell
node --test src/analysis/client.test.mjs
npm run build
npm run verify:foundations
```

별도 작업 폴더에서 최신 main 7bc7742의 `types.ts`를 읽어 두 샘플이 `AnalysisResult<SolutionView>`와 호환됨을 추가 검사했습니다. 공통 타입을 소원 폴더에 복제하지 않았습니다. 사진 분석·실제 API·B 화면 통합·Android 검증을 완료한 것은 아닙니다.

## 7. 실제 API로 전환할 때

`createAnalysisClient(실제Transport, 'api')`로 클라이언트 생성 부분을 교체합니다. 화면의 `startAnalysis(input, onState)`, 핸들의 `cancel()`·`completed`는 같은 인터페이스를 사용합니다. 실제 transport에서는 서버 요청·응답 검증·같은 데이터 버전의 사례 검색·실패 분류를 구현해야 합니다. 샘플 제어 `completeSample`은 API 클라이언트에 없습니다.

서버·모델·계정·비용·사진 규격·실제 취소 방식은 별도 제안/합의 사항입니다. 키는 서버에서만 보관하고 프론트·VITE_·GitHub에 넣지 않습니다. 모델 비교 테스트는 이 화면 연결 샘플과 별도로 진행합니다.

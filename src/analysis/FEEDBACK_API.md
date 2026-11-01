# 해결 방법 평가·의견 API 연결 안내

## 현재 상태

- 사용자 구분: 기존 Supabase 임시 사용자 ID 재사용. 재설치/브라우저 데이터 삭제 시 새 ID이며 기기 간 계정 통합은 하지 않는다.
- 사용자·결과별 최신 평가 1개를 유지한다. 의견 제출은 독립된 기록이며 평가 변경 이력은 수집하지 않는다.
- **보관 기간은 팀 검토 중이다. 실제 Supabase 적용, Cron 등록, 공용 서버 배포, B 화면 연결은 아직 하지 않았다.**
- 현재 공용 서버에는 이 변경 코드가 없어 아래 신규 경로가 `404`일 수 있다. 다음 `503 feedback-not-configured` 설명은 새 코드 배포 후 보관 정책을 설정하지 않은 경우의 동작이다.
- `FEEDBACK_RETENTION_DAYS`를 임의로 넣지 않는다. 설정이 없으면 이 API만 `503 feedback-not-configured`이며 기존 분석은 계속 제공한다.
- 서버와 DB의 승인 보관 기간이 일치하고 만료 삭제 작업이 준비된 경우에만 저장할 수 있다. SQL 안에도 기간 기본값은 없다.
- B 화면, App.tsx, 전체 이동, 공통 컴포넌트/스타일은 이번 작업에서 변경하지 않았다.

## 주소와 인증

기존 분석 서버의 설정된 HTTPS 기본 주소에 아래 경로를 붙인다. 실제 시험 서버 주소·프로젝트 공개용 설정은 팀 내 전달 자료에서 공유하며 GitHub에 게시하지 않는다.

| 메서드·경로 | 용도 |
| --- | --- |
| `POST /api/feedback/state` | 현재 사용자의 최신 평가·순번 조회 |
| `POST /api/feedback/rating` | 좋아요·싫어요·해제 저장 |
| `POST /api/feedback/opinions` | 하나의 의견 사유 또는 직접 입력 제출 |

모든 요청은 `Content-Type: application/json`, 기존 Supabase 임시 사용자 JWT인 `Authorization: Bearer <user access token>`을 사용한다. OpenAI 키, Supabase secret, `ownerId`를 앱 요청에 넣지 않는다. 기존 분석용 `/session` 토큰은 의견 API에서 요구하지 않는다. 서버가 JWT를 확인해 사용자 ID를 결정한다. 기존 허용 Origin 정책은 유지한다.

예슬 연결용 호출 예시(화면 구현 코드는 아님):

```ts
import { configuredAppSession } from './app-session'
import { resolveAnalysisBaseUrl } from './endpoint'

async function sendFeedback(path: 'state' | 'rating' | 'opinions', body: unknown, signal: AbortSignal) {
  const getToken = configuredAppSession()
  if (!getToken) throw new Error('공용 서버 인증 설정이 필요합니다.')
  const token = await getToken(signal)
  const response = await fetch(`${resolveAnalysisBaseUrl()}/api/feedback/${path}`, {
    method: 'POST', signal,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  const data = await response.json()
  if (!response.ok) throw Object.assign(new Error('의견 저장 실패'), { code: data.code, status: response.status })
  return data
}
```

## 결과 식별

기존 사례는 현재 `solutionCases`/`getSolutionById`에 실제로 있는 ID를 그대로 사용한다.

```json
{ "source": "existing", "caseId": "욕실·수도:1" }
```

생성 결과는 기존 `toGeneratedSolution(content, requestId)`가 만드는 ID를 그대로 사용한다. 다음 값은 설명용 UUID다.

```json
{ "source": "generated", "resultId": "generated:22222222-2222-4222-8222-222222222222" }
```

서버는 분석이 실제로 반환한 `requestId`·결과 source·검증된 사용자만 별도 연결 테이블에 기록한다. 생성 결과는 해당 사용자가 받은 생성 결과 기록이 있어야 평가·의견을 저장한다. 다른 사용자의 ID, 기존 사례를 반환한 분석의 UUID, 미리보기용 가짜 ID, 기능 활성화 전에 반환해 연결 기록이 없는 생성 결과는 `result-unavailable`이다. 기존 사례 ID로 바꿔 끼우지 않는다. 생성 내용·문제 글·사진·문의 메시지는 이 연결 테이블에 넣지 않는다.

분석 성공 JSON에 `feedbackAvailable`이 추가된다. 결과 연결 저장 실패가 유료 분석 답변을 숨기지 않도록 `false`와 함께 분석 결과는 제공한다. 기존 프론트 분석 클라이언트는 이 필드를 아직 전달하지 않으므로 B 연결에서는 저장 API의 실패 응답도 처리해야 한다. 기존 생성 ID 형식과 분석 결과 데이터 구조는 변경하지 않았다.

## 현재 평가 읽기

```json
{ "result": { "source": "existing", "caseId": "욕실·수도:1" } }
```

```json
{ "rating": null, "revision": 0, "updatedAt": null }
```

## 평가 저장·해제·순서

```json
{
  "operationId": "44444444-4444-4444-8444-444444444444",
  "result": { "source": "existing", "caseId": "욕실·수도:1" },
  "revision": 1,
  "rating": "like"
}
```

`rating`은 `"like"`, `"dislike"`, `null` 중 하나다. 다른 선택으로 바꿀 때와 모두 해제할 때도 **새 사용자 조작마다 새 operationId와 더 큰 revision**을 사용한다. 해제는 행 삭제가 아닌 `rating:null` 상태로 보관해 늦은 이전 선택의 부활을 막는다.

성공 응답 예시(시각은 서버 DB에서 기록):

```json
{ "operationId": "44444444-4444-4444-8444-444444444444", "saved": true,
  "duplicate": false, "revision": 1, "submittedAt": "2026-11-01T00:00:00+00:00" }
```

같은 operationId·같은 정규화된 내용의 재시도는 처음 저장한 접수 시각과 함께 `duplicate:true`를 반환하고 다시 저장하지 않는다. 같은 ID에 다른 내용은 `409 idempotency-conflict`다. 오래된 revision은 `409 stale-selection`이며 최신 선택을 덮지 않는다. 예를 들어 revision 12가 먼저 저장됐다면 나중에 도착한 11은 거절된다.

화면 연결 시 지켜야 할 점:

1. 결과를 열 때 state로 서버 revision을 읽는다. 같은 결과의 클릭 순번은 동기적으로 증가시킨다(React state 갱신을 기다리며 중복 번호를 만들지 않는다).
2. 한 조작의 네트워크 재시도에는 **원래 operationId·revision·내용을 그대로** 사용한다. 응답을 못 받은 경우 저장 안 됐다고 단정하지 않는다.
3. UI는 가장 최근 조작에 해당하는 응답만 반영한다. 오래된 요청의 성공/실패 응답으로 현재 버튼을 되돌리지 않는다.
4. 여러 탭에서 revision이 충돌하면 state를 다시 읽고 아직 유효한 최신 사용자 의도만 더 큰 revision·새 operationId로 보낸다. API만으로 서로 다른 탭의 사용자 의도 시각을 알아낼 수는 없다.
5. 임시 사용자 세션이 유지되는 범위에서 적용된다. 서버가 확인한 사용자 ID는 요청 본문으로 대체하지 않는다.

## 의견 제출

평가 저장과 별도 호출한다. 싫어요 선택, 의견 시트 열기/취소, 의견 제출을 하나의 API로 묶지 않는다. 시트 취소 시 의견 API를 호출하지 않으며 이미 저장한 평가는 유지한다.

| reason | 화면 사유 |
| --- | --- |
| `situation-mismatch` | 내 상황과 달라요. |
| `incorrect-method` | 방법이 틀린 것 같아요. |
| `unsafe-method` | 따라하기 위험해 보여요. |
| `too-difficult` | 어려워 보여요. |
| `missing-information` | 필요한 준비물·정보가 빠졌어요. |
| `custom` | 직접 입력하기 |

일반 사유는 하나의 문자열만 보내고 `text`는 보내지 않는다.

```json
{ "operationId": "55555555-5555-4555-8555-555555555555",
  "result": { "source": "existing", "caseId": "욕실·수도:1" }, "reason": "unsafe-method" }
```

직접 입력은 `custom`과 `text`를 함께 보낸다. 공백·보이지 않는 제어 형식 문자뿐인 내용은 거절하며 입력 길이는 2,000자 이하다. 앞뒤 공백만 제거해 저장하고, 내부 줄바꿈은 보존한다. 이름·연락처·사진·원본 문제·문의 메시지를 별도 필드로 보내지 않는다. 자유 의견에 개인정보를 적지 않도록 화면 담당자가 안내할 수 있다.

```json
{ "operationId": "66666666-6666-4666-8666-666666666666",
  "result": { "source": "generated", "resultId": "generated:22222222-2222-4222-8222-222222222222" },
  "reason": "custom", "text": "이 단계의 설명을 조금 더 쉽게 알려주면 좋겠어요." }
```

```json
{ "operationId": "66666666-6666-4666-8666-666666666666", "saved": true,
  "duplicate": false, "submittedAt": "2026-11-01T00:00:00+00:00" }
```

빠른 중복 클릭은 같은 제출 의도로 묶어야 한다. 화면에서는 제출 중 동기적인 ref/Promise 잠금으로 동일 operationId를 재사용하고, 요청마다 UUID를 새로 만들지 않는다. 내용 변경 없이 재시도할 때도 같은 ID를 보존한다. 새로운 의견을 의도적으로 제출할 때만 새 ID를 만든다. 서로 다른 ID의 별도 제출까지 임의로 합쳐 지우지는 않는다.

감사 화면은 **200 + saved:true 또는 이미 저장 확인된 duplicate:true**를 받은 뒤에만 표시한다. 실패/타임아웃에서는 작성한 사유·본문·재시도 ID를 보존한다.

## 실패 응답

본문은 `{ "code": "..." }`이며 원본 DB 오류·키·의견 내용을 반환하지 않는다.

| HTTP / code | 연결 시 처리 |
| --- | --- |
| 401 `auth-required` | 임시 인증을 확인하고 입력 보존. 다른 사용자 ID를 임의 생성해 대체하지 않기 |
| 403 `forbidden` | 허용 Origin/Host 등 서버 연결 설정 확인 |
| 422 `invalid-input` | 사유/공백/길이/순번/예상 밖 필드 확인 |
| 404 `case-not-found` | 현재 사례 목록에 없는 ID. 임의 ID로 대체하지 않기 |
| 404 `result-unavailable` | 생성 결과의 소유·원본 연결·만료 확인 불가. 실제 저장 성공으로 표시하지 않기 |
| 409 `stale-selection` | 이전 순번. 최신 사용자 의도를 보존하고 state 확인 |
| 409 `idempotency-conflict` | 같은 처리 ID에 다른 내용. 호출 측 ID 관리 확인 |
| 503 `feedback-not-configured` | 새 코드 배포 후 보관 기간/DB 정책/삭제 작업 미준비. 저장 성공으로 표시하지 않기 |
| 503 `storage-unavailable` | DB 또는 저장 응답 확인 실패. 입력과 처리 ID 보존 후 수동 재시도 |
| 네트워크/타임아웃 | 저장 여부 미확정. 같은 처리 ID로 재시도. 자동 성공 처리 금지 |

## 테이블·보관·활성화 순서

새 테이블: `howhouse_feedback_policy`(운영 정책만), `howhouse_feedback_results`(사용자별 결과 연결), `howhouse_feedback_ratings`(최신 상태), `howhouse_feedback_opinions`(별도 제출), `howhouse_feedback_operations`(최소 중복 방지 접수증). 모두 RLS를 켜고 일반 사용자 직접 접근과 RPC 실행을 차단한다. 서버가 확인한 사용자 범위만 서버 전용 SQL 함수로 처리한다. 직접 입력 의견은 기존 서버 암호화 키로 AES-256-GCM 암호화하고, 중복 확인은 HMAC으로 계산한다.

보관 기간 결정 후 별도 검토/승인할 순서:

1. `feedback-schema.sql` 검토 후 실제 Supabase 적용·권한 검증.
2. Supabase Cron 준비 후 `feedback-retention.sql`의 NULL을 **팀이 정한 일수**로 바꾸고 검토·실행. 기본값 없음. 기존 같은 이름 작업이 있으면 덮어쓰지 않고 중단한다.
3. 삭제 작업은 매시간 만료 행을 지운다. 만료 즉시 API 조회/수정에서 제외하고, 물리 삭제에는 정상 작동 기준 최대 약 1시간의 간격이 있다. 작업 실패/비활성은 별도 운영 확인이 필요하다. 기한은 평가 마지막 갱신/의견 제출/접수 시각 기준이다. 보관 기간 변경은 기존 행에 소급 적용하지 않는다.
4. 서버 전용 `FEEDBACK_RETENTION_DAYS`를 같은 일수로 설정하고 승인된 코드 배포. 비밀 키 추가/재발급은 필요하지 않다.
5. 실제 서버에서 저장·중복·권한·만료 작업을 확인한 다음 예슬이 B 화면을 연결.

의견/평가 저장은 GPT를 호출하지 않는다. 초기 서버/테이블 준비와 실제 배포·B 연결 완료를 구분한다.

## 검증 실행과 한계

```powershell
node --test server/analysis/feedback.test.mjs
```

실제 PostgreSQL SQL 검사는 프로젝트 의존성을 바꾸지 않는 별도 PGlite 검증 모듈 경로가 있을 때 실행한다.

```powershell
$env:FEEDBACK_PGLITE_MODULE = '<별도 검증 도구의 pglite/dist/index.js 절대 경로>'
node --test server/analysis/feedback-sql.test.mjs
```

모듈 경로가 없으면 SQL 검사는 skip으로 표시되며 통과로 간주하지 않는다. 테스트의 30일은 격리된 검증용 값으로 제품 정책이 아니다. SQL 실행·rollback·RLS·역순 도착·중복은 검증했지만 PGlite는 단일 PostgreSQL 연결이므로 실제 Supabase 다중 연결의 락 경합, Cron 스케줄러, 네트워크 응답 유실, B 화면 연결은 실환경 확인이 남는다.

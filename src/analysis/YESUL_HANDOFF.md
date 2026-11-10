# 예슬·연우 전달용 — 분석 API 통합

기준: 2026-11-01. 실행·제약: [CURRENT.md](CURRENT.md), 호출 코드: [INTEGRATION.md](INTEGRATION.md).

최신 추가: [안전한 전문가 연결](SAFE_ESCALATION.md). 안전한 점검 요청은 정상 B02/B03 결과로 처리한다. 기존 1~8단계를 유지하며 Schema/검증/프롬프트의 범위를 일치시켰다. 새 unsupported-input은 A05 지원 범위 밖으로 표시하고 정보 부족·안전 안내 불가·모델 거절과 구분한다. B 화면·공통 UI·App 이동 코드는 변경하지 않았다. 서버와 앱 배포 반영은 별도다.

## Android 후속 연결 합의

- 소원: 환경별 API 주소 옵션/환경변수 제공. [API_ADDRESS.md](API_ADDRESS.md) 참조.
- 예슬: API/샘플 모드 UI, 일반 화면 F02 복귀와 분석 서버 확인 분리.
- 이번 후속 변경에서는 App.tsx·ProblemPreview.tsx·ConnectivityBoundary.tsx를 수정하지 않는다.
- 실제 APK Origin과 HTTPS 서버 주소가 정해지면 서버 허용 정책을 별도 맞춘다. 현재 PC 서버를 Android 연결 완료로 간주하지 않는다.

## 현재 전달 내용

소원 쪽 분석은 실제 OpenAI API까지 연결했습니다. 글·사진으로 기존 사례를 먼저 판단하고,
적합한 사례가 없으면서 정보가 충분하면 해결 방법과 필요한 문의 문장을 한 번의 응답에 생성합니다.
기존 사례는 `{ source: 'existing', caseId }`, 생성은 `{ source: 'generated', solution }`입니다.
생성 내용을 기존 사례 ID로 재조회하거나 CSV에 추가하지 않습니다.

- 사례 ID: 현재 `src/solutions/data`의 분야+번호. 샘플 `욕실·수도:1`.
- 생성 샘플: `generatedSampleResult` (화면 연결용임을 표시). wire 형식은 CURRENT.md, B 표시 변환은 `toGeneratedSolution`.
- 필수 생성 항목: 제목·설명·1~8단계·예상 시간·책임 주체·판단 참고. 시간/책임 불명확 시 `-`, 판단 참고는 책임 주체가 있어도 필수다. 준비물 없으면 [], 문의가 불필요한 대상은 []. 문의 대상별 순서 있는 문장 최대 4개이며 한 문장씩 블록을 만든다. 생성 계약 버전 2와 구버전 호환은 SAFE_ESCALATION.md를 따른다.
- 문의 메시지는 같은 분석에서 자동 작성되며 B03 진입·선택·편집·복사 때 추가 AI 호출이 없습니다.
- `startAnalysis({analysisUserText,analysisUserPhotos}, onState)` → running / succeeded / failed / cancelled.
- 요청 핸들의 `cancel()` 또는 클라이언트 `cancel()`. 이전/취소 요청의 늦은 응답은 무시합니다.
- 사용자 승인 대기 제한 90초. 시간 초과는 A05, 다시 입력은 글·사진 유지, 자동 재시도 없음.
- B02 뒤로/완료 → 홈. B03 복사 → 화면 유지, 뒤로 → B02. B03 편집 내용은 왕복해도 유지합니다.
- F02 분석 단절 → 취소, 복구 확인 뒤 입력을 보존한 A02. 일반 화면 → 기존 화면/편집 상태 복귀. 자동 분석 없음.

## 오류 전달

`getAnalysisFailureKind(code)`로 분류합니다.

| 구분 | code | 현재 연결 |
| --- | --- | --- |
| 연결 | connection-error | F02, 서버 응답을 받지 못함. 물리적 인터넷 단절이라고 단정하지 않음 |
| 분석 | insufficient-input / unsupported-input / unsafe-input / model-refusal / analysis-timeout | A05. 정보 부족·지원 범위 밖·안전 안내 불가·제공사 거절·시간 초과를 구분 |
| 서버 | api-error / server-error / server-busy | 입력 보존 A02. busy는 실제 한도와 분리 |
| 응답 | invalid-response / case-not-found / catalog-mismatch | 입력 보존 A02, 개발 도구에서 원인 코드 확인 |
| 입력 | invalid-input | 형식·크기 안내, 새 모델 호출 전 거절 |
| 한도 | budget-limit | 한도 안내, 자동 호출 없음 |

`checkAnalysisConnection({verifyUpstream:true})`은 로컬 서버와 OpenAI 네트워크 경로만 확인합니다.
모델 호출/키 전송/새 과금은 없으며 잔액이나 실제 분석 성공을 보증하지 않습니다.
요청 상태 조회·재개 API는 없습니다. 서버 취소는 시도하지만 이미 발생한 비용 중단·환불은 보장하지 않습니다.

## 팀원이 검토할 공유 파일

- 예슬: `src/App.tsx`, `src/app-screens/problem/ProblemPreview.tsx`, `ProblemScreen.tsx`, `src/app-screens/analysis/AnalysisScreen.tsx` 및 `ConnectivityBoundary`/`AnalysisResultFlow`.
- 연우: `src/solutions/B02.tsx`, `b02.css`: 생성 결과 표시 타입과 사진 없는 결과의 헤더 겹침 수정. 원본 CSV·조회 함수·B03 로직 변경 없음.
- 실행 보안: `vite.config.ts`에서 server 폴더/.local 파일 접근 차단.
- 공통 컴포넌트·전역 스타일·디자인 문서·의존성 구성 변경 없음.

## 실행·검증 범위

루트에서 `npm ci`(최초 의존성 설치가 필요할 때), 두 창에서 각각 `node server/analysis/server.mjs`, `npm run dev -- --strictPort`.
키는 각 실행 PC의 `server/analysis/.env`에서만 설정합니다. PR에는 `.env.example`만 포함합니다.
키가 없는 팀원은 무료 샘플 모드로 연결을 확인할 수 있습니다. 신규 실제 분석은 과금됩니다.

PC 및 USB 폰 Chrome에서 실제 사진→분석→원본 해결 방법, 실패 후 사진 유지, F02 복구,
B03 편집·복사·왕복 보존을 확인했습니다. 생성 문의는 저장된 실제 GPT 결과로 PC B03에서 확인했습니다.
APK/WebView와 외부 서버는 아직 연결하지 않았습니다. 무료 팀 전용 배포 준비는 [DEPLOYMENT.md](DEPLOYMENT.md).

공통 문서 갱신 필요: 기존 사례 우선/없으면 조건부 생성, no_match≠실패, 생성 결과 별도 전달,
문의 본문 구성, 90초 제한과 F02 복구 정책. 이 PR에서는 공통 기획·디자인 문서를 직접 바꾸지 않습니다.
이 문서는 전달용이며 다른 채팅/팀원에게 자동 메시지를 보내지 않았습니다.


## 공용 시험 서버 후속 계약

사용자 최신 결정은 모든 시험 앱 사용자 사용 가능, 별도 로그인 화면 없음, 분석 횟수 제한 없음이다.
TRIAL_SERVER.md를 기준으로 전달한다. VITE_ANALYSIS_AUTH_URL / VITE_ANALYSIS_AUTH_PUBLISHABLE_KEY 설정 시
기존 함수 안에서 자동 임시 인증을 사용하므로 App/ProblemPreview/ConnectivityBoundary를 소원이 수정하지 않는다.
서버는 사용자 토큰을 검증하고 답변을 사용자별로 저장한다. auth-required(kind access)는 오프라인과 구분한다.
OpenAI 키와 Supabase secret은 서버만 보관. Supabase publishable 값은 공개 식별 값으로 별개다.
실제 배포 주소와 Android Origin을 확인한 뒤 예슬이 앱을 재빌드·설치해야 한다.

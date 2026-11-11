# PR62 실제 AI·사진 분석 적용 순서 — 아직 실행하지 않음

2026-11-12. AI 없는 main은 보존하고 `codex/ai-release-privacy`의 고정 후보 커밋을 사용한다. Supabase Free·현재 서울 프로젝트·AI/사진·동의 증빙·철회/삭제·평가/신고를 유지한다. 로그인과 YouTube API 등록은 후속이다. 이 문서는 배포나 설정 변경 승인이 아니다.

## 이미 완료한 것은 반복하지 않음

Supabase Free DPA·조직 공유 설정, 기존 DB/RLS/RPC 검사와 Render 환경 표시값, 공개 근거 및 v9 본문, 사진 메타데이터 제거, 로컬 SQL·이전/최신 Android 후보 검증은 기존 기록을 사용한다. 새 DB·프로젝트·유료 가입·일괄 SQL 적용·키 교체를 요구하지 않는다. 버전·동의 해시·카탈로그 일치는 후보를 고정할 때만 새 후보 기준으로 생성한다.

현재 소스의 `analysisConsentApproved=false`, `notionSyncVerified=false`는 유지되어 있다. 두 값을 확인 없이 켜지 않는다. 기존 환경변수의 표시값과 Live 프로세스의 값은 구분한다.

## 1. 예슬이의 Notion v9 공개 반영

기존 전달 ZIP의 Markdown6개와 manifest를 사용한다. 예슬이로부터 반영 완료 URL을 받으면 로그아웃 상태의 공개 접근·본문·v9 버전을 대조한다. 실제 확인 전에는 `notionSyncVerified`를 true로 기록하지 않는다. 본문을 수정하면 앱 원본과 서버 증빙도 변경되므로 별도 편집 없이 v9 그대로 반영한다. 이번 작업에서 Notion을 편집하지 않았다.

## 2. 코드 승인 상태와 후보 고정 — 실제 적용 승인 후

공개 본문 확인이 끝나고 사용자가 실제 연결 적용을 승인하면 `policy-approval.json`의 `notionSyncVerified` 및 `analysisConsentApproved` 변경을 별도 코드 변경으로 남긴다. 후자는 실제 분석을 허용하는 배포 결정이지 모든 최종 검증이 이미 통과했다는 표시는 아니다. 실연결 검증 잔여는 지우지 않는다. 최종 서명 앱 검증이 끝나기 전에 완료로 기록하지 않는다.

승인 변경 이후의 전체 커밋 SHA를 후보로 고정하고 아래 명령의 출력 JSON을 보관한다. 이 JSON은 공개 해시·URL만 포함하며 운영 키나 DB 행을 읽지 않는다. 미커밋 제품 코드 변경이 없는 상태에서 실행한다. 현재 산출물을 과거 APK와 일치한다고 단정하는 도구는 아니다.

```powershell
node --experimental-strip-types scripts/ai-candidate-manifest.mjs
node scripts/sync-policy-documents.mjs --check
```

## 3. Render: 무엇을 바꾸고 무엇을 유지하는가

현재 서비스 `howhouse-analysis-test`의 마지막 확인 Live는 `c18a3cf`, 연결 브랜치는 `feature/analysis-hosted-trial`이었다. 최신 상태라고 새로 단정하지 않으며 적용 직전에 Live 표시만 확인한다. main 병합은 필요 없다.

공식 Render 기능상 같은 연결 저장소의 특정 SHA를 지정해 배포할 수 있다. 따라서 **권장안은 연결 브랜치를 바꾸지 않고 Manual Deploy → Deploy a specific commit에서 승인한 PR62 후보 SHA를 지정**하는 것이다. Deploy latest commit은 기존 연결 브랜치의 다른 코드를 배포할 수 있으므로 사용하지 않는다. Auto-Deploy Off를 유지하고 배포된 Live SHA를 확인한다. 지금은 버튼을 누르지 않았다.

| Render 항목 | 적용 시 기대값/행동 |
| --- | --- |
| 저장소·요금제·리전 | 기존 저장소와 무료 서비스 유지. 새 프로젝트/유료 전환 없음 |
| 실행 명령 | 저장소 루트 기준 `node --experimental-strip-types server/analysis/trial-server.mjs`. 현 설정이 동일하면 유지; 다르면 변경 영향부터 설명 |
| OPENAI_MODEL | 기존 확인 `gpt-6.1-terra` 유지 |
| OPENAI_PROCESSING_REGION | 기존 표시 `us` 유지, 배포 후 `/health`에서 실행 지역 확인 |
| RELEASE_DATA_ENABLED | 기존 표시 `1` 유지. 새로 켜는 작업을 반복하지 않음 |
| PRIVACY_DOCUMENT_READY | 기존 표시 `1` 유지. 새로 켜는 작업을 반복하지 않음 |
| ANALYSIS_PRIVATE_TRIAL | 현재 호스팅 진입 코드가 요구하는 `1`. 이 변수명은 사용자당1회 제한을 뜻하지 않음 |
| ANALYSIS_ALLOWED_ORIGINS | Android WebView 기본 출처 `https://localhost` 포함. `*`로 열지 않음 |
| SUPABASE_URL·PUBLISHABLE_KEY·SECRET_KEY | 기존 프로젝트 값 유지. 앱에는 publishable만 전달 |
| OPENAI_API_KEY·ANALYSIS_CACHE_ENCRYPTION_KEY | 기존 값 유지. 암호화 키를 교체하면 기존 답변/의견의 복호화·삭제 코드에 영향을 주므로 바꾸지 않음 |
| FEEDBACK_RETENTION_DAYS | 현재 소스는 이 값이 없으면 평가/의견 저장이 비활성화될 수 있음. 고지 기준 최대365일에 맞는 유효값인지 확인. 누락·초과일 때만 `365`로 보완할 내용을 설명한 후 승인 범위에서 적용 |
| PORT·RENDER_EXTERNAL_URL | Render 자동 제공값 유지. app URL에 포트나 로컬 주소를 넣지 않음 |

환경변수를 보완해야 한다면 변경할 이름·값의 성격과 영향을 먼저 설명한다. 전체 키 화면을 수집하지 않는다. Render의 Save only는 다음 배포까지 실행 반영되지 않고, Save and deploy/Save, rebuild, and deploy는 배포를 일으키므로 승인 전에는 어느 저장 동작도 실행하지 않는다.

현재 RPC/스키마를 재적용할 이유는 이 브랜치 변경에서 발견되지 않았다. 배포 시 저장소의 시작 검사 또는 실제 동의 저장이 실패하면 오류를 구분하고 중단한다. 실패를 권한 개방이나 동의 검사 우회로 해결하지 않는다.

## 4. 앱: 무엇을 바꾸는가

앱 빌드 프로세스에만 다음 공개 설정을 공급한다. 운영 서비스에 앱용 변수를 추가하는 작업과 구분한다. 실제 값은 해당 계정에서 안전하게 연결하며 Git/채팅에 키를 적지 않는다.

| 앱 빌드 입력 | 값·조건 |
| --- | --- |
| VITE_ANALYSIS_API_BASE_URL | `https://howhouse-analysis-test.onrender.com` (실제 서비스 주소가 동일한 경우) |
| VITE_ANALYSIS_AUTH_URL | 기존 Supabase 프로젝트의 HTTPS 루트 주소 |
| VITE_ANALYSIS_AUTH_PUBLISHABLE_KEY | 같은 프로젝트의 publishable 키. secret/service-role/OpenAI 키 금지 |
| VITE_RELEASE_PRIVACY_READY | 공개 본문·후보 적용이 승인된 뒤 `1`로 빌드. 현재는 변경하지 않음 |
| 모드 | 최종 후보는 release/production. 개발 도구·촬영 우회 없음 |

앱과 서버의 동의 v9/양쪽 해시 및 115개 카탈로그 버전이 같아야 한다. 앱만 먼저 배포하면 구 서버와 catalog-mismatch가 날 수 있다. 서버 적용·읽기 확인 후 최종 후보 앱을 설치하여 실연결을 검증하고 사용자 배포는 검증 뒤에 한다.

## 5. 서명·앱 버전 준비

이번 로컬 코드 보완은 서명 환경변수4개와 버전2개를 프로세스로 공급할 수 있도록 한 것이다. 실제 키를 읽거나 새 키를 만들지 않았다.

- `HOWHOUSE_KEYSTORE_PATH`, `HOWHOUSE_KEYSTORE_PASSWORD`, `HOWHOUSE_KEY_ALIAS`, `HOWHOUSE_KEY_PASSWORD`
- `HOWHOUSE_VERSION_CODE`, `HOWHOUSE_VERSION_NAME`

같은 applicationId `com.howhouse.app`의 기존 앱 업데이트라면 기존 키와 설치/Play 최고 versionCode를 대조한다. AI 없는 main의 공개 버전·트랙을 임의로 덮어쓰지 않는다. 버전코드는 기존 제출 코드보다 높게 지정하며 이번 작업에서 임의 숫자를 확정하지 않는다. Play App Signing을 쓰면 업로드 키와 실제 배포 서명이 다를 수 있으므로 테스트 트랙 설치가 최종 배포 서명 검증 경로다. 로컬 업로드 키 APK로 기존 Play 설치본을 무조건 덮어쓸 수 있다고 전제하지 않는다.

서명 준비 명령은 아래와 같지만 실제 키 없이 성공시키려고 값을 꾸미지 않는다.

```powershell
# 해당 프로세스에 승인된 공개 빌드 입력·서명·버전만 안전하게 공급한 뒤 실행
node node_modules/vite/bin/vite.js build --mode release
node node_modules/@capacitor/cli/bin/capacitor sync android
cd android
./gradlew.bat --offline verifyAiReleaseInputs
# 최종 제출용: bundleRelease / 직접 설치할 서명 후보가 필요한 경우: assembleRelease
```

release guard는 AI variant·개발도구 off·공개 준비·미국 요구·최신 정책 파일 해시와 서명/버전 입력을 검사한다. 이 검사는 실제 키의 소유권·Play 등록 상태를 대신 확인하지 않는다. 키/비밀번호·서명 산출물은 PR에 넣지 않는다. 기존 debug·검증 패키지의 흐름은 유지한다.

## 6. 실제 연결 검증 — 배포·계정 쓰기·API 비용 승인 후

1. Live 후보 SHA, 무료 상태, `/health`의 us, `/privacy`·`/terms`의200·본문 일치, 외부 삭제 페이지 접근을 확인한다. health200만으로 분석 성공을 대신하지 않는다. 실제 키·전체 환경변수·전체 응답 본문은 수집하지 않는다.
2. 전용 테스트 계정으로 동의 전/거부 후 불필요한 인증·분석·평가 요청이 없는지 확인한다. 기존 실제 사용자나 삭제 코드에 접근하지 않는다.
3. v9 양쪽 동의를 저장하고 영수증의 버전·surface·해시·시각을 확인한다. 과거 동의를 v9로 소급 변경하지 않는다.
4. 글만1회와 합성 또는 허용된 비식별 사진+글1회, 총2회의 실제 분석을 계획한다. 실제 OpenAI 사용료가 있으며 지역 할증은 사용자가 수용했다. 캐시·모델의 기존/생성 판단에 따라 실제 호출 수가 달라질 수 있고 특정 결과를 얻으려고 자동 추가 호출하지 않는다. 카메라·보관함의 사진 처리와 결과 화면도 후보에서 확인한다.
5. 결과의 평가/신고 저장이 성공한 경우만 접수 완료인지 확인한다. 실패하면 저장 설정·권한을 구분하며 결과 화면 검증과 혼동하지 않는다.
6. 철회200·accepted:false 후, **삭제 전에** 같은 테스트 인증으로 분석이 consent-required로 차단되는지 확인한다. 이 요청은 모델 호출 전에 차단되어야 한다.
7. 테스트 계정의 서버 삭제를 요청하고 deleted:true·operationId·온보딩/로컬 초기화를 확인한다. 해당 계정에 대한 Auth 거절과 연결 자료 삭제를 필요한 최소 범위에서 확인한다. 공급자 모든 로그/백업까지 즉시 지웠다고 주장하지 않는다.
8. 테스트 계정·사진·검증 산출물·임시 연결을 정리한다. 임시 서비스를 따로 만들기로 한 경우만 그 서비스도 정리하며 기존 운영 서비스는 삭제하지 않는다.

실제 연결이 실패하면 서비스 설정·동의/본문 해시·카탈로그 버전·Auth·provider 오류를 분리해 보고한다. source 승인 false, 본문 미공개, 구 서버 문제를 개인정보가 입력되면 무조건 금지되는 현상으로 해석하지 않는다. 성공 뒤에만 실제 운영/최종 서명 검증 완료를 기록하고 스토어 제출을 별도 진행한다.

## 참고

- Render 특정 커밋 배포: https://render.com/docs/deploys#deploying-a-specific-commit
- Render 환경변수 저장 방식: https://render.com/docs/configure-environment-variables
- 기존 근거·비운영 검증: `FINAL_OVERSEAS_NOTICE_V9.md`, `AI_BRANCH_RELEASE_PLAN.md`, `ANDROID_AI_CANDIDATE_DELTA_VALIDATION.md`

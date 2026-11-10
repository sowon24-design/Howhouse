# AI 없는 어쩌집 전환 — 변경 내용 및 PR 검토 안내

작성일: 2026년 11월 10일
브랜치: `codex/ai-without-supabase` → `main`
기준 main: `3a1ec48`

## 1. 이번 PR의 핵심

앱의 시작점을 기존 AI 앱에서 **기기에 포함된 주거 문제 사례를 검색하는 앱**으로 전환합니다. 이 PR이 main에 병합되면 main으로 빌드하는 앱도 AI 없는 버전이 됩니다.

앱 이용 중 OpenAI 분석·사진 전송·Supabase 인증 및 저장·Render 분석 서버를 사용하지 않습니다. 이전 AI 소스와 서버 자료는 저장소에 보존하며, 기존 실서버와 DB를 중단하거나 삭제하는 PR은 아닙니다. 런타임 AI 사용과 사전에 GPT로 제작한 정적 이미지 사용은 구분합니다.

## 2. 사용자가 이용하는 기능

| 기능 | 최종 동작 |
| --- | --- |
| 시작 및 닉네임 | 만 14세 이상 자기 확인, 닉네임과 시작 설정을 기기에만 저장 |
| 홈·카테고리 | main에 포함된 기존 주거 문제 사례 53개 재사용 |
| 검색 | 53개 사례의 검색 사전, 띄어쓰기·유사 표현·증상과 대상의 관련도 정렬. 부정 표현과 무관한 검색어 처리 |
| 해결 방법 | 기존 사례의 준비물·단계·참고 시간과 수리비 안내 표시. 준비물은 단계 수에 합산하지 않음 |
| 준비물·영상 | 제품명 쿠팡 검색과 YouTube 외부 링크. 앱 내부에서 원격 썸네일을 자동 요청하지 않음 |
| 문의 문장 | 기존 사례 문장 선택·직접 편집·복사. 앱이 자동 발송하지 않음 |
| 마이 페이지 | 닉네임 수정, 약관 6개 오프라인 열람, 이메일 문의와 기기 설정 초기화 |

이 PR이 사례 CSV 53개를 새로 작성한 것은 아닙니다. main의 사례 데이터를 재사용하며 새 검색 사전을 추가했습니다. 일치 사례가 없어도 새 해결책을 생성하지 않습니다.

## 3. 안전·개인정보·약관

- 전기 위험 사례 `난방·전기:26`, `:27`, `:28`에서 플러그 조작·젖은 설비 닦기·차단기 재투입 지침을 접근 금지와 전문가 점검 중심으로 보완했습니다. catalog 전용 어댑터를 사용해 공통 CSV는 보존했습니다.
- 수리비 부담이 계약·원인·현장 상태에 따라 확인할 참고임을 결과와 근거 앞에 명시했습니다.
- 소원 Notion 트랙 문서 6개를 앱과 동기화했습니다. 연우 트랙과 원본은 보존했습니다.
- 시행일은 사용자 결정에 따라 **2026년 11월 10일**입니다. AI 수집·이용 및 분석 국외 이전 문서는 새 동의를 받는 대신 미사용 안내입니다.
- 기기 설정, 메모리 검색어·문의 문장, 클립보드, 외부 링크, 직접 보내는 Gmail 문의를 구분했습니다.
- 문의 담당은 유소원, 주소는 `happytanglee@gmail.com`입니다. 수신·답장 가능 및 계정 보안 완료는 사용자 확인 사항입니다. 문의 운영 절차와 처리 완료 후 30일 이내 운영팀 사본 삭제 정책을 문서화했습니다.
- 이전 AI 서버 기록은 새 앱 초기화와 별개입니다. 기존 정책과 이메일 권리행사 경로를 유지하는 전환 계획을 검토했습니다. 이번 작업에서 사용자 자료를 조회·삭제하거나 실제 서버 삭제 성공을 새로 검증하지 않았습니다.
- 사례 문장은 팀 자체 제작, 이미지는 참고 자료 없이 GPT로 직접 생성했고 타인 얼굴·로고·캐릭터가 없음을 사용자 확인했습니다. 이미지·아이콘 시각 점검과 Pretendard 라이선스 보존을 기록했습니다. 법률 자문·권리 무침해·Play 승인 보장으로 표시하지 않습니다.

공개 개인정보: https://xamxam33.notion.site/41402821a7f3805bb89cccccd63ec5a6
공개 이용약관: https://xamxam33.notion.site/41402821a7f3808b8575dc3b877d7763

## 4. Android·빌드·출시 자료

- catalog 앱의 AI/서버 모듈·API 주소 번들 포함을 차단하고 CSP의 네트워크 연결을 막았습니다.
- Capacitor에서 App 플러그인만 사용하도록 구성했습니다. Camera/Network 플러그인은 Android 연결에서 제외했으며 추가 라이브러리나 의존성 재설치는 하지 않았습니다.
- 확인한 QA Manifest에는 INTERNET·CAMERA·READ_MEDIA_IMAGES 권한이 없고 `allowBackup=false`입니다.
- 첫 Play 업로드 설정은 `com.howhouse.app`, versionCode `1`, versionName `1.0`입니다. QA 앱은 기존 앱과 분리된 `com.howhouse.app.catalogqa`입니다.
- 업로드 키는 환경변수로만 받도록 준비했습니다. 키·비밀번호·APK/AAB는 PR에 넣지 않았습니다.
- 휴대폰 검증 전에는 production/release 빌드가 실패하도록 출시 차단을 유지했습니다. 검토 빌드는 아래 명령을 사용합니다.
- 스토어 설명·첫 출시 문구·Console 입력 근거·아이콘 및 이미지 준비 안내를 포함했습니다. 실제 스토어 제출은 하지 않았습니다.

```sh
npm run typecheck
npm run verify:foundations
node --test src/catalog/search-cases.test.mjs src/catalog/content-review.test.mjs
node node_modules/vite/bin/vite.js build --mode catalog-preview --configLoader runner
node node_modules/@capacitor/cli/bin/capacitor sync android
node scripts/catalog-preflight.mjs
```

`catalog-preflight`는 현재 Android 미검증 및 preview 파일을 이유로 실패하는 것이 예상 결과입니다. 이를 통과시키려고 승인 값을 임의로 변경하지 않습니다.

## 5. 주요 변경 파일

| 영역 | 파일 |
| --- | --- |
| 앱 진입·구성 | `src/main.tsx`, `src/catalog/CatalogApp.tsx`, `catalog.css`, `vite.config.ts` |
| 검색 | `src/catalog/search-cases.ts`, `search-dictionary.json`, 검색 테스트 |
| 안전 보완 | `src/catalog/content-review.ts` 및 테스트 |
| 공통 화면 연결 | `HomeScreen.tsx`, `B01.tsx`, `B02.tsx`, `VideoPreview.tsx` |
| 약관 | `src/catalog/policy.ts`, `policy-documents.json`, `docs/catalog-policies/` |
| Android | `capacitor.config.ts`, Android Gradle·Manifest·플러그인 설정 |
| 출시 검증 | `release-approval.json`, `app-release.json`, `catalog-preflight.mjs` |
| 운영·스토어 | `docs/CATALOG_*.md`, `CONTENT_EMAIL_REVIEW.md`, `docs/play-store/` |

일부 전달 문서에는 진행 단계별 과거 기록이 남아 있습니다. 현재 최종 변경 범위와 미완료 상태는 이 문서와 `CATALOG_PRIVACY_CONTENT_FINAL_REVIEW.md`의 마지막 후속 기록을 기준으로 확인합니다.

## 6. 검증 결과와 아직 남은 일

완료: 타입 검사, 공통 자산 검사, 검색·안전 테스트 7개, catalog-preview 웹 빌드, 별도 Android QA APK 빌드, APK의 웹 파일 266개와 최신 dist 일치, 정책 해시 및 권한 대조.

현재 QA APK SHA-256: `05cccd5a01a68e86fcf8454fb15c406d820fb5e8944ac37924a8060adb7fab14`.

남은 일:

1. 실제 갤럭시에서 시작·약관·검색·카테고리·외부 링크·문의 편집/복사·뒤로가기·오프라인·초기화를 확인합니다.
2. 실제 통과 결과를 기록한 뒤 Android 승인 상태와 최종 화면 자산을 확정합니다.
3. 업로드 키로 출시 AAB를 제작하고 Play App Signing·데이터 보안·대상 연령·등급·스토어 항목을 대조합니다.
4. 계정에 필요한 비공개 테스트와 프로덕션 액세스 신청 후 공개 심사에 제출합니다.

PR 게시와 main 병합·서버 배포·DB 변경·Play 제출은 서로 다른 단계입니다. 이 PR은 검토 요청이며 main 자동 병합을 요청하거나 출시 완료를 선언하지 않습니다.

## 7. 실기기 검증 중 후속 보완

카테고리에서 사례를 연 뒤 Android Back을 누르면 홈으로 이동하는 동작을 발견했습니다. catalog 앱 안에서 진입 위치를 메모리에 보관하고 화면 뒤로가기와 Android Back이 같은 원래 목록으로 돌아가도록 수정했습니다. 검색에서 연 사례는 검색어가 유지된 검색 결과로, 홈에서 연 사례는 홈으로 돌아갑니다. 수정 후 브라우저의 카테고리/검색 복귀를 확인했고 실기기 재검증을 이어갑니다. 최신 상세 결과는 CATALOG_ANDROID_QA.md를 확인해 주세요.

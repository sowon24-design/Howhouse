# AI 유지 버전의 출시 보완 — 병합·배포 전 검토

2026-11-10. 기준 main `3a1ec48`, 별도 브랜치 `codex/ai-release-privacy`.
AI 없는 버전과 병행 검토한다. 이 PR은 Draft이며 자동 병합·배포하지 않는다. AI·사진 분석·Supabase Free와 기존 평가·동의 증빙·철회·삭제를 유지한다.

## 2026-11-12 후속 — v9 최종 본문·전달 파일

v9 Android 비운영 차이 검증도 완료했다. 가상기기 APK의 본문/해시·동의 전/거부 후 외부 요청0·승인 차단과 별도 WebView 로컬 SQL 하네스의 양쪽 영수증·이전 동의 차단·철회·삭제를 통과했다. 최종 서명 앱의 실제 운영 검증은 아니다. `ANDROID_V9_OFFLINE_VALIDATION.md` 및 후속 로그인 검토 `LOGIN_FEASIBILITY_V9.md`를 따른다. 앱 제품 코드·운영 설정 변경은 없었다.

현재 검토 본문은 `2026-11-12-v9`이다. 사용자 지정 계정·일반 계약 조건으로 국외 이전 본문을 마무리하고 Global 프로젝트의 요청별 미국 처리, 기본 보관·예외와 선택적 공유, Supabase Free DPA 적용을 명확히 했다. 기존 사진 메타데이터 안내의 모순도 수정했다. `FINAL_OVERSEAS_NOTICE_V9.md`와 `YESUL_NOTION_V9_HANDOFF.md`를 따른다.

앱·서버 공통 원본과 `docs/policies` 6개 Markdown/manifest를 v9로 맞췄다. 기존 증빙은 보존한다. 신규 마이그레이션·런타임 변경·운영 적용 없이 승인 플래그 두 개는 false를 유지한다. 아래 v6~v8 검증·판단은 당시 기록이며 v9의 실제 운영 검증 완료를 뜻하지 않는다. 아래 적용 순서의 v8 참조는 이번 v9 본문으로 대체한다. Notion은 예슬이가 v9 전달 파일로 공개 반영한다.

## 2026-11-11 기록 — v8 공식 근거 연결

당시 검토 본문은 `2026-11-11-v8`이다. 이하 v6/v7 실검증은 역사적 기록으로 보존한다. Edge Function 이전 없이 Render 싱가포르→OpenAI 미국, 별도 Supabase 서울 Auth/DB 경로를 유지했다. 기존 미국 API·store:false·동의·사진 처리 코드는 중복 변경하지 않았다.

앱의 국외 이전 고지와 개인정보처리방침에 현행 OpenAI DPA의 법인/수탁자 역할, 미국 지정 콘텐츠 처리·TLS, 조건부 지원/검토·계열사 국가를 구분하고 공식 계약·목록·보관 문서 출처를 연결했다. 2024년 구DPA로 현재 계약을 대신하지 않는다. 요청별 실제 서버 경유 추적을 출시 필수 조건으로 두지 않는다. 공개 자료가 권역까지만 특정한 Supabase EU 로그 등을 임의 국가로 채우지도 않는다.

v8와 앱·서버 해시·6개 전달 파일을 동기화하고 이전v6/v7 증빙 보존·현재분석 차단·새본문 동의 흐름을 로컬SQL로 검증한다. 기존v7 Android 및v6 실외부서비스 결과를v8 실서버 검증 완료로 바꾸지 않는다. 공개 Notion·최종 서명앱·실제 적용 계약/설정 확인과 출시 승인은 별도로 남으며 두 승인값false를 유지한다. 이 후속의 근거·변경 경계는 `OFFICIAL_PROCESSING_SCOPE_V8.md`를 따른다.

## 변경 내용

- `photo-privacy.ts`에서 사진을 기기 내 디코딩·재인코딩하고 원본 EXIF/GPS/XMP·파일명·수정 시각을 복사하지 않는다. 표시 크기를 유지하되 JPEG/WebP 재압축이 가능하다. 픽셀 속 얼굴·주소·글자는 제거하지 않는다.
- `http-client.ts`에서 정리한 사진만 인증·세션·분석 요청에 사용한다. 실패·취소 시 원본으로 대체하지 않으며 재인코딩 뒤에도 장당 4 MiB 제한을 적용한다. 글만 분석하는 기존 경로를 유지한다.
- 현재 앱 고지와 `docs/policies` 6개 문서를 v8로 동기화한다. v5/v6/v7 증빙을 덮어쓰지 않고 현재 버전의 새 동의 영수증을 요구한다. 이번 변경에 신규 DB 마이그레이션은 없다.
- 서울 DB/Auth와 해외 로그·지원, 공급자별 보관 조건·예외를 구분한 검토 본문을 반영한다. 사용자 문의 안내는 필요한 최소 정보만 요청하며 자동 원문·사진 첨부를 추가하지 않는다.
- 동의 영수증→실제 SQL 증빙→분석→철회 차단→삭제의 로컬 통합 검증을 추가한다. 전송 단위 검증과 실제 브라우저 사진 정리 검증 도구를 포함한다.

## 의도적으로 포함하지 않는 것

`qa-server.mjs`, `qa-isolation.mjs` 및 관련 테스트·실행 명령, 한 계정/한 분석 제한, 검증용 승인 주입, 임시 서비스 주소·계정, 키·토큰·환경변수, 검증 APK·스크린샷·원본 응답은 포함하지 않는다. 기존 서버 시작 명령은 바꾸지 않는다. `analysisConsentApproved=false`, `notionSyncVerified=false`를 유지한다. 운영 승인을 우회하지 않는다.

## 실제 검증 기록과 한계

별도 무료 Render 검증 서비스와 폐기용 계정으로 실제 Android→Supabase·Render·OpenAI를 확인했다. 그 서비스와 계정은 정리했다.

| 항목 | 확인 범위 |
| --- | --- |
| v6 동의 | 실제 영수증 HTTP200·본문 해시 일치 |
| 사진 분석 | 합성 누수 그림으로 실제 POST 1회 HTTP200, generated 결과 및 Android `#analysis-result` 화면 확인 |
| 철회 | accepted:false; 삭제 전에 유효 세션으로 재요청 시 HTTP428/consent-required |
| UI 삭제 | HTTP200, 온보딩 복귀, 로컬 동의·프로필 제거, 만료 전 토큰 Auth403 |
| 삭제 응답 보완 | 다른 폐기용 계정으로 실제 삭제200/deleted:true/작업번호 일치·Auth403 확인. 기존 Live c18a3cf와 검증 HEAD의 server.mjs·release-store.mjs에 차이 없음 |

같은 UI 삭제의 응답 본문은 수집하지 못했으므로 삭제 응답 보완을 하나의 연속 기록으로 주장하지 않는다. 독립 SQL로 실제 DB 모든 테이블·백업·업체 로그까지 삭제됐다고 증명한 것은 아니다. 모델 응답 하나는 모든 입력 품질을 보장하지 않는다.

검증 서버는 feedbackStore를 연결하지 않아 평가 상태503이 표시됐다. 평가 기능을 없앤 것이 아니며 최종 운영 배포 후 평가·의견 동작을 확인해야 한다. 이 PR은 검증용 서버를 포함하지 않는다.

## 법적 고지의 미확정 사항

별도 국외 이전 선택 동의를 기본 경로로 유지한다. 거부·철회 시 AI 분석 제한, 준비된 사례 조회 유지. 운영자는 고객지원에 이용자 원문·사진·토큰을 넣지 않고 불필요한 저장·추적 기능을 추가하지 않는 방침을 채택했다.

다음은 테스트 통과나 메타데이터 제거로 해결됐다고 표시하지 않는다.

1. Supabase EU 개별 로그 국가·글로벌 지원과 Render 부수 운영, OpenAI 시스템·계열사의 국가·수령자 고지 구체성.
2. 공급자 내부 운영·보안 기록의 조건형 보유기간 표현의 충분성.
3. 조건부 재이전의 수령자 연락처·고지 및 필요한 보호조치의 범위.

모르는 국가·기간을 임의 채우지 않는다. 이는 확인된 위법 판정이나 AI 기능 불가능 판정도 아니며, 전체 적합성 승인 완료도 아니다. 기관·업체 문의를 대신 실행하거나 출시 승인을 받은 것으로 표현하지 않는다.

공개 근거: [법 28조의8·11](https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029334869), [Supabase FAQ](https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq), [Supabase DPA](https://supabase.com/legal/customer-resources/data-processing-addendum), [Render DPA](https://render.com/dpa), [Render 로그](https://render.com/docs/logging), [OpenAI 데이터](https://developers.openai.com/api/docs/guides/your-data), [OpenAI 하위처리자](https://openai.com/policies/sub-processor-list/).

## 추후 적용 순서 — 이번 PR에서 실행하지 않음

1. 공개 계약·고지 범위 판단과 예슬이의 Notion v8 6개 공개 본문 일치를 확인한다. 업체·개인정보위 문의나 요청별 실제 서버 추적을 필수 절차로 추가하지 않는다. 최신 반영 내용은 `OFFICIAL_PROCESSING_SCOPE_V8.md`, 상세 근거 이력은 `OVERSEAS_NOTICE_EVIDENCE.md`를 따른다.
2. 채택할 AI/비AI 버전을 정한 뒤 최신 main과 다시 비교하고 변경 내용을 설명한 후 병합한다. 병합 시점의 충돌까지 현재 결과가 보장하지 않는다.
3. 기존 Render는 마지막 확인에서 별도 브랜치 feature/analysis-hosted-trial의 c18a3cf이며 자동 배포가 꺼져 있었다. 적용 시점에 상태를 재확인하고 승인된 정확한 커밋과 앱의 v8 본문을 맞춰 명시적으로 배포한다. main 병합만으로 갱신된다고 전제하지 않는다.
4. 준비 플래그의 기존 표시값1을 무조건 재설정하지 않는다. 실행값·공개 privacy/terms URL·버전·해시를 확인하고, 최종 승인값 변경은 별도 설명·승인 범위에서 처리한다. 기존 v5 앱의 재동의·업데이트 영향을 확인한다.
5. 최종 서명 Android에서 동의 전/거부 후 요청, 동의·분석·평가·철회 차단·삭제를 점검하고 스토어 고지와 맞춘다.

v7은 업체별 전송 시기·방법, 인증·접속 정보, 지원 문의 최소화와 철회/삭제 구분을 추가한 후속 본문이다. 위 실제 외부서비스·Android 표의 증거는v6이며 v7 외부서비스 검증 완료로 바꾸지 않는다. v7은 새 해시·양쪽 동의 화면·이전v6 증빙 보존 및 차단을 로컬 SQL/HTTP로 확인한다.

후속 실제 Android 비운영 검증도 완료했다. v7 APK 본문/해시와 동의 전 외부 요청0·미승인 버튼 차단을 확인하고, 같은 WebView의 전용 로컬 HTTP/SQL 하네스로 사진 정리·양쪽 동의·철회·삭제를 검증했다. 자세한 범위·한계는 `ANDROID_V7_OFFLINE_VALIDATION.md`를 따른다. 공개 자료의 국가·수령자·보관 조건 추가 구체화는 `OVERSEAS_NOTICE_EVIDENCE.md`에 정리했다. 동의 본문을 변경하지 않아 v7과 해시는 유지한다.

## 재현 가능한 로컬 확인

`node node_modules/typescript/bin/tsc --noEmit`

`node scripts/sync-policy-documents.mjs --check`

`node --experimental-strip-types --test` (Node 24; PGlite 검증은 `FEEDBACK_PGLITE_MODULE`에 설치된 PGlite 진입 파일 절대경로 지정)

`node scripts/verify-photo-privacy.mjs <결과.json>` (`CHROME_PATH` 지정 가능)

테스트에는 합성 입력과 로컬 DB만 사용하며 실제 키·유료 API를 요구하지 않는다.

v7 후속 변경에서 타입 검사·고지6개 동기화·자동 테스트235개(건너뜀0)·개발 빌드를 통과했다. 이전 커밋에서 실제 브라우저 JPEG/PNG/WebP 메타데이터/방향·손상/취소/인코더 실패 차단을 통과했으며 그 사진 처리 구현은 이번에 변경하지 않았다. 개발 빌드에는 기존500kB 청크 경고가 있다. 출시/프리뷰 모드 빌드는 공개 서버 설정이 없는 상태에서 기존 검사로 거부됨을 확인했으며, 통과를 위해 승인값이나 운영 설정을 변경하지 않았다. 최종 서명 출시 빌드 성공을 주장하지 않는다.

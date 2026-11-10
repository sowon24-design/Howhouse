# 앱·Notion 약관 동기화 인계

본문 개정일: 2026-11-10. 동의 문서 버전: `2026-11-10-v5`.

PR #56은 main에 통합됐다. 후속 PR #57에서 자동 인증 최소화·사용자 확인 사항·신고 진입과 통합한다. 새 본문 버전은 v5이며 기존 v4 문구나 영수증을 새 본문으로 덮어쓰지 않는다. PR #57도 main에 병합 완료됐다(확인 커밋 `3cff37d`). 아래 절차로 최신 main을 받는다.

## 이번 반영 범위

사용자가 승인한 D01 내부 철회·삭제 진입, 동의 증빙 보완과 앱·Notion 본문 동기화 원본을 포함한다. AI·사진·답변 캐시·평가·신고는 유지한다. main 코드 반영은 운영 DB·Render 적용이나 출시 승인을 뜻하지 않는다.

사용자 결정에 따라 Notion 직접 수정 대신 **예슬이가 기존 6개 페이지에 반영하는 방식**으로 인계한다. 앱에 연결된 공개 페이지를 다른 워크스페이스에 복제하거나 URL을 새로 만들지 않는다. 동기화 파일 생성은 실제 Notion 수정이 아니다.

## 수정할 원본과 재생성

1. 본문: `src/app-screens/my/information-draft.json`.
2. 동의 버전·기존 Notion 주소: `src/analysis/policy-publication.json`.
3. UI/증빙 어댑터: `src/analysis/consent-document.ts`. 여기에는 본문을 중복 작성하지 않는다. E03/A02 및 서버 증빙이 JSON의 같은 본문을 읽는다.
4. 운영 승인: `src/analysis/policy-approval.json`. `analysisConsentApproved:false`는 의도된 상태다. 문구 정리·Notion 게시만으로 true로 바꾸지 않는다.

```sh
npm run policies:sync
npm run policies:check
npm run typecheck
```

본문·체크 문구를 바꾸면 동의 버전도 올린다. 생성한 `docs/policies/` 파일과 manifest를 원본 변경과 함께 커밋한다. 같은 화면·버전의 다른 본문으로 기존 DB 증빙을 덮어쓰지 않는다.

## 예슬이가 반영할 6개 페이지

| 문서 | 원본 키 / 생성 파일 | 기존 페이지 |
|---|---|---|
| 개인정보 및 데이터 관리 | `data` / `docs/policies/data.md` | https://xamxam33.notion.site/40902821a7f380beb305dd0f095f5d79 |
| 이용약관 | `terms` / `docs/policies/terms.md` | https://xamxam33.notion.site/40902821a7f38009a098dc50f64202c4 |
| 개인정보 처리방침 | `privacy` / `docs/policies/privacy.md` | https://xamxam33.notion.site/40902821a7f3809aa417d65279f87c37 |
| 개인정보 수집·이용 동의 | `processingConsent` / `docs/policies/processingConsent.md` | https://xamxam33.notion.site/41002821a7f38029bde2c6991015ac60 |
| 개인정보 국외 이전 동의 | `overseasConsent` / `docs/policies/overseasConsent.md` | https://xamxam33.notion.site/41002821a7f3802c9e4ac923b78fe556 |
| AI 활용 정보 | `ai` / `docs/policies/ai.md` | https://xamxam33.notion.site/41002821a7f38017a9bef636b4c68d8c |

파일의 첫 제목은 페이지 식별용이다. 기존 페이지 제목을 유지하고 그 아래 본문을 동일하게 반영한다. 관련 없는 하위 페이지나 팀 작업 메모를 지우지 않는다. 앱 원본을 함께 수정하지 않은 채 Notion만 별도 문구로 고치지 않는다.

`docs/policies/manifest.json`에는 페이지별 원본 본문과 Markdown 해시가 있다. 이것은 내보낸 파일의 일치 증거이며 Notion 게시 완료 증거는 아니다. 게시 후 비로그인 웹·모바일에서 실제 본문과 링크를 확인하고 페이지 ID·개정 버전·확인일을 이 문서의 반영 기록에 남긴다.

| 실제 Notion 반영 | 상태 |
|---|---|
| 6개 페이지 본문 갱신 | 예슬이 반영 대기 |
| 비로그인/모바일 본문 일치 확인 | 미실행 |

## 확인 자료로 정리한 내용과 남는 한계

- 운영자·책임자 유소원, 공개 문의처, 서비스 범위와 동의 거부·철회·삭제 경로를 통일했다.
- 답변의 7일 재사용 만료, 호출 30일, 평가/의견/신고 최대 365일, 계정 삭제/90일 미활동 정리, 문의 처리 완료 후 30일을 서로 구분했다. 제공업체 내부 로그·백업 전체가 같은 기간에 지워진다고 쓰지 않는다.
- Render 싱가포르·Hobby 로그 조회기간 7일, Supabase 서울 DB/Auth·Free API/DB 기본 로그 조회기간 1일·EU 운영 로그, OpenAI 미국 지정 요청·응답 저장 비활성·기본 악용 모니터링 최대 30일 및 예외를 구분했다. 계정 확인 기록과 코드·공식 자료를 기준으로 작성했다.
- 공개 자료가 특정하지 않는 개별 EU 로그 국가와 내부 보안/지원 보유기간을 추정하지 않았다. 이를 기재한 문장이 곧 국외 이전 고지 요건의 최종 충족을 뜻하지 않는다.
- 원본 미저장과 암호화 답변 저장, YouTube 미리보기 자동 요청, 사진 부가정보, 임시 인증과 동의 증빙의 처리 범위를 반영했다.
- 업체 회신을 기다리는 단계를 만들지 않았다. 적용 근거·실제 처리 범위의 남은 검토는 기존 계약/공개 자료/운영 설정이나 구성 조정으로 해결해야 한다. 다른 근거로 바꾼다고 사실 확인을 생략하지 않는다.

## 배포 승인과 실제 적용은 별도

미확정 문구를 정리해도 앱 환경 플래그만으로 실제 동의 수집이 열리지 않도록 승인 파일을 따로 검사한다. 서버도 승인 전 신규 동의를 거부하며 기존 철회·삭제는 유지한다. 호스팅 서버에 동의 저장 기능이 빠진 경우 분석은 실패 처리한다. 무료 샘플·기존 사례 조회는 유지한다.

현재 남은 항목은 승인 파일의 목록을 따른다. 공개 Notion 반영만으로 법적·운영 준비 전체를 완료 처리하지 않는다. 동의 전 자동 인증/평가 조회 경로, 최종 네트워크 범위, 실제 증빙 SQL 적용과 서버·앱 검증도 별도다.

운영 시 기존 main의 `server/analysis/release-data.sql` 다음에 새 `consent-evidence.sql`을 시험 DB에서 검증한 뒤 적용해야 한다. 사용자 상태를 새 동의로 소급 바꾸지 않는다. 원문·해시·이력은 새 동의부터 기록한다. 새 앱·서버가 같은 버전을 써야 하므로 DB→서버→앱 전환 일정을 맞춘다. 이 main 반영에서 실제 DB·Render·정책 공개 플래그를 바꾸지 않았다.

## main을 받아 이어서 작업하기

미커밋 변경이 있으면 먼저 현재 작업 브랜치에 보존한다. 강제 초기화나 강제 pull을 하지 않는다. GitHub Desktop에서는 Fetch origin 후 main의 새 커밋을 받고, 별도 화면 브랜치에서 이어간다. 기존 화면 브랜치를 계속 쓸 경우 최신 main을 병합하면서 위 원본 파일과 D01 내부 관리 버튼을 보존한다.

```sh
git status
git fetch origin
git switch main
git pull --ff-only origin main
npm ci
npm run policies:check
npm run typecheck
```

main의 최신 코드를 받은 후 새 작업 브랜치를 만들어 수정한다. Notion 본문 반영과 화면 문구 수정이 끝나면 실제 수정한 페이지/파일·버전을 함께 알려 통합 검증한다.

## 검증

본문 생성/일치 검사, 타입 검사, test 모드 웹 빌드 및 관련 자동 검사 210개 통과. 미확정 배포 승인은 별도로 차단됨을 검사했다. 실제 Notion 수정·운영 배포·최종 AAB/Play 검사는 이번 범위에서 실행하지 않았다.

## 근거

- 저장소 `docs/LLM_PROVIDER_TRANSFER_REVIEW.md`의 계정 확인 기록
- https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq
- https://supabase.com/legal/customer-resources/data-processing-addendum
- https://developers.openai.com/api/docs/guides/your-data
- https://render.com/docs/logging
- https://law.go.kr/LSW/lsLinkCommonInfo.do?lsJoLnkSeq=1029332501

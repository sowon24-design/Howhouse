# PR62 v9 국외 이전 고지·동의 최종 편집본

2026-11-12 / `codex/ai-release-privacy` / `2026-11-12-v9`

## 이번 작업의 전제와 경계

사용자는 “Render에서 사용하는 키가 소원의 Personal / Default project 발급 키이고 별도 계약이 없는 경우”를 기준으로 본문을 마무리하도록 요청했다. 이를 이번 편집의 운영 전제로 사용한다. 키 대조를 에이전트가 직접 수행했다거나 별도 계약 부존재를 대시보드가 입증했다고 기록하지 않는다. 전달받은 계정 확인표의 Global, 호출 로깅 Enabled per call, 데이터 공유 3종 Disabled를 구분하여 반영했다. 10% 지역 처리 할증은 사용자가 알고 수용했다.

main 병합·운영 배포·계정 설정 변경·유료 가입·실제 모델 호출·DB 쓰기는 하지 않는다. AI·사진 분석·Supabase Free, Render 중계와 기존 동의 영수증·철회·삭제 기능을 유지한다. Edge Function을 도입하지 않는다.

## 최종 본문에서 달라진 것

- 미국 지정 처리는 프로젝트 지역을 미국으로 바꿨다는 뜻이 아니라, Global 프로젝트에서도 지원되는 미국 주소의 요청별 지역 처리로 설명한다. 실제 배포 설정과 코드 일치는 운영 적용 단계에서 확인한다.
- OpenAI 일반 서비스 계약·DPA의 OpCo 수탁자 관계를 사용하고, 별도 계약·ZDR/MAM 승인이 있어야만 출시할 수 있다는 전제를 추가하지 않는다.
- 선택적 공유 Disabled, `store:false`, 기본 악용 모니터링 보관을 구분한다. 최대 30일의 기본 보관과 법률·안전상 연장, 이미지 안전 검토, 최대 24시간 프롬프트 캐시 등 기능별 예외를 함께 안내한다. 무보관 또는 모든 사본 즉시 삭제라고 쓰지 않는다.
- Supabase Free 조직의 Legal Documents에서 확인한 DPA 자동 적용·별도 서명 불필요와 Assistant 공유 Disabled를 반영한다. 후자는 앱 AI 분석이나 필수 보안 처리까지 비활성화한다는 뜻이 아니다.
- 기존의 사진 위치정보가 함께 전송될 수 있다는 오래된 문구를 현재 메타데이터 제거 구현과 맞춘다. 픽셀 속 얼굴·주소·문자는 자동 제거되지 않는다는 안내는 유지한다.
- 본문 변경으로 버전을 v9로 올리고 앱·서버 공통 출처, Markdown 6개와 해시 manifest를 함께 갱신한다. 기존 v5~v8 증빙은 덮어쓰지 않는다. 체크박스 선택 구조·거부/철회 효과·기존 사례 조회는 유지한다.

## 유지한 범위와 남는 한계

Render 싱가포르 분석 → OpenAI 미국 지정 API, 별도 Supabase 서울 DB/Auth를 구분한다. 공급자 운영·지원·안전 검토와 주요 콘텐츠 처리를 구분하며 기존 업체별 항목·시기·방법·연락처·보관·거부 설명을 삭제하지 않는다.

Supabase의 EU 개별 로그 국가·글로벌 지원 국가나 내부 기록 세부 기간이 새로 밝혀진 것은 아니다. 기존 공개 범위를 솔직하게 유지한다. TIA는 계정에서 다운로드할 수 있었지만 2025-03-14 문서이므로 최신 목록을 대신해 미국·싱가포르만으로 전체 국가를 확정하지 않는다. 본문 편집 완료를 모든 국가 공백 해결이나 법률 적합성 보증으로 표현하지 않는다. 사용자·운영자 검토만으로 법정 요건 미충족이 치유된다는 의미도 아니다.

공급자·기관 문의와 매 요청의 실제 서버 추적을 새 출시 필수 절차로 요구하지 않는다. `analysisConsentApproved=false`, `notionSyncVerified=false`를 유지하며 기존 검증을 v9 실제 운영 검증으로 바꾸지 않는다.

## 예슬이 전달 및 적용 순서

`docs/policies`의 Markdown 6개가 앱 본문의 내보내기 원본이다. 별도 수정한 문서를 섞지 말고 manifest의 v9·해시와 함께 전달한다. `YESUL_NOTION_V9_HANDOFF.md`를 따른다. 공개 Notion에 실제 반영한 뒤에만 동기화 확인을 기록한다.

이후 사용자의 별도 승인 범위에서 최신 main 비교·병합, 승인 커밋 배포와 공개 정책 URL/동의 버전·해시 확인, 최종 서명 Android의 동의 전/거부 후 요청·동의→분석→평가→철회 차단→삭제 검증을 진행한다. 이번에는 실행하지 않는다.

## 이번에 사용한 근거

- OpenAI 공식 데이터 문서: https://developers.openai.com/api/docs/guides/your-data (Global 프로젝트의 요청별 처리, 미국의 ZDR/MAM 비필수, 시스템 데이터 제외, 보관·캐시·이미지 예외)
- OpenAI 일반 계약·DPA: https://openai.com/policies/services-agreement/ · https://openai.com/policies/data-processing-addendum/
- OpenAI 조건부 처리: https://openai.com/policies/sub-processor-list/
- 실제 Supabase 조직 Legal Documents: https://supabase.com/dashboard/org/xgzczmmkckhizlwvcwac/documents
- Supabase DPA: https://supabase.com/legal/customer-resources/data-processing-addendum
- 계정에서 연결한 보조 TIA: https://supabase.com/downloads/docs/Supabase+TIA+250314.pdf

기존 업체별 근거 검토는 `OFFICIAL_PROCESSING_SCOPE_V8.md`, `OVERSEAS_NOTICE_EVIDENCE.md`에 보존한다. 이미 확인한 DB/RLS/RPC·리전 검사를 반복하지 않는다.

## 로컬 검증 결과

2026-11-12: 본문 6개 동기화 검사, TypeScript 검사, 로컬 자동 테스트 235개(실패·건너뜀 0, PGlite 포함), 개발 모드 빌드 통과. 동의 본문의 앱·서버 해시 일치와 SQL 증빙·철회·삭제 검증을 포함한다. 기존 500kB 청크 경고는 남아 있다. 최종 서명 Android 빌드·v9 운영 연결 검증을 수행한 것은 아니다.

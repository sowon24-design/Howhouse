# B 화면 통합 인계 — 예슬님

- 담당 폴더: src/solutions/. App.tsx·공통 라우팅은 이 PR에서 변경하지 않습니다.
- B01: categoryLabel, items({key,label}), onSelect(id), onWriteProblem, onBack을 받습니다.
- data/index.ts의 categories/getCategoryCases/solutionCases로 목록을 만들고 getSolutionById(id)로 B02 입력을 조회합니다. ID는 원본 분야:번호이며 UI 8카테고리와 구분됩니다. 활성 사례 53개입니다.
- B02: data,onBack,onContact,onComplete,onOpenVideo,onPreviewOpinion을 받습니다. 최신 사용자 결정: 완료는 A01, 뒤로는 B01입니다. 독립 확인에서는 B01 복귀/이동 요청 안내만 수행합니다.
- B03: recipients=toMessageRecipients(data),onBack을 받습니다. 문의 대상별 문장·수정은 분리합니다. 뒤로는 같은 B02입니다.
- 최신 사용자 결정: B03 복사 성공 후 페이지 이동은 없습니다. 성공·실패·빈 본문 모두 B03에 알림을 표시합니다. 화면 안의 뒤로만 같은 B02로 돌아갑니다. copyMessageResult는 명시적 success/failed/empty 결과를 반환하며 기존 copyMessage 문자열 API도 유지합니다.
- 의견 완료는 UI만이며 저장 API는 없습니다. 실제 LLM/분석 응답 연동도 미구현입니다. data/types.ts는 로컬 표시용이며 팀 API 계약이 아닙니다.
- 독립 진입: npm run dev 후 /src/solutions/preview.html. preview.tsx는 확인용 이동/스크롤 보존 예제입니다. 전체 앱 라우터로 복사하지 않습니다. preview-only.css도 출시 화면에 import하지 않습니다.
- 사진: data/photos.ts의 casePhotos에 사례 ID별 [{src,alt},...] 등록. 사진 미등록 시 사용자 제공 temporary-common.png가 임시로 표시됩니다. 내용/제목은 CSV를 수정 가능하며 ID를 유지하세요. 공동 시트 자동 동기화는 없습니다.
- main(PR #28) 병합 후 확인: 홈→문제 작성, 공통 미리보기, B01→B02→B03→B02→B01. 앱 빌드·B 독립 빌드·verify:foundations·데이터/메시지13개 검사 통과. 앱 빌드는 500kB 청크 크기 경고가 있으나 성공합니다.
- 미검증: Android 실기기, WebView 클립보드/키보드/시스템 여백/오버스크롤, PC 터치 모드 드래그 취소. 통합 시 화면별 상태 보존과 전역 알림 방식은 예슬님이 연결합니다.

## A↔B 연결 반영 (2026-10-31)
- src/app-screens/solutions/SolutionsFlow.tsx가 홈 8개 카테고리를 기존 데이터에 대응하고 B01→B02→B03을 연결합니다. B01 뒤로→홈, 내 문제를 찾을 수 없어요→A02입니다.
- B03 왕복 시 B02 카드·스크롤·의견 상태와 문의 대상별 수정 내용을 유지합니다. 홈 이탈·새로고침 후 복구는 제공하지 않습니다.
- HTTP 미리보기에서도 복사할 수 있도록 기존 D12와 같은 클립보드 대체 처리를 B03에 추가했습니다.
- 인기 사례 선정·분석 결과→B02·Android Back은 미연결입니다. 독립 preview는 그대로 유지합니다.

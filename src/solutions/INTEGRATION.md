# B 화면 통합 인계 — 예슬님

- 담당 폴더: src/solutions/. App.tsx·공통 라우팅은 이 PR에서 변경하지 않습니다.
- B01: categoryLabel, items({key,label}), onSelect(id), onWriteProblem, onBack을 받습니다.
- data/index.ts의 categories/getCategoryCases/solutionCases로 목록을 만들고 getSolutionById(id)로 B02 입력을 조회합니다. ID는 원본 분야:번호이며 UI 8카테고리와 구분됩니다. 활성 사례 53개입니다.
- B02: data,onBack,onContact,onComplete,onOpenVideo,onPreviewOpinion을 받습니다. 완료/뒤로 최종 목적지는 A01입니다. 독립 확인에서는 B01 복귀/이동 요청 안내만 수행합니다.
- B03: recipients=toMessageRecipients(data),onBack을 받습니다. 문의 대상별 문장·수정은 분리합니다. 뒤로는 같은 B02입니다.
- 복사 성공 후 최종 목적지는 A01, 작은 성공 알림은 홈 이동 뒤에도 보여야 합니다. 아직 홈 이동 콜백/전역 알림은 미구현입니다. copyMessage의 결과를 명시적 성공/실패/빈 값으로 분리하여 연결하고 문구 비교로 분기하지 마세요. 실패/빈 본문에서는 B03을 유지합니다.
- 의견 완료는 UI만이며 저장 API는 없습니다. 실제 LLM/분석 응답 연동도 미구현입니다. data/types.ts는 로컬 표시용이며 팀 API 계약이 아닙니다.
- 독립 진입: npm run dev 후 /src/solutions/preview.html. preview.tsx는 확인용 이동/스크롤 보존 예제입니다. 전체 앱 라우터로 복사하지 않습니다. preview-only.css도 출시 화면에 import하지 않습니다.
- 사진: data/photos.ts의 casePhotos에 사례 ID별 [{src,alt},...] 등록. 사진 미등록 시 사용자 제공 temporary-common.png가 임시로 표시됩니다. 내용/제목은 CSV를 수정 가능하며 ID를 유지하세요. 공동 시트 자동 동기화는 없습니다.
- main(PR #28) 병합 후 확인: 홈→문제 작성, 공통 미리보기, B01→B02→B03→B02→B01. 앱 빌드·B 독립 빌드·verify:foundations·데이터/메시지13개 검사 통과. 앱 빌드는 500kB 청크 크기 경고가 있으나 성공합니다.
- 미검증: Android 실기기, WebView 클립보드/키보드/시스템 여백/오버스크롤, PC 터치 모드 드래그 취소. 통합 시 화면별 상태 보존과 전역 알림 방식은 예슬님이 연결합니다.

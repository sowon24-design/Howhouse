# B 화면 통합 인계 — 예슬님

## 최신 인계 — 2026-11-01

- 이번 B 수정은 의견/문장 선택 시트 열기·닫기 모션, 의견 공백 검사, 판단 참고 펼침 모션, 레이아웃을 밀지 않는 복사 알림이다. 공통 Dialog는 재사용하며 공통 원본은 변경하지 않았다.
- B01/B02/B03의 외부 Props·데이터·콜백 형식은 이번 수정에서 변경하지 않았다. 새 SolutionSheet는 B 내부 전용이다. App.tsx·전체 이동·의존성도 변경하지 않았다.
- 사례 대표 이미지와 B02 최신 그라데이션/흰 헤더 변경도 이번 브랜치에 포함되어 있다. 이미지 교체는 data/photos.ts의 사례 ID 연결로, 내용 교체는 원본 CSV/변환 데이터 검증으로 계속 가능하다.
- 아래의 과거 인계 중 ‘인기 사례/분석 결과/Android Back 미연결’은 현재 main 통합 전 기록이다. 현재 코드에는 SolutionsFlow 및 AnalysisResultFlow를 통한 연결이 있다. 실제 Android 동작·실제 API 결과까지 모두 검증했다는 뜻은 아니다.
- 최신 이동 규칙: B01 뒤로→홈, 카테고리 경유 B02 뒤로→B01, 인기/분석 경유 B02 뒤로→홈, 완료→홈, B03 복사 성공→B03 유지, B03 뒤로→같은 B02.
- PC 확인: 타일 사례 선택, A02 왕복 시 B01 카테고리·스크롤 유지, B03 왕복 시 B02 단계·스크롤 유지, 마지막 카드 X=24px/다음 비활성, 시트 모션/초안 보존/공백 비활성, 실제 클립보드 일치, 360px 의견 시트 폭.
- 미완료/미검증: 의견 저장 API, Android WebView 터치/키보드/Back/클립보드 권한/시스템 여백, 외부 영상 앱 왕복, 실제 분석 응답의 B02/B03 전체 흐름. PC 결과와 분리해서 확인해야 한다.
- 소원·예슬 공동 확인: existing `{source:'existing',caseId}`와 generated `{source:'generated',solution}` 분기, toGeneratedSolution 표시 변환, 문의 문장 배열·빈 문의 대상, 웹/Android 서버 주소·환경변수·실제 API 테스트. API 비밀 키는 GitHub에 올리지 않는다.
- 자세한 확인/보류 항목은 [INTERACTION_CHECK.md](INTERACTION_CHECK.md)를 따른다. 과거 ‘복사 후 홈’ 기록보다 최신 ‘B03 유지’가 우선한다.

## 이전 인계 기록

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

### 2026-11-01 B02 재진입 상태 규칙 (예슬 확정)
- B02의 뒤로가기로 B01에 나가면 B02 스크롤·단계·평가·책임 설명·의견 초안을 폐기한다. Android Back도 같은 콜백을 사용한다.
- B01에서 같은 사례를 다시 선택해도 새 B02로 시작한다.
- B02↔B03 왕복 중에는 B02 상태를 유지한다. 사례 ID·결과 형식·외부 데이터 콜백은 변경하지 않는다.

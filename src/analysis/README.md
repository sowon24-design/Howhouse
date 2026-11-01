# 소원 담당 분석 모듈

현재 구현과 실행은 [CURRENT.md](CURRENT.md), 팀 연결 방법은 [INTEGRATION.md](INTEGRATION.md),
팀 전달 요약은 [YESUL_HANDOFF.md](YESUL_HANDOFF.md), 완료 점검은 [REMAINING.md](REMAINING.md)를 참고한다.
서버는 `server/analysis/`, 프론트 분석 함수·검증·샘플은 이 폴더에 있다.

## 담당 범위

- 소원: 글·사진 분석, 기존 사례 검색·적합성 판단, 조건부 해결책/문의 문장 생성, API·응답 검증, 요청 상태·취소·비용 보호.
- 연우: B 화면과 사례 자료. existing ID 원본은 현재 `src/solutions/data`를 사용한다.
- 예슬: A/D/E/F 화면(A04/A05 포함)과 전체 화면 이동. 이번 PR에는 사용자가 승인한 통합 변경이 포함돼 리뷰가 필요하다.

기존 사례가 없다는 이유만으로 실패시키지 않는다. 기존 사례는 원본 ID로 조회하며 생성 결과는 별도 데이터로 전달한다.
관리용 열·ID·책임·비용·외부 링크를 LLM 생성 대상으로 삼지 않으며 공동 시트를 수정하지 않는다.

## 기준 자료와 실제 조회 기록

기준은 루트 AGENTS.md, W9 PRD, docs/화면별_기능정의.md, DESIGN.md, src/components/CONTRACT.md이다.
이전 주차 자료와 `design/design system.md`는 기준으로 쓰지 않는다.
2026-10-31 초기 확인 때 다음 실제 자료를 읽었으며 수정하지 않았다.

- [Figma 출시 화면](https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=462-8452): A04 `463:10070`, A05 `509:8475`.
- [공동 사례 시트](https://docs.google.com/spreadsheets/d/1UIo0I-zIWh8y1aIkGIBD6Q0YrpeR86JxVrCtXDWJ-YU/edit): 4개 사례 탭 A1:AB65. 초기 조회 때 57개 번호가 있었으며 현재 앱은 삭제 목록 등을 반영한 53개 사례를 사용한다.
- 현재 실행 자료는 프로젝트에 포함된 CSV다. 시트 수정이 자동 반영되는 구조가 아니다.
- B03은 대상별 원본 문장을 순서대로 합쳐 최초 본문을 만든다. 별도 최초 본문 필드는 없다.

## 현재 확인 수준

PC와 USB 갤럭시 퀀텀4 Chrome에서 분석 흐름을 확인했다. APK/WebView 설치와 외부 서버 배포는 미완료다.
실제 API 테스트와 무료 샘플을 구분한다. 모델 정확도 전체를 검증한 것으로 보고하지 않는다.
키·원본 사진·암호화 답변·호출 기록은 Git에 올리지 않는다.

주차별로 하위 내용 여닫을 수 있습니다.

<details> <summary><h2>5주차</h2></summary>

### 맡은 역할
GitHub 저장소 세팅, 기술 타당성 검토, PRD 정리, 디자인 통합 논의 문서 작성 (※ 팀원과 공동으로 한 일은 삭제하거나 "(공동)"으로 표시)

### 한 일

**GitHub 세팅**
- 저장소 폴더 구조(docs, design, wireframes/이름, src, members/이름)를 Codex로 생성하고 PR로 올림
- git 사용자 이름·이메일을 확인해 커밋이 내 계정으로 연결되는 것을 확인
- main 브랜치 보호 규칙 때문에 PR 승인이 필요하다는 점을 파악하고 승인 절차를 팀에 공유
- main README 작성

**기술 타당성·PRD**
- 음성 트리거(iOS Siri 단축어/Android), 업체 정보 API, 문자 자동 발송 가능 범위 조사
- 조사 결과를 반영해 일정 조율을 빼고 해결 사례 도서관 + SOS 모드로 범위 확정에 참여
- Manyfast용 PRD 프롬프트 작성 및 PRD 초안 작성 (prd.md)

**디자인 통합 논의 문서**
- 팀원 3명이 각자 만든 디자인을 하나로 합치는 과정에서, 어떤 부분을 어떻게 합쳤는지와 논의사항을 문서로 정리해 작성 (design decision.md)

**와이어프레임·프로토타입**
- Figma(Figma Make)로 와이어프레임과 프로토타입 제작

### 결과 (커밋/PR/이슈 링크로 근거 남기기)
- PR #1 "폴더 구조 초기 세팅" (병합): https://github.com/sowon24-design/Howhouse/pull/1
- PR #5 "add prd.md & merge test" (병합): https://github.com/sowon24-design/Howhouse/pull/5
- PR #10 "add design decisions" (병합): https://github.com/sowon24-design/Howhouse/pull/10
- PR #11 "Delete docs/decisions" (병합): https://github.com/sowon24-design/Howhouse/pull/11
- PR #12 "add design decision.md" (병합): https://github.com/sowon24-design/Howhouse/pull/12
- PR #7 "wireframe-v1 pr" (리뷰 승인 없이 닫힘): https://github.com/sowon24-design/Howhouse/pull/7
- 브랜치별 내 커밋 목록:
- 1. main: https://github.com/sowon24-design/Howhouse/commits?author=xamxam33
  2. yeseul/design: https://github.com/sowon24-design/Howhouse/commits/yeseul/design
  3. yeseul/wireframe: https://github.com/sowon24-design/Howhouse/commits/yeseul/wireframe
  4. design-decision: https://github.com/sowon24-design/Howhouse/commits/design-decision
- 와이어프레임·프로토타입(Figma): https://www.figma.com/make/g3ZdCXZXOMinHk1c0Isjgf/Design-Wireframe-for-App?t=DFpoN6exd781E325-1
- 와이어프레임 (내 브랜치): https://github.com/sowon24-design/Howhouse/tree/yeseul/wireframe/wireframes/%ED%97%88%EC%98%88%EC%8A%AC
- 디자인 (내 브랜치): https://github.com/sowon24-design/Howhouse/tree/yeseul/design/design

</details>

<details> <summary><h2>6주차</h2></summary>

### 맡은 역할
사용성 테스트 설계(공동 업무)·관찰, UT 분석, PRD 수정, 수정사항 문서 작성, 각종 파일 관리, 레포지토리 규칙 정리 (※ 팀원과 공동으로 한 일은 "(공동)"으로 표시)

### 한 일

**사용성 테스트 계획·진행**
- 사용성 테스트 계획 및 설계: 과업 시나리오(싱크대 아래 누수), 관찰 체크포인트(진입·수행·확인), 판정 기준(독립 성공·도움 후 성공·실패)
- 사용성 테스트 3회 진행 (관찰자)
- 사용성 테스트 템플릿 구글 독스 기록 (공동)
- 촬영 영상, 화면 녹화, 스크립트 등 UT 기록물을 드라이브와 GitHub에 정리

**사용성 테스트 분석**
- Claude를 활용한 UT 분석 프롬프트 설계: 반드시 지킬 규칙 6가지(알림 무시, 확인된 것만 쓰기, 확실도 표시, 발언 원문 유지, 사실·해석 분리, 시간 맞추기)와 출력 형식 5가지(화면 체류 타임라인, 사건 기록, 체크포인트 요약, 문제 후보, 확인 필요 목록)
- 손 촬영 영상, 화면 녹화, 음성 스크립트의 시간을 맞춰 참여자별 UT 기록 3건 작성 (UT_P01 · UT_P02 · UT_P03)
- 화면 녹화로 기존 기록의 [추정] 항목을 확인하고, 문제 정의를 수정해 기록을 완성
- UT를 어떤 자료와 프롬프트로 분석했는지 정리한 분석 과정 문서 작성

**UT 결과를 바탕으로 반영할 수정사항 논의 (공통 업무)**
- 팀원들과 논의를 통해 3번의 UT에서 공통적으로 발견된 문제 (ex. 긴급 모드를 사용하지 않음) 등을 정리
- 이를 바탕으로 PRD와 프로토타입에 수정할 내용을 논의 및 정리함

**PRD·프로토타입 수정**
- UT를 바탕으로 PRD 및 프로토타입 수정사항 6가지 도출 (공동): 긴급 모드 삭제, 해결 단계 용어 풀어 쓰기, 단계 카드 상세 이미지 삭제, 업체 찾기를 카카오맵 API 기준으로 통일, 메시지 전송 후 해결 사례 페이지로 복귀, 메시지 만들기 화면 구조 변경
- 업체 찾기 수정 방향을 정하기 위해 카카오맵 로컬 API의 제공 범위와 리뷰 수집 시 저작권 문제를 확인
- PRD 문서 수정: SOS 모드 관련 내용 삭제, 화면별 요구사항(문제 입력·사례 보기, 커뮤니티, 해결 단계 카드, 연락 메시지, 업체 찾기) 추가, 시나리오와 성공 지표 갱신
- 'w6_수정사항 기록' 파일에 수정 항목별 인사이트, UT 근거, 수정 이유, 수정 전·후를 문서화

**수정사항 문서화**
- UT 결과를 바탕으로 어떤 기능을 왜 고쳤는지 정리한 'w6_수정사항 기록' 문서 작성
- 수정 항목 6가지마다 핵심 인사이트 → UT 근거(참여자 발언·행동과 시점) → 수정 이유 → 수정 전·후 비교 순서로 정리
- 맨 위에 항목별 핵심 인사이트와 반영 위치(PRD 절, 프로토타입 화면)를 한눈에 보는 요약 표를 넣음
- 다음 UT에서 수정 효과를 확인할 재검증 기준을 항목별로 정리
- PRD에는 바뀐 기능만 남기고, 수정 근거는 이 문서로 분리해 PRD에서 링크로 연결

**저장소 운영**
- main README에 레포지토리 규칙 정리
- contribution 브랜치를 만들어 팀원 모두 매주 회고와 기여 기록을 작성할 수 있는 공간 신설
- /design 파일 내 디자인 제출물들을 codex로 주차별로 하위 폴더를 생성할 수 있도록 구조 변경

### 결과 (커밋/PR/이슈 링크로 근거 남기기)
- PR #14 - #16: https://github.com/sowon24-design/Howhouse/pulls?q=is%3Apr+state%3Aclosed
- 브랜치별 내 커밋 목록:
  1. main: https://github.com/sowon24-design/Howhouse/commits/main
  2. PRD: https://github.com/sowon24-design/Howhouse/commits/PRD
  3. W6-Usability-Test: https://github.com/sowon24-design/Howhouse/commits/W6-Usability-Test
  4. contribution: https://github.com/sowon24-design/Howhouse/commits/contribution
- UT 분석 기록 (내 브랜치 'yeseul/usability-test/Usability Test/허예슬_UT 분석 문서'): https://github.com/sowon24-design/Howhouse/tree/yeseul/usability-test/Usability%20Test/%ED%97%88%EC%98%88%EC%8A%AC_UT%20%EB%B6%84%EC%84%9D%20%EB%AC%B8%EC%84%9C
- 사용성 테스트 템플릿 기록 (구글 독스, 공동 업무): https://docs.google.com/document/d/1o35ro-qQkY2Kp1yOX1RPo5dv-gCnscj-b2y2-6C21IE/edit?tab=t.0
- UT 기록물 (드라이브): https://drive.google.com/drive/folders/1ah5hECdTXkZMfvGoauoKEmGQuanYvnLg?usp=drive_link

</details>

<details>
<summary><h2>7주차</h2></summary>

### 맡은 역할
개인 디자인 시안 제작, 발표 PPT의 공통 디자인 시스템·그리드 설정, IA 및 플로우차트 제작, 발표 PPT 제작(공동), 발표 준비 및 진행(공동)  
※ 팀원과 공동으로 한 일은 "(공동)"으로 표시

### 한 일

**개인 디자인 시안 제작**
- 개인 스케치를 바탕으로 Figma에서 디자인 시안 1·2 제작
- 화면별 레이아웃과 시각적 표현을 구체화하고 디자인 고도화
- 제작한 개인 시안을 팀 디자인 취합 및 발전의 바탕으로 활용

**발표 PPT 디자인 시스템·그리드 설정**
- 팀원들이 하나의 Figma 파일에서 작업할 때 발생할 수 있는 디자인 불일치를 줄이기 위해 공통 기준 마련
- PPT에 사용할 컬러·타이포그래피 시스템과 그리드 설정
- 모든 팀원이 일관된 색상·텍스트 위계·정렬 기준으로 슬라이드를 제작할 수 있도록 작업 환경 구성

**IA 및 플로우차트 제작**
- 사용성 테스트 결과와 수업 피드백을 반영한 7주차 최종 서비스 구조 정리
- 수정된 서비스 구조를 설명할 IA와 플로우차트 제작
- IA로 화면 간 정보 구조를 정리하고, 플로우차트로 주요 기능의 이용 순서와 화면 이동 흐름을 시각화

**발표 PPT 제작 (공동)**
- 1–7주차 활동 내용을 정리하여 발표 자료 초안 작성
- 발표 내용의 연결과 전달 순서를 고려해 PPT 전체 흐름 정리 (개인)
- 공통 디자인 시스템과 그리드를 바탕으로 슬라이드 디자인

**발표 준비 및 진행 (공동)**
- 팀원별 발표 파트를 나누고 담당 내용에 맞춰 발표 준비
- 각자 맡은 파트를 발표하며 프로젝트 진행 과정과 결과 공유

### 결과 (커밋/PR/이슈 링크로 근거 남기기)
- 개인 디자인 시안 1, 2 (내 브랜치): https://github.com/sowon24-design/Howhouse/tree/yeseul/design/design/w7%20design
- 팀 디자인 시안 1, 2: https://github.com/sowon24-design/Howhouse/tree/main/design/w7%20design
- 발표 PDF: https://www.figma.com/deck/2iw0u6sn1xJmAuFOetZ63E

</details>

# 작은 텍스트 출처 표시 공식 조건 대조

확인일: 2026-11-11. 현재 화면은 변경하지 않았다.

## 결론
현재 ‘출처: YouTube’ 텍스트 링크만으로 공식 요건 충족을 입증하지 못했다. ‘금지라는 개별 회신을 받음’ 또는 ‘YouTube가 이 앱을 불승인함’이라는 뜻은 아니다. 공개 기준에 명시된 브랜드 표시 방식을 따랐다는 확인 근거가 없어 출시 승인으로 처리할 수 없다는 판단이다.

## 근거
1. 개발자 정책 III.F.2.1은 썸네일도 YouTube Brand Features를 표시해 출처를 명확히 해야 하는 콘텐츠로 명시한다.
   https://developers.google.com/youtube/terms/developer-policies
2. API 이용약관 1.4의 Brand Features 정의에는 상호·상표 등도 포함된다. 그러나 10.1과 10.3은 브랜드 지침에 따른 사용을 요구하고 최종 적합성 판단을 YouTube에 유보한다. 정의에 상호가 포함된다는 사실만으로 일반 글꼴 텍스트 링크가 로고 대체 수단으로 승인됐다고 해석하지 않는다.
   https://developers.google.com/youtube/terms/api-services-terms-of-service
3. Branding Guidelines는 공식 로고/아이콘의 선택과 API 영역 옆 배치를 안내하며 표시하는 로고·아이콘의 최소 크기는 공식 브랜드 사이트 기준을 따르도록 요구한다. 작은 일반 텍스트만으로의 대체 예외는 확인하지 못했다.
   https://developers.google.com/youtube/terms/branding-guidelines
4. 공식 브랜드 사이트의 실제 화면에서 Digital 최소 높이100px를 확인했다. 이전20px를 인용하는 제3자 자료를 최신 공식 조건 대신 사용하지 않는다. 작은 CSS 글자 출처에 이100px 수치를 적용한다는 뜻이 아니라, 텍스트를 공식 로고 대체물로 인정하는 근거 자체가 없다는 뜻이다.
   https://brand.youtube/youtube-logo/
5. 공식 준수 안내는 허용 여부가 불확실하면 API Compliance Audit을 요청하도록 안내한다. 공개 연결 폼은 현재 Audit and Quota Extension Form이며 추가 한도 요청/재감사 항목을 표시한다. 해당하지 않는 신청 사유를 임의로 선택하지 않는다. 지원 경로 확인·회신이 필요하다.
   https://developers.google.com/youtube/terms/developer-policies-guide
   https://support.google.com/youtube/contact/yt_api_form

## YouTube 확인 요청 초안 — 발송하지 않음
Our Android housing-help app uses YouTube Data API v3 only to retrieve public video metadata and thumbnails. Each thumbnail links to its original YouTube video. Immediately below it, we display an underlined clickable text attribution, “출처: YouTube” (“Source: YouTube”), in the app's regular caption font. We do not display a YouTube logo or icon. Can this exact implementation satisfy Developer Policies III.F.2 and the Branding Guidelines? If not, what is the minimum permitted attribution treatment for this mobile thumbnail card? Please identify the applicable official specification or written exception. We are not requesting additional quota.

첨부 후보: youtube-source-small.jpg(키·이용자 정보 없음). 발송하지 않았다.

## 재개 조건
- 공식 대체 기준 또는 이 구현에 적용 가능한 YouTube의 서면 확인을 받는다.
- 또는 출처 부분만 공식 브랜드 조건에 맞추는 변경 범위를 확정한다.
- 그전에는 providerPolicyReviewed=false 유지. 공개 개인정보 문서·새 동의의 실기기 검증·Play 설치본 검증도 별도로 남아 있다.
- 최종 AAB 생성·업로드·테스터 초대·심사 제출은 하지 않았다. 기존 디자인·키·설정·커밋은 변경하지 않았다.

## 후속 구현
작은 텍스트 방식은 현재 코드에서 제거했고 공식 원본 아이콘·최소 표시크기·내장 여백·관련 영상 링크를 적용했다. 이 문서의 ‘텍스트 대체 승인 불확실’은 이전 구현에 대한 판단이다. 최신 구현·검증·남은 별도 출시 항목은 YOUTUBE_RELEASE_READINESS.md 참조.

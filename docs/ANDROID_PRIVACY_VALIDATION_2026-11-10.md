# Android 실기기 개인정보 흐름 검증

2026-11-10 / Galaxy A54 SM-A546S / Android 16 / WebView Chromium 156.

## 범위와 설치

- 로컬 `codex/photo-privacy-minimization`의 5456b44 기준. main·운영·공개 Notion 변경 없음.
- 기존 앱을 덮어쓰지 않는 별도 `com.howhouse.validation` / ‘어쩌집 검증용’ debug APK 설치. `release-preview` 웹 모드, 개발 도구 숨김, 미국 리전 가드 유지. 최종 서명된 출시 APK가 아니다.
- 앱 엔드포인트는 `analysis.audit.invalid`, `auth.audit.invalid` 및 합성 publishable 표식만 사용. 실제 Supabase 프로젝트·OpenAI에 연결하지 않았다. `analysisConsentApproved=false` 유지.
- APK SHA-256: `CABF7BCC5F3C0985FBFCA090E4D8DF05CEB63508EB359EF24D40DB56DDD03AF1`.
- 빌드 시 생성된 PC 전용 Capacitor 경로 변경은 원상복구했다. 시스템 기본 Java·SDK 설정을 변경하지 않았다. 준비 과정의 두 가상기기는 종료했다.

## 실제 기기에서 통과

| 검증 | 결과 | 확인 방식 |
| --- | --- | --- |
| JPEG/PNG/WebP 원본 메타데이터·파일명 제거 | 통과 | Android WebView에서 합성 EXIF/GPS/XMP·텍스트/메타데이터를 넣은 사진으로 현재 prepareAnalysisPhoto 실행 |
| EXIF 회전·표시 크기 유지 | 통과 | 회전된 JPEG 및 PNG/WebP의 디코딩 전후 표시 크기·픽셀 표본 대조 |
| 손상·취소·인코딩 실패 | 통과 | 원본 전송으로 대체하지 않고 오류/취소 |
| 네이티브 카메라 첨부 후 정리 | 통과 | 사용자가 촬영·첨부한 상태 확인. 기기 안에서 2296×4080 유지, 새 JPEG 2,266,296바이트, 고정 이름·원본 EXIF 미복사 확인 |
| 네이티브 보관함 첨부 후 정리 | 통과 | 사용자가 보관함에서 추가한 두 번째 사진 확인. 기기 안에서 1438×2048 유지, 새 JPEG 526,291바이트, 고정 이름·원본 EXIF 미복사 확인 |
| 최종 승인 전 분석 차단 | 통과 | 실제 앱 A02 화면에서 선택 항목을 모두 체크해도 ‘동의하고 분석하기’ 비활성, 안내 표시, 첨부 사진 유지 확인 |

실사용자가 선택한 두 사진의 픽셀·파일 바이트·원래 이름은 PC/외부 서버로 내보내지 않았다. PC 결과에는 MIME·정리 후 크기·표시 크기와 성공 여부만 기록했다. GPS가 원본에 실제 있었는지까지 판독하지 않았으며, 출력에서 원본 EXIF가 복사되지 않음을 확인했다. 사진 속 얼굴·주소 등 픽셀은 제거 대상이 아니다.

## 실제 Android WebView + 로컬 HTTP/SQL 통합 검증

현재 createPrivacyClient·createHttpAnalysisClient·prepareAnalysisPhoto를 별도 테스트 번들로 불러왔다. 전송 함수에 개발자 도구를 통한 로컬 연결 어댑터를 주입하여 휴대폰에서 직렬화한 실제 multipart 바이트를 PC의 loopback HTTP 서버로 연결했다. 서버는 실제 createAnalysisServer·createReleaseStore와 SQL 마이그레이션을 적용한 메모리 PGlite를 사용했다. 테스트 의존성에만 consentApproved=true를 주입했으며 앱·운영 승인 파일은 false 그대로다.

| 검증 | 결과 |
| --- | --- |
| 동의 전 분석 요청 | 서버 consent-required, 모델 스텁 미호출 |
| 수집·이용만 선택, 국외 이전 미선택 | 동의 거부 |
| onboarding·analysis 각 표면의 v6 동의 저장 | 영수증 확인, 문서 버전·해시 일치 |
| 저장 후 합성 사진 분석 | 두 표면 모두 성공, 현재 전송 함수에서 정리한 사진 바이트 도착, 원본 표식 미포함 |
| 철회 후 분석 | 로컬 영수증 해제, 서버에서 차단, 추가 모델 스텁 호출 없음 |
| 삭제 | 합성 계정·동의 이력 삭제 확인. 다른 합성 계정과 공통 문서 보존 |

모델 스텁 호출 2회 / 실제 AI 호출 0회 / 운영 DB 쓰기 0회. 합성 Auth·모델과 단순 ledger를 사용했다. 이 검증에서 답변 캐시·평가·신고의 실운영 데이터 삭제까지 검증한 것은 아니다.

## 아직 통과로 표시할 수 없는 것

- 실제 Supabase Auth·운영 DB의 신규 v6 저장·삭제, Render 배포 연결, 실제 OpenAI 답변 품질·사진 인식 성공.
- 최종 승인 후 UI 버튼에서 실제 서버까지의 전체 성공 흐름. 이번 성공 흐름은 WebView 안의 현재 클라이언트 함수를 로컬 어댑터로 실행한 것이며, 미승인 UI를 출시 승인으로 바꾸지 않았다.
- 최종 서명 출시 APK·스토어 심사, 공개 약관 동기화, 국외 이전 고지의 법적 충분성.
- 외부 요청이 시작되면 차단하는 개발자 도구 감시 중 예상치 못한 외부 요청은 관측하지 않았지만, 이를 모든 화면·모든 네이티브 통신의 완전한 감사로 확대하지 않는다.

다음 실제 연결 검증은 운영을 바꾸지 않는 별도 승인된 테스트 환경과 테스트 계정으로 진행해야 한다. 그 환경이 없으면 이번 결과를 실운영 E2E 통과로 대체하지 않는다.

결과 파일은 사용자 전달용 outputs의 `Android-실기기-로컬통합-검증.json`, `Android-카메라사진-기기내-검증.json`, `Android-보관함사진-기기내-검증.json`, `Android-미승인-분석차단-검증.json`에 저장했다. 합성 서버·DB는 검증 종료 후 닫았다.

# 어쩌집 비공개 테스트 인계 — 2026-11-12

## 현재 상태
휴대폰의 새 약관 열람·필수 확인·홈 이동, 자동 썸네일·흰 아이콘·20% Multiply 디자인·YouTube 외부 이동/복귀를 사용자가 정상 확인했다. 이전 오프라인 검색·문의 편집/복사·뒤로가기·설정 초기화 확인도 기록되어 있다.

제출용 production 웹 빌드·Android 동기화 완료. 관련 검사92개·타입 검사 통과, catalog-preflight blocker0. 이는 코드/자산 사전검사 통과이며 Play Console 필수 항목·법적 인증·실제 Play 설치 완료를 의미하지 않는다.

## 최종 AAB
- 패키지 com.howhouse.app / 표시명 어쩌집 / 버전1.0 / 코드1 / target SDK36.
- 최종 정책 catalog-2026-11-12-youtube-v2. PR66 UI와 사용자 승인 출처 레이어/준비물 비연결 표시 유지.
- 예정 출력: Howhouse-1.0-v1-YouTube-20261112-release.aab.
- 사용자 서명 명령 준비 완료. 파일348개 해시로 변경 여부 확인 후 기존 업로드 키를 사용한다. 비밀번호는 사용자 직접 입력.
- 아직 AAB 생성/검증 완료로 보고하지 않음. QA APK는 제출하지 않는다.

## 팀원에게 전달할 변경점
- AI/OpenAI·Supabase 로그인/저장·사진 분석 없음. 서버 계정 없음.
- 기존 사례 검색·준비물·해결 순서·문의 문장 선택/편집/복사는 기기에서 동작.
- 준비물 쿠팡 링크 없음. 스토어 설명/이미지/광고 선언에 쿠팡 기능을 넣지 않음.
- YouTube API 썸네일 자동 조회가 있어 인터넷 권한과 Google 외부 통신이 있음. 네트워크 없는 이전 버전의 수집/공유 답변을 그대로 복사하지 않음.
- 사용자 자료와 접속정보를 구분: 닉네임·검색어·문의 문장·사진·광고 ID·OAuth 토큰은 API에 넣지 않음. Google은 기기에서 접속정보를 받음. 앱 메모리 해제가 Google 기록 삭제는 아님.
- 개인정보 공개 URL: https://xamxam33.notion.site/41402821a7f3805bb89cccccd63ec5a6
- 이용약관 공개 URL: https://xamxam33.notion.site/41402821a7f3808b8575dc3b877d7763
- 담당 유소원 / 어쩌집 운영팀 / happytanglee@gmail.com.
- Google 직접 수집과 운영팀의 국외 이전 구분은 YOUTUBE_PRIVACY_REASSESSMENT_20261112.md 참조. 단일 로그 보관기간 미확인만으로 출시 불가라고 보지 않으며 무위험·심사 승인도 보증하지 않음.

## 순서
1. 서명 AAB 생성 후 서명/버전/권한/정책해시/번들 포함물 검증.
2. Console 앱 설정·스토어 자료·데이터 보안·콘텐츠 등급·대상 연령·광고·앱 액세스·정책URL 대조. 팀원이 작업 중인 항목은 임의 저장하지 않음.
3. 비공개 테스트 Alpha에 최종 AAB 등록. Console의 버전 코드 수용/사전 검사 확인.
4. 사용자가 준비한 테스터12명 이메일/그룹 설정. 명단 입력은 아직 보류 상태이며 자동 메시지 발송 안 함.
5. 비공개 테스트 심사/배포 뒤 Play에서 직접 설치하여 Google 재서명본의 썸네일과 기본 기능 검증.
6. 해당 계정의 프로덕션 액세스 조건을 Console에서 충족한 뒤 신청. 사용자 확인이 필요한 약관 동의/공개 출시 제출은 별도 단계.

실제 Play 설치본 검증은 아직 미완료. 이번 작업에서 commit/push/PR/main 병합·스토어 제출·초대 발송은 하지 않았다.

## 최종 AAB 생성·검증 완료
- 파일: C:/Users/user/Documents/Codex/howhouse-release-20261111-pr67/Howhouse-1.0-v1-YouTube-20261112-release.aab
- SHA-256: d5895b92d18d136045aac289710ae7e73c256634d03257f27bcafb007d71a15c
- 크기63,520,102바이트. bundletool 구조 검증·jarsigner 서명 검증·업로드 인증서 일치 확인.
- 패키지com.howhouse.app / 1.0 / 코드1 / target36 / min24.
- 권한은 INTERNET과 앱 내부 receiver용 signature 권한. 카메라·사진 권한 없음. allowBackup=false.
- 정책 v2·production 승인 메타데이터·원본 정책 해시 및 Android 웹 파일297개 일치.
- Play 서명 헤더 포함, 이전 AI/DB 서버 문자열과 고정 video-thumbnails 자산 제외. 네이티브 공유 라이브러리 .so 없음.
- 상세 검증 JSON: C:/Users/user/Documents/Codex/howhouse-release-20261111-pr67/final-aab-verification-20261112.json
- 이 파일이 현재 제출 후보이며 이전 QA APK/AAB와 구분한다. 이후 소스/정책/디자인 변경 시 다시 빌드·검증해야 한다.
- Console 업로드·버전 수용·심사·테스터 등록·Play 설치본 검증은 아직 하지 않았다. 팀원 Console 자료와 개인정보 선언을 맞춘 뒤 비공개 테스트 단계로 진행한다.

## Play Console 반영 완료 (2026-11-12)
사용자 후속 요청에 따라 개인정보 URL·지원 이메일·현재 앱 기준 데이터 보안을 저장하고 최종 AAB를 Alpha에 업로드했다. 저장된 버전은 1.0(1)이며 한국어 출시 노트 포함. 상세 근거/변경은 PLAY_CONSOLE_UPDATE_20261112.md 참조. 테스터 미지정·난독화 가독화 파일 미첨부 경고2건을 확인했다. 테스터 이메일과 Google 검토 전송은 아직 하지 않았다. 이전 '업로드 미실행' 문단은 당시 단계 기록이다.

## 2026-11-12 코드 2 최종 반영 완료

- R8 적용 APK 수동 휴대폰 검증 통과: 검색 유지·뒤로가기·문의 수정/복사·YouTube 썸네일/외부 이동/복귀, 기존 UI 유지.
- Alpha에 버전 1.0 / 코드 2 AAB 업로드 및 저장 완료. 코드 1은 다른 버전으로 대체됨으로 표시된다.
- Play가 ‘이 app bundle에는 ReTrace 매핑 파일이 첨부되어 있습니다.’로 인식했다.
- 출시 검토 화면 경고는 테스터 미지정 1개만 남았다. 가독화 파일 경고는 해소됐다.
- 아직 검토를 위해 Google에 전송하지 않았다. 테스터 이메일도 입력하지 않았다. commit·push·PR 없음.
- 실제 Play 설치본의 YouTube 연결은 테스트 배포 후 별도 확인할 항목이다.
- 증빙: 로컬 r8-20261112/play-code2-saved.png 및 r8-verification.json.

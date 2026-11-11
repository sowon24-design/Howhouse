# 공식 YouTube 미리보기 연결 준비 — 2026-11-11

## 결정과 현재 상태
사용자는 공식 API로 썸네일 유지 준비를 선택했다. AI·Supabase 기능을 재도입하지 않는다. 새 라이브러리 설치·유료 결제·클라우드 설정 변경·API 실호출·commit/push/PR·Play 업로드는 수행하지 않았다. 테스터12명은 확보됐고 이메일 입력은 사용자가 나중에 진행한다.

src/youtube/preview-client.ts는 준비 단계 모듈이며 화면에서 아직 import하지 않는다. 기존 VideoPreview의 JPG 경로와 이미 검증한 AAB는 그대로다. 이 모듈 추가만으로 썸네일 문제 해결·출시 준비 완료라고 보고하지 않는다.

## 계정 준비 순서 (초보자용)
1. Google Cloud Console에 앱을 관리할 개인 Google 계정으로 로그인한다. 학교 계정은 관리자가 서비스를 제한할 수 있다.
2. 프로젝트 선택 → 새 프로젝트. 이름은 Howhouse YouTube로 준비한다. 프로젝트명은 공개될 수 있으므로 개인정보는 넣지 않는다. 조직은 개인 계정에서 선택 없음으로 가능하다면 둔다.
3. 최초 약관·국가 확인은 사용자가 직접 검토·동의한다. 무료 체험 시작·결제 계정 연결·유료 서버는 진행하지 않는다.
4. API 및 서비스 → 라이브러리 → YouTube Data API v3 → 사용. Gemini/OpenAI 등 다른 API가 아니다.
5. 사용자 인증 정보 → API 키 생성. 키 원문은 채팅·캡처·GitHub에 보내지 않는다. 새 자격증명 생성·저장은 사용자가 직접 진행한다.
6. API 제한: YouTube Data API v3만 선택. 무제한 키로 출시하지 않는다.
7. Android 앱 제한에 패키지 com.howhouse.app와 해당 설치본의 SHA-1을 지정한다. 직접 설치 APK의 업로드 서명 인증서와 Play App Signing의 실제 배포 인증서는 다를 수 있으므로 둘을 구분한다. Play에 실제 적용된 서명 SHA-1은 Console에서 확인 후 등록한다. 인증서 지문은 공개값이지만 비밀번호·keystore 파일은 공유하지 않는다.
8. 읽기 전용 videos.list 1회로 제한된 키의 작동·Android 요청 헤더·WebView CORS를 실검증한다. 실패하면 제한을 해제하지 않고 원인을 확인한다. 일반 브라우저에서 Android 키를 무제한 재사용하지 않는다.

Google API 키는 앱에 포함하면 추출 가능한 프로젝트/쿼터 식별값이다. OpenAI 비밀 키를 숨기는 설계와 다르며 완전 은닉을 보장하지 않는다. Google도 Android 헤더 제한 우회 가능성을 명시하므로 API 제한·쿼터·모니터링을 함께 적용한다. 이 위험을 허용할 수 없으면 별도 서버 경로를 먼저 설계해야 하며 자동으로 옛 Render/Supabase 서버를 재사용하지 않는다.

## 구현한 모듈
- 공식 HTTPS videos.list, part=snippet,status. 알려진 11자리 영상ID 하나만 조회.
- 검색어·닉네임·문의 문장·사진·사용자 로그인/OAuth는 전송하지 않음.
- 원본 제목·채널명 보존, 공개 상태만 허용. 삭제/비공개는 unavailable.
- 공식 API에서 받은 i.ytimg.com HTTPS/해당ID 경로만 허용. 임의 URL·인증정보 포함 URL 거절.
- 쿠키 제외·요청 no-store·자동 재시도/영구 캐시 없음. 취소 후 늦은 성공 반영 금지.
- 오류에 키·URL·응답 원문을 포함하거나 로그로 출력하지 않음.
- Android 제한용 패키지·SHA-1 헤더 지원. 실제 제한 검증 및 CORS 검증은 미완료.
- 프리뷰 이미지의 실제 다운로드·노출·명시적 사용자 선택·object URL 해제는 후속 화면 어댑터 작업이며 아직 포함되지 않음.

## 연결 전에 반드시 할 일
- 외부 로딩을 이용자가 선택할 수 있도록 안내하고 연결하지 않아도 사례·검색·문의 기능과 YouTube 외부 이동을 유지한다.
- Google에 접속하면 IP·기기/요청 정보·영상ID 등이 처리될 수 있다. 현재 정책의 외부 링크만 사용한다는 설명은 API 직접 통신을 설명하지 못하므로 실제 정보흐름과 법적 고지 근거를 검토한다. 단순 버튼 하나가 국외 이전 고지 요건을 자동 충족한다고 간주하지 않는다.
- 개인정보 안내에 YouTube API 사용·Google 개인정보처리방침, 필요한 YouTube 이용약관 연결 및 이용 조건을 반영한다. 공개 문서·앱 동기화 및 Play 설문을 담당 팀원에게 전달한다.
- CSP connect/img 허용 출처는 필요한 Google API와 썸네일 출처로 한정, Android INTERNET만 추가. 카메라·사진·위치·계정 권한 추가 없음. 현 connect-src none을 우회하지 않는다.
- 썸네일은 원본 비율/내용을 유지하고 잘라내거나 변조하지 않는다. 현재 object-fit:cover 및 어두운 오버레이는 새 표시 구현 시 대조한다. YouTube 출처를 명확히 표시한다.
- 고정 JPG 배포 경로를 제거하고 실패 시 로컬 JPG로 되돌리지 않는다. 자동 영구 캐시 없이 새로 조회하며 오프라인에서는 네트워크 썸네일 대신 안내만 표시한다.
- 기존 승인 JSON의 true를 이번 기능 검증 완료로 재사용하지 않는다. 정책 변경·네트워크 추가·실기기 확인 후 승인하며 현재 새 기능 출시 승인 미완료.
- 기존 versionCode1의 라이브러리 사용 여부를 확인한 뒤 필요하면 증가. AAB 재서명·전체 권한 및 변경 화면 검증 후 Alpha에 올린다. 이전 AAB는 보존하되 새 API 적용본으로 간주하지 않는다.

## 비용과 근거
videos.list는 요청당1쿼터 단위이며 검색 대신 정해진ID 조회를 사용한다. 기본 쿼터와 실제 프로젝트 설정은 Console에서 확인한다. 결제 계정·유료 서버 없이 기본 할당 내에서 준비하고 자동 유료 확장을 가정하지 않는다.
- https://developers.google.com/youtube/data/reference/rest/v3/videos/list
- https://developers.google.com/youtube/data/getting-started
- https://developers.google.com/youtube/terms/developer-policies (III.E.4, III.F.2)
- https://developers.google.com/youtube/terms/developer-policies-guide
- https://docs.cloud.google.com/docs/authentication/api-keys (Android restrictions와 우회 가능성 주의)
- https://policies.google.com/privacy?hl=ko

## 검사
node --experimental-strip-types --test src/youtube/preview-client.test.mjs : 7개 통과. 가짜 fetch 응답을 사용한 무료 검사이며 실제 Google 연결 성공·정책 적합성 보장은 아니다.

## 실제 Cloud 준비 현황
2026-11-11 사용자가 개인 계정 로그인 및 최초 Cloud 약관 완료를 확인했다. Howhouse YouTube 프로젝트(project ID howhouse-youtube)를 생성하고 화면에서 완료 확인. 결제/무료체험 등록 및 유료 리소스 생성은 수행하지 않음. Google이 프로젝트 생성 시 기본 활성화하는 API들이 있으므로 YouTube만 활성화돼 있다고 단정하지 않는다. YouTube Data API v3 상세 화면의 사용 설정 직전까지 준비했다. 해당 화면은 제품 사용이 별도 약관 동의임을 표시하므로 사용자의 직접 검토·사용 설정을 요청했다. API 키는 생성하지 않았고 앱 실연결도 미완료다.
- 후속 실제 확인: YouTube Data API v3 상태 사용 설정됨. 사용자 인증 정보 탭에서 API 키와 OAuth 클라이언트가 모두 없는 상태를 확인했다. 사용자 인증 정보 만들기 메뉴만 펼쳤고 API 키 생성은 사용자에게 인계했다. OAuth 동의 화면 구성 경고는 보이지만 공개 메타데이터 API 키 요청에 사용자 로그인/OAuth를 추가하지 않는다.
- 키 제한 실제 확인: Howhouse 키는 YouTube API 전용 제한만 저장돼 있었고 Android 제한 없음이었다. 사용자 승인 범위의 축소 조치로 Android com.howhouse.app 및 직접 설치 업로드 인증서 SHA-1 F1:C0:8F:E7:53:31:26:3A:97:96:55:F9:6C:61:89:73:60:8D:FA:78을 추가·저장했다. 목록의 Android 앱, API1개 및 제한 요약에서 저장 확인. 키 원문 표시·복사·회전·재생성 안 함. Play 배포 인증서 추가는 별도 남음.
- 로컬 키 설정 명령은 Windows 사용자 DPAPI 암호화로 저장하며 채팅이나 Git으로 키를 전달하지 않는다. 해당 Windows 사용자/PC에 종속되므로 다른 PC에서 그대로 읽지 못할 수 있다. 최초 공식 메타데이터 요청1회 결과는 키/응답본문/URL 없이 별도 보고서에 저장한다. 이 요청은 PC의 선언된 Android 헤더 검사이며 실기기·WebView CORS·Play서명 최종 검증을 대신하지 않는다.

## 2026-11-11 연결 구현 후속
- 사용자 로컬 실호출 보고서 youtube-live-check.json: HTTP200, publicVideo/thumbnailAvailable true. 실제 키는 읽거나 출력하지 않음. 최초에는 작업 프로세스의 계정 보호로 오인했으나, 후속 확인에서 암호화 문자열 끝의 줄바꿈을 제거하지 않은 형식 오류로 정정했다. Trim 후 키 값을 출력하지 않고 복호화/형식 검사 통과. DPAPI 암호화 보호 자체는 유지했다.
- src/solutions/VideoPreview는 이제 src/youtube/YoutubePreview로 연결됐다. 고정 JPG import 제거. 사용자가 버튼을 누르기 전 통신하지 않고 API 원본 제목·채널명·공식 이미지 표시. 이미지 요청도 no-store/omit/no-referrer, blob URL 사용 및 취소·숨김·언마운트 해제. 오프라인/실패 시 외부 영상 이동 유지.
- 기존 썸네일 원본과 같은 해시의 파일이 미리보기 dist에 0개임을 확인. 원본 저장소 JPG는 기존 작업 보존을 위해 삭제하지 않았고 APK 번들에 포함하지 않는다.
- 공식 YouTube 브랜드 사이트 제공 PNG를 변경 없이 포함하고 출처/해시 기록. 최신 사이트의 최소 digital 높이100px 및 여백·관련영상 링크 준수로 준비했으며 UI 실기기 시각 확인은 남음.
- CSP는 www.googleapis.com과 i.ytimg.com fetch만 허용하고 직접 원격이미지는 허용하지 않는다(blob 표시). Android INTERNET 추가, 카메라/앨범/위치/분석 SDK 추가 없음.
- 무료 회귀 검사111개·타입·기초 자산·미리보기 빌드·Gradle 구성 확인 통과. CORS 사전 검사: Google API는 https://localhost와 Android 요청 헤더 허용, 이미지 서버 ACAO * 확인. 실제 WebView 호출·이미지 decode 성공은 아직 미확인.
- 별도 YouTube 승인파일은 모두false, catalog 공개정책/Android/콘텐츠 승인도false로 변경해 재검증 전 출시 빌드를 차단. 실제 release 빌드가 차단됨을 확인.
- docs/YOUTUBE_PRIVACY_HANDOFF.md에 팀원 작업과의 차이·공개문서 초안·미확인 법적 근거 및 국가/보관 문제를 기록. Google API 사용이 개인정보 검토를 자동 완료하지 않음.
- 사용자 실행 확인용 빌드는 assembleYoutubeQa: 동일 패키지/업로드 서명으로 기존 설정 보존 업데이트 가능, 버전명 -youtube-check, 개발 확인용/Play 제출 불가. 아직 생성·설치하지 않았다. 기존 최종 AAB는 보존하고 새 API 적용본으로 간주하지 않는다.

- 확인용 명령 수정: Get-Content -Raw 결과의 끝 줄바꿈을 .Trim()으로 제거한 뒤 ConvertTo-SecureString 실행. 암호문 원본·키·권한은 변경하지 않았다. PowerShell 구문 및 복호화/키 형식 검사 통과. 아직 APK 빌드 성공으로 기록하지 않음.

- 사용자 PowerShell 후속 오류: Vite의 reporter/chunk 경고가 Windows PowerShell 5의 NativeCommandError로 승격되어 안내 명령이 중단됨. 외부 명령을 Start-Process -Wait -PassThru -WindowStyle Hidden으로 실행하고 stdout/stderr 로그를 분리, 실제 ExitCode로 실패 여부를 판단하도록 Vite/Capacitor/Gradle 3곳 모두 수정. Windows PowerShell 5에서 stderr 경고를 출력하지만 exit0인 통제 검사를 실행해 중단되지 않음을 검증했다. 경고 로그와 실제 빌드 실패 검사는 유지하며 보안/실행정책을 변경하지 않음. 새 APK 빌드 결과는 아직 미확인.

## 최신 사용자 지시 — UI/문구 동결
PR67 기존 UI 디자인과 문구를 유지한다. 영상 카드의 기존 class·크기·색·외부이동 아이콘·접근성 문구를 유지하고 썸네일 데이터 공급만 교체한다. 추가한 로고·별도 버튼·영상제목/채널명·설명 문구·전용 CSS는 화면에서 제거했다. B02 기존 CSS·공통 코드/스타일·화면 이동·앱 정책 본문은 변경하지 않았다. 새 데이터 처리 안내나 출처 표시가 필수라고 판단되면 임의 UI 추가 없이 먼저 사용자에게 공유한다.
새 동작은 카드가 보일 때 조회하며, 이전의 명시적 버튼 선택 방식으로 작성한 개인정보 초안/검증 기록을 최종안으로 사용하면 안 된다. 로고/제목 미표시 및 기존 이미지 crop/overlay의 YouTube 표시 조건은 검토 미완료이고 출시 승인false 유지.
API 키를 VITE 환경변수로 주입하는 실제 연결본 빌드는 자동 승인 검토가 ‘추출 가능한 키 노출을 구체적으로 승인받지 않음’ 사유로 차단했다. 우회·간접 빌드는 진행하지 않았고 키 없는 디자인 빌드 및 무료 검사만 진행했다. 제한된 Google 공개 프로젝트 키를 앱에 포함하는 것에 대한 명시 승인 또는 대체 설계 결정이 필요하다. 기존 테스트 APK는 이미 설치된 이전 버튼형 버전이며 새 디자인을 설치 완료로 보고하지 않는다.
- 사용자가 추출 가능성과 무료 호출 한도 소진 위험을 고지받은 뒤 ‘제한된 공개 키 방식 승인’으로 명시 승인했다. 해당 YouTube 전용·Android 제한 공개 프로젝트 키만 포함한 썸네일 전용 확인 빌드 재시도 승인 후 성공. 키 값은 출력하지 않음.
- 자동 회귀111개 및 타입 검사 통과. 기존 B02 CSS/공통 스타일·컴포넌트/전체 이동/정책 본문 diff 없음. 키 포함 웹296개가 Android에 동기화됐고 고정 JPG/추가 로고/미리보기 불러오기·YouTube에서 영상 보기 문구가 새 번들에 없음을 확인.
- 새 서명 안내는 이미 검증한 웹파일 해시를 확인한 뒤 assembleYoutubeQa만 수행한다. 이전 키 설정/전체 빌드 안내를 반복하지 않는다. 기존 APK 보존. UI 변경본의 서명·설치·휴대폰 검증은 아직 미완료이며 출시 승인false 유지.

## Play 서명 제한 후속 완료
2026-11-11 사용자가 현행 Play 앱 서명 키의 공개 SHA1 AB:05:9B:FC:7D:3F:5D:9F:69:0D:7E:57:EA:2B:71:20:BE:8A:9E:E6을 복사해 제공했다. Google Howhouse 키의 Android 제한에 com.howhouse.app/해당 지문을 추가·저장하고, 페이지를 다시 열어 해당 행과 기존 직접설치 F1:C0:8F:E7:53:31:26:3A:97:96:55:F9:6C:61:89:73:60:8D:FA:78 행이 모두 보존됐음을 확인했다. YouTube Data API v3 1개 제한 유지. 키 값·키 회전·서명키 자체·결제·리전·앱 UI/문구는 변경하지 않았다.
Play 지문 헤더로 공식 공개 영상ID1건 조회HTTP200/영상존재 확인. 이는 선언된 헤더와 서버 제한의 검사이며 실제 Play 설치본 인증서·HTTP헤더·WebView 동작 검증을 대신하지 않는다. 해당 보고서는 youtube-play-restriction-check.json.
src/youtube/android-signers.json에 공개 지문만 기록하고 scripts/youtube-release.mjs는 Play 제출 빌드에서 Play SHA1과 일치하지 않으면 차단하도록 보완했다. 관련 검사3개 통과. 기존 UI/문구/공통 스타일/이동 diff 없음.
YouTube 관련 승인 파일은 모두false 유지. 공개 개인정보 고지·출처표시와 실제 Play설치본 확인이 아직 남는다. 새 AAB·Git 게시·Play업로드 없음.

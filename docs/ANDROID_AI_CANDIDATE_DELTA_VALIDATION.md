# PR62 최신 AI Android 후보 — 변경 부분 검증

2026-11-12 / 기준 `6d0dc2c` + 이번 상세 경로 수정.
앱 소스 SHA-256: `427fcb53eefdd29b1b76b51d1adeabc0734faaed1793d479c004b2716a9d85ce`.
정책 파일 SHA-256: `4df09469175dd06fe66a759c2b1baba13debe624464b92484f820228d8fb415b` / 동의 v9 유지.

## 범위

Pixel_10 Android16 가상기기에 별도 applicationId `com.howhouse.validation`의 debug APK를 오프라인 Gradle로 빌드·설치했다. 웹은 release-preview, variant=ai, aiEnabled=true, serverStorage=true, developerTools=false, privacyReady=false, requiredProcessingRegion=us였다. 합성 `.invalid` 주소·공개 키만 넣었고 분석 승인 파일은 false 그대로다. 최종 서명 스토어 APK·실제 휴대폰·운영 연결 검증이 아니다.

이번에 바뀐 사례·닉네임·썸네일·외부 링크에 집중했다. 사진 디코더·메타데이터 제거·동의/철회/삭제의 기존 v9 WebView SQL 검증 및 이전 앱/서버 카탈로그115개 일치 결과는 재사용했다. 운영 DB 쓰기·실제 OpenAI 호출·main 병합·운영/공개 Notion 설정 변경은 0회다.

## 발견하고 고친 문제

홈 배치가 없는 추가 사례 G01을 `#case/...`로 열면 App이 표시할 category를 찾지 못해 상세 화면을 표시하지 않았다. 실제 후보 WebView에서 해당 제목을 찾지 못하는 것으로 재현했다. AI 결과 화면과 직접 사례 경로는 구분하며 모든 AI 결과가 실패했다는 뜻은 아니다.

`categoryForCaseDetail()`을 추가하여 홈 분류가 없는 사례도 같은 분야의 상세 화면 틀을 사용하도록 연결했다. 홈 목록 자체는 변경하지 않아 추가23개 배치·나머지39개 제외 규칙을 유지한다. 상품·영상 링크와 AI·서버 기능을 삭제하지 않는다. 관련 회귀 검사4개와 타입 검사를 통과한 뒤 APK를 새로 빌드·재설치하여 재검증했다.

## 실제 후보 결과

| 대상 | 결과 |
| --- | --- |
| AI 후보 식별·정책 해시 | APK의 빌드 확인표와 소스 일치, 승인 우회 없음 |
| 닉네임 초안 | 입력→약관 화면으로 뒤로→닉네임 재진입 후 같은 값 유지, 시작 완료 |
| 난방·전기:G07 | 4단계·준비물 버튼·원래 YouTube 주소 및 포장 썸네일 로딩 정상 |
| 욕실·수도:G12 | 5단계·준비물 버튼·원래 YouTube 주소 및 포장 썸네일 로딩 정상 |
| 해충·곰팡이:G35 | 4단계·준비물 버튼3개, 영상 없는 사례 처리 정상 |
| 난방·전기:G01 | 수정 후 홈 배치 없는 사례의 5단계 상세 정상, 영상·준비물 없는 경우 정상 |
| 화면 검증 중 외부 요청 | 0건, 외부 전송 차단 유지 |
| 쿠팡 버튼 | 디지털 온습도계 버튼의 실제 Android ACTION_VIEW→coupang.com 실행 요청 정상 |
| YouTube 링크 | 실제 Android ACTION_VIEW→youtube.com, YouTube 앱 UrlActivity 연결 요청 정상 |

썸네일은 WebView의 로컬 asset/data URL과 이미지 디코딩 완료(naturalWidth>0)를 확인했다. 기존 YouTube 링크를 보존했으며 새 YouTube API·키를 등록하지 않았다. 준비물의 기존 쿠팡 일반 검색 링크도 보존했다.

링크 검증은 실제 네트워크 connected=false, 비행기 모드에서 DOM 클릭 핸들러가 발생시킨 외부 Intent를 Android 로그로 확인했다. 가상기기의 오프라인 보호가 화면 이동을 막는 상태와 정상 연결 상태의 화면 검증을 구분했다. 실제 상품 페이지 접속·영상 재생·로그인·구매는 수행하지 않았다. 앱의 오프라인 보호를 제품 코드에서 끄지 않았다.

## 증거와 정리

로컬 outputs에 `Android-후보-변경부분-검증.json`, `Android-후보-외부링크-검증.json`, `Android-후보-추가사례.png`를 저장했다. 원본 상품/영상 외부 콘텐츠·사용자 사진·키·토큰은 수집하지 않았다. APK·테스트 하네스·합성 설정·ADB 주소는 PR에 넣지 않는다.

동기화가 만든 PC 경로는 복원한다. 검증 앱과 이번에 열린 외부 앱 종료, ADB 포워딩 제거, 가상기기 연결 설정 복구 후 이번 숨김 가상기기를 종료한다.

다음 잔여는 예슬이의 v9 공개 반영, 승인된 AI 브랜치의 앱/서버 버전 동시 적용, 최종 서명 앱의 실제 글·사진 분석 결과·평가·철회/삭제 확인이다. 이번 결과를 운영 분석 성공이나 최종 출시 승인으로 확대하지 않는다. main의 AI 없는 출시 버전과 YouTube API 준비 작업은 변경하지 않았다.

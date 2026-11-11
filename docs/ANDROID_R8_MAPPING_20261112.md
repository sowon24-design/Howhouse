# R8 가독화 파일 준비 (2026-11-12)

- Play에 저장한 코드 1은 난독화가 꺼져 있어 mapping.txt가 없었다. 경고를 숨기기 위한 임의 파일은 만들지 않는다.
- 출시 빌드에 R8 및 기본 최적화 규칙을 활성화했다. Capacitor 8.6.0이 제공하는 플러그인 보존 규칙을 사용한다.
- 새 산출물은 버전 1.0 / 코드 2이다. UI·문구·데이터 처리·권한은 변경하지 않는다.
- APK와 AAB를 같은 빌드에서 생성하고 해당 mapping.txt를 별도로 보관한다. AAB 내 BUNDLE-METADATA의 매핑과 일치하는지 후속 검증한다.
- 현재: 설정 및 서명 명령 구문·출시 사전 검사 완료. 실제 R8 빌드, 서명·매핑 확인, 휴대폰 회귀 검사, Play 코드 2 업로드는 미완료다.
- 코드 1의 기존 산출물은 보존한다. 코드 2의 매핑을 코드 1에 첨부하면 안 된다.
- 테스터 등록·Google 심사 전송은 수행하지 않았다. Git 게시도 수행하지 않았다.

## 근거

- https://developer.android.com/topic/performance/app-optimization/enable-app-optimization
- https://support.google.com/googleplay/android-developer/answer/9848633?hl=ko

AAB의 가독화 파일 자동 인식 여부는 새 빌드 업로드 후 실제 Console에서 확인한다.

## 실제 코드 2 빌드 확인

APK·AAB 빌드 성공. AAB 내 proguard.map과 별도 mapping.txt의 SHA-256 일치 확인. APK 서명은 기존 업로드 인증서와 같고 AAB jarsigner 검증은 jar verified다. 자체 서명 인증서·타임스탬프 부재·ZIP manifest 순서 관련 jarsigner 경고는 별도 로그에 보존했다. bundletool 구조 검사를 통과했고 기존 권한과 버전 코드 2를 확인했다. 연결된 갤럭시에 업데이트 설치·실행 성공. 수동 회귀 확인과 Play 코드 2 업로드/가독화 경고 해소 확인은 아직 남아 있다.

검증 기록: howhouse-release-20261111-pr67/r8-20261112/r8-verification.json (저장소 외 로컬 산출물)

사용자가 휴대폰에서 검색·뒤로가기, 문의 수정·복사, YouTube 표시·외부 이동·복귀와 기존 UI 유지가 정상임을 확인했다.



## 2026-11-12 코드 2 최종 반영 완료

- R8 적용 APK 수동 휴대폰 검증 통과: 검색 유지·뒤로가기·문의 수정/복사·YouTube 썸네일/외부 이동/복귀, 기존 UI 유지.
- Alpha에 버전 1.0 / 코드 2 AAB 업로드 및 저장 완료. 코드 1은 다른 버전으로 대체됨으로 표시된다.
- Play가 ‘이 app bundle에는 ReTrace 매핑 파일이 첨부되어 있습니다.’로 인식했다.
- 출시 검토 화면 경고는 테스터 미지정 1개만 남았다. 가독화 파일 경고는 해소됐다.
- 아직 검토를 위해 Google에 전송하지 않았다. 테스터 이메일도 입력하지 않았다. commit·push·PR 없음.
- 실제 Play 설치본의 YouTube 연결은 테스트 배포 후 별도 확인할 항목이다.
- 증빙: 로컬 r8-20261112/play-code2-saved.png 및 r8-verification.json.

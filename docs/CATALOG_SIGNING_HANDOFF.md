# 출시 서명 및 남은 인계

현재는 검토용 QA APK만 준비되어 있다. 기존 키는 사용자가 생성한 `howhouse-release.jks`, alias `howhouse`이며 파일·비밀번호를 채팅이나 Git에 올리지 않는다.

## 준비한 빌드 구성

Android release 서명은 다음 프로세스 환경변수로만 받는다.

- HOWHOUSE_KEYSTORE_PATH: 기존 키 파일의 절대 경로
- HOWHOUSE_KEYSTORE_PASSWORD: 키 저장소 비밀번호
- HOWHOUSE_KEY_ALIAS: howhouse
- HOWHOUSE_KEY_PASSWORD: 키 비밀번호

첫 업로드임을 사용자 확인했다. `src/catalog/app-release.json`을 단일 기준으로 패키지 `com.howhouse.app`, versionCode `1`, versionName `1.0`을 사용한다. 별도 버전 환경변수는 요구하지 않는다. 이후 업데이트 때는 이 파일의 코드를 증가시킨다.

값 누락 시 release 작업은 중단한다. debug QA는 비밀 값을 요구하지 않는다. 공개 정책·Android·콘텐츠·기존 데이터 전환 승인이 없거나 preview 웹 파일이면 기존 출시 차단도 유지한다. 비밀번호는 사용자 기기에서 비공개로 입력하며 빌드 후 환경변수를 지운다. 값이 포함된 명령·전체 환경변수·로그를 공유하지 않는다.

승인과 실제 테스트가 완료된 뒤의 순서:

1. `node scripts/catalog-preflight.mjs`의 미완료 항목 확인. 이 도구는 확인값을 자동 승인하지 않는다.
2. 정책·실기기·콘텐츠 확인 완료 후 출시 웹 빌드, Capacitor copy/sync 수행.
3. 사용자 기기에만 서명 환경변수 4개 설정. 버전은 첫 업로드 설정 파일 기준.
4. android에서 `gradlew.bat bundleRelease` 실행. 생성 AAB의 패키지 ID·versionCode·인증서를 Console 등록 정보와 대조.
5. QA APK나 debug 서명 파일 대신 확인한 release AAB를 비공개 테스트 트랙에 제출.

## 다음에 필요한 외부 결과

- 팀원이 생성한 AI 없는 Notion 개인정보·약관의 공개 URL 및 시행일.
- GPT 이미지별 입력 참고 자료·로고·초상 등 제3자 권리 검토. 자체 생성 사실은 확인했지만 모든 이미지 권리 검증을 대신하지 않는다.
- Gmail 문의 처리 안내 확정 및 기존 AI 기록의 권리 행사 경로 확인.
- 기기 준비 후 실기기 확인. 사용자 요청으로 지금은 보류하며 통과로 기록하지 않음.
- 기존 AAB/APK 업로드 없음은 사용자 확인 완료. 첫 업로드 시 패키지 및 업로드 키/Play App Signing 상태 대조.
- 최종 앱 아이콘·대표 이미지·실제 화면 스크린샷과 콘텐츠 등급/데이터 보안 설문 완료.

커밋·푸시·실서버 변경·기존 DB 삭제·문서 공개·Play 제출은 실행하지 않았다.

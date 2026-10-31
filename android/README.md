# 어쩌집 Android 개발용 기본 프로젝트

## 현재 상태

- Capacitor 8.6.0, 앱 표시 이름 어쩌집, 개발용 식별자 com.howhouse.app.
- React 소스는 기존 src/에서 수정한다. Android 전용 부분은 이 폴더에서 관리한다.
- 웹 빌드·동기화·개발용 APK 빌드·Pixel 10 에뮬레이터 설치 및 E01 첫 화면 표시까지 확인했다. 키보드·사진·뒤로가기 등 Android 기능 검증은 아래 후속 범위에 남아 있다.
- 기본 아이콘·네이티브 시작 화면·버전은 템플릿이다. 출시용 디자인과 버전 확정은 후속 작업이다.

## 첫 실행 준비

1. https://developer.android.com/studio 에서 Windows용 Android Studio 설치. 다운로드/설치 중 약관은 사용자가 직접 확인·동의한다.
2. 초기 설정에서 Android SDK, Platform Tools, Emulator를 설치한다. 이 프로젝트는 compile/target SDK 36, 최소 API 24를 사용한다. SDK Manager에서 API 36과 요구되는 Build Tools를 설치한다. Gradle JDK는 Java 21을 사용한다. 최신 Studio에 포함된 Java 25에서는 현재 Gradle 8.14.3 실행 시 `Unsupported class file major version 69` 오류가 확인됐다.
3. 프로젝트 루트에서 `npm run android:sync`, `npm run android:open`을 실행한다.
4. Android Studio의 Gradle 동기화를 완료하고 Device Manager에서 Android 가상 기기를 생성한다. Run으로 실행한다.
5. 현재 Windows 프로젝트 경로에 한글이 포함되어 있다. Gradle이 비 ASCII 경로 오류를 내면 원본을 이동/삭제하지 말고 영문 경로의 별도 체크아웃 또는 빌드 경로를 준비한다. 오류를 확인하기 전에 경로 검사를 임의로 끄지 않는다.

## 화면 수정 후 반영

### 예슬 PC에서 확인한 빌드 환경

- Eclipse Temurin Java 21: `C:\Users\asus\AppData\Local\HowhouseTools\jdk-21.0.13+9`. 공식 배포 ZIP의 SHA-256 검증 후 압축 해제했다. 시스템 기본 Java는 변경하지 않았다.
- SDK: `C:\Users\asus\AppData\Local\Android\Sdk` (Platform 36, Build Tools 35.0.0).
- 원본 프로젝트의 한글 경로로는 Android Gradle 플러그인이 빌드를 차단했다. 원본을 이동하지 않고 `subst`로 같은 폴더를 `W:\`에 연결하여 빌드에 성공했다. 경로 검사 비활성화는 사용하지 않았다.
- `W:`는 파일 복사본이 아니라 같은 원본 폴더의 별칭이며, 재부팅 후 다시 연결해야 할 수 있다. 이미 다른 용도로 사용 중인 드라이브에는 연결하지 않는다. 팀원은 자신의 영문 경로와 JDK/SDK 경로를 사용한다.

프로젝트 루트 PowerShell에서 이 PC의 재설치 절차:

```powershell
# W:가 비어 있고 아직 연결하지 않은 경우에만 실행
subst W: (Get-Location).Path
$env:JAVA_HOME = "$env:LOCALAPPDATA/HowhouseTools/jdk-21.0.13+9"
$env:ANDROID_HOME = "$env:LOCALAPPDATA/Android/Sdk"
npm run android:sync
& W:/android/gradlew.bat -p W:/android assembleDebug
# 빌드 성공 후, adb devices로 현재 기기 ID를 확인한다.
& "$env:ANDROID_HOME/platform-tools/adb.exe" devices
& "$env:ANDROID_HOME/platform-tools/adb.exe" -s emulator-5554 install -r W:/android/app/build/outputs/apk/debug/app-debug.apk
& "$env:ANDROID_HOME/platform-tools/adb.exe" -s emulator-5554 shell am start -n com.howhouse.app/.MainActivity
```

Android Studio에서 실행할 때는 `W:\android`를 열고 Gradle JDK를 위 Java 21 폴더로 지정한다. 이 PC의 경로를 팀 공용 Gradle 설정에 하드코딩하지 않는다.

프로젝트 루트에서 `npm run android:sync`를 실행한 뒤 Android Studio에서 Run한다.
이 명령은 웹 빌드 후 dist를 Android assets로 복사하고 네이티브 의존성을 동기화한다.
`android/app/src/main/assets/public`을 직접 수정하지 않는다. 자동 생성되며 Git에서 제외한다.
팀원 변경을 받은 후에도 같은 명령으로 반영한다. 웹 개발만 하는 팀원은 Android Studio 설치가 필요 없다.

## 다음 검증 범위

- 온보딩/홈 진입, 닉네임 재실행 유지, 테스트 초기화.
- Android 상태바·하단 시스템 영역 및 키보드 표시 시 닉네임 CTA 위치.
- Android Back은 아래 규칙으로 연결했다. 실제 기기의 제스처 Back, 사진 첨부 상태의 보존, 전체 화면별 회귀 검증은 추가 확인한다.
- 사진 선택·최대 5장·카메라 권한. 웹의 현재 사진 선택 UI를 옮긴 것만으로 Android 연결 완료로 보지 않는다.
- 실제 API, F02 네트워크 복구는 별도 단계. 현재 샘플 분석만 있다.
- 브라우저 저장과 Android WebView 저장은 별개다. 웹 테스트 닉네임을 자동으로 가져오지 않는다.
- 개발용 도구는 현재 웹과 동일하게 포함된다. 출시 전에 노출 범위를 정리한다.

## 팀 협업·배포 전 확인

- com.howhouse.app은 사용자 승인 개발용 식별자다. 스토어 등록 전에 팀과 확정한다. 변경 시 설치된 기기에서는 다른 앱으로 취급되고 테스트 저장값이 이어지지 않을 수 있다. 변경 시 Capacitor 설정뿐 아니라 Gradle applicationId/namespace, Java 패키지 경로도 함께 맞춘다.
- SDK 경로 local.properties, 빌드 결과 APK/AAB, 서명 키·비밀 값은 커밋하지 않는다. 현재 서명·배포·push는 하지 않았다.
- 설치 시 npm audit의 moderate 4건은 Capacitor CLI의 rimraf→glob/minimatch 개발 의존성 경로에서 보고되었다. 강제 구버전 다운그레이드는 하지 않았다. 릴리스 준비 시 업데이트 여부를 재확인한다.

공식 안내: https://capacitorjs.com/docs/getting-started/environment-setup · https://capacitorjs.com/docs/basics/workflow

## Android 시스템 뒤로가기 (2026-10-31)

- 공식 `@capacitor/app` 8.1.2의 backButton 이벤트를 사용한다. 브라우저 history.back()으로 화면을 추측하지 않는다.
- 키보드는 Android가 우선 닫는다. 앱에 전달된 Back은 열린 dialog의 기존 cancel 콜백 → 현재 보이는 화면의 복귀 콜백 순으로 처리한다. 닫힘 애니메이션 중에는 추가 Back이 아래 화면으로 전달되지 않는다.
- A02: 기존 진입 화면(홈 또는 B01)으로. A04/A05: 분석 요청을 취소하고 A02로 돌아가며 현재 글·사진을 메모리에서 유지한다. 홈 이동 시 기존 초안 초기화가 적용된다. 실제 서버 취소 기능을 추가한 것은 아니다.
- D02: 저장 없이 D01, 정보 화면: D01, D01: 홈. E04: E03, E03: 마지막 소개, 소개: 직전 소개, 첫 소개: E01.
- 사용자 결정: 홈 A01 / 최초 환영 E01에서는 minimizeApp으로 백그라운드로 보낸다. 강제 종료·프로필 삭제는 하지 않는다.
- B 내부 코드는 수정하지 않는다. `src/app-screens/solutions/SolutionsFlow.tsx`에서 B03→B02, 카테고리 경유 B02→B01, 홈/분석 결과 경유 B02→홈, B01→홈을 연결한다. A02 뒤에 남아 있는 B01은 Back을 중복 수신하지 않는다.
- F01/F02 및 foundations는 아직 개발 미리보기다. 미정인 실제 복구/종료 목적지를 임의로 추가하지 않고 Back 화면 이동을 보류한다.
- 에뮬레이터 확인: A02 키보드만 닫기(화면·글 유지), 사진 첨부 시트만 닫기, A04→A02(글 유지), A02→홈, 홈→휴대폰 홈. 분석 취소·늦은 응답 등 기존 모듈 검사 10개 통과. 사진 파일 첨부 보존과 모든 D/E/B 경로의 실제 기기 검증을 완료한 것은 아니다.

## Android 사진 연결 (2026-10-31)
- `@capacitor/camera` 8.2.6: A02에서 시스템 카메라와 사진 선택기를 호출한다. B 화면/분석 모듈은 수정하지 않는다.
- Android 사진 선택은 남은 장수를 limit으로 전달한다. 1장 남으면 단일 선택. Android 13+ 시스템 선택기에서 선택 개수 제한을 지원한다. 구형 선택기가 초과 결과를 반환하면 일부만 잘라 넣지 않고 재선택 안내를 표시한다. 웹은 기존 1장 선택을 유지한다.
- 촬영은 saveToGallery=false, 별도 편집/리사이즈/추가 압축/용량 제한은 적용하지 않는다. 플러그인 기본 이미지 처리와 캐시 사용은 있으며 원본 바이트 보존을 보장하는 설정은 아니다. 서버 전달 규격은 소원과 별도 합의한다.
- 최종 결과를 File[]로 변환해 기존 analysisUserPhotos에 추가한다. 일부 파일 읽기 실패 시 해당 선택 묶음은 추가하지 않고 기존 입력을 보존한다. 첨부 중에는 분석 CTA와 중복 선택을 막는다.
- 사용자 승인: 취소 시 안내 오류 없이 기존 글·사진 유지. 권한/읽기 실패 시 A02 오류 안내, 글만으로 이용 가능, 설정 자동 이동 없음. 갤러리 전체 접근이나 카메라 권한을 불필요하게 Manifest에 추가하지 않는다. 외부 시스템 카메라/사진 선택기가 권한을 처리하므로 팝업이 항상 뜨는 것은 아니다.
- 문제 초안은 메모리에만 유지한다. 홈/새로고침/프로세스 종료 시 초기화한다. 촬영 중 OS가 앱 프로세스를 종료한 경우 결과/초안을 복원하지 않는다. 시스템 카메라가 사용하는 임시 캐시 파일의 즉시 삭제까지 구현한 것은 아니다.
- 검증: Pixel 10 Android 16 (API 36.1)에서 촬영 후 첨부, 사진만으로 CTA 활성, 기존 1장+4장 복수 선택, 5번째 추가 선택 차단 안내, 총 5장일 때 + 숨김, 삭제 후 + 복귀, 선택 취소 후 기존 4장 유지, 촬영 취소 후 작성 글과 4장 유지 확인. 권한 거부/읽기 실패는 코드 검사로 확인했으며 실제 거부 UI·구형 Android·실기기 검증은 남아 있다.
- 검사: `node --test src/app-screens/problem/native-photos.test.mjs`. 실제 API 전송은 하지 않는다.

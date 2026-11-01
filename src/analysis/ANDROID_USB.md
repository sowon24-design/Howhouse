# Android 폰 USB 검증 — 1단계

현재 Platform-Tools 설치와 갤럭시 퀀텀4 USB 연결을 완료했다. 5173/8787 연결 및 폰 경유 서버 응답을 확인했다. 아래는 다시 연결할 때의 절차다.
먼저 **휴대폰 Chrome의 웹 화면**을 확인하며, APK/WebView 검증 완료를 뜻하지 않는다.
프로젝트의 Android 설정을 임의로 HTTP 허용/보안 해제로 바꾸지 않는다.

## 1. 소원이 직접 할 도구 준비

1. [Google 공식 Platform-Tools 페이지](https://developer.android.com/tools/releases/platform-tools)를 연다.
2. `Download SDK Platform-Tools for Windows`를 선택한다.
3. 다운로드 전 Google SDK 약관이 표시된다. 소원이 직접 읽고 동의 여부를 결정한다.
   Codex가 대신 약관에 동의하거나 다운로드 동의 절차를 우회하지 않는다.
4. 받은 `platform-tools-latest-windows.zip`을 폴더에 압축 해제한다.
   예: `C:\Users\user\Downloads\platform-tools-latest-windows\platform-tools\adb.exe`가 보이면 된다.
   Howhouse의 public 폴더/소스에 SDK 도구를 넣지 않는다.

## 2. 휴대폰 준비

1. 폰의 설정에서 개발자 옵션을 활성화하고 USB 디버깅을 켠다. 위치는 제조사에 따라 다르다.
2. 데이터 전송 가능한 USB 케이블로 PC에 연결하고 폰 잠금을 푼다.
3. ‘이 컴퓨터에서 USB 디버깅을 허용’ 창은 소원이 직접 확인한다. 승인/인증을 우회하지 않는다.
4. ADB가 unauthorized를 표시하면 재시도하기 전에 폰 승인 상태를 확인한다.

## 3. PC에서 연결 확인

저장소 루트 PowerShell에서 실행한다. 첫 경로는 실제 압축 해제한 위치로 바꾼다.

```powershell
$analysisAdb = 'C:\Users\user\Downloads\platform-tools-latest-windows\platform-tools\adb.exe'
& $analysisAdb devices
```

정확히 1대가 `device`로 표시되면 준비된 스크립트로 확인/연결할 수 있다.

```powershell
.\scripts\connect-analysis-usb.ps1 -AdbPath $analysisAdb -CheckOnly
.\scripts\connect-analysis-usb.ps1 -AdbPath $analysisAdb
```

이 스크립트는 1대만 선택 가능하며 5173/8787만 USB로 연결한다.
Windows 스크립트 실행 정책에 막히면 정책을 해제하지 말고 아래 ADB 명령을 직접 실행한다.
여러 기기가 연결되어 있으면 다른 기기를 분리한 뒤 진행한다.

```powershell
& $analysisAdb reverse tcp:5173 tcp:5173
& $analysisAdb reverse tcp:8787 tcp:8787
```

## 4. 실행 확인

PC의 별도 두 PowerShell 창에서 기존 실행 방법대로 서버와 Vite를 실행한다.

```powershell
node server/analysis/server.mjs
npm run dev -- --strictPort
```

폰 Chrome에서 **http://127.0.0.1:5173/#problem** 을 연다.
동일한 주소를 사용해야 기존 서버 Origin 검사와 맞는다. PC 서버를 0.0.0.0으로 공개하거나 방화벽을 끌 필요가 없다.
USB가 연결된 동안만 테스트하며 Wi-Fi/공개 인터넷 서버 배포가 아니다.
무료 샘플로 입력·사진 선택·성공/실패·뒤로·X를 먼저 확인한다.
실제 분석 버튼은 과금될 수 있다. 신규 사진 테스트는 남은 한도와 자료를 먼저 확인한다.

연결 해제는 이 프로젝트 포트만 제거한다. `reverse --remove-all`로 다른 프로젝트를 지우지 않는다.

```powershell
& $analysisAdb reverse --remove tcp:5173
& $analysisAdb reverse --remove tcp:8787
```

현재 폰 Chrome의 첨부·입력 보존·결과/문의 화면과 USB 서버 연결을 확인했다. Codex 환경의 ADB 실행은 프로필 폴더 권한으로 실패할 수 있으므로 재연결 명령은 사용자 PowerShell에서 실행한다. 시스템 권한이나 전역 Git/보안 설정을 변경하지 않는다.
네이티브 앱은 이후 Android Studio/JDK/SDK 준비 후 HTTPS/개발 연결 정책까지 별도로 확인해야 한다.
키는 계속 PC 서버에만 두며, 폰·프론트·VITE_ 변수로 복사하지 않는다.

공식 참고: [USB로 로컬 서버 연결](https://developer.android.com/develop/ui/views/layout/webapps/access-local-server),
[ADB와 기기 승인](https://developer.android.com/tools/adb).


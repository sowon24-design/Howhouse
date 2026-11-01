# 공용 시험 APK 연결

소원 전달(2026-11-01): 서버 Live/health, PC 실제 분석·B02·B03, 사용자별 캐시·암호화 답변 저장 확인. 이 기록은 담당자 전달 내용이며 예슬 PC/Android 검증 결과와 구분한다.

## 팀원별 설정

프로젝트 루트의 `.env.trial.local`에 소원에게 받은 공개 연결 설정을 작성한다. 파일은 Git에서 제외된다. 아래 빈칸은 실제 값으로 채운다.

```dotenv
VITE_ANALYSIS_API_BASE_URL=
VITE_ANALYSIS_AUTH_URL=
VITE_ANALYSIS_AUTH_PUBLISHABLE_KEY=
```

OpenAI 키·Supabase secret/service_role 키는 넣지 않는다. 공개 publishable 키만 앱에 포함한다.

```sh
npm run android:sync:trial
```

위 명령은 `trial` 모드로 빌드하고 Android에 복사한다. 이후 Android Studio에서 APK 빌드·설치한다. 기존 `npm run android:sync`를 이어 실행하면 일반 샘플 기본 빌드로 덮어쓰므로 혼용하지 않는다.

- `trial`: 실제 API 기본. 분석 버튼을 눌러야 요청한다. 개발용 도구에서 무료 샘플로 전환 가능.
- 일반 `npm run dev`, `npm run build`, `npm run android:sync`: 기존 무료 샘플 기본.
- 설정 누락·비 HTTPS·비공개 키 종류는 trial 빌드에서 차단한다. 형식 검사는 실제 서버 연결 성공을 뜻하지 않는다.
- 개발 도구의 현재 모드를 확인한 뒤 분석한다. 유효한 저장 답변이 없으면 실제 분석 비용이 발생할 수 있다.

## Origin

소원이 허용한 Origin: `https://localhost`, `http://localhost`, `http://127.0.0.1:5173`, `http://localhost:5173`.
현재 Capacitor 설정에는 원격 URL/호스트 override가 없다. 설치 후 실제 WebView Origin과 연결을 확인한다.
Vite는 5173 strictPort로 실행하여 포트가 사용 중일 때 5174로 자동 변경하지 않는다. 다른 포트·LAN 주소는 서버 담당 확인이 필요하다.

## 검증 및 남은 작업

- 예슬 PC 통합 미리보기 1280×720에서 빈 입력/25줄 입력 확인: 입력창 최대 250px, CTA y=568~624로 화면 안에 표시되고 클릭 위치가 가려지지 않음. 소원 측 가림 현상은 현재 코드에서 재현되지 않아 레이아웃은 변경하지 않음.
- 시험 모드 선택·빌드 설정 검사는 무료 로컬 검사다. 실제 서버 주소·인증 설정 수령 전에는 시험 APK 연결 완료로 보지 않는다.
- 이후: 설정 반영 → APK 빌드·설치 → Origin/인증 확인 → 사용자가 허용한 실제 글·사진 분석 → B02·B03 확인.
- 공용 서버 사진 분석, 실기기 오프라인/90초 제한 회귀는 별도 검증한다. 자동 재분석 금지·취소·입력 보존과 F02 일반 복귀 규칙은 유지한다.

### 2026-11-01 시험 APK 반영 결과

- 전달 TXT의 공개 서버·인증 설정 3개를 Git 제외 파일 `.env.trial.local`에 반영. 실제 값은 이 문서에 기록하지 않음.
- `npm run android:sync:trial` 및 Android `assembleDebug` 성공. 실행 중인 에뮬레이터에 `install -r`로 설치하고 앱 실행 확인(기존 앱 데이터 유지).
- 동기화된 앱 번들에 설정 3개와 시험 API 기본 모드 안내 포함 확인. trial 설정 검사 통과.
- 실행 로그에서 WebView `https://localhost` 확인. PC에서 해당 Origin으로 서버 `/health` 조회: HTTP 200, status ok 및 허용 Origin 일치 확인. 이 검사는 Android 내부 인증·분석 성공을 보장하지 않음.
- 기존 B 화면 수정 보존. 유료 분석 요청·push 수행하지 않음.
- 남은 검증: Android 실제 인증 및 글·사진 분석 → B02·B03, 실기기 오프라인/90초 제한 회귀. 실제 분석은 비용 발생 가능하므로 별도 요청 후 진행.
- 일반 웹 개발은 무료 샘플 기본이며, 이번 시험 APK는 실제 API 기본. 개발 도구에서 무료 샘플로 전환 가능.

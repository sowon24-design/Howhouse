# 캡스톤 전용 무료 서버와 폰 단독 시연

2026-11-17 사용자 선택: 기존 Render 계정에 **별도 무료 Web Service**를 준비한다. 기존 출시 서버·Supabase·main은 변경하지 않는다. 화면 디자인과 문구는 유지한다.

## 1. 배포할 소스

저장소 `sowon24-design/Howhouse`, 브랜치 `캡스톤-프로토타입`.

새 서버 코드가 GitHub에 올라간 뒤 생성한다. 이전 커밋 `ceebf55`에는 이번 Android/Render 코드가 없으므로 그 커밋으로 배포하지 않는다. `render.capstone.yaml`은 신규 서비스용 참고 설정이며 기존 서비스에 덮어쓰지 않는다.

## 2. 신규 Web Service 설정

| 항목 | 값 |
|---|---|
| Name | `howhouse-capstone-prototype` (중복이면 서비스 생성 화면의 실제 이름 사용) |
| Runtime | Node |
| Branch | `캡스톤-프로토타입` |
| Region | Singapore |
| Instance Type | **Free** |
| Build Command | `node --version` |
| Start Command | `node --experimental-strip-types server/analysis/capstone-render.mjs` |
| Health Check Path | `/health` |
| Auto-Deploy | Off |

기존 서버 코드는 Node 기본 기능과 저장소 내부 파일만 사용한다. 이 배포 경로에서 새 라이브러리를 설치하거나 기존 의존성 구성을 변경하지 않는다. Render의 현재 공개 리전 목록에는 한국이 없으므로 서울이라고 표시하지 않는다.

환경변수:

| 이름 | 값 / 처리 |
|---|---|
| `NODE_VERSION` | `24.15.0` |
| `OPENAI_MODEL` | `gpt-6.1-terra` |
| `OPENAI_PROCESSING_REGION` | `us` |
| `OPENAI_API_KEY` | 소원님이 현재 유효한 키를 서버 설정에 직접 입력. 채팅·Git·APK에 넣지 않음 |
| `HOWHOUSE_YOUTUBE_API_KEY` | 기존 제한된 YouTube 키를 서버 설정에 직접 입력. APK에 넣지 않음 |
| `CAPSTONE_DEMO_ENABLED` | 첫 배포 `0`. 유료 분석을 시작하지 않고 준비 상태부터 확인 |
| `CAPSTONE_DEMO_EXPIRES_AT` | 분석을 켤 때 합의한 종료 시각을 ISO 8601로 입력. 예시 값을 그대로 사용하지 않음 |

`RENDER_EXTERNAL_HOSTNAME`, `PORT`, `RENDER_GIT_COMMIT`은 Render가 제공한다. Supabase URL·키·계정·테이블을 사용하지 않는다.

## 3. 무료 서버에서 보장되는 것과 아닌 것

- HTTPS 서버가 준비되면 폰 APK가 인터넷으로 연결한다. PC·USB가 없어도 된다. API 키는 서버에서만 사용한다.
- 새 유료 분석은 **서버 프로세스 한 번 실행당 최대 5회**, 실패 시도도 포함한다. 동일 입력 캐시는 실행 중 재사용한다. 원본 글·사진은 앱 서버 파일에 저장하지 않는다.
- 무료 Render의 파일은 재시작·재배포·절전 시 사라진다. 따라서 답변 캐시와 5회 기록도 초기화된다. 이를 지속적인 월 예산·전체 누적 한도라고 설명하지 않는다. OpenAI 비용은 별도로 발생한다.
- 이를 고려해 분석 기본값을 꺼 둔다. 시연 일시와 이 제한의 범위를 확인한 뒤 `CAPSTONE_DEMO_ENABLED=1` 및 종료 시각을 지정한다. 종료 시각 이후 새 요청은 거절한다. 종료 시각은 서버 재시작 후에도 환경변수에 남는다. 공개·상시 운영으로 자동 확대하지 않는다.
- 설정 검사에서 종료 시각은 활성화 당시 미래 7일 이내여야 한다. 이것은 새로운 데이터 보관 정책이 아니라 시연 활성화 설정의 상한이다. 시연 종료 일정을 임의로 확정하지 않는다.
- 무료 서버는 15분 미사용 후 절전하며 첫 연결에 약 1분이 걸릴 수 있다. 시연 직전 `/health`를 먼저 열어 준비하고, 분석 실패 시 자동 유료 재시도는 하지 않는다.
- 무료 인스턴스라도 기존 계정의 사용량·결제 설정에 따라 전송량과 빌드 시간 초과 요금이 발생할 수 있다. 현재 계정의 잔여 무료 범위는 별도로 확인해야 하며 ‘모든 비용 0원’이라고 보장하지 않는다.
- 서버 주소를 비밀로 한다고 접근 통제가 되지는 않는다. 이 코드의 origin·세션·호스트 검사는 기기 소유자 인증을 대신하지 않는다. 비민감·소유/허락된 시연 자료만 사용하고 공개 이용자에게 배포하지 않는다.

## 4. 서버 → APK 연결

서버 `/health`에서 `variant: capstone`, 최신 `commit`, `database: false`를 확인한다. `demoEnabled: false` 상태로 준비 검사를 먼저 한다. 이 점검은 OpenAI 요청을 보내지 않는다.

실제 생성된 서버 URL을 확인한 뒤 빌드할 터미널에서 `VITE_CAPSTONE_API_BASE_URL`을 해당 HTTPS origin으로 설정하고 `node scripts/capstone-android-prepare.mjs`를 실행한다. 주소에는 비밀번호·키·경로·쿼리를 넣지 않는다. 이어서 JDK 21과 SDK 36으로 `assembleDebug`를 실행한다. 원격 서버 주소가 없는 현재 APK는 USB용이며 폰 단독 완성본이 아니다.

생성 파일: `capstone-android.local/android/app/build/outputs/apk/debug/app-debug.apk`.

앱 ID `com.howhouse.capstone`의 별도 앱이다. 기존 `com.howhouse.app`를 삭제하지 않는다. 설치 후 검색·사진 선택·분석 중단·입력 보존·실제 분석·썸네일·외부 영상·뒤로가기를 확인한다. 공개 출시·Play 업로드용 AAB는 만들지 않는다.

## 5. 아직 하지 않은 작업

GitHub 새 변경 게시, 실제 신규 서비스 생성/키 설정/Live 확인, 계정 무료 사용량 확인, 시연 활성화 일정 합의, 원격 URL로 APK 재빌드, 실제 폰의 인터넷 분석 검증. 기존 USB용 APK 빌드 성공을 이 항목의 완료로 간주하지 않는다.

참고: [Render 무료 제한](https://render.com/docs/free), [Web Service 배포](https://render.com/docs/web-services), [Blueprint 설정](https://render.com/docs/blueprint-spec).

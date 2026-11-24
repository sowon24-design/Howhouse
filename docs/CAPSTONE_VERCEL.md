# 캡스톤 Vercel 시연 배포

시연 시간은 한국 시간 기준 2026-11-25~26일, 12-08~14일이다. 웹은 두 기간 사이에도 접속할 수 있지만, 신규 AI 분석은 지정 기간에만 허용한다. 11월 최대 48회, 12월 최대 49회로 나눈다. 이는 2026-11-24 확인한 API 잔액 $4.38과 과거 요청당 약 $0.045를 바탕으로 한 **상한**이며 실제 잔액이 먼저 소진될 수 있다. 실패·취소된 예약도 상한에 포함한다. 충전은 자동으로 수행하지 않는다.

Vercel Hobby의 개인·비상업 시연과 Upstash Redis Free를 사용한다. Vercel에는 이 브랜치만 연결하고, 루트 디렉터리는 저장소 루트로 둔다. `vercel.json`이 빌드·정적 파일·API 경로를 지정한다. 프로젝트의 Node.js 버전은 24를 사용한다. 서버 비밀 값은 Vercel의 Secret 환경 변수로 설정하고 소스에 올리지 않는다:

- `OPENAI_API_KEY`: 기존 캡스톤 분석 전용 API 키
- `OPENAI_MODEL`: `gpt-6.1-terra`
- `CAPSTONE_SESSION_SECRET`: 무작위 32자 이상 문자열
- `HOWHOUSE_YOUTUBE_API_KEY`: 기존 제한된 Google API 키
- `KV_REST_API_URL`, `KV_REST_API_TOKEN`: Vercel의 Upstash 무료 Redis 연결에서 자동 생성됨

`/health`는 시연 활성 여부를, `/session`은 잔여 예약 횟수를 반환한다. 원본 글·사진·답변은 Redis에 넣지 않는다. Redis에는 기간별 사용 횟수와 무작위 요청 ID의 예약 여부만 저장한다. 데이터베이스 저장이 없으므로 같은 입력을 다시 분석하면 새 횟수를 쓴다. Vercel의 기본 요청 크기 제한 4.5 MB 때문에 사진을 여러 장 올린 큰 요청은 실패할 수 있다.

배포 후 두 기간의 시작·종료, `/health`, `/session`, 기존 사례 열람, 작은 비개인 시연 이미지 1건 분석, 썸네일을 확인한다. 실제 분석은 API 크레딧을 사용한다. Main·기존 Render 서비스·출시용 서버는 이 배포의 대상이 아니다.

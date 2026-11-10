# AI 없는 어쩌집 전환 계획

2026-11-10 사용자 결정. 브랜치 `codex/ai-without-supabase`, 기준 main `3a1ec48`.

## 제품과 단계

1. 앱 전환: 기존 사례 53개·카테고리·기기 내 단어 검색·준비물·해결 단계·문의 문장 편집/복사 유지. AI/사진 분석·계정·서버 평가/의견/신고·캐시 제거. **초기 구현 및 브라우저 확인 완료.**
2. 개인정보와 약관: `src/catalog/policy.ts`에 새 검토안 작성. 최종 시행일·공개 URL·외부 문서 동기화는 미완료. 기존 AI용 Notion 문서를 그대로 링크하지 않는다.
3. Android: 불필요 권한·네이티브 플러그인·병합 Manifest·외부 브라우저·복사·뒤로가기·앱 종료 및 초기화 검증. **새 버전 실기기 검증 미완료.**
4. 제출 준비: 콘텐츠 권리·안전 안내·스토어 설명/스크린샷·데이터 보안 답변·공개 개인정보 URL·비공개 테스트·프로덕션 액세스·최종 서명 확인. **제출 미완료.**

현재 앱 시작점은 `src/catalog/CatalogApp.tsx`다. 기존 AI 소스와 서버 SQL은 전환 근거로 남기지만 새 배포 번들에 연결하지 않는다. 기존 실서버·Supabase 데이터는 중단하거나 삭제하지 않았다.

## 반복 점검 기준

기능·외부 서비스·SDK·권한 추가 시, 정책 본문 변경 시, Android 빌드 시, PR 전, Play 제출 전에 아래를 반복 확인하고 새 이슈를 기록한다. 필요한 공식 정책은 당시 최신 자료로 확인한다. 이 검토가 법률 적합성 인증이나 심사 통과 보장은 아니다.

| 대상 | 적용한 방향 | 남은 확인 |
| --- | --- | --- |
| AI/DB 외부 처리 | OpenAI·Supabase·Render 및 Camera/Network 모듈을 새 번들에서 차단. 기존 서버 설정을 요구하지 않음 | Android 실제 네트워크·병합 권한·플러그인 확인 |
| 단말 저장 | catalog 전용 키에 닉네임·14세 이상 확인. 검색·메시지는 메모리. 초기화는 catalog 키만 삭제 | 저장 실패·앱 삭제·초기화 실기기 검증. 기존 버전 정보와 구분 |
| 외부 링크 | 앱 내부 원격 썸네일 없음. YouTube 영상·준비물 이름만 넣은 쿠팡 링크·사용자 직접 이메일 | 외부 앱 이동 및 실제 URL 검증. 이메일 처리와 콘텐츠 제공 업체 정책 별도 확인 |
| 공개 문서 | 새 AI 없는 버전 검토안. 국외 AI 처리 동의를 요구하지 않음 | 최종 문서·시행일·공개 URL 확정. 실제 처리 없는 항목만 제거 |
| 콘텐츠 권리 | 기존 사례·그림·영상 링크 재사용 | 원본·AI 제작 이미지 및 캐릭터의 사용권, 영상 연결과 사례 출처 검토. 임시 이미지 구분 |
| 안전·비용 부담 | 일반 안내 문구 유지, 위험 작업 중단 안내 | 모든 위험 사례의 단계·책임 단정 표현을 검토. 현장 진단·법률 판단으로 오인시키지 않음 |
| 앱 유용성 | 검색·단계별 확인·준비물 링크·문의 문장 선택/편집/복사 | 단순 문서 모음이 아닌 실제 유용성 및 오류 없는 동작 검증 |
| 기존 서버 데이터 | 새 앱에서는 접근하지 않음 | 기존 기록의 보관/삭제 및 권리 행사 경로 안내. 임의 폐기 금지 |

## 실행 및 검증

- 새 작업 폴더: `C:/Users/user/Documents/Codex/howhouse-ai-without-supabase`
- 개발 실행 `npm run dev -- --configLoader runner` → `http://127.0.0.1:5181/`, 종료 Ctrl+C.
- 검토용 빌드 `npm run build -- --mode catalog-preview --configLoader runner`.
- 검토용 배포 파일 실행 `npm run preview -- --port 5181 --strictPort --configLoader runner`.
- 타입 검사·검토용 빌드·공통 기반 검사 통과. 검색·기존 문의 문장·해결 상태 문장·쿠팡 링크 관련 검사 12개 통과.
- 브라우저에서 최초 시작, 53개 사례, 배수구 검색 5개, 결과 없음, 기존 해결 방법, 문의 문장 수정·복사·재진입 시 수정 보존 확인. 새로고침 후 검색어가 저장되지 않는 것도 확인.
- 빌드 모듈 검사로 `src/analysis/`, `server/`, 예전 App, Camera/Network 런타임을 차단. 빌드 HTML은 CSP `connect-src 'none'` 및 원격 이미지/임베드 차단.
- Android 기본 Manifest의 INTERNET 제거. `includePlugins`로 App만 선택 후 실제 동기화 성공. 등록 JSON에 App 하나만 존재. `processDebugMainManifest` 성공 및 병합된 Debug Manifest에서 INTERNET/카메라/사진 권한 없음 확인. 앱 자체 비공개 리시버 권한만 존재. 의존성 패키지는 재설치·교체하지 않음. 최종 Release Manifest와 실기기 동작은 추가 확인 대상.
- `src/catalog/release-approval.json`의 공개 정책·Android·콘텐츠 권리·기존 데이터 전환 확인은 모두 false. 일반 production 빌드는 차단. 검토용 빌드는 Play 제출 파일이 아니다.
- Android `preReleaseBuild`도 검토용 웹 파일을 예상한 사유로 차단하는 것까지 확인했다. 최종 서명 APK/AAB는 만들지 않았다.
- 기존 AI용 검사/문서는 과거 구현을 설명하며 새 앱의 출시 완료 근거가 아니다. 전체 과거 검사 재통과를 이번에 주장하지 않는다.

## 공식 근거

2026-11-10 공식 자료 확인. 일반 정책과 실제 검증 결과를 구분한다.

- 사용자 데이터: https://support.google.com/googleplay/android-developer/answer/10144311?hl=en
- 데이터 보안: https://support.google.com/googleplay/android-developer/answer/10787469?hl=en — 수집 없는 앱도 양식과 개인정보 처리방침 필요.
- 앱 유용성·기능: https://support.google.com/googleplay/android-developer/answer/9898783?hl=en-GB — 단순 정적 문서, 미작동 앱 제한.

Supabase를 제거했다고 개인정보 관련 법률 검토가 모두 끝나는 것은 아니다. 새 앱의 외부 링크·이메일·단말 저장과 이전 버전 데이터 처리를 계속 구분해 검토한다. main 병합·서버 배포·기존 DB 삭제·공개 문서 게시·Play 제출은 하지 않았다.

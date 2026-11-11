# Android 아이콘·캡처 설정

- 원본: Figma 6WGOaMy4R6jiO6Q7fQ09w8, 앱 아이콘 섹션 646:7003 / 512px 원본 651:7024.
- launcher-source.png 원본을 Android mipmap 각 밀도의 launcher/round/foreground에 비율 유지 축소 적용.
- Android가 원형·둥근 사각형 등 런처 마스크를 적용한다.
- 캡처용 빌드: PowerShell에서 $env:VITE_HIDE_DEVELOPER_TOOLS='1' 후 npm run build -- --mode catalog-preview, npx cap sync android, assembleDebug.
- 개발 도구 복원: 해당 환경변수를 제거하고 다시 빌드·동기화·설치. 웹 개발 서버는 기본적으로 도구 유지.
- 2026-11-11 Pixel_10 재설치 성공. 아이콘 표시와 실행 화면 확인. 해상도/밀도 override를 reset하여 원래 1080×2424/420dpi 복원. 배터리100% 유지.
- 현재 catalog Android는 내장 사례와 로컬 검색을 사용한다. AI/DB/네트워크 플러그인 미포함, 앱 번들 CSP connect-src none. 오프라인에서 F02로 전체 화면을 차단하지 않는다. 외부 Notion/YouTube/쿠팡/이메일은 외부 앱과 인터넷 환경에 따라 동작한다. 이번에는 실제 네트워크 차단 재시험은 하지 않았다.
- 권한·외부 수집·정책 본문·출시 승인값 변경 없음. 캡처용 개발 APK이며 출시 서명 AAB 아님.

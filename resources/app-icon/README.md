# 어쩌집 출시 아이콘

- 사용자 지정 원본: https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=646-7003
- `651:7024`: 512×512 Google Play Store 슬롯. 연결된 원본 PNG는 1024×1024이며 `howhouse-master-1024.png`로 보존했다.
- `648:7014`: 108×108 아이콘 구성. 원본과 같은 집 심볼·파란 그라데이션을 확인했다. Figma 파일은 수정하지 않았다.
- `howhouse-play-512.png`: 원본을 정사각형 비율 그대로 512×512로 축소한 RGBA PNG. Play Console에 올릴 스토어 아이콘 후보이며 아직 업로드하지 않았다.

## Android 적용

기존 mipmap의 `ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png`를 같은 원본으로 교체했다. mdpi/hdpi/xhdpi/xxhdpi/xxxhdpi의 일반 아이콘은 48/72/96/144/192px, adaptive 전경은 108/162/216/324/432px다. 원형 전용 리소스에만 표준 원형 마스크를 적용했다. Play용 PNG에는 미리 원형·둥근 모서리 마스크를 넣지 않았다.

Android 26 이상은 기존 adaptive-icon XML의 mipmap 전경을 사용한다. Android가 108dp 전경의 중앙 72dp를 마스킹하므로, 그 영역 안에 원본 전체를 중앙 배치해 집 심볼이 잘리지 않게 했다. 바깥 여백은 투명하고 adaptive 배경색은 원본 좌상단 색이다. 앱 식별자·버전·서명·권한은 아이콘 교체로 변경하지 않았다. 작은 아이콘에서도 집 모양이 잘리지 않는지는 실기기에서 확인한다.

새 라이브러리를 프로젝트에 추가하지 않았다. 임시 Figma 자산 URL은 런타임에서 사용하지 않는다.

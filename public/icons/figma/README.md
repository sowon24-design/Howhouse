# 어쩌집 Figma 아이콘 원본

출처: https://www.figma.com/design/6WGOaMy4R6jiO6Q7fQ09w8/figma-design?node-id=355-6642

2026-10-30 Figma get_design_context로 각 컴포넌트 세트의 변형과 에셋을 조회하고 원본 SVG를 다운로드했습니다. 벡터 경로·색상·루트 크기를 변경하지 않았습니다. 파일 이름은 해당 변형의 노드 ID입니다.

29개 세트, 180개 변형 중 Blank 4개는 빈 프레임이므로 SVG가 없습니다. SVG는 총 176개입니다. 원본 이름·크기·변형·파일의 대응은 `src/components/Icon/catalog.json`에 기록합니다. 임시 다운로드 URL은 실행 코드에 사용하지 않습니다.

Warning·Info·Setting·Kebab은 전체 프레임보다 작은 내부 그룹 SVG입니다. `icon.css`에서 원본 여백을 적용하며 SVG를 프레임 전체 크기로 늘리지 않습니다. Info는 원본의 뒤집기 변환도 적용합니다.

사용자 정정에 따라 이름을 실제 방향으로 맞췄습니다: Arrow_Left(408:3504), Arrow_Right(408:3506), Arrow_Bottom(408:3518), Arrow_Top(408:3530). SVG 자체는 그대로입니다. Home Stroke의 Size=16, Community Fill의 Size=28은 최신 Figma 수정값을 반영했습니다. Blank는 원본부터 16×16·20×20·24×24·28×28이며, 미리보기에서만 실제 공간에 점선 테두리를 표시합니다.

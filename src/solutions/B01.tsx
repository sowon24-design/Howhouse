import { GNB, ListRow } from '../components/ui'
import './b01.css'
import questionUrl from './assets/question.svg'
import toilet from './assets/categories/toilet.png'
import boiler from './assets/categories/boiler.png'
import water from './assets/categories/water.png'
import washer from './assets/categories/washer.png'
import light from './assets/categories/light.png'
import fridge from './assets/categories/fridge.png'
import pest from './assets/categories/pest.png'
import mold from './assets/categories/mold.png'

// Preserve the source image and the crop authored in each launch Figma frame.
const artwork: Record<string, {src:string; width:number; height:number; scale:number; left:number; top:number}> = {
  '화장실': {src:toilet,width:157,height:200,scale:212.9,left:-107.81,top:-41.14},
  '보일러': {src:boiler,width:139,height:200,scale:209.88,left:-10.07,top:-27.24},
  '수도·수질': {src:water,width:137,height:180,scale:252.49,left:-22.86,top:-51.12},
  '세탁기': {src:washer,width:137,height:200,scale:216.11,left:-103.33,top:-28.63},
  '전기·조명': {src:light,width:121,height:200,scale:226.82,left:-13.3,top:-18.74},
  '냉장고': {src:fridge,width:134,height:192,scale:210.86,left:-104.57,top:-26.4},
  '해충': {src:pest,width:138,height:200,scale:231.22,left:-114.29,top:-33.33},
  '곰팡이': {src:mold,width:150,height:184,scale:241.07,left:-125.6,top:-54.85},
}

/** UI-only input; not a shared API or sheet schema. The caller adapts its data. */
export type B01Item = { key: string; label: string }
export type B01Props = {
  categoryLabel: string
  items: readonly B01Item[]
  onSelect: (key: string) => void
  onWriteProblem: () => void
  onBack: () => void
}

export function B01({ categoryLabel, items, onSelect, onWriteProblem, onBack }: B01Props) {
  const art = artwork[categoryLabel]
  return <section className="solutions-b01" aria-label={`${categoryLabel} 카테고리`}>
    <GNB title={`${categoryLabel} 카테고리`} onBack={onBack} />
    {art && <div className="solutions-b01__art" aria-hidden="true">
      <div style={{width:art.width,aspectRatio:`${art.width} / ${art.height}`}}>
        <img src={art.src} alt="" style={{width:`${art.scale}%`,left:`${art.left}%`,top:`${art.top}%`}} />
      </div>
    </div>}
    <main className="solutions-b01__content">
      <h1 className="text-heading">나의 상황과<br />가장 비슷한 문제를 골라주세요.</h1>
      <ul className="solutions-b01__list" aria-label="사례 목록">
        {items.map(item => <li key={item.key}>
          <ListRow onClick={() => onSelect(item.key)}>{item.label}</ListRow>
        </li>)}
      </ul>
      <ListRow variant="pale" onClick={onWriteProblem}
        icon={<img src={questionUrl} alt="" width="24" height="24" />}>
        다른 사례 찾아보기
      </ListRow>
    </main>
  </section>
}


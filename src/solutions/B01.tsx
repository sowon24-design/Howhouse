import { GNB, ListRow } from '../components/ui'
import './b01.css'
import questionUrl from './assets/question.svg'

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
  return <section className="solutions-b01" aria-label={`${categoryLabel} 카테고리`}>
    <GNB title={`${categoryLabel} 카테고리`} onBack={onBack} />
    <main className="solutions-b01__content">
      <h1 className="text-heading">나의 상황과<br />가장 비슷한 문제를 골라주세요.</h1>
      <ul className="solutions-b01__list" aria-label="사례 목록">
        {items.map(item => <li key={item.key}>
          <ListRow onClick={() => onSelect(item.key)}>{item.label}</ListRow>
        </li>)}
      </ul>
      <ListRow variant="pale" onClick={onWriteProblem}
        icon={<img src={questionUrl} alt="" width="24" height="24" />}>
        내 문제를 찾을 수 없어요
      </ListRow>
    </main>
  </section>
}


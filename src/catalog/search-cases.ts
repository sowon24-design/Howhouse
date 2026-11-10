import dictionary from './search-dictionary.json' with {type:'json'}
type SearchableCase = { id?: string; title: string; symptom: string; category: string; description: string }
type Keywords = {targets: string[]; symptoms: string[]}
const words: Record<string, Keywords> = dictionary
const normalize = (text: string) => text.normalize('NFC').toLocaleLowerCase('ko').trim()
function phrases(text: string) {
  return normalize(text)
    .replace(/안\s*빠져요|안\s*빠짐|빠지지\s*않아요|안\s*내려가요|안내려가고/g,'배수 안됨')
    .replace(/안\s*들어와요|채워지지\s*않아요/g,'급수 안됨')
    .replace(/새요|샙니다|새는/g,'누수')
    .replace(/깜빡여요|깜박거려요/g,'깜박임')
    .replace(/깨졌어요|금이\s*갔어요/g,'파손')
    .replace(/얼어요|얼었어요/g,'결빙')
    .replace(/시끄러워요/g,'소음')
    .replace(/냄새\s*나요/g,'냄새')
    .replace(/냄새(?:는|가)?\s*안\s*나(?:고|요)|냄새(?:는|가)?\s*없어요/g,' ')
    .replace(/물(?:은|이)?\s*잘\s*빠지(?:는데|고|요)/g,' ')
}
const subjects = [ ['세탁기','드럼세탁기','통돌이','세탁통','탈수','빨래'], ['냉장고','냉장실','냉동실','냉동고','채소칸','야채칸'], ['변기','양변기'], ['보일러','난방'], ['환풍기','환기팬'], ['콘센트','플러그','멀티탭'], ['실리콘'], ['줄눈','타일 사이','타일 틈'] ]
function contains(text: string, phrase: string) {
  // Avoid matching 수도 inside 하수도. Other known phrases permit Korean particles.
  if (phrase === '수도') return /(^|[^가-힣])수도/.test(text)
  return text.includes(phrase) || (phrase.length >= 3 && text.replace(/\s/g,'').includes(phrase.replace(/\s/g,'')))
}

/** Literal local search only. Query text is neither saved nor transmitted. */
export function searchCases<T extends SearchableCase>(cases: readonly T[], query: string): T[] {
  const text = phrases(query)
  if (!text.trim()) return [...cases]
  const explicit = subjects.filter(group => group.some(word => contains(text,word)))
  return cases.map((item,index) => {
    const entry = item.id ? words[item.id] : undefined
    if (!entry) {
      const source=normalize([item.title,item.symptom,item.category,item.description].join(' '))
      const tokens=normalize(query).split(/\s+/).filter(Boolean)
      return {item,index,score:tokens.every(token=>source.includes(token))?1:0,condition:0}
    }
    const targets=entry.targets.map(normalize)
    if (explicit.length && !explicit.some(group=>group.some(word=>targets.some(target=>contains(target,word))))) return {item,index,score:0,condition:0}
    const target = targets.some(word=>!['집','방','물','바닥','수도'].includes(word)&&contains(text,word))
    const symptom = entry.symptoms.some(word=>contains(text,phrases(word)))
    const condition = [...targets,...entry.symptoms.map(phrases)].some(word=>word.length>=5&&contains(text,word)) ? 2 : 0
    const exact=normalize(query)===normalize(item.symptom)||normalize(query)===normalize(item.title)
    const score=exact?16:(target?3:0)+(symptom?5:0)+(target&&symptom?4:0)+(target||symptom?condition:0)
    return {item,index,score,condition}
  }).filter(row=>row.score>0).sort((a,b)=>b.score-a.score||b.condition-a.condition||String(a.item.id??a.index).localeCompare(String(b.item.id??b.index),'ko',{numeric:true})).map(row=>row.item)
}

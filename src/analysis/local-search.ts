/** Deterministic on-device search. No network, user storage, embeddings or generated answers. */
export type SearchCase = {id:string;title:string;symptom:string;category:string}
const objects = [
 ['싱크대','개수대'],['변기'],['배수구','하수구','배수관'],['세탁기','빨래','세탁','탈수'],
 ['냉장고','냉장실','냉동고','냉동실'],['보일러','난방','온수','방바닥'],
 ['전등','조명','형광등','불빛','스위치'],['콘센트','플러그'],['차단기','두꺼비집','정전'],
 ['바퀴벌레','바퀴'],['초파리','날파리','날벌레'],['개미'],['쌀벌레','곡물'],
 ['타일','줄눈'],['벽지','벽','천장'],['수도','수돗물','수압','샤워'],['환기팬','환풍기'],
 ['쓰레기통'],['실리콘'],['스마트폰','휴대폰','노트북'],
]
const symptoms=[
 ['누수','물이새','물새','물샘','새요','새고','샙','젖어','젖었','흘러'],
 ['막힘','막혔','막혀','안내려','내려가지않','안빠','빠지지않','배수불량','배수가안','배수가되지않'],
 ['악취','냄새','냄세'],['곰팡이','곰팡'],['소음','시끄','소리','기계음'],
 ['결로','물방울'],['안켜','켜지지않','들어오지않','작동안','작동하지않','점등불량'],
 ['수압','물살','약해','약하'],['파손','깨졌','깨져','금이'],['성에','서리'],
 ['차갑','차가워지지','냉각','시원하지'],['물고임','물이고','고여'],['습기','눅눅','습해'],
 ['얼룩','변색','누렇','갈색'],['금속음','긁는','쇠'],['벌레'],['깜박','흔들'],
]
const compact=(text:string)=>text.normalize('NFKC').toLowerCase().replace(/[^가-힣a-z0-9]/g,'')
const features=(text:string,groups:string[][])=>new Set(groups.flatMap((terms,i)=>terms.some(term=>compact(text).includes(term))?[i]:[]))
const common=(a:Set<number>,b:Set<number>)=>[...a].filter(value=>b.has(value)).length
export function findLocalCases(text:string,cases:readonly SearchCase[],limit=5) {
 const query=compact(text)
 if(query.length<2)return []
 const queryObjects=features(text,objects),querySymptoms=features(text,symptoms)
 const ranked=cases.map(item=>{
  const content=item.title+' '+item.symptom
  const objectMatches=common(queryObjects,features(content,objects))
  const symptomMatches=common(querySymptoms,features(content,symptoms))
  // Never replace an unavailable sink/phone/cockroach case with an unrelated object.
  if(queryObjects.size&&!objectMatches)return {item,score:0}
  const exact=compact(content).includes(query)||query.includes(compact(item.title))
  if(querySymptoms.size&&!symptomMatches&&!exact)return {item,score:0}
  const score=exact?100:(queryObjects.size?objectMatches*10+symptomMatches*20:symptomMatches*20)
  return {item,score}
 })
 return ranked.filter(r=>r.score>0).sort((a,b)=>b.score-a.score||a.item.id.localeCompare(b.item.id)).slice(0,limit).map(r=>r.item)
}

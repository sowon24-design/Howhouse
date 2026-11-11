import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { convertCsv } from '../../src/solutions/data/convert.ts'
import { isActiveCase } from '../../src/solutions/data/deleted-cases.ts'
import { videoSupplements } from '../../src/solutions/data/video-supplements.ts'
import { serializeCatalog } from '../../src/analysis/catalog.ts'
import { applyAdditionalGuides } from '../../src/solutions/data/additional-guides.ts'
import guides from '../../src/solutions/data/additional62/refined-guides.json' with {type:'json'}
import videos from '../../src/solutions/data/additional62/videos.json' with {type:'json'}

export function loadCatalog() {
  const files = [['욕실·수도', '욕실·수도 (1).csv'], ['난방·전기', '난방·전기.csv'],
    ['가전', '가전.csv'], ['해충·곰팡이', '해충·곰팡이 (1).csv']]
  const additions = applyAdditionalGuides(['난방·전기','해충·곰팡이','욕실·수도','가전'].flatMap((field,index) =>
    convertCsv(field,readFileSync(new URL(`../../src/solutions/data/additional62/cases${index}.csv`,import.meta.url),'utf8'),{})),guides,videos)
  const cases = [...files.flatMap(([field, name]) => convertCsv(field,
    readFileSync(new URL(`../../src/solutions/data/raw/${name}`, import.meta.url), 'utf8'), videoSupplements)),...additions].filter(isActiveCase)
  if (!cases.length || new Set(cases.map(c => c.id)).size !== cases.length) throw new Error('Invalid case catalog')
  const serialized = serializeCatalog(cases)
  return { cases, serialized, version: createHash('sha256').update(serialized).digest('hex') }
}

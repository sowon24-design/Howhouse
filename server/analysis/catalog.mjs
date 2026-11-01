import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { convertCsv } from '../../src/solutions/data/convert.ts'
import { isActiveCase } from '../../src/solutions/data/deleted-cases.ts'
import { videoSupplements } from '../../src/solutions/data/video-supplements.ts'
import { serializeCatalog } from '../../src/analysis/catalog.ts'

export function loadCatalog() {
  const files = [['욕실·수도', '욕실·수도 (1).csv'], ['난방·전기', '난방·전기.csv'],
    ['가전', '가전.csv'], ['해충·곰팡이', '해충·곰팡이 (1).csv']]
  const cases = files.flatMap(([field, name]) => convertCsv(field,
    readFileSync(new URL(`../../src/solutions/data/raw/${name}`, import.meta.url), 'utf8'), videoSupplements)).filter(isActiveCase)
  if (!cases.length || new Set(cases.map(c => c.id)).size !== cases.length) throw new Error('Invalid case catalog')
  const serialized = serializeCatalog(cases)
  return { cases, serialized, version: createHash('sha256').update(serialized).digest('hex') }
}

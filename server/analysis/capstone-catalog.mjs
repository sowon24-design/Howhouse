import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { loadCatalog } from './catalog.mjs'
import { convertCsv } from '../../src/solutions/data/convert.ts'
import { applyAdditionalGuides } from '../../src/solutions/data/additional-guides.ts'
import { isActiveCase } from '../../src/solutions/data/deleted-cases.ts'
import { serializeCatalog } from '../../src/analysis/catalog.ts'
import guides from '../../src/solutions/data/additional62/refined-guides.json' with { type: 'json' }
import videos from '../../src/solutions/data/additional62/videos.json' with { type: 'json' }

/** Match the CURRENT browser catalog, including the 62 additions after the old AI server. */
export function loadCapstoneCatalog() {
  const fields = ['난방·전기', '해충·곰팡이', '욕실·수도', '가전']
  const additions = applyAdditionalGuides(fields.flatMap((field, index) => convertCsv(field,
    readFileSync(new URL(`../../src/solutions/data/additional62/cases${index}.csv`, import.meta.url), 'utf8'), {})), guides, videos)
  const cases = [...loadCatalog().cases, ...additions].filter(isActiveCase)
  if (!cases.length || new Set(cases.map(item => item.id)).size !== cases.length) throw Error('Invalid capstone catalog')
  const serialized = serializeCatalog(cases)
  return { cases, serialized, version: createHash('sha256').update(serialized).digest('hex') }
}

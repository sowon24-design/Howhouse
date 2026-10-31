import type { Field, SolutionCase } from './types'

/** CSV quoting, escaped quotes, CRLF and multiline cells. Cells remain unchanged. */
export function parseCsv(input: string): string[][] {
  const rows: string[][] = []
  let row: string[] = [], cell = '', quoted = false
  const text = input.replace(/^\uFEFF/, '')
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++ }
      else quoted = !quoted
    } else if (ch === ',' && !quoted) { row.push(cell); cell = '' }
    else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cell); rows.push(row); row = []; cell = ''
    } else cell += ch
  }
  if (quoted) throw new Error('닫히지 않은 CSV 따옴표')
  if (cell || row.length) { row.push(cell); rows.push(row) }
  return rows
}

export function splitSupplies(text: string): string[] {
  let depth = 0, item = ''
  const result: string[] = []
  for (const ch of text) {
    if (ch === '(' || ch === '（') depth++
    if (ch === ')' || ch === '）') depth = Math.max(0, depth - 1)
    if (ch === ',' && depth === 0) { if (item.trim()) result.push(item.trim()); item = '' }
    else item += ch
  }
  if (item.trim()) result.push(item.trim())
  return result
}

export function youtubeVideo(raw: string): {url: string; thumbnail: string} | null {
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    const host = url.hostname.toLowerCase()
    let id: string | null = null
    if (host === 'youtu.be') id = url.pathname.split('/')[1]
    else if (host === 'youtube.com' || host === 'www.youtube.com' || host === 'm.youtube.com') {
      id = url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(shorts|embed)\//.test(url.pathname) ? url.pathname.split('/')[2] : null
    }
    if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return null
    return { url: raw, thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` }
  } catch { return null }
}

export function convertCsv(field: Field, csv: string, supplements: Readonly<Record<string, readonly string[]>>): SolutionCase[] {
  const [header, ...rows] = parseCsv(csv)
  const expected = ['번호','분류','사례(증상)','예상 원인(AI 추측)','해결 제목','준비물','총 예상 소요 시간','배상책임 주체','판단 참고','1단계 제목','1단계 설명','2단계 제목','2단계 설명','3단계 제목','3단계 설명','4단계 제목','4단계 설명','유튜브 링크 첨부']
  if (!header || expected.some((name, i) => header[i] !== name)) throw new Error(`${field}: CSV 열이 기준과 다릅니다.`)
  return rows.filter(row => row.some(cell => cell.trim())).map(row => {
    const value = (i: number) => row[i] ?? ''
    const id = `${field}:${value(0)}` as const
    if (!value(0).trim()) throw new Error(`${field}: 사례 번호 누락`)
    const links = value(17).match(/https?:\/\/[^\s<>"）)]+/g) ?? []
    const videos = [...links, ...(supplements[id] ?? [])].map(youtubeVideo).filter((v): v is NonNullable<typeof v> => v !== null)
    const steps = Array.from({length: 4}, (_, i) => ({ number: i + 1, title: value(9 + i * 2), description: value(10 + i * 2) })).filter(s => s.title.trim() || s.description.trim())
    return {
      id, field, number: value(0), category: value(1), symptom: value(2), source: 'existing',
      title: value(4), description: value(3), supplies: splitSupplies(value(5)), duration: value(6), responsibility: value(7), reference: value(8), steps, videos,
      contacts: { landlord: {label:value(18),sentences:row.slice(20,24)}, company:{label:value(19),sentences:row.slice(24,28)} },
      canContact: !!(value(18).trim() || value(19).trim()),
    }
  })
}

export function createCaseLookup(cases: readonly SolutionCase[]) {
  const index = new Map(cases.map(c => [c.id as string, c]))
  if (index.size !== cases.length) throw new Error('중복 사례 ID')
  return (id: string) => index.get(id)
}

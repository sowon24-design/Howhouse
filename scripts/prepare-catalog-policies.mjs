import { mkdir, writeFile } from 'node:fs/promises'
import { catalogPolicy as p } from '../src/catalog/policy.ts'
const root = new URL('../docs/catalog-policies/web/', import.meta.url)
await mkdir(root, { recursive: true })
const escape = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
for (const [key, fileTitle, title = fileTitle] of [
  ['privacy', '개인정보 처리방침'], ['terms', '이용약관'], ['data', '개인정보 및 데이터 관리'],
  ['consent', 'AI 분석 동의 미사용 안내', '개인정보 수집·이용 동의 — 미사용 안내'],
  ['transfer', '분석 국외 이전 동의 미사용 안내', '개인정보 국외 이전 동의 — 미사용 안내'],
  ['ai', '서비스 제공 방식 및 이미지 안내', '서비스 제공 방식'],
]) {
  const body = p[key].map(section => section.split('\n').map(line => line.startsWith('## ')
    ? `<h2>${escape(line.slice(3))}</h2>` : `<p>${escape(line)}</p>`).join('')).join('')
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>어쩌집 ${title}</title><style>body{font-family:system-ui,sans-serif;max-width:48rem;margin:auto;padding:24px;line-height:1.8;color:#19212e}p{overflow-wrap:anywhere}</style></head><body><h1>${title}</h1>${body}</body></html>`
  await writeFile(new URL(`${key}.html`, root), html, 'utf8')
  await writeFile(new URL(`../${fileTitle}.md`, root), `# ${title}\n\n${p[key].join('\n\n')}\n`, 'utf8')
}
console.log('Exported catalog policy copies. External publication and release approvals are separate.')

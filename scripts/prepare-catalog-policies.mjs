import { mkdir, writeFile } from 'node:fs/promises'
import { catalogPolicy as p } from '../src/catalog/policy.ts'
const root = new URL('../docs/catalog-policies/web/', import.meta.url)
await mkdir(root,{recursive:true})
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')
const effective=p.effectiveDate ?? '공개 전 확정'
for(const [key,title] of [['privacy','개인정보 처리방침'],['terms','이용약관'],['data','개인정보 및 데이터 관리'],['consent','AI 분석 동의 미사용 안내'],['transfer','분석 국외 이전 동의 미사용 안내'],['ai','서비스 제공 방식 및 이미지 안내']]) {
  const html=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>어쩌집 ${title}</title><style>body{font-family:system-ui,sans-serif;max-width:48rem;margin:auto;padding:24px;line-height:1.8;color:#19212e}p{overflow-wrap:anywhere}</style></head><body><h1>어쩌집 ${title}</h1><p>AI 없는 버전 / ${escape(p.version)} / 시행일: ${escape(effective)}</p>${p[key].map(t=>`<p>${escape(t)}</p>`).join('')}<p>문의: ${escape(p.email)}</p></body></html>`
  await writeFile(new URL(`${key}.html`,root),html,'utf8')
  await writeFile(new URL(`../${title}.md`,root),`# 어쩌집 ${title} — AI 없는 버전\n\n버전: ${p.version} / 시행일: ${effective}\n\n${p[key].join('\n\n')}\n`,'utf8')
}
console.log('Prepared review HTML only. Not published; release approvals unchanged.')

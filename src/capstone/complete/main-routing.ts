/** Legacy Figma review links must not replace overlapping main screens. */
export function mainRoute(hash: string): string | null {
  if (hash.startsWith('#frame/')) return null
  if (['', '#', '#home', '#search', '#onboarding'].includes(hash)
    || hash.startsWith('#solutions/') || hash.startsWith('#case/')) {
    return hash === '#onboarding' ? '#home' : hash || '#home'
  }
  const id = hash.replace(/^#screen\//, '')
  if (id === '336:27446') return '#home'
  const categories: Record<string, string> = {
    '1042:12024': '화장실', '1042:12068': '보일러', '1042:12112': '수도·수질',
    '1042:12155': '세탁기', '1042:12200': '전기·조명', '1042:12244': '냉장고',
    '1042:12286': '해충', '1042:12328': '곰팡이',
  }
  if (categories[id]) return '#solutions/' + encodeURIComponent(categories[id])
  // Result/message links without a selected result return to main's case finder.
  if (['336:28787','336:29106','336:29193','336:28859','336:28971',
    '1042:11167','1042:13133','1042:13183','1042:13231','1042:13276',
    '1042:13324','1042:13371','1042:13715','1042:13830','1042:13929',
    '1042:14028','1042:14147','1042:14266'].includes(id)) return '#search'
  return null
}

/** Legacy Figma review links must not replace overlapping main screens. */
export function mainRoute(hash: string): string | null {
  if (hash.startsWith('#frame/')) return null
  if (['', '#', '#home', '#onboarding'].includes(hash)
    || hash.startsWith('#case/')) {
    return hash === '#onboarding' ? '#home' : hash || '#home'
  }
  const id = hash.replace(/^#screen\//, '')
  if (id === '336:27446') return '#home'
  // Result/message links without a selected result return to main's case finder.
  if ([
    '1042:11167','1042:13133','1042:13183','1042:13231','1042:13276',
    '1042:13324','1042:13371','1042:13715','1042:13830','1042:13929',
    '1042:14028','1042:14147','1042:14266'].includes(id)) return '#search'
  return null
}

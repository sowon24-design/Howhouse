export const catalogIntroductionKey = 'howhouse.catalog.introduction.v1'
type Store = Pick<Storage, 'getItem' | 'setItem'>
export function readIntroduction(store: Store): number {
  try {
    const value = store.getItem(catalogIntroductionKey)
    return value !== null && /^[0-3]$/.test(value) ? Number(value) : 0
  } catch { return 0 }
}
export function saveIntroduction(store: Store, step: number) {
  try { store.setItem(catalogIntroductionKey, String(step)) } catch { /* Continue in memory when storage is unavailable. */ }
}

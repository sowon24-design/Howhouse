export const profileKey = 'howhouse.profile.v1'
export const introductionKey = 'howhouse.introduction.step.v1'
export type LocalProfile = { nickname: string; setupComplete: boolean }
type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export function readProfile(store: Store): LocalProfile | undefined {
  try {
    const value = JSON.parse(store.getItem(profileKey) ?? 'null')
    if (!value || typeof value.nickname !== 'string' || typeof value.setupComplete !== 'boolean') return
    const nickname = value.nickname.trim()
    if (!nickname || Array.from(nickname).length > 10 || !/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9 ]+$/.test(nickname)) return
    return { nickname, setupComplete: value.setupComplete }
  } catch { return undefined }
}

export function writeProfile(store: Store, profile: LocalProfile) {
  try { store.setItem(profileKey, JSON.stringify(profile)); return true } catch { return false }
}

export function resetProfile(store: Store) {
  try {
    store.removeItem(profileKey)
    store.removeItem(introductionKey)
    return true
  } catch { return false }
}

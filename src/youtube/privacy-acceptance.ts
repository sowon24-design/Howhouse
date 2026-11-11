import { catalogPolicy } from '../catalog/policy.ts'

export function readYoutubePrivacyAcceptance(storage: Pick<Storage, 'getItem'>): boolean {
  try {
    const value = JSON.parse(storage.getItem('howhouse.catalog.profile.v1') ?? 'null')
    return value?.ageConfirmed === true && value?.policyVersion === catalogPolicy.version
  } catch { return false }
}

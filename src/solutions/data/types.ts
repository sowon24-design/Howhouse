export const fields = ['욕실·수도', '난방·전기', '가전', '해충·곰팡이'] as const
export type Field = typeof fields[number]
export type CaseId = `${Field}:${string}`
export type CasePhoto = { src: string; alt: string }
export type SolutionCase = {
  id: CaseId; field: Field; number: string; category: string; symptom: string
  source: 'existing' | 'generated'; title: string; description: string; duration: string
  responsibility: string; reference: string; supplies: string[]
  steps: { number: number; title: string; description: string }[]
  videos: { url: string; thumbnail: string }[]
  contacts: { landlord: { label: string; sentences: string[] }; company: { label: string; sentences: string[] } }
  canContact: boolean
}
export type SolutionView = SolutionCase & { photos: readonly CasePhoto[] }

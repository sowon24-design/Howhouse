import { youtubeVideo } from './convert.ts'
import type { SolutionCase } from './types'

type Guide = Pick<SolutionCase, 'duration' | 'steps'>

/** Reviewed 4–8 steps and explicit video decisions override the four-pair CSV archive. */
export function applyAdditionalGuides(
  cases: readonly SolutionCase[],
  guides: Readonly<Record<string, Guide>>,
  videos: Readonly<Record<string, string | null>>,
): SolutionCase[] {
  return cases.map(item => {
    const guide = guides[item.number]
    if (!guide || guide.steps.length < 4 || guide.steps.length > 8) throw Error(`추가 사례 단계 누락: ${item.id}`)
    if (!Object.hasOwn(videos, item.number)) throw Error(`추가 사례 영상 결정 누락: ${item.id}`)
    const url = videos[item.number]
    const video = url ? youtubeVideo(url) : null
    if (url && !video) throw Error(`추가 사례 영상 주소 오류: ${item.id}`)
    return { ...item, ...guide, videos: video ? [video] : [] }
  })
}

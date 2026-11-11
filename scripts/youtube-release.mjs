export const youtubeApprovalKeys = ['privacyNoticePublished', 'providerPolicyReviewed', 'androidPreviewVerified', 'playSigningRestrictionVerified']
export function validateYoutubeRelease(env, approval) {
  if (!/^AIza[A-Za-z0-9_-]{35}$/.test(String(env.VITE_YOUTUBE_API_KEY ?? '').trim())) throw Error('출시용 YouTube API 설정이 없습니다. 키 값은 로그나 Git에 기록하지 마세요.')
  if (!/^[a-fA-F0-9]{40}$/.test(String(env.VITE_YOUTUBE_ANDROID_SHA1 ?? '').trim())) throw Error('출시 앱의 YouTube 서명 제한 설정이 없습니다.')
  if (String(env.VITE_YOUTUBE_ANDROID_SHA1).trim().toUpperCase() !== signers.playSha1) throw Error('Play 제출용 YouTube 요청에는 Play 앱 서명 지문이 필요합니다. USB 직접 설치 지문을 재사용하지 마세요.')
  if (youtubeApprovalKeys.some(key => approval[key] !== true)) throw Error('YouTube 미리보기의 공개 개인정보 안내·정책·Android·Play 서명 검증이 남았습니다.')
}
export const catalogContentSecurityPolicy = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src https://www.googleapis.com https://i.ytimg.com; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'"
import signers from '../src/youtube/android-signers.json' with { type: 'json' }

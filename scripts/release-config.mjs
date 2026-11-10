export function validateReleaseConfig(mode, env, policy) {
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith('VITE_') && (/OPENAI|SECRET|SERVICE_ROLE|ENCRYPTION|PASSWORD|PRIVATE_KEY/i.test(key) || /^(sk-|sb_secret_)/.test(String(value)))) throw Error('VITE_ 설정에 서버 비밀 값을 넣을 수 없습니다. 앱 인증에는 publishable 키만 사용하세요.')
  }
  if (['development','test'].includes(mode)) return
  const required = ['VITE_ANALYSIS_API_BASE_URL', 'VITE_ANALYSIS_AUTH_URL', 'VITE_ANALYSIS_AUTH_PUBLISHABLE_KEY']
  for (const name of required) if (!env[name]?.trim()) throw Error(`공개 서버 설정이 필요합니다: ${name}`)
  for (const name of required.slice(0, 2)) {
    let url
    try { url = new URL(env[name]) } catch { throw Error(`URL 형식 오류: ${name}`) }
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) throw Error(`공용 HTTPS 주소만 사용할 수 있습니다: ${name}`)
    if (name.endsWith('AUTH_URL') && url.pathname !== '/') throw Error('인증 주소는 프로젝트 루트여야 합니다.')
  }
  if (!env.VITE_ANALYSIS_AUTH_PUBLISHABLE_KEY.startsWith('sb_publishable_')) throw Error('Supabase 공개 publishable 키만 앱에 사용할 수 있습니다.')
  if (mode === 'trial' || mode === 'release-preview') return
  if (env.VITE_CAPTURE_MODE === 'true') throw Error('출시 빌드에 촬영용 우회 설정을 사용할 수 없습니다.')
  if (env.VITE_RELEASE_PRIVACY_READY !== '1') throw Error('개인정보·국외 처리 고지와 서버 기능 검증 후 출시 승인이 필요합니다.')
  const strings=value=>typeof value==='string'?[value]:value&&typeof value==='object'?Object.values(value).flatMap(strings):[]
  if (strings(policy).some(text=>/검토 초안|확정 필요|출시 전 확정|\[(?!선택\]|필수\])[^\]]+\]/.test(text))) throw Error('출시 안내 문서에 미확정 항목이 남아 있습니다.')
}

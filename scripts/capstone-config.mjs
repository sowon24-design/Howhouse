export function validateCapstoneEnvironment(environment) {
  for (const [key, value] of Object.entries(environment)) {
    if (!key.startsWith('VITE_') || !value) continue
    if (/OPENAI|SECRET|SERVICE_ROLE|PASSWORD|PRIVATE_KEY|ENCRYPTION|ANALYSIS_AUTH/i.test(key) || /^(sk-|sb_secret_)/.test(String(value))) {
      throw Error('Capstone credentials belong on the server, not in VITE_ configuration.')
    }
  }
  const endpoint = environment.VITE_ANALYSIS_API_BASE_URL
  if (endpoint && endpoint !== 'http://127.0.0.1:8787') throw Error('Capstone currently supports its loopback server only.')
  if (environment.VITE_CAPSTONE_API_BASE_URL) {
    const url = new URL(environment.VITE_CAPSTONE_API_BASE_URL)
    if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash || /^(localhost|127\.|\[::1\])/.test(url.hostname)) {
      throw Error('Remote capstone server must be an explicit HTTPS origin without credentials or a path.')
    }
  }
}

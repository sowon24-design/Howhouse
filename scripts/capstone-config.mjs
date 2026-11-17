export function validateCapstoneEnvironment(environment) {
  for (const [key, value] of Object.entries(environment)) {
    if (!key.startsWith('VITE_') || !value) continue
    if (/OPENAI|SECRET|SERVICE_ROLE|PASSWORD|PRIVATE_KEY|ENCRYPTION|ANALYSIS_AUTH/i.test(key) || /^(sk-|sb_secret_)/.test(String(value))) {
      throw Error('Capstone credentials belong on the server, not in VITE_ configuration.')
    }
  }
  const endpoint = environment.VITE_ANALYSIS_API_BASE_URL
  if (endpoint && endpoint !== 'http://127.0.0.1:8787') throw Error('Capstone currently supports its loopback server only.')
}

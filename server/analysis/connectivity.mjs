/** No API key or model request: 401 from /models confirms the network path only. */
export async function probeModelConnectivity(fetchImpl = fetch) {
  try {
    const response = await fetchImpl('https://api.openai.com/v1/models', {
      method: 'GET', signal: AbortSignal.timeout(5000), redirect: 'error',
    })
    await response.body?.cancel()
    return response.status === 401 || response.ok ? 'reachable' : 'server-error'
  } catch { return 'unreachable' }
}

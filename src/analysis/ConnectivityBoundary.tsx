import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { OfflineScreen } from '../app-screens/system/SystemPreview'
import { checkAnalysisConnection } from './http-client'
import { createRecoveryRouteGuard } from './recovery-route'

/** Keep ordinary screens mounted (including edited B03 text), cancel active analysis via suspended. */
export function ConnectivityBoundary({ children }: {
  children: (suspended: boolean, onConnectionLost: () => void) => ReactNode
}) {
  const [offline, setOffline] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [status, setStatus] = useState('')
  const checking = useRef<AbortController | null>(null)
  const [route] = useState(() => createRecoveryRouteGuard({
    readHash: () => window.location.hash,
    replaceHash: hash => window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${hash}`),
  }))
  const lost = useCallback(() => { route.freeze(); setOffline(true); setStatus('연결을 확인한 뒤 이전 화면으로 돌아갑니다. 분석은 자동으로 다시 요청하지 않습니다.') }, [route])
  useLayoutEffect(() => {
    // Capture before AppContent's ordinary router listener, including browser Back.
    const intercept = (event: Event) => route.intercept(event)
    window.addEventListener('hashchange', intercept, { capture: true })
    window.addEventListener('popstate', intercept, { capture: true })
    return () => {
      window.removeEventListener('hashchange', intercept, { capture: true })
      window.removeEventListener('popstate', intercept, { capture: true })
    }
  }, [route])
  useEffect(() => {
    window.addEventListener('offline', lost)
    return () => { window.removeEventListener('offline', lost); checking.current?.abort() }
  }, [lost])
  useEffect(() => {
    if (!offline) return
    // Hidden screens must not consume Android Back and clear their preserved draft.
    const stopBack = (event: Event) => { event.preventDefault(); event.stopImmediatePropagation() }
    window.addEventListener('howhouse:android-back', stopBack, { capture: true })
    return () => window.removeEventListener('howhouse:android-back', stopBack, { capture: true })
  }, [offline])
  async function retry() {
    if (checking.current) return
    const controller = new AbortController(); checking.current = controller; setRetrying(true)
    try {
      const result = await checkAnalysisConnection({ signal: controller.signal, verifyUpstream: true })
      if (controller.signal.aborted) return
      if (result.status === 'reachable') { route.release(); setOffline(false) }
      else setStatus('아직 연결을 확인하지 못했어요. 잠시 후 다시 시도해 주세요.')
    } catch { /* Unmount/cancel does not restore a screen. */ }
    finally { if (!controller.signal.aborted) setRetrying(false); checking.current = null }
  }
  return <>
    <div inert={offline} aria-hidden={offline} style={offline ? { display: 'none' } : undefined}>{children(offline, lost)}</div>
    {offline && <div className="hh-home-preview">
      <div className="hh-home-preview-frame hh-system-frame"><OfflineScreen retrying={retrying} onRetry={() => { void retry() }} /></div>
      <p role="status" className="ui-sr-only">{status}</p>
    </div>}
  </>
}

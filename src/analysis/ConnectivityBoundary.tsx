import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Network } from '@capacitor/network'
import { App as NativeApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { OfflineScreen } from '../app-screens/system/SystemPreview'
import { minimizeAndroidApp } from '../app-screens/android-back'
import { createRecoveryRouteGuard } from './recovery-route'

/** Keep ordinary screens mounted (including edited B03 text), cancel active analysis via suspended. */
export function ConnectivityBoundary({ children }: {
  children: (suspended: boolean, onConnectionLost: () => void) => ReactNode
}) {
  const [offline, setOffline] = useState(false)
  const [status, setStatus] = useState('')
  const [retrying, setRetrying] = useState(false)
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
    let disposed = false
    const check = async () => {
      try {
        const state = await Network.getStatus()
        if (!disposed && !state.connected) lost()
      } catch { /* A failed local query is not proof of disconnection. */ }
    }
    const subscription = Network.addListener('networkStatusChange', state => {
      if (!disposed && !state.connected) lost()
    })
    void subscription.then(() => { if (!disposed) void check() }).catch(() => {})
    const resume = Capacitor.isNativePlatform()
      ? NativeApp.addListener('appStateChange', state => { if (state.isActive) void check() })
      : null
    return () => {
      disposed = true
      void subscription.then(handle => handle.remove()).catch(() => {})
      void resume?.then(handle => handle.remove()).catch(() => {})
    }
  }, [lost])
  useEffect(() => {
    if (!offline) return
    // Hidden screens must not consume Android Back and clear their preserved draft.
    const stopBack = (event: Event) => { event.preventDefault(); event.stopImmediatePropagation(); minimizeAndroidApp() }
    window.addEventListener('howhouse:android-back', stopBack, { capture: true })
    return () => window.removeEventListener('howhouse:android-back', stopBack, { capture: true })
  }, [offline])
  async function retry() {
    // Device connectivity only: this does not prove Internet or API availability.
    if (retrying) return
    setRetrying(true)
    try {
      const state = await Network.getStatus()
      if (state.connected) { route.release(); setOffline(false) }
      else setStatus('아직 기기가 오프라인이에요. 연결 후 다시 시도해 주세요.')
    } catch {
      setStatus('기기의 연결 상태를 확인하지 못했어요. 다시 시도해 주세요.')
    } finally { setRetrying(false) }
  }
  return <>
    <div data-connectivity-suspended={offline || undefined} inert={offline} aria-hidden={offline} style={offline ? { display: 'none' } : undefined}>{children(offline, lost)}</div>
    {offline && <div className="hh-home-preview">
      <div className="hh-home-preview-frame hh-system-frame"><OfflineScreen retrying={retrying} onRetry={() => { void retry() }} /></div>
      <p role="status" className="ui-sr-only">{status}</p>
    </div>}
  </>
}

import { useEffect, useLayoutEffect, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { App as NativeApp } from '@capacitor/app'

const backEvent = 'howhouse:android-back'

/** Only the visible flow registers; its existing screen callbacks own navigation. */
export function useAndroidBack(handler: () => void, enabled = true) {
  const current = useRef(handler)
  useLayoutEffect(() => { current.current = handler })
  useEffect(() => {
    if (!enabled) return
    const receive = (event: Event) => {
      if (event.defaultPrevented) return
      event.preventDefault()
      current.current()
    }
    window.addEventListener(backEvent, receive)
    return () => window.removeEventListener(backEvent, receive)
  }, [enabled])
}

export function minimizeAndroidApp() {
  if (Capacitor.getPlatform() === 'android') void NativeApp.minimizeApp()
}

export function useAndroidBackBridge() {
  useEffect(() => {
    if (Capacitor.getPlatform() !== 'android') return
    let disposed = false
    const subscription = NativeApp.addListener('backButton', () => {
      if (disposed) return
      // Android consumes Back for the IME first. Once delivered to the app,
      // close the top dialog through its existing cancel handler, not .close().
      const dialogs = document.querySelectorAll<HTMLDialogElement>('dialog[open]')
      const dialog = dialogs.item(dialogs.length - 1)
      if (dialog) {
        if (dialog.dataset.motion !== 'exit') dialog.dispatchEvent(new Event('cancel', { cancelable: true }))
        return
      }
      const handled = !window.dispatchEvent(new Event(backEvent, { cancelable: true }))
      if (!handled && window.location.hash === '#home') minimizeAndroidApp()
      // Developer previews / unresolved F flows deliberately do not use history.back().
    })
    return () => { disposed = true; void subscription.then(handle => handle.remove()) }
  }, [])
}

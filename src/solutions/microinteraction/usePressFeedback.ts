import { useEffect, useRef, type MouseEvent } from 'react'
import './microinteraction.css'

type Tone = 'neutral' | 'tile' | 'primary' | 'pale'
/** Opt-in: acknowledge a committed click before navigation; never capture scrolling. */
export function usePressFeedback() {
  const active = useRef(true)
  const pending = useRef<Animation | null>(null)
  useEffect(() => {
    active.current = true
    return () => { active.current = false; pending.current?.cancel(); pending.current = null }
  }, [])
  return (action: () => void, tone: Tone = 'neutral') => ({
    className: 'yw-press yw-press--' + tone,
    onClick: async (event: MouseEvent<HTMLButtonElement>) => {
      if (pending.current) return
      const button = event.currentTarget
      if (button.disabled) return
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) { action(); return }
      const base = getComputedStyle(button).getPropertyValue('--yw-press-rest').trim()
      const hover = getComputedStyle(button).getPropertyValue('--yw-press-hover').trim()
      const animation = button.animate([
        { transform: 'scale(1)', backgroundColor: base },
        { transform: 'scale(.97)', backgroundColor: hover, offset: .38 },
        { transform: 'scale(1)', backgroundColor: hover },
      ], { duration: 180, easing: 'cubic-bezier(.2,.7,.3,1)' })
      pending.current = animation
      try { await animation.finished } catch { return }
      finally { if (pending.current === animation) pending.current = null }
      if (active.current && button.isConnected && !button.disabled) action()
    },
  })
}

import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Dialog } from '../components/ui/Dialogs'
import './solution-sheet.css'

/** B-only positioning adapter; shared Dialog owns motion, focus, and modal lifecycle. */
export function SolutionSheet({ open, onClose, label, className, children, swipeDismiss = true }: {
  open: boolean; onClose: () => void; label: string; className: string; children: ReactNode; swipeDismiss?: boolean
}) {
  const marker = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    if (!open) return
    const dialog = marker.current!.closest('dialog')!
    const frame = document.activeElement?.closest<HTMLElement>('.hh-home-preview-frame, .solutions-preview__viewport')
    const scroller = document.activeElement?.closest<HTMLElement>('.hh-solutions-layer, .solutions-preview__viewport')
    const overflow = scroller?.style.overflowY
    if (scroller) scroller.style.overflowY = 'hidden'
    const viewport = window.visualViewport
    function position() {
      const rect = frame?.getBoundingClientRect()
      const top = Math.max(rect?.top ?? 0, viewport?.offsetTop ?? 0)
      const bottom = Math.min(rect?.bottom ?? innerHeight, (viewport?.offsetTop ?? 0) + (viewport?.height ?? innerHeight))
      dialog.style.bottom = `${Math.max(0, innerHeight - bottom)}px`
      // Shared Dialog follows the owning app frame width.
      dialog.style.maxHeight = `${Math.max(0, bottom - top - 24)}px`
    }
    position()
    window.addEventListener('resize', position)
    viewport?.addEventListener('resize', position)
    viewport?.addEventListener('scroll', position)
    return () => {
      window.removeEventListener('resize', position)
      viewport?.removeEventListener('resize', position)
      viewport?.removeEventListener('scroll', position)
      if (scroller) scroller.style.overflowY = overflow ?? ''
    }
  }, [open])
  return <Dialog open={open} onClose={onClose} label={label} swipeDismiss={swipeDismiss} className={`ui-action-sheet solutions-sheet ${className}`}><span hidden ref={marker}/>{children}</Dialog>
}

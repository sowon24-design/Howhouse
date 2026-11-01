import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Dialog } from '../components/ui/Dialogs'
import './solution-sheet.css'

/** B-only positioning adapter; shared Dialog owns motion, focus, and modal lifecycle. */
export function SolutionSheet({ open, onClose, label, className, children, swipeDismiss = false }: {
  open: boolean; onClose: () => void; label: string; className: string; children: ReactNode; swipeDismiss?: boolean
}) {
  const marker = useRef<HTMLSpanElement>(null)
  const close = useRef(onClose)
  useLayoutEffect(() => { close.current = onClose })
  useLayoutEffect(() => {
    if (!open || !swipeDismiss) return
    const dialog = marker.current!.closest('dialog')!
    dialog.style.translate = ''
    dialog.style.transition = ''
    let start: { x: number; y: number; eligible: boolean } | null = null
    let distance = 0
    let dragged = false
    const begin = (x: number, y: number, target: EventTarget | null) => {
      dragged = false
      distance = 0
      start = target instanceof Element && !target.closest('textarea, select')
        ? { x, y, eligible: dialog.scrollTop <= 0 } : null
    }
    const move = (x: number, y: number, event: Event) => {
      if (!start?.eligible) return
      const dy = y - start.y
      if (!dragged && (dy < 6 || dy < Math.abs(x - start.x))) return
      if (!event.cancelable) return
      event.preventDefault()
      dragged = true
      distance = Math.max(0, dy)
      dialog.style.transition = 'none'
      dialog.style.translate = `0 ${distance}px`
    }
    const end = (cancelled = false) => {
      start = null
      if (!dragged) return
      if (!cancelled && distance >= Math.min(100, dialog.offsetHeight * .2)) close.current()
      else {
        dialog.style.transition = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'none' : 'translate 200ms ease-out'
        dialog.style.translate = '0 0'
      }
    }
    const touchStart = (e: TouchEvent) => { if (e.touches.length === 1) begin(e.touches[0].clientX, e.touches[0].clientY, e.target) }
    const touchMove = (e: TouchEvent) => { if (e.touches.length === 1) move(e.touches[0].clientX, e.touches[0].clientY, e) }
    const touchEnd = () => end()
    const touchCancel = () => end(true)
    const mouseDown = (e: PointerEvent) => { if (e.pointerType === 'mouse' && e.button === 0) begin(e.clientX, e.clientY, e.target) }
    const mouseMove = (e: PointerEvent) => { if (e.pointerType === 'mouse' && start) move(e.clientX, e.clientY, e) }
    const mouseUp = (e: PointerEvent) => { if (e.pointerType === 'mouse') end() }
    const preventDragClick = (e: MouseEvent) => { if (dragged) { e.preventDefault(); e.stopImmediatePropagation() } }
    dialog.addEventListener('touchstart', touchStart, { passive: true })
    dialog.addEventListener('touchmove', touchMove, { passive: false })
    dialog.addEventListener('touchend', touchEnd)
    dialog.addEventListener('touchcancel', touchCancel)
    dialog.addEventListener('pointerdown', mouseDown)
    window.addEventListener('pointermove', mouseMove)
    window.addEventListener('pointerup', mouseUp)
    dialog.addEventListener('click', preventDragClick, true)
    return () => {
      dialog.removeEventListener('touchstart', touchStart)
      dialog.removeEventListener('touchmove', touchMove)
      dialog.removeEventListener('touchend', touchEnd)
      dialog.removeEventListener('touchcancel', touchCancel)
      dialog.removeEventListener('pointerdown', mouseDown)
      window.removeEventListener('pointermove', mouseMove)
      window.removeEventListener('pointerup', mouseUp)
      dialog.removeEventListener('click', preventDragClick, true)
    }
  }, [open, swipeDismiss])
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
      dialog.style.width = `${Math.min(412, rect?.width ?? innerWidth)}px`
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
  return <Dialog open={open} onClose={onClose} label={label} className={`ui-action-sheet solutions-sheet ${className}`}><span hidden ref={marker}/>{children}</Dialog>
}

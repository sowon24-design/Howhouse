import { useEffect, useId, useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './Button'
import { Asset } from './Asset'
import { lockModalScroll } from './modalScrollLock'
import './ui.css'

type DialogProps = { open: boolean; onClose: () => void; children: ReactNode; label: string; className: string; closeOnBackdrop?: boolean; swipeDismiss?: boolean }

export function Dialog({ open, onClose, children, label, className, closeOnBackdrop = true, swipeDismiss = false }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const owner = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    if (!open || !className.split(' ').includes('ui-action-sheet')) return
    const dialog = ref.current!
    const frame = owner.current?.closest<HTMLElement>('.hh-home-preview-frame, .solutions-preview__viewport')
    const viewport = window.visualViewport
    const position = () => {
      const rect = frame?.getBoundingClientRect()
      const left = Math.max(rect?.left ?? 0, viewport?.offsetLeft ?? 0)
      const right = Math.min(rect?.right ?? innerWidth, (viewport?.offsetLeft ?? 0) + (viewport?.width ?? innerWidth))
      dialog.style.width = Math.max(0, right - left) + 'px'
      dialog.style.left = left + 'px'
      dialog.style.right = 'auto'
      dialog.style.marginLeft = '0'
      dialog.style.marginRight = '0'
    }
    position()
    const observer = new ResizeObserver(position)
    if (frame) observer.observe(frame)
    window.addEventListener('resize', position)
    viewport?.addEventListener('resize', position)
    viewport?.addEventListener('scroll', position)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', position)
      viewport?.removeEventListener('resize', position)
      viewport?.removeEventListener('scroll', position)
    }
  }, [open, className])
  const startedOutside = useRef(false)
  const pointerStart = useRef({ x: 0, y: 0 })
  const drag = useRef<{ id: number; y: number; distance: number } | null>(null)
  const dragged = useRef(false)
  const restore = useRef<(() => void) | null>(null)
  useEffect(() => {
    const dialog = ref.current!
    if (open) {
      dialog.style.translate = ''
      dialog.style.transition = ''
      if (!dialog.open) {
        const previousOverflow = document.body.style.overflow
        const locked: { node: HTMLElement; overflow: string }[] = []
        const frame = owner.current?.closest<HTMLElement>('.hh-home-preview-frame, .solutions-preview__viewport')
        if (frame) {
          for (const node of [frame, ...frame.querySelectorAll<HTMLElement>('*')]) {
            if (/(auto|scroll)/.test(getComputedStyle(node).overflowY)) {
              locked.push({ node, overflow: node.style.overflow })
              node.style.overflow = 'hidden'
            }
          }
        }
        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
        document.body.style.overflow = 'hidden'
        dialog.showModal()
        const unlockScroll = lockModalScroll(dialog)
        restore.current = () => {
          dialog.close()
          unlockScroll()
          document.body.style.overflow = previousOverflow
          locked.forEach(({ node, overflow }) => { node.style.overflow = overflow })
          if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
        }
      }
      dialog.dataset.motion = 'enter'
      return
    }
    if (!dialog.open) return
    dialog.dataset.motion = 'exit'
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : parseFloat(getComputedStyle(dialog).getPropertyValue('--dialog-duration'))
    const timer = window.setTimeout(() => { restore.current?.(); restore.current = null }, duration)
    return () => window.clearTimeout(timer)
  }, [open])
  useEffect(() => () => { restore.current?.(); restore.current = null }, [])
  return <><span ref={owner} hidden />{createPortal(<dialog ref={ref} className={`ui-dialog ${className}`} aria-label={label} data-swipe-dismiss={swipeDismiss || undefined}
    onCancel={event => { event.preventDefault(); if (open) onClose() }}
    onKeyDown={event => {
      if (event.key !== 'Tab') return
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), [href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex="0"]')).filter(node => node.getClientRects().length > 0)
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (!first) { event.preventDefault(); return }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }}
    onPointerDown={event => {
      pointerStart.current = { x: event.clientX, y: event.clientY }
      const r = event.currentTarget.getBoundingClientRect()
      startedOutside.current = event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom
      dragged.current = false
      const handle = event.target instanceof Element && event.target.closest('.ui-sheet-drag-zone')
      if (open && swipeDismiss && handle && !startedOutside.current && event.button === 0) {
        drag.current = { id: event.pointerId, y: event.clientY, distance: 0 }
        event.currentTarget.setPointerCapture(event.pointerId)
      }
    }}
    onPointerMove={event => {
      if (!drag.current || drag.current.id !== event.pointerId) return
      const distance = Math.max(0, event.clientY - drag.current.y)
      drag.current.distance = distance
      dragged.current ||= distance > 6
      event.currentTarget.style.transition = 'none'
      event.currentTarget.style.translate = `0 ${distance}px`
    }}
    onPointerUp={event => {
      if (!drag.current || drag.current.id !== event.pointerId) return
      const distance = drag.current.distance
      drag.current = null
      event.currentTarget.releasePointerCapture(event.pointerId)
      if (distance >= Math.min(100, event.currentTarget.offsetHeight * .2)) onClose()
      else {
        event.currentTarget.style.transition = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'none' : 'translate 200ms ease-out'
        event.currentTarget.style.translate = '0 0'
      }
    }}
    onPointerCancel={event => {
      drag.current = null
      event.currentTarget.style.translate = '0 0'
    }}
    onClick={event => {
      if (Math.hypot(event.clientX - pointerStart.current.x, event.clientY - pointerStart.current.y) > 6) { event.preventDefault(); return }
      if (dragged.current) { dragged.current = false; event.preventDefault(); return }
      const r = event.currentTarget.getBoundingClientRect()
      const outside = event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom
      if (open && closeOnBackdrop && startedOutside.current && outside) onClose()
      startedOutside.current = false
    }}>{swipeDismiss && <div className="ui-sheet-drag-zone" aria-hidden="true" />}<div className="ui-dialog-inner" inert={!open}>{children}</div></dialog>, document.body)}</>
}

export type SheetAction = { id: string; label: string; onClick: () => void; disabled?: boolean }
export function ActionSheet({ open, onClose, actions, label, cancelLabel = '취소' }: {
  open: boolean; onClose: () => void; actions: readonly SheetAction[]; label: string; cancelLabel?: string
}) {
  return <Dialog open={open} onClose={onClose} label={label} className="ui-action-sheet" swipeDismiss>
    <div className="ui-sheet-handle" aria-hidden="true" />
    <div className="ui-sheet-content"><div className="ui-sheet-actions">
      {actions.map(action => <Button key={action.id} variant="pale" disabled={action.disabled} onClick={action.onClick}>{action.label}</Button>)}
    </div><Button onClick={onClose}>{cancelLabel}</Button></div>
  </Dialog>
}

export function Overlay({ open, title, body, onConfirm, onClose, confirmLabel = '네', cancelLabel = '아니오' }: {
  open: boolean; title: string; body?: string; onConfirm: () => void; onClose: () => void; confirmLabel?: string; cancelLabel?: string
}) {
  const id = useId()
  return <Dialog open={open} onClose={onClose} label={title} className="ui-overlay" closeOnBackdrop={false}>
    <span className="ui-warning-large"><Asset name="overlay-warning" /></span>
    <div className="ui-overlay-copy"><h2 id={id}>{title}</h2>{body && <p>{body}</p>}</div>
    <div className="ui-overlay-actions"><Button variant="pale" onClick={onClose}>{cancelLabel}</Button><Button onClick={onConfirm}>{confirmLabel}</Button></div>
  </Dialog>
}

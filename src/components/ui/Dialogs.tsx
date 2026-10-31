import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './Button'
import { Asset } from './Asset'
import './ui.css'

type DialogProps = { open: boolean; onClose: () => void; children: ReactNode; label: string; className: string; closeOnBackdrop?: boolean }

export function Dialog({ open, onClose, children, label, className, closeOnBackdrop = true }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const startedOutside = useRef(false)
  const restore = useRef<(() => void) | null>(null)
  useEffect(() => {
    const dialog = ref.current!
    if (open) {
      if (!dialog.open) {
        const previousOverflow = document.body.style.overflow
        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
        document.body.style.overflow = 'hidden'
        dialog.showModal()
        restore.current = () => {
          dialog.close()
          document.body.style.overflow = previousOverflow
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
  return createPortal(<dialog ref={ref} className={`ui-dialog ${className}`} aria-label={label}
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
      const r = event.currentTarget.getBoundingClientRect()
      startedOutside.current = event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom
    }}
    onClick={event => {
      const r = event.currentTarget.getBoundingClientRect()
      const outside = event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom
      if (open && closeOnBackdrop && startedOutside.current && outside) onClose()
      startedOutside.current = false
    }}><div className="ui-dialog-inner" inert={!open}>{children}</div></dialog>, document.body)
}

export type SheetAction = { id: string; label: string; onClick: () => void; disabled?: boolean }
export function ActionSheet({ open, onClose, actions, label, cancelLabel = '취소' }: {
  open: boolean; onClose: () => void; actions: readonly SheetAction[]; label: string; cancelLabel?: string
}) {
  return <Dialog open={open} onClose={onClose} label={label} className="ui-action-sheet">
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

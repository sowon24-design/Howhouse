import { useEffect, useRef, useState, type ButtonHTMLAttributes } from 'react'

// Visual feedback only. Native click keeps Enter/Space activation semantics.
export function usePressFeedback(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const [pressed, setPressed] = useState(false)
  const pointer = useRef<number | null>(null)
  const cancelled = useRef(false)
  const clear = () => { pointer.current = null; setPressed(false) }
  const cancel = () => { cancelled.current = true; clear() }
  useEffect(() => { if (props.disabled) cancel() }, [props.disabled])
  useEffect(() => {
    window.addEventListener('blur', cancel)
    return () => window.removeEventListener('blur', cancel)
  }, [])
  const handlers: ButtonHTMLAttributes<HTMLButtonElement> = {
    onPointerDown(event) {
      props.onPointerDown?.(event)
      if (!props.disabled && !event.defaultPrevented && event.button === 0 && event.isPrimary) {
        cancelled.current = false
        pointer.current = event.pointerId
        setPressed(true)
      }
    },
    onPointerMove(event) {
      props.onPointerMove?.(event)
      if (pointer.current !== event.pointerId) return
      const bounds = event.currentTarget.getBoundingClientRect()
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) cancel()
    },
    onPointerUp(event) { props.onPointerUp?.(event); if (pointer.current === event.pointerId) clear() },
    onPointerCancel(event) { props.onPointerCancel?.(event); cancel() },
    onPointerLeave(event) { props.onPointerLeave?.(event); if (pointer.current !== null) cancel() },
    onKeyDown(event) {
      props.onKeyDown?.(event)
      if (!props.disabled && !event.defaultPrevented && !event.repeat && (event.key === 'Enter' || event.key === ' ')) {
        cancelled.current = false
        setPressed(true)
      }
      if (event.key === 'Escape') cancel()
    },
    onKeyUp(event) { props.onKeyUp?.(event); if (event.key === 'Enter' || event.key === ' ') clear() },
    onBlur(event) { props.onBlur?.(event); cancel() },
    onClick(event) {
      if (props.disabled || (event.detail > 0 && cancelled.current)) { event.preventDefault(); return }
      props.onClick?.(event)
    },
  }
  return { pressed: pressed && !props.disabled, handlers }
}

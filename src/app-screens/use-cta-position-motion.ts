import { useLayoutEffect, useRef } from 'react'

/** Animate only the footer's visual position, never its layout spacing. */
export function useCtaPositionMotion<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useLayoutEffect(() => {
    const node = ref.current
    if (!node || !node.parentElement) return
    let previousTop = node.getBoundingClientRect().top
    let animation: Animation | undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const observer = new ResizeObserver(() => {
      const transform = getComputedStyle(node).transform
      const offset = transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m42
      const top = node.getBoundingClientRect().top - offset
      if (Math.abs(top - previousTop) < 0.5) return
      const delta = previousTop + offset - top
      previousTop = top
      animation?.cancel()
      if (reduced.matches) return
      animation = node.animate([
        { transform: `translateY(${delta}px)` },
        { transform: 'translateY(0)' },
      ], { duration: 100, easing: 'cubic-bezier(0, 0, .2, 1)' })
    })
    observer.observe(node.parentElement)
    observer.observe(node)
    return () => { observer.disconnect(); animation?.cancel() }
  }, [])
  return ref
}

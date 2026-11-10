/** Keep scrolling inside the topmost modal, including at a scroll area's ends. */
export function lockModalScroll(dialog: HTMLDialogElement) {
  const root = document.documentElement
  const previous = root.style.overflow
  const previousOverscroll = root.style.overscrollBehavior
  root.style.overflow = 'hidden'
  root.style.overscrollBehavior = 'none'
  let lastY = 0
  const isTop = () => Array.from(document.querySelectorAll('dialog[open]')).at(-1) === dialog
  const canScroll = (target: EventTarget | null, x: number, y: number, delta: number) => {
    const bounds = dialog.getBoundingClientRect()
    if (x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom) return false
    let node = target instanceof Element ? target : null
    if (!node || !dialog.contains(node)) return false
    while (node && node !== dialog) {
      if (node instanceof HTMLElement && /(auto|scroll)/.test(getComputedStyle(node).overflowY)) {
        const remaining = node.scrollHeight - node.clientHeight
        if (remaining > 1 && (delta < 0 ? node.scrollTop > 0 : node.scrollTop < remaining - 1)) return true
      }
      node = node.parentElement
    }
    return false
  }
  const wheel = (event: WheelEvent) => {
    if (isTop() && !canScroll(event.target, event.clientX, event.clientY, event.deltaY)) event.preventDefault()
  }
  const start = (event: TouchEvent) => { lastY = event.touches[0]?.clientY ?? 0 }
  const move = (event: TouchEvent) => {
    if (!isTop() || event.touches.length !== 1) return
    const touch = event.touches[0]
    const delta = lastY - touch.clientY
    lastY = touch.clientY
    if (!canScroll(event.target, touch.clientX, touch.clientY, delta)) event.preventDefault()
  }
  document.addEventListener('wheel', wheel, { capture: true, passive: false })
  document.addEventListener('touchstart', start, { capture: true, passive: true })
  document.addEventListener('touchmove', move, { capture: true, passive: false })
  return () => {
    root.style.overflow = previous
    root.style.overscrollBehavior = previousOverscroll
    document.removeEventListener('wheel', wheel, true)
    document.removeEventListener('touchstart', start, true)
    document.removeEventListener('touchmove', move, true)
  }
}

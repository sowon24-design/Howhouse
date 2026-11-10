import { useState, type ButtonHTMLAttributes } from 'react'

export function HomePressButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const [pressed, setPressed] = useState(false)
  return <button {...props} data-home-pressed={pressed && !props.disabled || undefined}
    onPointerDown={event => { props.onPointerDown?.(event); if (event.button === 0 && !event.defaultPrevented) setPressed(true) }}
    onPointerUp={event => { props.onPointerUp?.(event); setPressed(false) }}
    onPointerCancel={event => { props.onPointerCancel?.(event); setPressed(false) }}
    onPointerLeave={event => { props.onPointerLeave?.(event); setPressed(false) }}
    onBlur={event => { props.onBlur?.(event); setPressed(false) }} />
}

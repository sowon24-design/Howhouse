import type { ButtonHTMLAttributes } from 'react'
import { useEffect, useState } from 'react'
import { Asset } from './Asset'
import './ui.css'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'pale'
  loading?: boolean
}

export function Button({ variant = 'primary', loading = false, disabled, children, className = '', type = 'button', ...props }: ButtonProps) {
  const [pressed, setPressed] = useState(false)
  const clear = () => setPressed(false)
  useEffect(() => { if (disabled || loading) clear() }, [disabled, loading])
  return <button {...props} type={type} className={`ui-button ui-button--${variant} ${className}`} disabled={disabled || loading} aria-busy={loading || undefined}
    data-pressed={pressed && !disabled && !loading || undefined}
    onPointerDown={event => { props.onPointerDown?.(event); if (!event.defaultPrevented && event.button === 0) { setPressed(true) } }}
    onPointerUp={event => { props.onPointerUp?.(event); clear() }}
    onPointerCancel={event => { props.onPointerCancel?.(event); clear() }}
    onPointerLeave={event => { props.onPointerLeave?.(event); clear() }}
    onBlur={event => { props.onBlur?.(event); clear() }}>
    {loading ? <><span className="ui-sr-only">{children} 처리 중</span><span className="ui-loading" aria-hidden="true">
      {[0, 1, 2].map(index => <span className="ui-loading-dot" key={index}>
        <span className="ui-loading-small"><Asset name={`dot-${variant === 'primary' ? 'white' : 'dark'}-small`} /></span>
        <span className="ui-loading-large"><Asset name={`dot-${variant === 'primary' ? 'white' : 'dark'}-large`} /></span>
      </span>)}
    </span></> : children}
  </button>
}

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Icon } from '../Icon/Icon'
import { Asset } from './Asset'
import './ui.css'

type RowProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'neutral' | 'pale'; icon?: ReactNode }
export function ListRow({ variant = 'neutral', icon, children, className = '', type = 'button', ...props }: RowProps) {
  const [pressed, setPressed] = useState(false)
  useEffect(() => { if (props.disabled) setPressed(false) }, [props.disabled])
  return <button {...props} type={type} className={`ui-list ui-tone--${variant} ${className}`} data-pressed={pressed && !props.disabled || undefined}
    onPointerDown={event => { props.onPointerDown?.(event); if (!event.defaultPrevented && event.button === 0) setPressed(true) }}
    onPointerUp={event => { props.onPointerUp?.(event); setPressed(false) }}
    onPointerCancel={event => { props.onPointerCancel?.(event); setPressed(false) }}
    onPointerLeave={event => { props.onPointerLeave?.(event); setPressed(false) }}
    onBlur={event => { props.onBlur?.(event); setPressed(false) }}>
    {icon}<span className="ui-row-label">{children}</span><Asset name="arrow-right" />
  </button>
}

export function MessageButton({ selected, onSelectedChange, children, disabled }: { selected: boolean; onSelectedChange: (selected: boolean) => void; children: ReactNode; disabled?: boolean }) {
  return <button type="button" disabled={disabled} className={`ui-message ui-tone--${selected ? 'pale' : 'neutral'}`} aria-pressed={selected} onClick={() => onSelectedChange(!selected)}>
    <span className="ui-row-label">{children}</span><Asset name={selected ? 'message-check' : 'message-plus'} />
  </button>
}

export function HomeIcon({ pale = false }: { pale?: boolean }) {
  return pale ? <Asset name="home-pale" /> : <Icon nodeId="355:7093" />
}

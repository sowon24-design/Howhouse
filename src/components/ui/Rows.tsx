import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { usePressFeedback } from './usePressFeedback'
import { Icon } from '../Icon/Icon'
import { Asset } from './Asset'
import './ui.css'

type RowProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'neutral' | 'pale'; icon?: ReactNode }
export function ListRow({ variant = 'neutral', icon, children, className = '', type = 'button', ...props }: RowProps) {
  const { pressed, handlers } = usePressFeedback(props)
  return <button {...props} {...handlers} type={type} className={`ui-list ui-tone--${variant} ${className}`} data-pressed={pressed}>
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

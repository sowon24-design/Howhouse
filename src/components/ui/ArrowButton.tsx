import type { ButtonHTMLAttributes } from 'react'
import { Asset } from './Asset'
import './ui.css'

export type ArrowButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> & {
  /** Describe the action, for example '다음 단계'. */
  label: string
}

/** Figma 549:9825: right arrow, 40px circle, 24px original icon. */
export function ArrowButton({ label, className = '', type = 'button', ...props }: ArrowButtonProps) {
  return <button {...props} type={type} aria-label={label} className={`ui-arrow-button ${className}`}>
    <Asset name="arrow-button-right" />
  </button>
}

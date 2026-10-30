import { useId, useRef } from 'react'
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react'
import { Asset } from './Asset'
import './ui.css'

type ChoiceProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children' | 'defaultChecked'> & { label: ReactNode; checked: boolean }

export function Checkbox({ label, checked, variant = 'fill', className = '', ...props }: ChoiceProps & { variant?: 'fill' | 'stroke' }) {
  return <label className={`ui-choice ${className}`}>
    <span className="ui-choice-control"><input {...props} type="checkbox" checked={checked} />
      <Asset name={`checkbox-${variant}-${checked ? 'on' : 'off'}`} />
    </span><span>{label}</span>
  </label>
}

export function Radio({ label, checked, className = '', ...props }: ChoiceProps) {
  return <label className={`ui-choice ${className}`}>
    <span className={`ui-choice-control ${checked ? '' : 'ui-radio-off'}`}><input {...props} type="radio" checked={checked} />
      {checked && <Asset name="radio-on" />}
    </span><span>{label}</span>
  </label>
}

type TabOption = { value: string; label: string; panelId: string }
export function TabBar({ options, value, onChange, label }: { options: readonly TabOption[]; value: string; onChange: (value: string) => void; label: string }) {
  const id = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  return <div className="ui-tabs" role="tablist" aria-label={label} style={{ '--tab-count': options.length, '--tab-index': Math.max(0, options.findIndex(option => option.value === value)) } as CSSProperties}>
    <span className="ui-tab-indicator" aria-hidden="true" />
    {options.map((option, index) => <button key={option.value} ref={node => { refs.current[index] = node }} type="button" role="tab"
      id={`${id}-${option.value}`} aria-controls={option.panelId} aria-selected={value === option.value} tabIndex={value === option.value ? 0 : -1}
      onClick={() => onChange(option.value)} onKeyDown={event => {
        let next: number
        if (event.key === 'ArrowRight') next = (index + 1) % options.length
        else if (event.key === 'ArrowLeft') next = (index - 1 + options.length) % options.length
        else if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = options.length - 1
        else return
        event.preventDefault(); onChange(options[next].value); refs.current[next]?.focus()
      }}>{option.label}</button>)}
  </div>
}

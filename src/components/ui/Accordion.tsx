import { useId } from 'react'
import type { ReactNode } from 'react'
import { Asset } from './Asset'
import './ui.css'

export function Accordion({ title, children, open, onOpenChange }: { title: string; children: ReactNode; open: boolean; onOpenChange: (open: boolean) => void }) {
  const id = useId()
  return <div className="ui-accordion" data-open={open}>
    <button type="button" className="ui-accordion-trigger" aria-expanded={open} aria-controls={id} onClick={() => onOpenChange(!open)}>
      <span className="ui-accordion-title"><span className="ui-warning-small"><Asset name="accordion-warning" /></span>{title}</span>
      <span className="ui-accordion-arrow"><Asset name="arrow-bottom" /></span>
    </button>
    <div id={id} className="ui-accordion-panel" aria-hidden={!open} inert={!open}><div className="ui-accordion-clip"><div className="ui-accordion-body">{children}</div></div></div>
  </div>
}

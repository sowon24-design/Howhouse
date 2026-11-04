import { Asset } from './Asset'
import './solution-step.css'

export type StepMaterial = { id: string; label: string; disabled?: boolean }
export type SolutionStepProps = {
  number: number
  title: string
  description: string
  active?: boolean
  materials?: readonly StepMaterial[]
  onMaterialClick?: (material: StepMaterial) => void
}

/** Presentation only: the screen decides the active step from its scroll position. */
export function SolutionStep({ number, title, description, active = false, materials = [], onMaterialClick }: SolutionStepProps) {
  return <div className="ui-solution-step" data-active={active} aria-current={active ? 'step' : undefined}>
    <div className="ui-solution-step__number-slot"><span className="ui-solution-step__number">{number}</span></div>
    <div className="ui-solution-step__content">
      <h4 className="ui-solution-step__title">{title}</h4>
      <p className="ui-solution-step__description">{description}</p>
      {materials.length > 0 && <div className="ui-solution-step__materials" role="group" aria-label={`${number}단계 준비물`}>
        {materials.map(material => <button key={material.id} type="button" className="ui-solution-step__material"
          disabled={material.disabled || !onMaterialClick} onClick={() => onMaterialClick?.(material)}>
          <span>{material.label}</span><Asset name="solution-step-external-link" />
        </button>)}
      </div>}
    </div>
  </div>
}

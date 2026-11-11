import './solution-step.css'

export type StepMaterial = { id: string; label: string }
export type SolutionStepProps = {
  number: number
  title: string
  description: string
  active?: boolean
  materials?: readonly StepMaterial[]

}

/** Static timeline row. active is retained for existing callers, without selection styling. */
export function SolutionStep({ number, title, description, materials = [] }: SolutionStepProps) {
  return <div className="ui-solution-step">
    <div className="ui-solution-step__number-slot"><span className="ui-solution-step__number">{number}</span></div>
    <div className="ui-solution-step__content">
      <div className="ui-solution-step__copy"><h4 className="ui-solution-step__title">{title}</h4>
      <p className="ui-solution-step__description">{description}</p></div>
      {materials.length > 0 && <div className="ui-solution-step__materials" role="group" aria-label={`${number}단계 준비물`}>
        {materials.map(material => <span key={material.id} className="ui-solution-step__material">{material.label}</span>)}
      </div>}
    </div>
  </div>
}

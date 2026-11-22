import type { ButtonHTMLAttributes } from 'react'
import { usePressFeedback } from '../../components/ui/usePressFeedback'

export function HomePressButton({ type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pressed, handlers } = usePressFeedback(props)
  return <button {...props} {...handlers} type={type} data-home-pressed={pressed} />
}

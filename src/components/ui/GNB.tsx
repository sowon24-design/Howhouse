import { Asset } from './Asset'
import './ui.css'

export function GNB({ title, variant = 'depth2-light', onBack, onClose }: {
  title?: string; variant?: 'depth1' | 'depth2-light' | 'depth2-dark'; onBack?: () => void; onClose?: () => void
}) {
  const tone = variant === 'depth2-dark' ? 'dark' : 'light'
  return <header className={`ui-gnb ui-gnb--${variant}`}>
    {variant !== 'depth1' && (onBack ? <button type="button" className="ui-icon-button" aria-label="뒤로" onClick={onBack}><Asset name={`back-${tone}`} /></button> : <span className="ui-gnb-spacer" />)}
    {title && <h2>{title}</h2>}
    {variant !== 'depth1' && (onClose ? <button type="button" className="ui-icon-button" aria-label="닫기" onClick={onClose}><Asset name={`close-${tone}`} /></button> : <span className="ui-gnb-spacer" />)}
  </header>
}

import { Icon } from '../Icon/Icon'
import { Asset } from './Asset'
import './ui.css'

export function AddImage({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return <button type="button" className="ui-add-image" aria-label="사진 추가" onClick={onClick} disabled={disabled}><Icon nodeId="369:9168" /></button>
}

export function Photo({ src, alt, onRemove }: { src: string; alt: string; onRemove: () => void }) {
  return <div className="ui-photo"><img className="ui-photo-image" src={src} alt={alt} />
    <button type="button" className="ui-photo-remove" aria-label={`${alt} 삭제`} onClick={onRemove}><Asset name="photo-close" /></button>
  </div>
}

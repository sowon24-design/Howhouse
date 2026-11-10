import catalog from './catalog.json'
import './icon.css'

export const iconCatalog = catalog
export type IconAsset = (typeof catalog)[number]

type IconProps = {
  /** Exact Figma variant node ID. Names are corrected; original geometry is preserved. */
  nodeId: string
  /** Omit for decorative icons. No click, focus or button props are exposed. */
  label?: string
}

export function Icon({ nodeId, label }: IconProps) {
  const asset = catalog.find((item) => item.id === nodeId)
  if (!asset) throw new Error(`등록되지 않은 Figma 아이콘: ${nodeId}`)

  const stroke = asset.variant.includes('Stroke')
  const special = ['408:3833', '431:14740', '408:4579', '408:3930'].includes(asset.groupId)
  const className = [
    'figma-icon',
    special ? `figma-icon--${asset.groupId.replace(':', '-')}` : '',
    stroke ? 'figma-icon--stroke' : '',
  ].join(' ')

  return (
    <span
      className={className}
      style={{ width: asset.width, height: asset.height }}
      data-node-id={asset.id}
      data-size={asset.width}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {asset.src && <span className="figma-icon__placement"><img src={asset.src} alt="" draggable={false} /></span>}
    </span>
  )
}

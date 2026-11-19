import { Children, cloneElement, createElement, isValidElement } from 'react'
import type { ReactNode, ReactElement } from 'react'
import HomeFrame from './frames/336-27446'
import MyFrame from './frames/336-30827'

const destinations = ['home', 'categories', 'community', 'my'] as const
const labels = ['홈', '해결책', '커뮤니티', '마이'] as const
type NodeProps = { children?: ReactNode; className?: string; 'data-name'?: string; [key: string]: unknown }

/** Reuse the exact reviewed Figma nav layers/assets; do not recreate its visuals. */
export function BottomNavigation({ selected }: { selected: 'home' | 'my' }) {
  const frame = selected === 'home' ? HomeFrame() : MyFrame()
  const navigation = Children.toArray(frame.props.children).find(child => isValidElement<NodeProps>(child) && child.props['data-name'] === 'Navigation Bar')
  if (!isValidElement<NodeProps>(navigation)) return null
  let index = 0
  function wire(node: ReactNode, parentIsNav = false): ReactNode {
    if (!isValidElement<NodeProps>(node)) return node
    const p = node.props, name = p['data-name']
    const children = Children.map(p.children, child => wire(child, name === 'Navigation Bar'))
    if (parentIsNav && name && name !== 'Navigation Bar') {
      const current = index++
      return createElement('button', { ...p, type: 'button', className: p.className + ' cg-action',
        'aria-label': labels[current], 'aria-current': destinations[current] === selected ? 'page' : undefined,
        onClick: () => { location.hash = destinations[current] } }, children)
    }
    return cloneElement(node as ReactElement<NodeProps>, {}, children)
  }
  return <nav className="cg-main-navigation cg-frame" aria-label="하단 메뉴">
    {wire(cloneElement(navigation, { className: navigation.props.className + ' cg-global-nav' }))}
  </nav>
}

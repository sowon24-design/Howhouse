/** Unmodified Figma instance exports; colors can differ from the icon library. */
export function Asset({ name }: { name: string }) {
  return <img className="ui-asset" src={`/components/figma/${name}.svg`} alt="" draggable={false} />
}

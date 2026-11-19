/** Figma GLASS adaptation. Only the backdrop is displaced; content stays sharp.
 * Figma depth/refraction are not CSS units: these two edge maps approximate the
 * reviewed nav (refraction .7/depth 20) and FAB (1/depth 100), not a native renderer.
 */
function edgeMap(width: number, height: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><linearGradient id="x"><stop stop-color="#ff0000"/><stop offset=".08" stop-color="#800000"/><stop offset=".92" stop-color="#800000"/><stop offset="1" stop-color="#000000"/></linearGradient><linearGradient id="y" x2="0" y2="1"><stop stop-color="#00ff00"/><stop offset=".22" stop-color="#008000"/><stop offset=".78" stop-color="#008000"/><stop offset="1" stop-color="#000000"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#x)"/><rect width="100%" height="100%" fill="url(#y)" style="mix-blend-mode:screen"/></svg>`
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}

export function GlassEffects() {
  return <svg className="cg-glass-definitions" aria-hidden="true" focusable="false">
    <defs>
      {([{ id: 'cg-glass-nav', width: 380, height: 64, scale: 14 },
        { id: 'cg-glass-write', width: 106, height: 56, scale: 22 }]).map(({ id, width, height, scale }) =>
        <filter key={id} id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage href={edgeMap(width, height)} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="edge-map" />
          <feDisplacementMap in="SourceGraphic" in2="edge-map" scale={scale} xChannelSelector="R" yChannelSelector="G" />
        </filter>)}
    </defs>
  </svg>
}

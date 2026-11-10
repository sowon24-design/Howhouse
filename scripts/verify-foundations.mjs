import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const read = (path) => readFile(new URL(path, root))
const catalog = JSON.parse(await read('src/components/Icon/catalog.json'))
assert.equal(catalog.length, 180)
assert.equal(new Set(catalog.map((asset) => asset.id)).size, 180)
assert.equal(new Set(catalog.map((asset) => asset.groupId)).size, 29)

let svgCount = 0
const partialGroups = new Set(['408:3833', '431:14740', '408:4579', '408:3930'])
for (const asset of catalog) {
  assert.ok([16, 20, 24, 28].includes(asset.width))
  assert.equal(asset.width, asset.height)
  if (!asset.src) {
    assert.equal(asset.groupId, '408:3835', 'Only the original Blank icon has no SVG')
    continue
  }
  assert.equal(asset.src, `/icons/figma/${asset.id.replace(':', '-')}.svg`)
  const path = `public${asset.src}`
  assert.ok((await stat(new URL(path, root))).size > 0)
  // Inspect only the root metadata; never rewrite or parse the vector paths.
  const svgRoot = (await read(path)).toString().match(/<svg\b[^>]*>/)?.[0]
  assert.ok(svgRoot, `Missing SVG root: ${asset.id}`)
  const width = Number(svgRoot.match(/\bwidth="([\d.]+)"/)?.[1])
  const height = Number(svgRoot.match(/\bheight="([\d.]+)"/)?.[1])
  assert.ok(width > 0 && height > 0)
  if (!partialGroups.has(asset.groupId)) {
    assert.equal(width, asset.width, `Wrong width: ${asset.id}`)
    assert.equal(height, asset.height, `Wrong height: ${asset.id}`)
  } else {
    assert.ok(width <= asset.width && height <= asset.height)
  }
  svgCount++
}
assert.equal(svgCount, 176)
for (const weight of ['Regular', 'Medium', 'SemiBold', 'Bold']) {
  const font = await read(`public/fonts/pretendard/Pretendard-${weight}.woff2`)
  assert.equal(font.subarray(0, 4).toString(), 'wOF2', `Invalid WOFF2: ${weight}`)
  assert.equal(font.readUInt32BE(8), font.length, `Incomplete WOFF2: ${weight}`)
}
assert.match((await read('public/fonts/pretendard/LICENSE')).toString(), /SIL OPEN FONT LICENSE/)
assert.ok(!JSON.stringify(catalog).includes('https://www.figma.com/api/mcp/asset/'))
const components = JSON.parse(await read('public/components/figma/manifest.json'))
assert.equal(components.length, 24)
assert.equal(new Set(components.map(asset => asset.path)).size, 24)
for (const asset of components) {
  assert.match(asset.node, /^\d+:\d+$/)
  const bytes = await read(`public${asset.path}`)
  assert.ok(bytes.length > 0, `Empty component asset: ${asset.name}`)
  if (asset.path.endsWith('.svg')) {
    const svgRoot = bytes.toString().match(/<svg\b[^>]*>/)?.[0]
    assert.ok(svgRoot, `Invalid SVG: ${asset.name}`)
    assert.ok(Number(svgRoot.match(/\bwidth="([\d.]+)"/)?.[1]) > 0)
    assert.ok(Number(svgRoot.match(/\bheight="([\d.]+)"/)?.[1]) > 0)
  } else {
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'Invalid preview PNG')
  }
}
console.log('PASS: 24 original component assets (23 SVG + 1 preview PNG)')
console.log(`PASS: 29 icon groups / 180 variants / 176 SVGs / 4 valid WOFF2 files + license (${fileURLToPath(root)})`)

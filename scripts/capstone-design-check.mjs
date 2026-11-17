import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { parseAst } from 'rolldown/parseAst'

const git = (...args) => execFileSync('git', ['-c', `safe.directory=${process.cwd().replaceAll('\\', '/')}`, ...args], { encoding: 'utf8' })
const baseline = '0a337ca54596259487e72103ca21e10e95e3ff37'
const file = 'src/app-screens/problem/ProblemPreview.tsx'
// All ordinary screen/component/style/asset sources must remain byte-equivalent
// apart from Git newline normalization. Only the request handler may differ.
const changed = git('diff', '--name-only', baseline, '--', 'src/app-screens', 'src/components', 'src/styles', 'src/solutions', 'public')
  .trim().split('\n').filter(Boolean)
if (changed.some(path => path !== file)) throw Error('Unexpected screen/style/asset changes: ' + changed.join(', '))
function markup(source) {
  const ast = parseAst(source, { lang: 'tsx' }, file)
  const values = []
  const visit = node => {
    if (!node || typeof node !== 'object') return
    if (node.type === 'JSXAttribute' && /^on[A-Z]/.test(node.name.name)) return
    if (node.type === 'JSXText') values.push(['text', node.value.replace(/\s+/g, ' ').trim()])
    if (node.type === 'JSXIdentifier') values.push(['identifier', node.name])
    if (node.type === 'JSXAttribute') values.push(['attribute', source.slice(node.start, node.end).replace(/\r\n/g, '\n')])
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit)
      else if (value && typeof value === 'object') visit(value)
    }
  }
  visit(ast)
  return JSON.stringify(values)
}
for (const path of [file, 'src/youtube/YoutubePreview.tsx']) {
  if (markup(git('show', `${baseline}:${path}`)) !== markup(readFileSync(path, 'utf8'))) throw Error('Screen markup or display text changed: ' + path)
}
console.log(JSON.stringify({ visualSourcesUnchanged: true, problemMarkupAndCopyUnchanged: true,
  scope: 'source preservation against main baseline; not a full rendered Figma pixel comparison' }))

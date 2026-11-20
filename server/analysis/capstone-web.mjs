import { readFileSync, realpathSync } from 'node:fs'
import { resolve, relative, extname } from 'node:path'

const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.woff2':'font/woff2', '.woff':'font/woff', '.gif':'image/gif' }
/** Built public files only; never repository/server files or source maps. */
export function createCapstoneWebHandler(root = resolve('dist-capstone')) {
  return (req, res) => {
    let path
    try { path = decodeURIComponent((req.url ?? '').split('?')[0]) } catch { return false }
    const file = path === '/' || path === '/capstone.html' ? 'capstone.html' : /^\/(assets|components|fonts|icons)\//.test(path) ? path.slice(1) : null
    if (!file || !/^[\w./-]+$/.test(file) || file.split('/').some(part => part.startsWith('.')) || !types[extname(file)]) return false
    const headers = { 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'no-referrer', 'Cache-Control':'no-cache' }
    if (!['GET','HEAD'].includes(req.method)) { req.resume(); res.writeHead(405, headers); res.end(); return true }
    try {
      const base = realpathSync(root), full = realpathSync(resolve(base, file)), within = relative(base, full)
      if (within.startsWith('..') || resolve(base, within) !== full) return false
      const data = readFileSync(full)
      res.writeHead(200, { ...headers, 'Content-Type':types[extname(file)], 'Content-Length':data.length })
      res.end(req.method === 'HEAD' ? undefined : data)
    } catch { res.writeHead(404, headers); res.end('Not found') }
    return true
  }
}

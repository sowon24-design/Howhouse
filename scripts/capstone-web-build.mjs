import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
const host = process.env.RENDER_EXTERNAL_HOSTNAME
if (!/^[a-z0-9][a-z0-9-]+\.onrender\.com$/.test(host ?? '')) throw Error('An exact Render hostname is required for the capstone web build.')
const root = resolve(import.meta.dirname, '..')
const result = spawnSync(process.execPath, ['node_modules/vite/bin/vite.js','build','--config','vite.capstone.config.ts','--mode','capstone','--configLoader','runner'], {
  cwd:root, stdio:'inherit', env:{ ...process.env, VITE_CAPSTONE_API_BASE_URL:`https://${host}` },
})
process.exitCode = result.status ?? 1

import { existsSync, writeFileSync } from 'node:fs'
import { capstoneServerOptions } from './capstone-server.mjs'
import { runConnectionCheck } from '../server/analysis/verify-openai.mjs'

// A single explicit diagnostic request, never a photo/user-input upload or retry.
const receipt = new URL('./capstone-provider-check.local', import.meta.url)
try {
  const config = capstoneServerOptions(process.argv.slice(2)).config
  if (!process.argv.includes('--send-once')) {
    console.log(JSON.stringify({ configured: true, model: config.model, processingRegion: config.processingRegion, paidRequestSent: false }))
  } else {
    if (existsSync(receipt)) throw Error('already-attempted')
    writeFileSync(receipt, JSON.stringify({ attempted: true, at: new Date().toISOString() }), { flag: 'wx', mode: 0o600 })
    const result = await runConnectionCheck(config)
    const report = { success: result.success, model: result.model, processingRegion: config.processingRegion,
      httpStatus: result.httpStatus ?? (result.success ? 200 : undefined), issue: result.issue,
      usage: result.usage, paidRequestSent: true, automaticRetry: false }
    writeFileSync(receipt, JSON.stringify(report, null, 2))
    console.log(JSON.stringify(report))
    if (!result.success) process.exitCode = 1
  }
} catch {
  console.error('Capstone provider check not started or already attempted. Check local configuration; no credentials are printed.')
  process.exitCode = 1
}

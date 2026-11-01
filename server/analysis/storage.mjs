import { openSync, closeSync, writeFileSync, renameSync, unlinkSync, existsSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

/** Fail before listening if billing reservations or encrypted cache cannot be saved. */
export function checkLocalStorage(ledgerPath, cachePath, io = { openSync, closeSync, writeFileSync, renameSync, unlinkSync, existsSync }) {
  const directory = dirname(cachePath instanceof URL ? fileURLToPath(cachePath) : cachePath)
  const probe = join(directory, `storage-check-${randomUUID()}.tmp.local`)
  const moved = `${probe}.renamed.local`
  try {
    // Opening for append checks permission without altering existing call history.
    io.closeSync(io.openSync(ledgerPath, 'a', 0o600))
    io.writeFileSync(probe, '', { flag: 'wx', mode: 0o600 })
    io.renameSync(probe, moved)
  } catch {
    throw new Error('analysis-storage-unavailable')
  } finally {
    for (const path of [probe, moved]) {
      if (io.existsSync(path)) io.unlinkSync(path)
    }
  }
}

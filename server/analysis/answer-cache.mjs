import { createHash, createHmac, randomBytes, createCipheriv, createDecipheriv } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync, renameSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/** Exact full input only. No raw text, photos, or hashes suitable for dictionary lookup on disk. */
export function inputFingerprint(input, context, secret) {
  const text = input.text.trim().normalize('NFC')
  const photos = input.photos.map(p => ({ type: p.type, sha256: createHash('sha256').update(p.bytes).digest('hex') }))
  const dated = /오늘|어제|내일|방금|지금/.test(text) ? new Date((context.now ?? Date.now()) + 9 * 60 * 60 * 1000).toISOString().slice(0, 10) : null
  return createHmac('sha256', secret).update(JSON.stringify({ ...context, now: undefined, dated, text, photos })).digest('hex')
}

/** Single local developer machine only. Shared/public deployment needs user isolation. */
export function createAnswerCache({ path, keyPath, now = Date.now, maxEntries = 100, ttlMs = 7 * 86400000 }) {
  if (path instanceof URL) path = fileURLToPath(path)
  if (!existsSync(keyPath)) writeFileSync(keyPath, randomBytes(32), { flag: 'wx', mode: 0o600 })
  const key = readFileSync(keyPath)
  if (key.length !== 32) throw new Error('Invalid cache key')
  let entries = new Map()
  if (existsSync(path)) {
    try {
      const record = JSON.parse(readFileSync(path, 'utf8'))
      const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(record.iv, 'base64'))
      decipher.setAuthTag(Buffer.from(record.tag, 'base64'))
      const plain = Buffer.concat([decipher.update(Buffer.from(record.data, 'base64')), decipher.final()])
      entries = new Map(JSON.parse(plain.toString('utf8')))
    } catch { entries = new Map() } // Corruption is a cache miss, never an answer.
  }
  function persist() {
    const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', key, iv)
    const data = Buffer.concat([cipher.update(JSON.stringify([...entries]), 'utf8'), cipher.final()])
    const record = { iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), data: data.toString('base64') }
    const temp = `${path}.tmp.local`
    writeFileSync(temp, JSON.stringify(record), { mode: 0o600 })
    renameSync(temp, path)
  }
  return {
    key: (input, context) => inputFingerprint(input, { ...context, now: now() }, key),
    get(id) {
      const entry = entries.get(id)
      if (!entry || !Number.isFinite(entry.at) || now() - entry.at > ttlMs || now() < entry.at) return undefined
      return structuredClone(entry.result)
    },
    set(id, result) {
      for (const [k, e] of entries) if (now() - e.at > ttlMs) entries.delete(k)
      entries.delete(id); entries.set(id, { at: now(), result: structuredClone(result) })
      while (entries.size > maxEntries) entries.delete(entries.keys().next().value)
      persist()
    },
  }
}

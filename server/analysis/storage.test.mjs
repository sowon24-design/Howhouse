import test from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { checkLocalStorage } from './storage.mjs'

test('startup storage check preserves billing/cache data and removes its own probes', () => {
  const dir = fs.mkdtempSync(join(tmpdir(), 'howhouse-storage-'))
  try {
    const ledger = join(dir, 'calls.local'), cache = join(dir, 'answers.local')
    fs.writeFileSync(ledger, '{"state":"reserved"}\n')
    fs.writeFileSync(cache, 'encrypted existing answers')
    checkLocalStorage(ledger, cache)
    assert.equal(fs.readFileSync(ledger, 'utf8'), '{"state":"reserved"}\n')
    assert.equal(fs.readFileSync(cache, 'utf8'), 'encrypted existing answers')
    assert.deepEqual(fs.readdirSync(dir).sort(), ['answers.local', 'calls.local'])
  } finally { fs.rmSync(dir, { recursive: true }) }
})

test('unwritable billing history stops startup without writing a cache probe or exposing paths', () => {
  let writes = 0
  assert.throws(() => checkLocalStorage('calls.local', 'answers.local', {
    ...fs, openSync() { throw new Error('EPERM private/path') },
    writeFileSync() { writes++ }, existsSync() { return false },
  }), { message: 'analysis-storage-unavailable' })
  assert.equal(writes, 0)
})

test('failed cache rename cleans the probe and fails startup', () => {
  const dir = fs.mkdtempSync(join(tmpdir(), 'howhouse-storage-'))
  try {
    const ledger = join(dir, 'calls.local')
    assert.throws(() => checkLocalStorage(ledger, join(dir, 'answers.local'), {
      ...fs, renameSync() { throw new Error('EPERM') },
    }), { message: 'analysis-storage-unavailable' })
    assert.deepEqual(fs.readdirSync(dir), ['calls.local'])
  } finally { fs.rmSync(dir, { recursive: true }) }
})

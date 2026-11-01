import test from 'node:test'
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { createTrialStore } from './trial-store.mjs'

const owner = '11111111-1111-4111-8111-111111111111', other = '22222222-2222-4222-8222-222222222222'
const config = { supabaseUrl: 'https://project.supabase.co', secretKey: 'sb_secret_mock', encryptionKey: randomBytes(32).toString('base64') }

test('hosted answer data is encrypted, identity-bound, expiring and stable across server restart', async () => {
  const rows = new Map(), requests = []
  let time = 1000000
  const fetchImpl = async (target, options) => {
    const url = new URL(target); requests.push({ url, options })
    assert.equal(options.headers.apikey, config.secretKey)
    assert.equal(options.headers.Authorization, undefined) // New secret keys are apikey values, not user JWTs.
    if (options.method === 'POST') {
      const body = JSON.parse(options.body)
      rows.set(body.p_owner, { encrypted_value: body.p_value, expires_at: new Date(time + 7 * 86400000).toISOString() })
      return Response.json(null)
    }
    return Response.json(rows.has(url.searchParams.get('owner_id')?.slice(3)) ? [rows.get(url.searchParams.get('owner_id').slice(3))] : [])
  }
  const store = createTrialStore({ ...config, fetchImpl, now: () => time })
  const alice = store.forUser(owner), bob = store.forUser(other)
  const input = { text: 'private original text', photos: [] }, context = { model: 'test' }
  const key = alice.cache.key(input, context), result = { source: 'generated', solution: { title: 'private answer' } }
  assert.notEqual(key, bob.cache.key(input, context))
  await alice.cache.set(key, result)
  assert.ok(!JSON.stringify([...rows]).includes('private answer'))
  assert.ok(!JSON.stringify(requests).includes('private original text'))
  const reopened = createTrialStore({ ...config, fetchImpl, now: () => time }).forUser(owner)
  assert.deepEqual(await reopened.cache.get(key), result)
  assert.equal(await bob.cache.get(key), undefined)
  rows.set(other, rows.get(owner)) // Even swapping ciphertext between owners fails authentication.
  assert.equal(await bob.cache.get(key), undefined)
  time += 7 * 86400000 + 1
  assert.equal(await reopened.cache.get(key), undefined)
})

test('trial ledger records calls without applying the PC ten-call protection quota', async () => {
  const bodies = []
  const store = createTrialStore({ ...config, fetchImpl: async (_url, options) => {
    bodies.push(JSON.parse(options.body)); return new Response(null, { status: 204 })
  } })
  const ledger = store.forUser(owner).ledger
  for (let i = 0; i < 15; i++) await ledger.reserve(`11111111-1111-4111-8111-${String(i).padStart(12, '0')}`)
  assert.equal(ledger.remaining(), null); assert.equal(bodies.length, 15)
  assert.ok(bodies.every(row => row.owner_id === owner && row.state === 'reserved'))
})

test('database errors fail closed; invalid subject and request IDs are refused', async () => {
  const store = createTrialStore({ ...config, fetchImpl: async () => new Response('private provider diagnostics', { status: 503 }) })
  await assert.rejects(store.check(), { message: 'trial-storage-unavailable' })
  assert.throws(() => store.forUser('not-a-uuid'))
  await assert.rejects(store.forUser(owner).ledger.reserve('not-a-uuid'))
})

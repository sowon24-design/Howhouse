import test from 'node:test'
import assert from 'node:assert/strict'
import { createTrialAccess } from './trial-access.mjs'

const id = '11111111-1111-4111-8111-111111111111'
const config = { supabaseUrl: 'https://project.supabase.co', publishableKey: 'sb_publishable_test', allowedUserIds: [id] }
const bearer = 'Bearer test-only-user-token-not-an-openai-key'
const user = { id, role: 'authenticated', email_confirmed_at: '2026-11-01T00:00:00Z', is_anonymous: false }

test('trial access requires HTTPS and the appropriate auth key before server exposure', () => {
  assert.throws(() => createTrialAccess({ ...config, supabaseUrl: 'http://project.supabase.co' }))
  assert.throws(() => createTrialAccess({ ...config, publishableKey: 'sb_secret_do-not-use-in-client' }))
})

test('trial access verifies the user remotely and returns only the allowed ID, with no OpenAI call', async () => {
  let calls = 0
  const authenticate = createTrialAccess({ ...config, fetchImpl: async (url, options) => {
    calls++; assert.equal(url, 'https://project.supabase.co/auth/v1/user')
    assert.equal(options.headers.Authorization, bearer)
    assert.equal(options.headers.apikey, config.publishableKey)
    assert.equal(options.body, undefined); assert.equal(options.redirect, 'error')
    return Response.json(user)
  } })
  for (let i = 0; i < 15; i++) assert.deepEqual(await authenticate(bearer), { id })
  assert.equal(calls, 15) // No arbitrary 10-call/day trial limit.
})

test('all app users including anonymous sessions are allowed; invalid and expired access is refused', async () => {
  let calls = 0
  const authenticate = createTrialAccess({ ...config, fetchImpl: async () => { calls++; return Response.json(user) } })
  await assert.rejects(authenticate(undefined), { code: 'auth-required' }); assert.equal(calls, 0)
  for (const candidate of [{ ...user, id: 'invalid' }, { ...user, email_confirmed_at: null }]) {
    await assert.rejects(createTrialAccess({ ...config, fetchImpl: async () => Response.json(candidate) })(bearer), { code: 'auth-required' })
  }
  for (const candidate of [{ ...user, id: '22222222-2222-4222-8222-222222222222' }, { ...user, is_anonymous: true, email_confirmed_at: null }]) {
    assert.equal((await createTrialAccess({ ...config, fetchImpl: async () => Response.json(candidate) })(bearer)).id, candidate.id)
  }
  await assert.rejects(createTrialAccess({ ...config, fetchImpl: async () => new Response('', { status: 401 }) })(bearer), { code: 'auth-required' })
})

test('auth service failure is closed, is not retried, and never exposes provider details', async () => {
  let calls = 0
  const authenticate = createTrialAccess({ ...config, fetchImpl: async () => { calls++; throw Error('private diagnostics') } })
  await assert.rejects(authenticate(bearer), { code: 'api-error', message: 'api-error' }); assert.equal(calls, 1)
})

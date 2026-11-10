import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'

const source = readFileSync(new URL('./app-session.ts', import.meta.url), 'utf8')
  .replace("from './client'", `from '${new URL('./client.ts', import.meta.url).href}'`)
const { createAppSession } = await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source)).toString('base64')}`)
const settings = { url: 'https://project.supabase.co', publishableKey: 'sb_publishable_public-test-value' }
const signal = () => new AbortController().signal
const tokens = { access_token: 'mock-user-access-token', refresh_token: 'mock-user-refresh-token', expires_in: 3600 }

test('app creates anonymous session without login, password, OpenAI key or analysis call, then reuses it', async () => {
  const saved = new Map(), calls = []
  const storage = { getItem: k => saved.get(k), setItem: (k, v) => saved.set(k, v), removeItem: k => saved.delete(k) }
  const fetchImpl = async (url, options) => {
    calls.push(url); assert.equal(url, 'https://project.supabase.co/auth/v1/signup')
    assert.deepEqual(JSON.parse(options.body), { data: {} }); assert.equal(options.headers.apikey, settings.publishableKey)
    return Response.json(tokens)
  }
  const auth = createAppSession({ ...settings, storage, fetchImpl })
  assert.equal(await auth(signal()), tokens.access_token)
  assert.equal(await auth(signal()), tokens.access_token)
  const reopened = createAppSession({ ...settings, storage, fetchImpl })
  assert.equal(await reopened(signal()), tokens.access_token)
  assert.equal(calls.length, 1)
})

test('expiry refreshes the same session rather than creating another anonymous account', async () => {
  let time = 0; const calls = []
  const auth = createAppSession({ ...settings, now: () => time, fetchImpl: async (url, options) => {
    calls.push(url)
    if (calls.length === 2) assert.deepEqual(JSON.parse(options.body), { refresh_token: tokens.refresh_token })
    return Response.json(tokens)
  } })
  await auth(signal()); time = 3600000; await auth(signal())
  assert.deepEqual(calls, ['https://project.supabase.co/auth/v1/signup', 'https://project.supabase.co/auth/v1/token?grant_type=refresh_token'])
})

test('auth errors are not retried and network failure is separate from account settings', async () => {
  let calls = 0
  const auth = createAppSession({ ...settings, fetchImpl: async () => { calls++; return new Response('private details', { status: 422 }) } })
  await assert.rejects(auth(signal()), e => e.failure.code === 'auth-required' && !e.message.includes('private details'))
  assert.equal(calls, 1)
  const offline = createAppSession({ ...settings, fetchImpl: async () => { throw new TypeError('private network details') } })
  await assert.rejects(offline(signal()), e => e.failure.code === 'connection-error')
})

test('secret keys and cancelled starts are rejected before transmission', async () => {
  assert.throws(() => createAppSession({ ...settings, publishableKey: 'sb_secret_server-only' }))
  assert.throws(() => createAppSession({ ...settings, url: 'http://project.supabase.co' }))
  let calls = 0
  const auth = createAppSession({ ...settings, fetchImpl: async () => { calls++; return Response.json(tokens) } })
  const controller = new AbortController(); controller.abort()
  await assert.rejects(auth(controller.signal), { name: 'AbortError' }); assert.equal(calls, 0)
})

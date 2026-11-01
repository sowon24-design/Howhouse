import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID, createDecipheriv } from 'node:crypto'
import { createAnalysisServer } from './server.mjs'
import { validateFeedback, FeedbackError } from './feedback.mjs'
import { createFeedbackStore, readFeedbackRetention } from './feedback-store.mjs'
import { MatchError } from './matcher.mjs'

const owner = '11111111-1111-4111-8111-111111111111'
const requestId = '22222222-2222-4222-8222-222222222222'
const catalog = { cases: [{ id: '욕실·수도:1' }], serialized: '[]', version: 'a'.repeat(64) }
const results = [{ source: 'existing', caseId: '욕실·수도:1' }, { source: 'generated', resultId: `generated:${requestId}` }]
const errorCode = code => error => error instanceof FeedbackError && error.code === code
const storeOptions = { supabaseUrl: 'https://project.supabase.co', secretKey: 'sb_secret_mock',
  encryptionKey: Buffer.alloc(32, 7).toString('base64'), retentionDays: 30 }

test('feedback has no assumed retention period; invalid settings cannot enable storage', () => {
  assert.equal(readFeedbackRetention({}), undefined)
  assert.equal(readFeedbackRetention({ FEEDBACK_RETENTION_DAYS: '30' }), 30) // Test fixture, not product policy.
  for (const value of ['0', '-1', 'forever', '1.5', ' 30', '4000']) assert.throws(() => readFeedbackRetention({ FEEDBACK_RETENTION_DAYS: value }))
  assert.throws(() => createFeedbackStore({ ...storeOptions, retentionDays: undefined }))
})

for (const result of results) {
  test(`${result.source}: rating set/clear/switch and independent single-reason opinions`, () => {
    for (const rating of ['like', 'dislike', null]) {
      const data = validateFeedback('rating', { result, operationId: randomUUID(), revision: 3, rating }, catalog)
      assert.equal(data.rating, rating); assert.equal(data.revision, 3)
    }
    assert.equal(validateFeedback('state', { result }, catalog).target.startsWith(result.source + ':'), true)
    const opinion = validateFeedback('opinions', { result, operationId: randomUUID(), reason: 'custom', text: '  검토가 필요해요.  ' }, catalog)
    assert.equal(opinion.text, '검토가 필요해요.'); assert.equal(Object.hasOwn(opinion, 'rating'), false)
    for (const text of ['', ' \n\t　', '\u200b\u2060', 'x'.repeat(2001)]) {
      assert.throws(() => validateFeedback('opinions', { result, operationId: randomUUID(), reason: 'custom', text }, catalog), errorCode('invalid-input'))
    }
    assert.throws(() => validateFeedback('opinions', { result, operationId: randomUUID(), reason: ['unsafe-method','too-difficult'] }, catalog), errorCode('invalid-input'))
    assert.throws(() => validateFeedback('opinions', { result, operationId: randomUUID(), reason: 'unsafe-method', text: 'extra' }, catalog), errorCode('invalid-input'))
    assert.throws(() => validateFeedback('rating', { result, operationId: randomUUID(), revision: 0, rating: 'like' }, catalog), errorCode('invalid-input'))
    for (const extra of ['ownerId','name','phone','photos','analysisUserText','message']) {
      assert.throws(() => validateFeedback('state', { result, [extra]: 'unexpected' }, catalog), errorCode('invalid-input'))
    }
  })
}

test('existing IDs must exist; generated IDs cannot be passed off as an existing case', () => {
  assert.throws(() => validateFeedback('state', { result: { source: 'existing', caseId: '없는분야:999' } }, catalog), errorCode('case-not-found'))
  assert.throws(() => validateFeedback('state', { result: { source: 'existing', caseId: `generated:${requestId}` } }, catalog), errorCode('case-not-found'))
  assert.throws(() => validateFeedback('state', { result: { source: 'generated', resultId: 'generated:sample' } }, catalog), errorCode('invalid-input'))
})

test('custom opinion is encrypted; retries have a stable keyed fingerprint and no raw comment leaves for DB', async () => {
  const bodies = [], operationId = randomUUID(), payload = { target: 'existing:욕실·수도:1', operationId, reason: 'custom', text: '의견 테스트 본문' }
  const store = createFeedbackStore({ ...storeOptions, fetchImpl: async (url, options) => {
    assert.match(url, /rpc\/howhouse_feedback$/); assert.equal(options.headers.apikey, storeOptions.secretKey)
    assert.equal(options.redirect, 'error'); assert.equal(options.body.includes(payload.text), false)
    bodies.push(JSON.parse(options.body)); return Response.json({ ok: true, data: { saved: true, operationId } })
  } })
  await store.execute(owner, 'opinions', payload); await store.execute(owner, 'opinions', payload)
  assert.equal(bodies[0].p_hash, bodies[1].p_hash)
  assert.notEqual(bodies[0].p_payload.comment.iv, bodies[1].p_payload.comment.iv)
  const record = bodies[0].p_payload.comment
  const decipher = createDecipheriv('aes-256-gcm', Buffer.from(storeOptions.encryptionKey, 'base64'), Buffer.from(record.iv, 'base64'))
  decipher.setAAD(Buffer.from(`${owner}:${operationId}:${payload.target}`)); decipher.setAuthTag(Buffer.from(record.tag, 'base64'))
  assert.equal(Buffer.concat([decipher.update(Buffer.from(record.data, 'base64')), decipher.final()]).toString(), payload.text)
})

test('storage failures, stale updates, conflicting retry IDs and missing result proof never return success', async () => {
  for (const code of ['stale-selection', 'idempotency-conflict', 'result-unavailable', 'feedback-not-configured']) {
    const store = createFeedbackStore({ ...storeOptions, fetchImpl: async () => Response.json({ ok: false, code }) })
    await assert.rejects(store.execute(owner, 'state', { target: `generated:${requestId}` }), errorCode(code))
  }
  for (const fetchImpl of [async () => { throw Error('private database error') }, async () => new Response('private error', { status: 503 }), async () => Response.json({ ok: true })]) {
    const store = createFeedbackStore({ ...storeOptions, fetchImpl })
    await assert.rejects(store.execute(owner, 'state', { target: results[0].caseId }), errorCode('storage-unavailable'))
  }
})

test('HTTP feedback uses verified user, bounds input and reports persistence failures; disabled policy keeps analysis working', async t => {
  let rejectStorage = false, latestOwner, registrations = 0
  const trial = { host: 'test', origins: ['https://localhost'], authenticate: async header => {
    if (header !== 'Bearer owner') throw new MatchError('auth-required'); return { id: owner }
  }, forUser: () => ({ ledger: { remaining: () => null, reserve() {}, finish() {} } }) }
  const server = createAnalysisServer({ config: { apiKey: 'mock', model: 'gpt-6.1-terra' }, catalog, trial,
    matchImpl: async () => ({ result: { source: 'existing', caseId: results[0].caseId } }),
    feedbackStore: { execute: async (user, kind, body) => { latestOwner=user; if(rejectStorage)throw new FeedbackError('storage-unavailable'); return { saved: true, operationId: body.operationId } },
      recordResult: async () => { registrations++ } } })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); t.after(() => new Promise(resolve => server.close(resolve)))
  const base = `http://127.0.0.1:${server.address().port}`; trial.host = new URL(base).host
  const headers = { Origin: 'https://localhost', Authorization: 'Bearer owner', 'Content-Type': 'application/json' }
  const body = { result: results[0], operationId: randomUUID(), revision: 1, rating: 'like' }
  assert.equal((await fetch(`${base}/api/feedback/rating`, { method:'POST',headers,body:JSON.stringify(body) })).status, 200)
  assert.equal(latestOwner, owner)
  assert.equal((await fetch(`${base}/api/feedback/rating`, { method:'POST',headers:{...headers,Authorization:'Bearer other'},body:JSON.stringify(body) })).status, 401)
  assert.equal((await fetch(`${base}/api/feedback/rating`, { method:'POST',headers,body:'x'.repeat(13000) })).status, 422)
  rejectStorage=true
  const failed = await fetch(`${base}/api/feedback/rating`, { method:'POST',headers,body:JSON.stringify(body) })
  assert.equal(failed.status,503); assert.deepEqual(await failed.json(),{code:'storage-unavailable'})
  const session = await (await fetch(`${base}/session`,{headers})).json()
  const form=new FormData(); form.set('requestId',randomUUID());form.set('catalogVersion',catalog.version);form.set('analysisUserText','mock')
  const response=await fetch(`${base}/api/analysis/match`,{method:'POST',headers:{Origin:headers.Origin,Authorization:headers.Authorization,'X-Howhouse-Session':session.token},body:form})
  assert.equal(response.status,200);assert.equal((await response.json()).feedbackAvailable,true);assert.equal(registrations,1)
})

test('unconfigured feedback returns 503 without accepting or pretending to save an opinion', async t => {
  const trial={host:'test',origins:['https://localhost'],authenticate:async()=>({id:owner}),forUser:()=>({ledger:{remaining:()=>null}})}
  const server=createAnalysisServer({config:{apiKey:'mock',model:'gpt-6.1-terra'},catalog,trial})
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>server.close(resolve)))
  const base=`http://127.0.0.1:${server.address().port}`;trial.host=new URL(base).host
  const response=await fetch(`${base}/api/feedback/opinions`,{method:'POST',headers:{Origin:'https://localhost',Authorization:'Bearer owner'}})
  assert.equal(response.status,503);assert.deepEqual(await response.json(),{code:'feedback-not-configured'})
  assert.equal((await fetch(`${base}/health`)).status,200)
})

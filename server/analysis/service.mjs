import { randomBytes, createHash } from 'node:crypto'
import { inputFingerprint } from './answer-cache.mjs'
import { analysisVersion, matchingInstructions, MatchError, matchCase } from './matcher.mjs'
import { generatedContentSchema, isGeneratedContent } from '../../src/analysis/solution.ts'
import { analysisTimeoutMs, runWithDeadline } from '../../src/analysis/deadline.ts'

export function validSavedResult(result, catalog) {
  return result?.source === 'existing' ? catalog.cases.some(c => c.id === result.caseId)
    : result?.source === 'generated' && isGeneratedContent(result.solution)
}

/** Cache before billing; coalesce identical in-flight input; abort only after last viewer leaves. */
export function createAnalysisService({ config, catalog, ledger, cache, matchImpl = matchCase, deadlineScheduler }) {
  const jobs = new Map(), secret = randomBytes(32)
  const context = { model: config.model, ...(config.processingRegion==='us'?{processingRegion:'us'}:{}), catalogVersion: catalog.version, analysisVersion,
    promptHash: createHash('sha256').update(matchingInstructions + JSON.stringify(generatedContentSchema)).digest('hex') }
  return async function analyze(input, { requestId, signal }) {
    if (signal.aborted) throw signal.reason
    const key = cache ? cache.key(input, context) : inputFingerprint(input, context, secret)
    let saved
    try { saved = await cache?.get(key) }
    catch { throw new MatchError('api-error', 'answer-read-failed') }
    if (validSavedResult(saved, catalog)) return { result: saved, reuse: 'saved' }
    let job = jobs.get(key)
    const joined = !!job
    if (job?.controller.signal.aborted || !job && jobs.size > 0) throw new MatchError('server-busy')
    if (!job) {
      const controller = new AbortController()
      job = { controller, viewers: 0, promise: null }
      jobs.set(key, job)
      job.promise = Promise.resolve().then(async () => {
        if (controller.signal.aborted) throw controller.signal.reason
        try { await ledger.reserve(requestId) }
        catch (error) { if (error instanceof MatchError) throw error; throw new MatchError('api-error', 'call-reserve-failed') }
        try {
          if (controller.signal.aborted) throw controller.signal.reason
          const { result, usage } = await runWithDeadline(
            signal => matchImpl({ ...config, catalog, text: input.text, photos: input.photos, signal }),
            { signal: controller.signal, timeoutMs: analysisTimeoutMs,
              timeoutError: () => new MatchError('analysis-timeout'), schedule: deadlineScheduler },
          )
          if (!validSavedResult(result, catalog)) throw new MatchError('api-error')
          try { await ledger.finish(requestId, controller.signal.aborted ? 'cancelled' : 'completed', usage) }
          catch { throw new MatchError('api-error', 'call-finish-failed') }
          if (!controller.signal.aborted) { try { await cache?.set(key, result) } catch { /* Return paid answer even if cache storage fails. */ } }
          return result
        } catch (error) {
          try { await ledger.finish(requestId, controller.signal.aborted ? 'cancelled' : 'failed', error instanceof MatchError ? error.usage : undefined) } catch { /* Reservation remains. */ }
          throw error
        } finally { jobs.delete(key) }
      })
      // Subscribers own error delivery; an immediate cancellation must not create an unhandled rejection.
      job.promise.catch(() => {}).finally(() => { if (jobs.get(key) === job) jobs.delete(key) })
    }
    const current = job
    return new Promise((resolve, reject) => {
      let done = false
      current.viewers++
      const detach = () => { signal.removeEventListener('abort', cancel); current.viewers-- }
      const cancel = () => {
        if (done) return
        done = true; detach()
        if (!current.viewers) current.controller.abort()
        reject(signal.reason)
      }
      signal.addEventListener('abort', cancel, { once: true })
      if (signal.aborted) cancel()
      current.promise.then(result => {
        if (done) return
        done = true; detach(); resolve({ result: structuredClone(result), reuse: joined ? 'in-flight' : 'new' })
      }, error => { if (!done) { done = true; detach(); reject(error) } })
    })
  }
}

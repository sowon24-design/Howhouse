/** User-approved limit; applies to the whole browser request and the server model job. */
export const analysisTimeoutMs = 90_000
export type DeadlineScheduler = (expire: () => void, milliseconds: number) => () => void
const scheduleDeadline: DeadlineScheduler = (expire, milliseconds) => {
  const timer = setTimeout(expire, milliseconds)
  return () => clearTimeout(timer)
}

/** Resolve once; an uncooperative late response never escapes after timeout/cancellation. */
export function runWithDeadline<T>(operation: (signal: AbortSignal) => Promise<T>, options: {
  signal: AbortSignal; timeoutMs: number; timeoutError: () => Error; schedule?: DeadlineScheduler
}): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (options.signal.aborted) { reject(options.signal.reason); return }
    const controller = new AbortController()
    let settled = false, cancelTimer = () => {}
    function cleanup() { cancelTimer(); options.signal.removeEventListener('abort', cancel) }
    function fail(error: unknown) {
      if (settled) return
      settled = true; cleanup(); reject(error); controller.abort(error)
    }
    function cancel() { fail(options.signal.reason) }
    options.signal.addEventListener('abort', cancel, { once: true })
    cancelTimer = (options.schedule ?? scheduleDeadline)(() => fail(options.timeoutError()), options.timeoutMs)
    if (options.signal.aborted) { cancel(); return }
    void Promise.resolve().then(() => {
      if (settled) return
      return operation(controller.signal)
    }).then(value => {
      if (settled) return
      settled = true; cleanup(); resolve(value as T)
    }, error => fail(error))
  })
}

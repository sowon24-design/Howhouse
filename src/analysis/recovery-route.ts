/** Keep the mounted screen and its in-memory draft stable while F02 covers it. */
export function createRecoveryRouteGuard(router: { readHash: () => string; replaceHash: (hash: string) => void }) {
  let snapshot: { hash: string } | undefined
  function restore() {
    if (snapshot && router.readHash() !== snapshot.hash) router.replaceHash(snapshot.hash)
  }
  return {
    freeze() { snapshot ??= { hash: router.readHash() } },
    intercept(event: Pick<Event, 'stopImmediatePropagation'>) {
      if (!snapshot) return
      // Stop App's hash listener before it can clear the draft or unmount B03.
      restore(); event.stopImmediatePropagation()
    },
    release() { restore(); snapshot = undefined },
  }
}

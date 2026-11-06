import { useEffect, useRef, useState } from 'react'
import { configuredAppSession } from './app-session'
import { resolveAnalysisBaseUrl } from './endpoint'
import { createFeedbackClient, feedbackErrorMessage, feedbackReasonCodes, feedbackTarget, FeedbackClientError } from './feedback-client'
import type { FeedbackRating } from './feedback-client'

export function useSolutionFeedback(source: string, id?: string) {
  const [rating, setRating] = useState<FeedbackRating>(null)
  const [loading, setLoading] = useState(true), [ratingPending, setRatingPending] = useState(false), [opinionPending, setOpinionPending] = useState(false)
  const [ratingError, setRatingError] = useState(''), [opinionError, setOpinionError] = useState('')
  const [ratingRetry, setRatingRetry] = useState(false)
  const client = useRef<ReturnType<typeof createFeedbackClient> | null>(null), alive = useRef(false)
  const ratingLock = useRef(false), opinionLock = useRef(false), desired = useRef<FeedbackRating>(null)
  useEffect(() => {
    let active = true; alive.current = true; setLoading(true); setRating(null); setRatingError(''); setOpinionError(''); setRatingRetry(false)
    let current: ReturnType<typeof createFeedbackClient> | undefined
    try {
      const target = feedbackTarget(source, id)
      if (!target) throw new FeedbackClientError('sample-result')
      const auth = configuredAppSession()
      if (!auth) throw new FeedbackClientError('feedback-not-configured')
      current = createFeedbackClient({ target, getAccessToken: auth, baseUrl: resolveAnalysisBaseUrl() }); client.current = current
      current.getState().then(state => { if (active) { desired.current = state.rating; setRating(state.rating) } })
        .catch(error => { if (active) setRatingError(feedbackErrorMessage(error)) }).finally(() => { if (active) setLoading(false) })
    } catch (error) { client.current = null; setRatingError(feedbackErrorMessage(error)); setLoading(false) }
    return () => { active = false; alive.current = false; current?.cancel(); client.current = null }
  }, [source, id])
  async function saveRating(value: FeedbackRating) {
    if (ratingLock.current) return
    desired.current = value; setRating(value); setRatingError(''); setRatingRetry(false)
    if (!client.current) { setRatingError(feedbackErrorMessage(new FeedbackClientError(feedbackTarget(source,id) ? 'feedback-not-configured' : 'sample-result'))); return }
    ratingLock.current = true; setRatingPending(true)
    try { await client.current.setRating(value) }
    catch (error) { if (alive.current) { setRatingError(feedbackErrorMessage(error)); setRatingRetry(true) } }
    finally { ratingLock.current = false; if (alive.current) setRatingPending(false) }
  }
  async function submitOpinion(reason: string, text: string): Promise<boolean> {
    if (opinionLock.current) return false
    setOpinionError('')
    const code = feedbackReasonCodes[reason]
    if (!code) { setOpinionError(feedbackErrorMessage(new FeedbackClientError('invalid-input'))); return false }
    if (!client.current) { setOpinionError(feedbackErrorMessage(new FeedbackClientError(feedbackTarget(source,id) ? 'feedback-not-configured' : 'sample-result'))); return false }
    opinionLock.current = true; setOpinionPending(true)
    try { await client.current.submitOpinion(code, text); return true }
    catch (error) { if (alive.current) setOpinionError(feedbackErrorMessage(error)); return false }
    finally { opinionLock.current = false; if (alive.current) setOpinionPending(false) }
  }
  return { rating, loading, ratingPending, ratingError, ratingRetry, opinionPending, opinionError,
    rate: (value: 'up' | 'down') => saveRating(desired.current === (value === 'up' ? 'like' : 'dislike') ? null : value === 'up' ? 'like' : 'dislike'),
    retryRating: () => saveRating(desired.current), submitOpinion }
}

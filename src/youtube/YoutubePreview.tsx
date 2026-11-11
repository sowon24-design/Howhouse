import { useEffect, useRef, useState } from 'react'
import { requestYoutubeImage, requestYoutubePreview, youtubeVideoId } from './preview-client'
import { youtubePreviewConfig } from './config'
import { readYoutubePrivacyAcceptance } from './privacy-acceptance'
import './source.css'
import youtubeIcon from './assets/youtube-icon-white.png'

type State = { image?: string; loading: boolean; failed: boolean }
const empty: State = { loading: false, failed: false }

/** Thumbnail-only design review. Release remains blocked pending attribution/privacy review. */
export function YoutubePreview({ url, externalIcon, onOpen }: { url: string; externalIcon: string; onOpen: (url: string) => void }) {
  const id = youtubeVideoId(url)
  const link = useRef<HTMLAnchorElement>(null)
  const imageUrl = useRef<string | undefined>(undefined)
  const [state, setState] = useState<State>(empty)
  const [accepted] = useState(() => { try { return readYoutubePrivacyAcceptance(localStorage) } catch { return false } })
  useEffect(() => {
    setState(empty)
    const config = youtubePreviewConfig()
    let active = true
    let inView = false
    let attempted = false
    let controller: AbortController | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    const clear = () => {
      controller?.abort()
      controller = undefined
      if (timer) clearTimeout(timer)
      timer = undefined
      if (imageUrl.current) URL.revokeObjectURL(imageUrl.current)
      imageUrl.current = undefined
    }
    const fail = () => { clear(); if (active) setState({ loading: false, failed: true }) }
    const load = async () => {
      if (!accepted || !id || !config || !active || attempted || document.hidden || !inView) return
      attempted = true
      const request = new AbortController()
      controller = request
      setState({ loading: true, failed: false })
      timer = setTimeout(fail, 10000)
      const result = await requestYoutubePreview(id, { ...config, privacyAccepted: accepted }, request.signal)
      if (!active || controller !== request || request.signal.aborted) return
      if (result.status !== 'ready') { fail(); return }
      const blob = await requestYoutubeImage(result.preview, request.signal)
      if (!active || controller !== request || request.signal.aborted) return
      if (!blob) { fail(); return }
      if (timer) clearTimeout(timer)
      timer = undefined
      controller = undefined
      imageUrl.current = URL.createObjectURL(blob)
      setState({ image: imageUrl.current, loading: false, failed: false })
    }
    const visibility = () => {
      if (document.hidden) { clear(); attempted = false; if (active) setState(empty) }
      else { void load() }
    }
    document.addEventListener('visibilitychange', visibility)
    let observer: IntersectionObserver | undefined
    if (typeof IntersectionObserver !== 'undefined' && link.current) {
      observer = new IntersectionObserver(entries => {
        inView = entries.some(entry => entry.isIntersecting)
        if (inView) { void load() }
      })
      observer.observe(link.current)
    } else { inView = true; void load() }
    return () => {
      active = false
      observer?.disconnect()
      document.removeEventListener('visibilitychange', visibility)
      clear()
    }
  }, [id, accepted])
  if (!id) return null
  return <div className="solutions-b02__video-container">
    <a ref={link} className="solutions-b02__video" href={url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer"
      aria-label="해결 방법 유튜브 영상 열기" aria-busy={state.loading || undefined} onClick={() => onOpen(url)}>
      {state.image && <img src={state.image} alt="해결 방법 유튜브 썸네일" onError={() => {
        if (imageUrl.current) URL.revokeObjectURL(imageUrl.current)
        imageUrl.current = undefined
        setState({ loading: false, failed: true })
      }}/>} 
      <span><img src={externalIcon} alt=""/></span>
    </a>
    <div className="hh-youtube-source">
      <a href={url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" aria-label="YouTube 영상 출처" onClick={() => onOpen(url)}>
        <img src={youtubeIcon} alt="YouTube"/>
      </a>
    </div>
  </div>
}

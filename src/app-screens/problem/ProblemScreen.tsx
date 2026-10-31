import { screenSlidesEnabled } from '../navigation-motion'
import { useCtaPositionMotion } from '../use-cta-position-motion'
import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ActionSheet, AddImage, Button, GNB, Photo } from '../../components/ui'
import './problem.css'
import { Capacitor } from '@capacitor/core'
import { photoErrorMessage, selectNativePhotos } from './native-photos'

export type AnalysisInput = { analysisUserText: string; analysisUserPhotos: File[] }
export const emptyInput = (): AnalysisInput => ({ analysisUserText: '', analysisUserPhotos: [] })
export const canAnalyze = (input: AnalysisInput) => Boolean(input.analysisUserText.trim() || input.analysisUserPhotos.length)

function AttachedPhoto({ file, index, onRemove }: { file: File; index: number; onRemove: () => void }) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const next = URL.createObjectURL(file)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [file])
  return url ? <Photo src={url} alt={`첨부 사진 ${index + 1}`} onRemove={onRemove} /> : null
}

export function ProblemScreen({ input, onChange, onBack, onAnalyze, onCapture }: {
  input: AnalysisInput
  onChange: (input: AnalysisInput) => void
  onBack: () => void
  onAnalyze: (input: AnalysisInput) => void
  onCapture: () => void
}) {
  const textarea = useRef<HTMLTextAreaElement>(null)
  const cta = useCtaPositionMotion<HTMLDivElement>()
  const picker = useRef<HTMLInputElement>(null)
  const photoKeys = useRef(new WeakMap<File, string>())
  const nextPhotoKey = useRef(0)
  const reduceMotion = useReducedMotion()
  const photoTransition = { duration: reduceMotion ? 0 : 0.32, ease: [0.4, 0, 0.2, 1] as const }
  function photoKey(file: File) {
    let key = photoKeys.current.get(file)
    if (!key) {
      key = `photo-${++nextPhotoKey.current}`
      photoKeys.current.set(file, key)
    }
    return key
  }
  const [sheet, setSheet] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [error, setError] = useState('')
  const [attaching, setAttaching] = useState(false)
  const busy = useRef(false)
  const alive = useRef(true)
  const latest = useRef({ input, onChange })
  latest.current = { input, onChange }
  useEffect(() => { alive.current = true; return () => { alive.current = false } }, [])
  async function attach(source: 'camera' | 'gallery') {
    setSheet(false)
    if (Capacitor.getPlatform() !== 'android') {
      if (source === 'camera') onCapture()
      else picker.current?.click()
      return
    }
    if (busy.current) return
    busy.current = true
    setAttaching(true)
    setError('')
    try {
      const files = await selectNativePhotos(source, 5 - latest.current.input.analysisUserPhotos.length)
      if (!alive.current || !files.length) return
      const current = latest.current.input
      if (current.analysisUserPhotos.length + files.length > 5) throw new Error('사진은 최대 5장까지 첨부할 수 있어요.')
      latest.current.onChange({ ...current, analysisUserPhotos: [...current.analysisUserPhotos, ...files] })
    } catch (error) {
      if (alive.current) setError(photoErrorMessage(error))
    } finally {
      busy.current = false
      if (alive.current) setAttaching(false)
    }
  }
  useLayoutEffect(() => {
    const node = textarea.current!
    node.style.height = '120px'
    node.style.height = `${Math.min(250, Math.max(120, node.scrollHeight))}px`
  }, [input.analysisUserText])
  const ready = canAnalyze(input) && !attaching
  return <main className={`hh-problem${leaving ? ' hh-problem--leaving' : ''}`} aria-label="문제 작성" inert={leaving}
    onAnimationEnd={event => {
      if (event.target === event.currentTarget && event.animationName === 'hh-problem-slide-out') onBack()
    }}>
    <GNB title="직접 문제 작성하기" onBack={() => {
      if (leaving) return
      if (!screenSlidesEnabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) onBack()
      else setLeaving(true)
    }} />
    <form className="hh-problem-content" onSubmit={event => {
      event.preventDefault()
      if (ready) onAnalyze({ ...input, analysisUserPhotos: [...input.analysisUserPhotos] })
    }}>
      <div className="hh-problem-fields">
        <div className="hh-problem-intro"><h1>어떤 문제가 생겼나요?</h1><p>문제가 생긴 곳과 증상을 편하게 작성해 주세요.</p></div>
        <div className="hh-problem-field">
          <label htmlFor="analysis-user-text">문제 상황</label>
          <textarea ref={textarea} id="analysis-user-text" placeholder="문제 상황을 자세히 작성해 주세요." value={input.analysisUserText}
            onChange={event => onChange({ ...input, analysisUserText: event.target.value })} />
        </div>
        <section className="hh-problem-field" aria-labelledby="photo-label">
          <h2 id="photo-label">사진 첨부하기 ({input.analysisUserPhotos.length}/5)</h2>
          <div className="hh-problem-photos">
            {input.analysisUserPhotos.length < 5 && <motion.div key="add-photo" layout="position" transition={{ layout: photoTransition }}><AddImage disabled={attaching} onClick={() => { if (!busy.current) setSheet(true) }} /></motion.div>}
            {input.analysisUserPhotos.map((file, index) => <motion.div key={photoKey(file)} layout="position" transition={{ layout: photoTransition }}>
              <AttachedPhoto file={file} index={index}
                onRemove={() => onChange({ ...input, analysisUserPhotos: input.analysisUserPhotos.filter((_, i) => i !== index) })} />
            </motion.div>)}
          </div>
          {error && <p role="alert" className="hh-problem-error">{error}</p>}
        </section>
      </div>
      <div ref={cta} className="hh-problem-next"><Button type="submit" disabled={!ready}>지금 해야 할 일 보러가기</Button></div>
    </form>
    <input ref={picker} type="file" accept="image/*" hidden aria-label="첨부할 사진 선택" onChange={event => {
      const file = event.target.files?.[0]
      event.target.value = ''
      if (!file) return
      if (!file.type.startsWith('image/')) { setError('사진 파일을 선택해 주세요.'); return }
      if (input.analysisUserPhotos.length >= 5) return
      setError('')
      onChange({ ...input, analysisUserPhotos: [...input.analysisUserPhotos, file] })
    }} />
    <ActionSheet open={sheet} onClose={() => setSheet(false)} label="사진 첨부 방법" cancelLabel="닫기" actions={[
      { id: 'camera', label: '사진 찍기', onClick: () => { void attach('camera') } },
      { id: 'gallery', label: '사진 보관함에서 선택하기', onClick: () => { void attach('gallery') } },
    ]} />
  </main>
}

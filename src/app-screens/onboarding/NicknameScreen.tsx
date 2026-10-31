import { useId, useRef, useState } from 'react'
import { useCtaPositionMotion } from '../use-cta-position-motion'
import { Button, GNB } from '../../components/ui'
import warning from './assets/nickname-warning.svg'
import './nickname.css'

export function isValidNickname(value: string) {
  return value.trim().length > 0 && Array.from(value).length <= 10 && /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9 ]+$/.test(value)
}

export function NicknameScreen({ onBack, onClose, onComplete, initialValue = '', mode = 'create' }: {
  onBack: () => void; onClose?: () => void; onComplete: (nickname: string) => void; initialValue?: string; mode?: 'create' | 'edit'
}) {
  const [value, setValue] = useState(initialValue)
  const cta = useCtaPositionMotion<HTMLElement>()
  const [composing, setComposing] = useState(false)
  const [spaceError, setSpaceError] = useState(false)
  const composingRef = useRef(false)
  const id = useId()
  const valid = isValidNickname(value)
  const changed = mode !== 'edit' || value.trim() !== initialValue.trim()
  const error = !composing && (spaceError || (value.length > 0 && !valid))
  function normalize() {
    const trimmed = value.trim()
    setSpaceError(value.length > 0 && trimmed.length === 0)
    setValue(trimmed)
    return trimmed
  }
  return <main className={`hh-nickname${mode === 'edit' ? ' hh-nickname--edit' : ''}`} aria-label="닉네임 설정">
    <GNB title="닉네임 설정" onBack={onBack} onClose={onClose} />
    <form className="hh-nickname-form" onSubmit={event => {
      event.preventDefault()
      if (composingRef.current) return
      const trimmed = normalize()
      if (isValidNickname(trimmed) && changed) onComplete(trimmed)
    }}>
      <div className="hh-nickname-content">
        <h1><label htmlFor={id}>{mode === 'edit' ? '닉네임' : '어떻게 불러드릴까요?'}</label></h1>
        <div className="hh-nickname-field" data-error={error}>
          <input id={id} aria-label="닉네임" autoFocus autoComplete="off" autoCapitalize="off" spellCheck={false}
            placeholder="닉네임을 입력해주세요" value={value} maxLength={composing ? undefined : 10}
            aria-invalid={error} aria-describedby={`${id}-count${error ? ` ${id}-error` : ''}`}
            onCompositionStart={() => { composingRef.current = true; setComposing(true) }}
            onCompositionEnd={event => { composingRef.current = false; setComposing(false); setValue(Array.from(event.currentTarget.value).slice(0, 10).join('')) }}
            onChange={event => { setSpaceError(false); setValue(composingRef.current ? event.target.value : Array.from(event.target.value).slice(0, 10).join('')) }}
            onBlur={() => { if (!composingRef.current) normalize() }} />
          <span id={`${id}-count`} className="hh-nickname-count">{Math.min(Array.from(value).length, 10)}/10</span>
        </div>
        <p id={`${id}-error`} className="hh-nickname-error" data-visible={error} aria-hidden={!error} role="alert"><span className="hh-nickname-warning" aria-hidden="true"><img src={warning} alt="" /></span><span>{spaceError || value.trim().length === 0 ? '공백만으로는 닉네임을 만들 수 없어요.' : '한글·영어·숫자와 띄어쓰기로 10자 이내로 입력해 주세요.'}</span></p>
      </div>
      <footer ref={cta} className="hh-nickname-next"><Button type="submit" disabled={!valid || !changed}>{mode === 'edit' ? '수정하기' : value.length === 0 ? '다음으로' : '시작하기'}</Button></footer>
    </form>
  </main>
}

import { Button } from '../../components/ui'
import { useEffect, useRef } from 'react'
import information from '../my/information-draft.json'
export type ConsentDocumentKind = 'service' | 'processing' | 'overseas'
export const consentTitles = { service: '서비스 이용약관', processing: '개인정보 수집·이용 동의', overseas: '개인정보 국외 이전 동의' }
const documents = {
  service: information.terms,
  processing: [
    { title: '수집·이용 목적', paragraphs: ['주거 문제 파악, 기존 사례 판단, 해결 방법·문의 문장 생성, 사용자별 답변 재사용 및 이용 한도·보안 관리에 사용합니다.'] },
    { title: '처리 항목', paragraphs: ['문제 글, 선택·촬영한 사진, 임시 사용자 식별자·인증 정보, 입력 비교용 식별값, 암호화된 분석 결과, 요청 시각·상태·사용량 및 동의 기록입니다. 사진은 선택 사항이며 불필요한 이름·연락처·얼굴·상세 주소는 제외해 주세요.'] },
    { title: '보유·이용 기간', paragraphs: ['원본 글·사진은 요청 처리 중 일시 사용하며 어쩌집 DB에 저장하지 않습니다. 생성 답변에는 입력 내용이 포함될 수 있습니다. 답변 캐시는 7일, 호출 기록은 30일 보관합니다. 임시 계정과 현재 동의 상태는 계정 유지 기간 동안 보관하고 90일 미활동 시 정리합니다. 사용자 삭제 요청이 먼저 이루어지면 해당 절차를 따릅니다.'] },
    { title: '동의 거부와 철회', paragraphs: ['동의하지 않아도 기존 사례를 볼 수 있습니다. 글·사진 분석에는 이 동의가 필요합니다. 동의 철회와 과거 서버 데이터 삭제는 별개이며 앱의 관리 기능 또는 happytanglee@gmail.com으로 요청할 수 있습니다.'] },
    { title: '처리 주체', paragraphs: ['운영자·개인정보 보호책임자: 유소원 / 문의: happytanglee@gmail.com'] },
  ],
  overseas: [
    { title: '이전 목적·방법', paragraphs: ['AI 분석과 서버 운영을 위해 동의 후 분석 요청 시 암호화된 통신으로 필요한 정보를 전송합니다. 카메라·사진 선택 권한과 개인정보 동의는 별개입니다.'] },
    { title: 'Render', paragraphs: ['Render Services, Inc. / privacy@render.com. 싱가포르 분석 서버에서 글·사진과 요청 정보를 처리합니다. 표준 계약상 미국 운영 업무가 있을 수 있습니다. Hobby 대시보드 로그는 7일이며 모든 내부 보안 기록의 삭제 기간과 동일하지 않습니다.'] },
    { title: 'OpenAI', paragraphs: ['OpenAI OpCo, LLC / privacy@openai.com. 글·선택 사진·분석 문맥을 미국 지정 요청으로 전송하여 사례 판단과 답변을 생성합니다. 데이터 공유를 끄고 store:false를 사용하지만 기본 악용 감시 로그는 최대 30일 및 법령·안전상 예외가 있습니다.'] },
    { title: 'Supabase', paragraphs: ['Supabase Pte. Ltd. / privacy@supabase.io. 프로젝트 DB·Auth는 서울에 저장됩니다. 공식 정책상 운영 로그는 EU, 지원 업무는 국외에서 처리될 수 있습니다. 구체적인 부수 처리 범위는 검토 중입니다.'] },
    { title: '거부 방법과 영향', paragraphs: ['동의하지 않거나 이 창을 닫아 거부할 수 있습니다. 기존 사례는 계속 볼 수 있지만 글·사진 분석에는 동의가 필요합니다. 철회·삭제 문의: happytanglee@gmail.com'] },
  ],
}
export function ConsentDocument({ kind, onBack }: { kind: ConsentDocumentKind; onBack: () => void }) {
  const scroll = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const area = scroll.current!
    const body = content.current!
    let lastY = 0
    let pull = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const reset = () => {
      pull = 0
      body.style.transition = reduced ? 'none' : 'transform 280ms ease-out'
      body.style.transform = 'translateY(0)'
    }
    const stretch = (delta: number) => {
      const bottom = Math.max(0, area.scrollHeight - area.clientHeight)
      if (!pull && !((area.scrollTop <= 0 && delta > 0) || (area.scrollTop >= bottom - 1 && delta < 0))) return false
      pull = Math.max(-160, Math.min(160, pull + delta))
      body.style.transition = 'none'
      body.style.transform = `translateY(${reduced ? 0 : 48 * Math.tanh(pull / 120)}px)`
      return true
    }
    const start = (e: TouchEvent) => { clearTimeout(timer); lastY = e.touches[0]?.clientY ?? 0; pull = 0 }
    const move = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const y = e.touches[0].clientY
      if (stretch(y - lastY)) e.preventDefault()
      lastY = y
    }
    const wheel = (e: WheelEvent) => {
      if (stretch(-e.deltaY)) { e.preventDefault(); clearTimeout(timer); timer = setTimeout(reset, 100) }
    }
    area.addEventListener('touchstart', start, { passive: true })
    area.addEventListener('touchmove', move, { passive: false })
    area.addEventListener('touchend', reset)
    area.addEventListener('touchcancel', reset)
    area.addEventListener('wheel', wheel, { passive: false })
    return () => {
      clearTimeout(timer)
      area.removeEventListener('touchstart', start)
      area.removeEventListener('touchmove', move)
      area.removeEventListener('touchend', reset)
      area.removeEventListener('touchcancel', reset)
      area.removeEventListener('wheel', wheel)
    }
  }, [kind])
  return <div className="hh-terms-sheet-content">
    <h2>{consentTitles[kind]}</h2>
    <div ref={scroll} className="hh-terms-document" key={kind} tabIndex={0} role="region" aria-label={`${consentTitles[kind]} 전문`}>
      <div ref={content} className="hh-terms-document-body">
      {documents[kind].map(section => <section key={section.title}><h3>{section.title}</h3>{section.paragraphs.map((text, index) => <p key={index}>{text}</p>)}</section>)}
      </div>
    </div>
    <Button onClick={onBack}>닫기</Button>
  </div>
}

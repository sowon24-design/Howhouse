import type { AnalysisResult } from './client'

/** Free integration fixture; not an actual repair recommendation. */
export const generatedSampleContent = {
  title: '[테스트] 생성 결과 연결 확인', description: '실제 분석이 아닌 무료 화면 연결 샘플입니다.',
  supplies: [], steps: [{ title: '표시 확인', description: '실제 수리 안내가 아닙니다. 생성 내용을 그대로 표시하는지 확인합니다.' }],
  contacts: { landlord: ['[테스트] 안녕하세요.', '[테스트] 점검을 문의드립니다.'], company: [] },
}
export const generatedSampleResult = { source: 'generated' as const, solution: {
  id: 'generated:sample-only', source: 'generated' as const,
  title: generatedSampleContent.title, description: generatedSampleContent.description,
  supplies: [], steps: generatedSampleContent.steps.map((step, i) => ({ ...step, number: i + 1 })),
  duration: '', responsibility: '', reference: '', videos: [], photos: [],
  contacts: { landlord: { label: '집주인', sentences: generatedSampleContent.contacts.landlord }, company: { label: '', sentences: [] } },
  canContact: true,
} }

/** Verified in main 7bc7742 CSV + converter. Only ID is returned; no rewritten copy. */
export const existingCaseSample = {
  source: 'existing', caseId: '욕실·수도:1',
} satisfies AnalysisResult<never>

/**
 * REVIEW DRAFT for Yeonwoo, not an API contract or an actual LLM result.
 * Compatible with SolutionView from main 7bc7742. Display identity below is
 * sample-only; never query, save, or register it as an existing case ID.
 * The user-facing instructions are deliberately labelled as a connection test.
 */
export const generatedSolutionDraft = {
  id: '욕실·수도:preview-generated-001' as const,
  field: '욕실·수도' as const,
  number: 'preview-generated-001',
  category: '욕실',
  symptom: '[연결 테스트] 준비된 사례에 없는 상황',
  source: 'generated' as const,
  title: '[연결 테스트] 생성 결과 표시 초안',
  description: '실제 문제를 분석한 결과가 아닙니다. B 화면 연결을 검토하는 샘플입니다.',
  duration: '', responsibility: '', reference: '', supplies: [],
  steps: [{ number: 1, title: '연결 상태를 확인해요', description: '실제 수리 안내가 아닌 테스트용 문장입니다.' }],
  videos: [], photos: [],
  contacts: {
    landlord: { label: '집주인', sentences: ['[테스트] 안녕하세요.', '[테스트] 문의 본문 표시를 확인합니다.'] },
    company: { label: '전문업체', sentences: ['[테스트] 안녕하세요.', '[테스트] 업체용 본문 표시를 확인합니다.'] },
  },
  canContact: true,
}

/** Opt-in only, after Yeonwoo reviews the draft; not the default sample path. */
export const generatedResultDraft = {
  source: 'generated', solution: generatedSolutionDraft,
} satisfies AnalysisResult<typeof generatedSolutionDraft>

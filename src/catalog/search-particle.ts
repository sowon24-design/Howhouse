/** 검색어의 마지막 발음에 맞는 접속 조사. 발음을 알 수 없으면 병기한다. */
export function searchParticle(query: string): string {
  const last = Array.from(query.trim().replace(/[\s\p{P}\p{S}]+$/gu, '')).at(-1)
  if (!last) return '와'
  const code = last.codePointAt(0)!
  if (code >= 0xac00 && code <= 0xd7a3) return (code - 0xac00) % 28 ? '과' : '와'
  if (/\d/.test(last)) return '013678'.includes(last) ? '과' : '와'
  if (/[ㄱ-ㅎ]/.test(last)) return '과'
  if (/[ㅏ-ㅣ]/.test(last)) return '와'
  return '와(과)'
}

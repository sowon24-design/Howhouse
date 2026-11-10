/** General product-name search only: no affiliate IDs, case details or user data. */
export function coupangSearchUrl(material: string): string | null {
  const query = material.trim()
  if (!query) return null
  const url = new URL('https://www.coupang.com/np/search')
  url.searchParams.set('q', query)
  return url.href
}

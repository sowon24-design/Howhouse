const bases = Object.freeze({global:'https://api.openai.com/v1',us:'https://us.api.openai.com/v1'})
export function readProcessingRegion(value='global') {
  if (!Object.hasOwn(bases,value)) throw new Error('지원하는 OpenAI 처리 지역은 global 또는 us입니다.')
  return value
}
export function providerBaseUrl(region='global') { return bases[readProcessingRegion(region)] }

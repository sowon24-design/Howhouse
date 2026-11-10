import {readProcessingRegion,providerBaseUrl} from './provider-region.mjs'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { fileURLToPath, pathToFileURL } from 'node:url'

const expected = 'HOWHOUSE_CONNECTION_OK'
// Standard text rates verified 2026-11-01; dashboard billing remains authoritative.
const prices = { 'gpt-6.1-terra': { input: 1, output: 5 }, 'gpt-6.1-sol': { input: 2, output: 10 } }

export function validateConfig(config) {
  const apiKey = config.OPENAI_API_KEY?.trim(), model = config.OPENAI_MODEL?.trim()
  if (!apiKey || apiKey.length < 20 || /\s/.test(apiKey)) throw new Error('키 설정이 필요합니다.')
  if (!Object.hasOwn(prices, model ?? '')) throw new Error('Terra 또는 Sol 모델 이름을 확인하세요.')
  return { apiKey, model, processingRegion:readProcessingRegion(config.OPENAI_PROCESSING_REGION) }
}

/** One fixed request. No photos, user data, tools, or automatic retries. */
export async function runConnectionCheck({ apiKey, model, processingRegion = 'global', fetchImpl = fetch }) {
  validateConfig({ OPENAI_API_KEY: apiKey, OPENAI_MODEL: model, OPENAI_PROCESSING_REGION:processingRegion })
  let response
  try {
    response = await fetchImpl(providerBaseUrl(processingRegion)+'/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model, input: `Reply with exactly this text and nothing else: ${expected}`,
        reasoning: { effort: model === 'gpt-6.1-terra' ? 'none' : 'low' },
        max_output_tokens: 128, store: false,
      }),
      // Diagnostic-only timeout, not the product's analysis time policy.
      signal: AbortSignal.timeout(30_000),
    })
  } catch {
    return { success: false, model, issue: 'network-or-timeout', note: '처리·과금 여부를 Usage에서 확인하세요. 자동 재시도하지 않습니다.' }
  }
  let data
  try { data = await response.json() } catch {
    return { success: false, model, httpStatus: response.status, issue: 'invalid-response' }
  }
  if (!response.ok) {
    const code = data?.error?.code
    return { success: false, model, httpStatus: response.status,
      issue: typeof code === 'string' && /^[a-z0-9_]{1,80}$/.test(code) ? code : 'api-error' }
  }
  const text = (Array.isArray(data.output) ? data.output : [])
    .filter(item => item.type === 'message')
    .flatMap(item => Array.isArray(item.content) ? item.content : [])
    .filter(item => item.type === 'output_text' && typeof item.text === 'string')
    .map(item => item.text).join('').trim()
  const raw = data.usage
  const usage = raw && Number.isSafeInteger(raw.input_tokens) && raw.input_tokens >= 0
    && Number.isSafeInteger(raw.output_tokens) && raw.output_tokens >= 0
    ? { inputTokens: raw.input_tokens, outputTokens: raw.output_tokens } : null
  return {
    success: data.status === 'completed' && text === expected, model, processingRegion,
    responseStatus: data.status === 'completed' ? 'completed' : 'not-completed',
    answerMatched: text === expected, usage,
    referenceCostUsd: usage ? (usage.inputTokens * prices[model].input + usage.outputTokens * prices[model].output) / 1_000_000 * (processingRegion==='us'?1.1:1) : null,
    costNote: '2026-11-01 표준 텍스트 단가 및 미국 지정 시 10% 할증 기준 참고액. 할인·세금·정산 등 실제 청구는 Usage/Billing 기준.',
  }
}

async function main() {
  const envPath = fileURLToPath(new URL('.env', import.meta.url))
  const receiptPath = fileURLToPath(new URL('connection-check.local', import.meta.url))
  let config
  try { config = validateConfig(parseEnv(readFileSync(envPath, 'utf8'))) } catch {
    console.error('키 설정을 먼저 완료하세요. .env 내용이나 키를 채팅에 보내지 마세요.')
    process.exitCode = 1
    return
  }
  if (!process.argv.includes('--send-once')) {
    console.log(`설정 확인 완료: ${config.model}. 키는 숨겼습니다. API 호출/과금 없음.`)
    return
  }
  if (existsSync(receiptPath)) {
    console.log('이미 점검 실행 기록이 있어 새 유료 호출을 막았습니다. 채팅에 결과 확인을 요청하세요.')
    return
  }
  const attempt = { attemptedAt: new Date().toISOString(), model: config.model, state: 'attempted' }
  // Exclusive creation prevents duplicate calls from concurrent launchers.
  writeFileSync(receiptPath, JSON.stringify(attempt, null, 2), { flag: 'wx' })
  console.log(`연결 점검 1회: ${config.model}, 출력 상한 128토큰. 사진/사용자 글 전송 없음.`)
  const result = await runConnectionCheck(config)
  writeFileSync(receiptPath, JSON.stringify({ ...attempt, state: 'finished', ...result }, null, 2))
  console.log(result.success ? 'SUCCESS: OpenAI API 연결 확인 완료.' : 'STOPPED: 점검 결과 확인이 필요합니다. 자동 재시도하지 않습니다.')
  console.log(JSON.stringify(result, null, 2))
  if (!result.success) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => {
    console.error('점검 도구가 중단됐습니다. 키를 표시하지 않고 종료합니다. 실행 기록을 확인하세요.')
    process.exitCode = 1
  })
}

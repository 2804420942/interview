#!/usr/bin/env node
/**
 * CloudBase AI 网关连通性 / 可用模型探测
 *
 * CloudBase 的 AI 网关没有提供 OpenAI 那样的 GET /models 接口，
 * 请求 /models 会被当成「名为 models 的模型」而返回 AI_MODEL_NOT_SUPPORTED。
 * 所以只能用候选模型名逐个打 chat/completions 来探测哪些已在控制台开通。
 *
 * 用法（密钥只从环境变量读，绝不写进仓库）：
 *   export CLOUDBASE_ENV_ID=your-env-id
 *   export CLOUDBASE_API_KEY=your-api-key
 *   node scripts/cloudbase-ai-probe.cjs
 *
 * 额外探测自定义模型名：
 *   node scripts/cloudbase-ai-probe.cjs deepseek-v3 kimi-k2
 *
 * 返回码含义：
 *   200 -> 模型已开通可用
 *   403 AI_MODEL_NOT_SUPPORTED -> 密钥有效，但该模型未在控制台开通
 *   401 INVALID_CREDENTIALS    -> 密钥无效或已吊销
 */

const ENV_ID = process.env.CLOUDBASE_ENV_ID
const API_KEY = process.env.CLOUDBASE_API_KEY

if (!ENV_ID || !API_KEY) {
  console.error('缺少环境变量。请先设置：')
  console.error('  export CLOUDBASE_ENV_ID=<你的环境ID>')
  console.error('  export CLOUDBASE_API_KEY=<你的APIKey>')
  process.exit(1)
}

const BASE = `https://${ENV_ID}.api.tcloudbasegateway.com/v1/ai/cloudbase`

// 资源点套餐常见模型名，按需增删
const DEFAULT_CANDIDATES = [
  'hy3', 'hy2', 'hy-turbos', 'hunyuan-lite', 'hunyuan-standard',
  'deepseek-v3', 'deepseek-r1', 'deepseek-v4-flash',
  'kimi-k2', 'glm-4.5', 'qwen3',
]

const candidates = process.argv.slice(2).length
  ? process.argv.slice(2)
  : DEFAULT_CANDIDATES

async function probe(model) {
  const started = Date.now()
  try {
    const res = await fetch(`${BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'hi' }],
        max_tokens: 8,
      }),
      signal: AbortSignal.timeout(30000),
    })

    const ms = Date.now() - started
    const text = await res.text()
    let payload
    try {
      payload = JSON.parse(text)
    } catch {
      payload = null
    }

    if (res.status === 200) {
      const reply = payload?.choices?.[0]?.message?.content ?? ''
      return { model, ok: true, status: 200, ms, note: reply.slice(0, 20) }
    }
    return { model, ok: false, status: res.status, ms, note: payload?.code || text.slice(0, 40) }
  } catch (e) {
    return { model, ok: false, status: 'ERR', ms: Date.now() - started, note: e.message.slice(0, 40) }
  }
}

;(async () => {
  console.log(`网关: ${BASE}`)
  console.log(`探测 ${candidates.length} 个候选模型...\n`)

  const results = []
  for (const m of candidates) {
    const r = await probe(m)
    results.push(r)
    const flag = r.ok ? '✅' : '❌'
    console.log(`  ${flag} ${m.padEnd(20)} ${String(r.status).padEnd(5)} ${String(r.ms + 'ms').padStart(7)}  ${r.note}`)
  }

  const available = results.filter(r => r.ok).map(r => r.model)
  console.log()
  if (available.length) {
    console.log(`可用模型 (${available.length}): ${available.join(', ')}`)
    console.log('\n编码助手配置：')
    console.log(`  Provider   OpenAI Compatible`)
    console.log(`  Base URL   ${BASE}`)
    console.log(`  API Key    <你的 CloudBase API Key>`)
    console.log(`  Model      ${available[0]}`)
  } else {
    const allUnsupported = results.every(r => r.note === 'AI_MODEL_NOT_SUPPORTED')
    const anyAuthFail = results.some(r => r.note === 'INVALID_CREDENTIALS')
    if (anyAuthFail) {
      console.log('密钥无效或已吊销，请到 控制台 → 环境配置 → API Key 重新签发。')
    } else if (allUnsupported) {
      console.log('密钥有效，但该环境未开通任何模型。')
      console.log('请到 控制台 → AI → 生文模型 开启模型：')
      console.log('  https://tcb.cloud.tencent.com/dev#/ai?tab=text-aiModel')
    } else {
      console.log('未探测到可用模型，请检查上方返回码。')
    }
  }
})()

// Local real-browser check: synthetic images only, no Auth, model or external services.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { stripTypeScriptTypes } from 'node:module'

async function browserChecks() {
  const { prepareAnalysisPhoto } = await import('/photo.js')
  const assert = (value, message) => { if (!value) throw Error(message) }
  const sentinel = 'PRIVATE-GPS-37.5500-126.9700-original-address.jpg'
  const bytes = value => new TextEncoder().encode(value)
  const concat = (...arrays) => {
    const result = new Uint8Array(arrays.reduce((n, a) => n + a.length, 0))
    let offset = 0; for (const array of arrays) { result.set(array, offset); offset += array.length }
    return result
  }
  const seed = document.createElement('canvas'); seed.width = 3; seed.height = 2
  const context = seed.getContext('2d'); context.fillStyle = 'rgb(220,40,70)'; context.fillRect(0, 0, 3, 2)
  const encode = type => new Promise(resolve => seed.toBlob(resolve, type, 0.98))
  const pixels = async blob => {
    const image = new Image(), url = URL.createObjectURL(blob)
    try {
      await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; image.src = url })
      const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight
      const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0)
      return { width: canvas.width, height: canvas.height, rgb: [...ctx.getImageData(0, 0, 1, 1).data] }
    } finally { URL.revokeObjectURL(url) }
  }
  const crc = array => {
    let value = 0xffffffff
    for (const byte of array) { value ^= byte; for (let i = 0; i < 8; i++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0) }
    return (value ^ 0xffffffff) >>> 0
  }
  const exif = new Uint8Array(98), view = new DataView(exif.buffer)
  exif.set(bytes('Exif\0\0II')); view.setUint16(8, 42, true); view.setUint32(10, 8, true)
  const tiff = 6
  view.setUint16(tiff + 8, 2, true)
  const entry = (offset, tag, type, count, value) => {
    view.setUint16(tiff + offset, tag, true); view.setUint16(tiff + offset + 2, type, true)
    view.setUint32(tiff + offset + 4, count, true); view.setUint32(tiff + offset + 8, value, true)
  }
  entry(10, 0x112, 3, 1, 6) // Orientation: rotate 90 degrees clockwise.
  entry(22, 0x8825, 4, 1, 38) // GPS IFD pointer.
  view.setUint16(tiff + 38, 2, true)
  entry(40, 1, 2, 2, 78); entry(52, 2, 5, 3, 68)
  for (let i = 0; i < 3; i++) { view.setUint32(tiff + 68 + i * 8, [37, 33, 0][i], true); view.setUint32(tiff + 72 + i * 8, 1, true) }
  const results = []
  for (const [index, type] of ['image/jpeg', 'image/png', 'image/webp'].entries()) {
    const blob = await encode(type); assert(blob.type === type, 'fixture encoder unsupported: ' + type)
    let original = new Uint8Array(await blob.arrayBuffer())
    if (type === 'image/jpeg') {
      const app1 = payload => concat(new Uint8Array([255, 225, (payload.length + 2) >> 8, (payload.length + 2) & 255]), payload)
      original = concat(original.slice(0, 2), app1(exif), app1(bytes('http://ns.adobe.com/xap/1.0/\0' + sentinel)), original.slice(2))
    } else if (type === 'image/png') {
      const payload = concat(bytes('tEXt'), bytes('Location\0' + sentinel)), chunk = new Uint8Array(payload.length + 8)
      const v = new DataView(chunk.buffer); v.setUint32(0, payload.length - 4); chunk.set(payload, 4); v.setUint32(chunk.length - 4, crc(payload))
      original = concat(original.slice(0, 33), chunk, original.slice(33))
    } else {
      const payload = bytes(sentinel), chunk = new Uint8Array(8 + payload.length + payload.length % 2)
      chunk.set(bytes('EXIF')); new DataView(chunk.buffer).setUint32(4, payload.length, true); chunk.set(payload, 8)
      original = concat(original, chunk); new DataView(original.buffer).setUint32(4, original.length - 8, true)
    }
    const file = new File([original], sentinel, { type, lastModified: Date.now() })
    const before = await pixels(file)
    const prepared = await prepareAnalysisPhoto(file, index, new AbortController().signal)
    const after = await pixels(prepared), output = new Uint8Array(await prepared.arrayBuffer())
    const text = new TextDecoder('latin1').decode(output)
    assert(!text.includes(sentinel) && !text.includes('Exif\0\0') && !text.includes('http://ns.adobe.com/xap/'), 'original metadata survived')
    assert(prepared.name === `analysis-photo-${index + 1}.${type === 'image/jpeg' ? 'jpg' : type.split('/')[1]}`, 'original filename survived')
    assert(prepared.lastModified === 0, 'original timestamp survived')
    assert(before.width === after.width && before.height === after.height, 'orientation or dimensions changed')
    if (type === 'image/jpeg') assert(before.width === 2 && before.height === 3, 'EXIF orientation fixture not applied')
    assert(before.rgb.every((n, i) => Math.abs(n - after.rgb[i]) < 15), 'visible photo changed excessively')
    results.push({ type, metadataRemoved: true, filenameRemoved: true, orientationPreserved: true, dimensions: [after.width, after.height] })
  }
  let rejected = false
  try { await prepareAnalysisPhoto(new File(['broken'], 'private.jpg', { type: 'image/jpeg' }), 0, new AbortController().signal) } catch { rejected = true }
  assert(rejected, 'corrupt image fell back to original')
  const controller = new AbortController(); controller.abort(); rejected = false
  try { await prepareAnalysisPhoto(new File(['broken'], 'private.jpg'), 0, controller.signal) } catch { rejected = true }
  assert(rejected, 'cancel ignored')
  const encodingFixture = new File([await encode('image/png')], 'private.png', { type: 'image/png' })
  const originalEncoder = HTMLCanvasElement.prototype.toBlob
  HTMLCanvasElement.prototype.toBlob = function (callback) { callback(null) }
  rejected = false
  try { await prepareAnalysisPhoto(encodingFixture, 0, new AbortController().signal) } catch { rejected = true }
  finally { HTMLCanvasElement.prototype.toBlob = originalEncoder }
  assert(rejected, 'encoder failure fell back to original')
  return { results, corruptRejected: true, cancelledRejected: true, encoderFailureRejected: true, externalServiceCalls: 0 }
}

const source = stripTypeScriptTypes(fs.readFileSync(new URL('../src/analysis/photo-privacy.ts', import.meta.url), 'utf8'))
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', req.url === '/photo.js' ? 'text/javascript' : 'text/html')
  res.end(req.url === '/photo.js' ? source : '<!doctype html><title>Local photo privacy test</title>')
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'howhouse-photo-'))
const browser = spawn(process.env.CHROME_PATH ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', [
  '--headless=new', '--disable-gpu', '--no-first-run', '--disable-background-networking', '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank',
], { stdio: 'ignore', windowsHide: true })
let ws
try {
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
  let port
  for (let i = 0; i < 100; i++) { try { port = fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]; break } catch { await pause(100) } }
  assert.ok(port, 'Browser did not start')
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
  ws = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }) })
  let sequence = 0; const pending = new Map()
  ws.addEventListener('message', event => {
    const message = JSON.parse(event.data), task = pending.get(message.id)
    if (!task) return
    pending.delete(message.id); message.error ? task.reject(Error(message.error.message)) : task.resolve(message.result)
  })
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence
    const timer = setTimeout(() => { pending.delete(id); reject(Error('Browser command timed out: ' + method)) }, 25000)
    pending.set(id, { resolve: result => { clearTimeout(timer); resolve(result) }, reject: error => { clearTimeout(timer); reject(error) } })
    ws.send(JSON.stringify({ id, method, params }))
  })
  await send('Page.navigate', { url: `http://127.0.0.1:${server.address().port}` }); await pause(200)
  const response = await send('Runtime.evaluate', { expression: `(${browserChecks.toString()})()`, awaitPromise: true, returnByValue: true, timeout: 20000 })
  assert.ok(!response.exceptionDetails, JSON.stringify(response.exceptionDetails))
  console.log(JSON.stringify(response.result.value, null, 2))
  if (process.argv[2]) fs.writeFileSync(path.resolve(process.argv[2]), JSON.stringify(response.result.value, null, 2) + '\n')
} finally { ws?.close(); browser.kill(); server.close() }

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { photoErrorMessage, readSelectedPhotos } from './native-photos.ts'

test('camera and gallery cancellation do not display an error', () => {
  for (const code of ['OS-PLUG-CAMR-0006', 'OS-PLUG-CAMR-0020']) assert.equal(photoErrorMessage({ code }), '')
})
test('permission denial offers text input without automatic settings navigation', () => {
  for (const code of ['OS-PLUG-CAMR-0003', 'OS-PLUG-CAMR-0005']) assert.match(photoErrorMessage({ code }), /글로/)
})
test('oversized fallback selection is rejected before reading, not silently truncated', async () => {
  await assert.rejects(readSelectedPhotos([{ webPath: 'invalid' }, { webPath: 'invalid' }], 1), /최대 1장/)
})
test('photos become File objects with image MIME and preserved bytes', async () => {
  const [file] = await readSelectedPhotos([{ webPath: 'data:image/png;base64,AQID' }], 1)
  assert.ok(file instanceof File)
  assert.equal(file.type, 'image/png')
  assert.deepEqual([...new Uint8Array(await file.arrayBuffer())], [1, 2, 3])
})
test('a read failure rejects the whole batch so existing attachments are untouched', async () => {
  await assert.rejects(readSelectedPhotos([{ webPath: 'data:image/png;base64,AQID' }, {}], 2), /Missing photo path/)
  await assert.rejects(readSelectedPhotos([{ webPath: 'data:text/plain,not-photo' }], 1), /Invalid photo/)
})

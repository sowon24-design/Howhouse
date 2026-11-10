/** Decode locally and encode only pixels: never copy the original EXIF/GPS or filename. */
export async function prepareAnalysisPhoto(photo: File, index: number, signal: AbortSignal): Promise<File> {
  signal.throwIfAborted()
  const url = URL.createObjectURL(photo)
  const image = new Image()
  const canvas = document.createElement('canvas')
  try {
    await new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        image.onload = null; image.onerror = null
        signal.removeEventListener('abort', abort)
      }
      const abort = () => { cleanup(); image.src = ''; reject(signal.reason) }
      image.onload = () => { cleanup(); resolve() }
      image.onerror = () => { cleanup(); reject(new Error('photo-decode-failed')) }
      signal.addEventListener('abort', abort, { once: true })
      if (signal.aborted) { abort(); return }
      image.src = url
    })
    signal.throwIfAborted()
    if (!image.naturalWidth || !image.naturalHeight) throw new Error('photo-decode-failed')
    // Browser decoding applies orientation before drawing. Do not resize the visible photo.
    canvas.width = image.naturalWidth; canvas.height = image.naturalHeight
    const context = canvas.getContext('2d')
    if (!context) throw new Error('photo-canvas-unavailable')
    context.drawImage(image, 0, 0)
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, photo.type, 0.95))
    signal.throwIfAborted()
    if (!blob?.size || blob.size > 4 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(blob.type)) {
      throw new Error('photo-encode-failed')
    }
    const extension = blob.type === 'image/jpeg' ? 'jpg' : blob.type.split('/')[1]
    return new File([blob], `analysis-photo-${index + 1}.${extension}`, { type: blob.type, lastModified: 0 })
  } finally {
    image.src = ''
    canvas.width = 0; canvas.height = 0
    URL.revokeObjectURL(url)
  }
}

import { Camera, MediaTypeSelection } from '@capacitor/camera'
import type { MediaResult } from '@capacitor/camera'

export function photoErrorMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code
  if (code === 'OS-PLUG-CAMR-0006' || code === 'OS-PLUG-CAMR-0020') return ''
  if (code === 'OS-PLUG-CAMR-0003' || code === 'OS-PLUG-CAMR-0005')
    return '사진에 접근할 수 없어요. 권한을 확인하거나 글로 문제를 알려 주세요.'
  return error instanceof Error && error.message.startsWith('사진은 최대')
    ? error.message : '사진을 불러오지 못했어요. 다시 시도하거나 글로 문제를 알려 주세요.'
}

export async function selectNativePhotos(source: 'camera' | 'gallery', remaining: number): Promise<File[]> {
  if (remaining < 1) return []
  const media = source === 'camera'
    ? [await Camera.takePhoto({ saveToGallery: false, editable: 'no' })]
    : (await Camera.chooseFromGallery({
      mediaType: MediaTypeSelection.Photo,
      allowMultipleSelection: remaining > 1,
      limit: remaining,
    })).results
  return readSelectedPhotos(media, remaining)
}

export async function readSelectedPhotos(media: Pick<MediaResult, 'webPath'>[], remaining: number): Promise<File[]> {
  // Older system pickers may ignore the limit. Never silently truncate a selection.
  if (media.length > remaining) throw new Error(`사진은 최대 ${remaining}장 더 선택할 수 있어요. 다시 선택해 주세요.`)
  return Promise.all(media.map(async (item, index) => {
    if (!item.webPath) throw new Error('Missing photo path')
    const response = await fetch(item.webPath)
    if (!response.ok) throw new Error('Photo read failed')
    const blob = await response.blob()
    if (!blob.size || !blob.type.startsWith('image/')) throw new Error('Invalid photo')
    const extension = blob.type.split('/')[1].replace('jpeg', 'jpg')
    return new File([blob], `photo-${Date.now()}-${index}.${extension}`, { type: blob.type })
  }))
}

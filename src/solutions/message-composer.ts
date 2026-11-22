import { Capacitor, registerPlugin } from '@capacitor/core'

const MessageComposer = registerPlugin<{ open(options: { body: string }): Promise<void> }>('MessageComposer')

/** Opens a draft only. Recipient selection and actual sending stay in the SMS app. */
export async function openMessageComposer(body: string): Promise<void> {
  if (!body.trim()) throw new Error('Empty message')
  if (Capacitor.getPlatform() === 'android') {
    await MessageComposer.open({ body })
    return
  }
  // Desktop preview has no reliable SMS handler; keep the editor and offer copying.
  if (!/Android/i.test(navigator.userAgent)) throw new Error('SMS app unavailable')
  window.location.href = `sms:?body=${encodeURIComponent(body)}`
}

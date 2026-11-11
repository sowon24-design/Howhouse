import { YoutubePreview } from '../youtube/YoutubePreview'

/** The old thumbnail prop is retained for B-screen compatibility, never loaded. */
export function VideoPreview({ url, externalIcon, onOpen }: {
  url: string; thumbnail: string; externalIcon: string; onOpen: (url: string) => void
}) {
  return <YoutubePreview key={url} url={url} externalIcon={externalIcon} onOpen={onOpen}/>
}

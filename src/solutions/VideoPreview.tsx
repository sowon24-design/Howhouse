const thumbnails = import.meta.glob('./assets/video-thumbnails/*.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

/** Packaged thumbnails preserve the original UI without remote image requests. */
export function VideoPreview({ url, thumbnail, externalIcon, onOpen }: {
  url: string; thumbnail: string; externalIcon: string; onOpen: (url: string) => void
}) {
  const id = /^https:\/\/i\.ytimg\.com\/vi\/([A-Za-z0-9_-]{11})\//.exec(thumbnail)?.[1]
  const image = id ? thumbnails['./assets/video-thumbnails/' + id + '.jpg'] : undefined
  return <div className="solutions-b02__video-container">
    <a className="solutions-b02__video" href={url} target="_blank" rel="noopener noreferrer" aria-label="해결 방법 유튜브 영상 열기" onClick={() => onOpen(url)}>
      {image ? <img src={image} alt="해결 방법 유튜브 썸네일"/> : <div className="solutions-b02__video-placeholder text-body-md">YouTube 영상</div>}
      <span><img src={externalIcon} alt=""/></span>
    </a>
  </div>
}

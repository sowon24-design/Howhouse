/** Catalog edition: remote images are never loaded inside the app. */
export function VideoPreview({ url, externalIcon, onOpen }: {
  url: string; thumbnail: string; externalIcon: string; onOpen: (url: string) => void
}) {
  return <div className="solutions-b02__video-container">
    <a className="solutions-b02__video" href={url} target="_blank" rel="noopener noreferrer" aria-label="해결 방법 유튜브 영상 열기" onClick={() => onOpen(url)}>
      <div className="solutions-b02__video-placeholder text-body-md">YouTube 영상 보기 (외부 사이트)</div>
      <span><img src={externalIcon} alt="" /></span>
    </a>
    <p className="text-caption-rg">선택하면 외부 사이트로 이동해요. 앱에서는 외부 썸네일을 불러오지 않아요.</p>
  </div>
}

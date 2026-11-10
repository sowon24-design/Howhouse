import { useState } from 'react'
import { Button } from '../components/ui'

/** Loading a remote preview is an explicit action, independent of opening the video. */
export function VideoPreview({ url, thumbnail, externalIcon, onOpen }: {
  url: string; thumbnail: string; externalIcon: string; onOpen: (url: string) => void
}) {
  const [requested, setRequested] = useState<string>()
  const loaded = requested === thumbnail
  return <div className="solutions-b02__video-container">
    <a className="solutions-b02__video" href={url} target="_blank" rel="noopener noreferrer" aria-label="해결 방법 유튜브 영상 열기" onClick={() => onOpen(url)}>
      {loaded ? <img referrerPolicy="no-referrer" src={thumbnail} alt="해결 방법 유튜브 썸네일" /> : <div className="solutions-b02__video-placeholder text-body-md">YouTube 영상</div>}
      <span><img src={externalIcon} alt="" /></span>
    </a>
    {!loaded && <div className="solutions-b02__video-preview-action"><Button variant="pale" onClick={() => setRequested(thumbnail)}>미리보기 불러오기</Button><p className="text-caption-rg">선택하면 YouTube 이미지 서버에 연결돼요.</p></div>}
  </div>
}

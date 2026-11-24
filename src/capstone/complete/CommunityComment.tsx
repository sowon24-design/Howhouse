import {useEffect,useState,useRef} from 'react'
import type { CommunityPost } from './model'
import { postTime } from './model'

/** User-approved comment variant: no profile image, blue author nickname. */
export function CommunityComment({ comment }: {
  comment: CommunityPost['comments'][number]
}) {
  const fallbackCreated=useRef(Date.now())
  const created=Number.isFinite(comment.created)?comment.created:fallbackCreated.current
  const [,refresh]=useState(0)
  useEffect(()=>{
    let timer:ReturnType<typeof setTimeout>
    const tick=()=>{
      refresh(value=>value+1)
      const elapsed=Math.max(0,Date.now()-created)
      timer=setTimeout(tick,60000-elapsed%60000)
    }
    tick()
    return()=>clearTimeout(timer)
  },[created])
  return <article className="cg-comment">
    <div className="cg-comment-header">
      <div className="cg-comment-metadata"><span className="cg-comment-author">{comment.author}</span><span className="cg-comment-divider" aria-hidden="true"/><span className="cg-comment-time">{postTime(created)}</span></div>
    </div>
    <p className="cg-comment-body">{comment.body}</p>
  </article>
}

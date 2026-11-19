import type { CommunityPost } from './model'
import { postTime } from './model'

/** User-approved comment variant: no profile image, blue author nickname. */
export function CommunityComment({ comment, created }: {
  comment: CommunityPost['comments'][number]; created: number
}) {
  return <article className="cg-comment">
    <div className="cg-comment-header">
      <div className="cg-comment-metadata"><span className="cg-comment-author">{comment.author}</span><span className="cg-comment-divider" aria-hidden="true"/><span className="cg-comment-time">{postTime(created)}</span></div>
    </div>
    <p className="cg-comment-body">{comment.body}</p>
  </article>
}

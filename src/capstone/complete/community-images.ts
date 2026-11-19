import drain from '../../solutions/assets/cases/p01-drain.jpg'
import heating from '../../solutions/assets/cases/p08-generated.jpg'
import room from '../../solutions/assets/additional62/renovation-room.png'
import leak from '../../solutions/assets/additional62/p28-generated.jpg'
import fridge from '../../solutions/assets/cases/p13-generated.jpg'
import bathroom from '../../solutions/assets/cases/p02-generated.jpg'
import supplies from '../../solutions/assets/additional62/disposal-items.png'
import washer from '../../solutions/assets/cases/p17-generated.jpg'
import controller from '../../solutions/assets/cases/p24-generated.jpg'
import wallpaper from '../../solutions/assets/additional62/p15-generated.jpg'
import recordRoom from '../../solutions/assets/cases/p15-generated.jpg'
import tools from '../../solutions/assets/additional62/cleaning-tools.png'
import type { CommunityPost } from './model'

/** Team-owned AI example images already shipped with main, never user photos. */
export const communityImages=[drain,heating,room,leak,fridge,bathroom,supplies,washer,controller,wallpaper,recordRoom,tools]
export function attachSeedPhotos(posts:CommunityPost[]):CommunityPost[]{return posts.map(post=>{
 if(post.photos.length)return post
 const index=/^demo-(\d+)$/.exec(post.id)?.[1]
 return index!==undefined&&communityImages[Number(index)]?{...post,photos:[communityImages[Number(index)]]}:post
})}

import { postTime, type CommunityPost } from './model'
import assetsIndex from './assets-index.json'
const urls=import.meta.glob('./assets/*',{eager:true,query:'?url',import:'default'}) as Record<string,string>
export function figmaAsset(name:string){const file=(assetsIndex as Record<string,string>)[name]??name;return urls['./assets/'+file]}
export function CommunityCard({post,onOpen}:{post:CommunityPost;onOpen:()=>void}){
 return <button type="button" className="cg-community-card" onClick={onOpen} aria-label={post.title}>
  <span className="cg-community-card-main"><span className="cg-community-card-copy"><strong>{post.title}</strong><span>{post.body}</span></span>{post.photos[0]&&<img className="cg-community-card-photo" src={post.photos[0]} alt="가상 게시글의 AI 생성 예시 이미지"/>}</span>
  <span className="cg-community-card-meta"><span><img src={figmaAsset('45837d26-18ac-49bf-8c3b-517402929838.svg')} alt=""/>{post.likes}</span><span><img src={figmaAsset('197c9790-a19c-4a1f-a520-7daadf5de4dc.svg')} alt=""/>{post.comments.length}</span><i/> <span>{postTime(post.created)}</span><i/><span>{post.author}</span></span>
 </button>
}

import test from 'node:test'
import assert from 'node:assert/strict'
import {canPublish,findPosts,initialPosts,rememberQuery,toggleLike,validNickname} from '../src/capstone/complete/model.ts'
test('community draft requires a category, nonblank title/body and original attachment/text limits',()=>{
 assert.equal(canPublish('도움 요청','배수구','물이 천천히 내려가요',[],[]),true)
 for(const [kind,title,body,photos,tags] of [['','제목','본문',[],[]],['기타',' ','본문',[],[]],['기타','제목','\n ',[],[]],['기타','x'.repeat(61),'본문',[],[]],['기타','제목','x'.repeat(1001),[],[]],['기타','제목','본문',Array(6),[]],['기타','제목','본문',[],Array(6)]])assert.equal(canPublish(kind,title,body,photos,tags),false)
})
test('filter/search and sorting operate on current posts rather than fixed result screens',()=>{
 const posts=initialPosts();posts[1]={...posts[1],title:'욕실 배수구',body:'물이 느려요',likes:20}
 assert.equal(findPosts(posts,'배수구','전체','popular')[0].id,posts[1].id)
 assert.equal(findPosts(posts,'없는 내용','전체','recent').length,0)
 assert.ok(findPosts(posts,'','수리 책임','recent').length>=1)
 assert.ok(findPosts(posts,'','수리 책임','recent').every(post=>post.kind==='수리 책임'))
 assert.equal(findPosts(posts,'','전체','popular')[0].likes,20)
})
test('fictional seed posts are distinct and have multiple own posts with actual comment counts',()=>{
 const posts=initialPosts('소원');assert.equal(posts.length,12);assert.equal(new Set(posts.map(post=>post.title)).size,12)
 assert.ok(posts.filter(post=>post.mine).length>=3);assert.ok(posts.filter(post=>post.mine).every(post=>post.author==='소원'))
 assert.ok(posts.every(post=>post.comments.length>0&&post.title.length<=60&&post.body.length<=1000))
})
test('like toggling and search history do not accumulate duplicates',()=>{
 const original=initialPosts()[0];assert.deepEqual(toggleLike(toggleLike(original)),original)
 assert.deepEqual(rememberQuery(['누수','곰팡이'],' 곰팡이 '),['곰팡이','누수'])
 assert.equal(rememberQuery(Array.from({length:10},(_,i)=>String(i)),'new').length,10)
})
test('profile accepts the original Korean/English/digit nickname constraints',()=>{
 assert.equal(validNickname('소원24'),true);assert.equal(validNickname('김서あ'),false);assert.equal(validNickname(' '),false);assert.equal(validNickname('x'.repeat(11)),false)
})
test('recommended order combines likes and comments and retains the active category filter',()=>{
 const original=initialPosts()[0]
 const posts=[{...original,id:'popular',kind:'자취 팁',likes:10,comments:[],created:1},{...original,id:'discussion',kind:'자취 팁',likes:8,comments:Array.from({length:4},(_,i)=>({id:String(i),author:'이웃',body:'의견',mine:false})),created:2},{...original,id:'other-kind',kind:'기타',likes:100,comments:[],created:3}]
 assert.equal(findPosts(posts,'','자취 팁','popular')[0].id,'popular')
 assert.equal(findPosts(posts,'','자취 팁','recommended')[0].id,'discussion')
 assert.equal(findPosts(posts,'','자취 팁','recommended').length,2)
 assert.equal(findPosts(posts,'','전체','recommended').length,3)
})

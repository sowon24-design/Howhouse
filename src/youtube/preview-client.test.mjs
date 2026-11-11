import test from 'node:test'
import assert from 'node:assert/strict'
import { requestYoutubePreview, requestYoutubeImage, youtubeVideoId } from './preview-client.ts'
const id='HN-djO8R7aI'
const config={apiKey:'unit-test-placeholder',privacyAccepted:true,android:{packageName:'com.howhouse.app',signingCertificateSha1:'AB'.repeat(20)}}
const body=()=>({items:[{id,status:{privacyStatus:'public'},snippet:{title:'원본 영상 제목',channelTitle:'원본 채널',thumbnails:{high:{url:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}}}}]})
const signal=()=>new AbortController().signal
test('missing or refused privacy acceptance prevents even the metadata request',async()=>{
  for(const privacyAccepted of [undefined,false]) {
    const result=await requestYoutubePreview(id,{...config,privacyAccepted},signal(),()=>{throw Error('network before acceptance')})
    assert.equal(result.status,'unavailable')
  }
})
test('invalid or missing configuration never calls the network',async()=>{
  const noRequest=()=>{throw Error('unexpected network')}
  assert.equal((await requestYoutubePreview(id,undefined,signal(),noRequest)).reason,'not-configured')
  assert.equal((await requestYoutubePreview('../private',config,signal(),noRequest)).reason,'invalid-id')
})
test('official API gets only a known ID without cookies, storage, or user text; preserves original metadata',async()=>{
  let count=0
  const result=await requestYoutubePreview(id,config,signal(),async(url,options)=>{
    count++
    assert.equal(url.origin,'https://www.googleapis.com')
    assert.equal(url.pathname,'/youtube/v3/videos')
    assert.equal(url.searchParams.get('id'),id)
    assert.equal(url.searchParams.get('part'),'snippet,status')
    assert.equal(url.searchParams.get('q'),null)
    assert.equal(options.credentials,'omit');assert.equal(options.cache,'no-store')
    assert.equal(options.headers.get('X-Android-Package'),'com.howhouse.app')
    assert.equal(options.headers.get('X-Android-Cert'),'AB'.repeat(20))
    return Response.json(body())
  })
  assert.equal(count,1);assert.equal(result.status,'ready')
  assert.equal(result.preview.title,'원본 영상 제목')
})
test('deleted or private videos are not displayed',async()=>{
  for(const payload of [{items:[]},{items:[{...body().items[0],status:{privacyStatus:'private'}}]}]){
    assert.equal((await requestYoutubePreview(id,config,signal(),async()=>Response.json(payload))).reason,'not-public')
  }
})
test('foreign hosts, HTTP, credentials, and wrong-video images are rejected',async()=>{
  for(const url of ['https://evil.example/vi/'+id+'/x.jpg','http://i.ytimg.com/vi/'+id+'/x.jpg','https://u:p@i.ytimg.com/vi/'+id+'/x.jpg','https://i.ytimg.com/vi/otherid0000/x.jpg']){
    const payload=body();payload.items[0].snippet.thumbnails.high.url=url
    assert.equal((await requestYoutubePreview(id,config,signal(),async()=>Response.json(payload))).reason,'invalid-response')
  }
})
test('quota and server errors are distinguished, no automatic retries',async()=>{
  for(const code of [403,429,500]){
    let count=0
    const result=await requestYoutubePreview(id,config,signal(),async()=>{count++;return new Response(null,{status:code})})
    assert.equal(count,1);assert.equal(result.reason,code===500?'provider':'quota-or-permission')
  }
})
test('late responses after cancellation cannot become ready',async()=>{
  const controller=new AbortController()
  const result=await requestYoutubePreview(id,config,controller.signal,async()=>{controller.abort();return Response.json(body())})
  assert.equal(result.reason,'cancelled')
})
test('malformed data and thrown key-bearing errors never leak as output',async()=>{
  const malformed=await requestYoutubePreview(id,config,signal(),async()=>Response.json({items:'wrong'}))
  assert.equal(malformed.reason,'invalid-response')
  const failed=await requestYoutubePreview(id,config,signal(),async()=>{throw Error(config.apiKey)})
  assert.deepEqual(failed,{status:'unavailable',reason:'network'})
  assert.ok(!JSON.stringify(failed).includes(config.apiKey))
})
test('only official HTTPS video links produce IDs',()=>{
  for(const link of [`https://youtu.be/${id}`,`https://www.youtube.com/watch?v=${id}`,`https://www.youtube.com/shorts/${id}`]) assert.equal(youtubeVideoId(link),id)
  for(const link of [`http://youtu.be/${id}`,`https://youtube.com.evil.example/watch?v=${id}`,`https://u:p@youtu.be/${id}`,'javascript:alert(1)']) assert.equal(youtubeVideoId(link),undefined)
})
const preview={videoId:id,title:'영상',channelTitle:'채널',thumbnailUrl:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
test('image bytes are fetched without persistent cache or cookies',async()=>{
  const blob=await requestYoutubeImage(preview,signal(),async(_url,options)=>{
    assert.equal(options.cache,'no-store');assert.equal(options.credentials,'omit');assert.equal(options.referrerPolicy,'no-referrer')
    return new Response(new Uint8Array([1,2,3]),{headers:{'content-type':'image/jpeg'}})
  })
  assert.equal(blob.size,3)
})
test('untrusted, oversized, failed and cancelled images are not exposed',async()=>{
  assert.equal(await requestYoutubeImage({...preview,thumbnailUrl:'https://evil.example/x'},signal(),()=>{throw Error('must not fetch')}),undefined)
  for(const response of [new Response('svg',{headers:{'content-type':'image/svg+xml'}}),new Response('large',{headers:{'content-type':'image/jpeg','content-length':String(3*1024*1024)}}),new Response(null,{status:404})]) {
    assert.equal(await requestYoutubeImage(preview,signal(),async()=>response),undefined)
  }
  const controller=new AbortController()
  assert.equal(await requestYoutubeImage(preview,controller.signal,async()=>{controller.abort();return new Response('image',{headers:{'content-type':'image/jpeg'}})}),undefined)
})

import type {B02ViewData} from '../../solutions/B02'
/** Approved display wording, without changing the server's responsibility enum. */
export function presentResult<T extends B02ViewData>(data:T):T {
 const unspecified=(value:string)=>!value.trim()||/^[-–—](?:\s*[（(][\s\S]*[）)])?$/.test(value.trim())
 return {...data,responsibility:unspecified(data.responsibility)?data.id==='욕실·수도:11'?'해당 없음':'부담 주체 확인 필요':data.responsibility,
 duration:unspecified(data.duration)?'확인 필요':data.duration}
}

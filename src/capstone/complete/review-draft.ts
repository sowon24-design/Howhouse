import type {B02ViewData} from '../../solutions/B02'
export function reviewDraft(data:B02ViewData){
 return {kind:'해결 후기',title:`${data.title} 해결 후기`.slice(0,60),body:[`${data.title} 문제로 어쩌집의 안내를 확인했어요.`, '지금은 문제가 해결됐어요.', '안내받은 해결 방법', ...data.steps.map((step,i)=>`${i+1}. ${step.title}`), '직접 해 본 방법과 도움이 된 점을 여기에 적어 주세요.'].join('\n\n').slice(0,1000),tags:''}
}

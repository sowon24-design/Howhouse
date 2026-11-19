import test from 'node:test'
import assert from 'node:assert/strict'
import { mainRoute } from '../src/capstone/complete/main-routing.ts'

test('legacy category links enter the main controller for all eight categories', () => {
  const categories = ['화장실','보일러','수도·수질','세탁기','전기·조명','냉장고','해충','곰팡이']
  const nodes = ['1042:12024','1042:12068','1042:12112','1042:12155','1042:12200','1042:12244','1042:12286','1042:12328']
  nodes.forEach((id,index) => assert.equal(mainRoute('#screen/'+id),'#solutions/'+encodeURIComponent(categories[index])))
})
test('main case identity and search routes are preserved without selecting substitute data', () => {
  for (const route of ['#case/'+encodeURIComponent('욕실·수도:2'),'#search','#home']) assert.equal(mainRoute(route),route)
  assert.equal(mainRoute('#screen/1042:11167'),'#search')
  assert.equal(mainRoute('#screen/1042:13183'),'#search')
})
test('only additional flows and explicitly read-only Figma fixtures bypass main', () => {
  for (const route of ['#community','#screen/336:30472','#screen/1042:10739','#analysis-result','#frame/1042:12068']) assert.equal(mainRoute(route),null)
  assert.equal(mainRoute('#categories'),null)
  assert.equal(mainRoute('#screen/336:27506'),null)
  assert.equal(mainRoute('#screen/336:30827'),null)
  assert.equal(mainRoute('#my'),null)
})

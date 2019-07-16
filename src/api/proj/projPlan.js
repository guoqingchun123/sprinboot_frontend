import http from '@/utils/http'

//查找当前项目的项目计划
export function fetchProjPlan(query) {
  return http.get('/api/projPlan/projStep', {
    params: query
  })
}
//添加项目计划信息
export function insertProjPlanInfo(data) {
  return http.post('/api/projPlan/projStep', data)
}
//编辑项目计划
export function modifyProjPlanInfo(data) {
  return http.put('/api/projPlan/projStep',data)
}
//删除项目计划
export function removePlanStep(ids) {
  return http.delete('/api/projPlan/projStep/'+ ids)
}

//上移项目计划
export function upProjInfo(data) {
  return http.put('/api/projPlan/projPlanStep',data)
}

//下移项目计划
export function downProjInfo(data) {
  return http.put('/api/projPlan/projPlanInfo',data)
}

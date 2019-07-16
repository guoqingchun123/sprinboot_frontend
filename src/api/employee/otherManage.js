import http from '@/utils/http'
//获取项目周报列表
export function fetchProWeekly(query) {
  return http.get('/api/projPlan/fetchProWeekly', {
    params: query
  })
}
//获取季度自评列表
export function fetchQuqEvaluate(query) {
  return http.get('/api/projPlan', {
    params: query
  })
}
//季度自评默认展示
export function defaultQuaEvaluate(query) {
  return http.get('/api/projPlan3', {
    params: query
  })
}
//获取季度自评展示列表
export function showQuqEvaluate(query) {
  return http.get('/api/projPlan2', {
    params: query
  })
}
//季度自评新增
export function createQuaEvaluate(data) {
  return http.post('/api/projPlan', data)
}
//季度自评修改
export function modifyQuaEvaluate(data) {
  return http.put('/api/projPlan', data)
}
//季度自评提交
export function submitQuaEvaluate(query) {
  return http.put('/api/projPlan3', query)
}
//季度自评审核
export function approvalQuaEvaluate(data) {
  return http.put('/api/projPlan2', data)
}
//季度自评删除
export function removeQuaEvaluate(ids) {
  return http.delete('/api/projPlan/', ids)
}
//项目周报弹窗
export function fetchWeeklyLog(query) {
  return http.get('/api/projPlan/fetchWeeklyLog', {
    params: query
  })
}
//审核项目周报
export function approvalSchedule(query) {
  return http.put('/api/schedules/approvalSchedule', query)
}

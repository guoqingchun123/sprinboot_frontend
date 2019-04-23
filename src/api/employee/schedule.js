import http from '@/utils/http'

//根据日期获取行事历信息
export function fetchSchedules(query) {
  return http.get('/api/schedules', {
    params: query
  })
}
//获得当前用户所在的执行中的项目
export function fetchProjInfos(query) {
  return http.get('/api/schedules/projInfos', {
    params: query
  })
}
//级联的项目任务信息（当前用户、进行中）
export function fetchTaskInfos(query) {
  return http.get('/api/schedules/taskInfos', {
    params: query
  })
}
//新增保存行事历
export function insertSchedule(query) {
  return http.post('/api/schedules', query)
}
//删除行事历
export function deleteSchedule(id) {
  return http.delete('/api/schedules/' + id)
}
//当前用户分页查询行事历信息
export function fetchSchedulesByPage(query) {
  return http.get('/api/schedules/schedulesByPage', {
    params: query
  })
}
//当前用户分页查询未审核行事历
export function fetchAuditDatas(query) {
  return http.get('/api/schedules/auditDatas', {
    params: query
  })
}
//当前用户分页查询所有审核行事历
export function fetchAuditAll(query) {
  return http.get('/api/schedules/auditAll', {
    params: query
  })
}
//审核行事历
export function approvalSchedule(query) {
  return http.put('/api/schedules/approvalSchedule', query)
}
//当前用户分页查询已审核行事历
export function fetchCancelDatas(query) {
  return http.get('/api/schedules/cancelDatas', {
    params: query
  })
}
//撤销审核行事历
export function cancelApproval(query) {
  return http.put('/api/schedules/cancelApproval', query)
}

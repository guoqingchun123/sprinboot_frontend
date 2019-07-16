import http from '@/utils/http'

//根据日期获取日报信息
export function fetchSchedules(query) {
  return http.get('/api/schedules', {
    params: query
  })
}
export function fetchMySchedules(query) {
  return http.get('/api/mySchedules', {
    params: query
  })
}
//新增保存我的日报
export function insertMySchedule(query) {
  return http.post('/api/mySchedules', query)
}
//修改我的日报
export function modifyMySchedule(data) {
  return http.put('/api/mySchedules', data)
}
//获得当前用户所在的执行中的项目
export function fetchProjInfos(query) {
  return http.get('/api/schedules/projInfos', {
    params: query
  })
}
//获得当前用户所在部门
export function fetchDeptInfos(query) {
  return http.get('/api/schedules/deptInfos', {
    params: query
  })
}
//级联的项目任务信息（当前用户、进行中）
export function fetchTaskInfos(query) {
  return http.get('/api/schedules/taskInfos', {
    params: query
  })
}
//新增保存日报
export function insertSchedule(query) {
  return http.post('/api/schedules', query)
}
//删除日报
export function deleteSchedule(id) {
  return http.delete('/api/schedules/' + id)
}

//当前用户分页查询未审核日报
export function fetchAuditDatas(query) {
  return http.get('/api/schedules/auditDatas', {
    params: query
  })
}
//当前用户分页查询所有审核日报
export function fetchAuditAll(query) {
  return http.get('/api/schedules/auditAll', {
    params: query
  })
}
//审核日报
export function approvalSchedule(query) {
  return http.put('/api/schedules/approvalSchedule', query)
}
//当前用户分页查询已审核日报
export function fetchCancelDatas(query) {
  return http.get('/api/schedules/cancelDatas', {
    params: query
  })
}
//撤销审核日报
export function cancelApproval(query) {
  return http.put('/api/schedules/cancelApproval', query)
}
//审核日报查询
export function fetchAuditSchedules(query) {
  return http.get('/api/schedules/auditSchedules', {
    params: query
  })
}
//审核日报
export function auditHandle(query) {
  return http.put('/api/schedules/auditSchedules', query)
}
//撤销审核日报
export function cancelHandle(query) {
  return http.put('/api/schedules/cancelSchedules', query)
}
//我的日报导出
export function exportSchedule(query) {
  return http.get('/api/schedules/exportSchedule', {
    params: query
  })
}

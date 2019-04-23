import http from '@/utils/http'
//获取项目信息列表
export function fetchBasicProjInfo(query) {
  return http.get('/api/proj/projList', {
    params: query
  })
}
//添加项目信息
export function insertProjInfo(data) {
  return http.post('/api/proj/projList', data)
}
//修改项目信息
export function updateProjInfo(data) {
  return http.put('/api/proj/projList', data)
}
//删除项目信息
export function deleteProjInfo(id) {
  return http.delete('/api/proj/projList/' + id)
}
//获取任务信息列表
export function fetchTaskInfo(query) {
  return http.get('/api/proj/projTaskList', {
    params: query
  })
}
//添加任务信息
export function insertProjTaskInfo(data) {
  return http.post('/api/proj/insertProjTask', data)
}
//修改任务信息
export function updateProjTaskInfo(data) {
  return http.put('/api/proj/updateProjTask', data)
}
//删除任务信息
export function deleteProjTaskInfo(id) {
  return http.delete('/api/proj/deleteProjTask/' + id)
}
//审批同意
export function approvalAgree(data) {
  return http.post('/api/proj/approvalAgreeProject', data)
}
//审批拒绝
export function approvalRefuse(data) {
  return http.post('/api/proj/approvalRefuseProject', data)
}
//项目分发时确定操作
export function distribute(data) {
  return http.put('/api/proj/distributeProject', data)
}
//项目签收时的操作
export function endApproval(data) {
  return http.put('/api/proj/endApproval', data)
}
//获取审批及记录信息列表
export function fetchApproveLog(query) {
  return http.get('/api/proj/getApprovalLog', {
    params: query
  })
}
//获取售前项目信息列表
export function fetchPresaleProjInfo(query) {
  return http.get('/api/proj/presaleProjInfo', {
    params: query
  })
}
//添加/修改/删除售前项目信息
export function savePresaleProjInfo(data) {
  return http.post('/api/proj/presaleProjInfo', data)
}
//查找当前项目的项目计划
export function fetchProjPlan(query) {
  return http.get('/api/projPlan/fetchProjPlan', {
    params: query
  })
}
//添加项目计划信息
export function insertProjPlanInfo(data) {
  return http.post('/api/projPlan/insertProjPlan', data)
}
//编辑项目计划
export function modifyProjPlanInfo(data) {
  return http.put('/api/projPlan/modifyProjPlanInfo',data)
}

//新增项目中初始数据查询
export function fetchProjData() {
  return http.get('/api/proj/projParam')
}
//根据选择客户查询客户联系人
export function fetchCustCard(query) {
  return http.get('/api/proj/custCardList', {
    params: query
  })
}
//上传文件数据
export function importProjFunction(data) {
  return http.post('/api/proj/importProjFunction', data)
}

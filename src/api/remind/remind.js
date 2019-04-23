import http from '@/utils/http'

//查询员工合同到期信息
export function queryEmpContractEndDate(query) {
  return http.get('/api/remind/contractEndRemind', {
    params: query
  })
}
//续签员工合同
export function changeSignState(data) {
  return http.put('/api/remind/contractEndRemind', data)
}
//中止员工合同
export function stopEmpContract(data) {
  return http.put('/api/remind/stopEmpContract', data)
}
//查询服务到期信息
export function queryServiceDueInfo(query) {
  return http.get('/api/remind/serviceDueRemind', {
    params: query
  })
}
//查询联系客户信息
export function queryContactCustomInfo(query) {
  return http.get('/api/remind/contactCustomRemind', {
    params: query
  })
}
//修改联系客户时间
export function editContactCustomInfo(data) {
  return http.put('/api/remind/contactCustomRemind', data)
}
//查询客户巡检回访信息
export function queryPotralVisitInfo(query) {
  return http.get('/api/remind/getPotralVisit', {
    params: query
  })
}
//修改巡检回访时间
export function editPotralVisitInfo(data) {
  return http.put('/api/remind/editPotralVisit', data)
}
//查询客户巡检回访提醒
export function queryInspectionlVisitRemind(query) {
  return http.get('/api/remind/queryInspectionlVisitRemind', {
    params: query
  })
}
//查询我的工作提醒
export function queryMyWorkRemind(query) {
  return http.get('/api/remind/queryMyWorkRemind', {
    params: query
  })
}

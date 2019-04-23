import http from '@/utils/http'

//服务记录查询
export function fetchServiceManage(query) {
  return http.get('/api/serviceManage', {
    params: query
  });
}
//服务记录新增
export function createServiceManage(data) {
  return http.post('/api/serviceManage', data)
}
//服务记录修改
export function modifyServiceManage(data) {
  return http.put('/api/serviceManage', data)
}
//服务记录删除
export function removeServiceManage(ids) {
  return http.delete('/api/serviceManage/' + ids)
}
//服务调度查询
export function fetchRecordScheduling(query) {
  return http.get('/api/serviceScheduling', {
    params: query
  });
}
//服务调度人员匹配
export function empDistribution(data) {
  return http.post('/api/serviceScheduling', data)
}
//导入员工数据
export function importEmpInfoExcel(file,data) {
  http.upload('/api/empManage/importEmpInfoExcel',file,data)
}
export function importEmpInfoFunction(data) {
  http.post('/api/empManage/importEmpInfo',data)
}

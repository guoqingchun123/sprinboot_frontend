import http from '@/utils/http'

//查询差旅明细
export function fetchTravelDatas(query) {
  return http.get('/api/travels', {
    params: query
  })
}
//查询差旅明细
export function fetchTravelByMonth(query) {
  return http.get('/api/travels/byMonth', {
    params: query
  })
}

//查询我的差旅明细
export function fetchTravels(query) {
  return http.get('/api/myTravels', {
    params: query
  })
}

//导入差旅明细文件
export function importTravel(file,data) {
  return http.upload('/api/importTravel',file,data)
}

//新增或者修改差旅
export function modifyTravel(data) {
  return http.put('/api/travels', data)
}
//删除差旅记录
export function deleteTravel(ids) {
  return http.delete('/api/travels/' + ids)
}
//下载模板
export function downloadTemplate(data) {
  return http.download('/api/travels/template',data)
}
//查询项目名称
export function fetchTravelsByEmpId(query) {
  return http.get('/api/fetchProNames', {
    params: query
  })
}
//获取部门、出差人
export function fetchDeptEmpInfo() {
  return http.get('/api/fetchDeptEmp')
}
//差旅信息导出
export function exportEmpTravel(data){
  return http.post('/api/travels/exportEmpTravel',data)
}
//我的差旅信息导出
export function exportMyEmpTravel(data) {
  return http.post('/api/travels/exportMyEmpTravel',data)
}
//excel下载
export function downloadTravelExcel(query) {
  return http.get('/api/travels/exportTravels',{
    params: query
  })
}
//查询部门名称
export function fetchDepts(query) {
  return http.get('/api/empTravel/listDepts', {
    params: query
  })
}
//查询差旅最后报销时间
export function fetchTravalTime(data) {
  return http.get('/api/travel/times',data)
}
//修改差旅最后报销时间
export function modifyTravalTime(data) {
  return http.post('/api/travel/times/'+data)
}

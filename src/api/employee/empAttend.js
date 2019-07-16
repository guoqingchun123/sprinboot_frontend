import http from '@/utils/http'

export function fetchEmpAttend(query) {
  return http.get('/api/empAttends', {
    params: query
  })
}
export function fetchAttendLog(query) {
  return http.get('/api/attendLogs', {
    params: query
  })
}
/*export function fetchMyAttend(query) {
  return http.post('/api/employ/myAttend', query)
}*/
//查询节假日配置
export function fetchHolidayConfig(query) {
  return http.get('/api/holidayConfigs', {
    params: query
  })
}
export function modifyHolidayConfig(data) {
  return http.put('/api/holidayConfigs', data)
}
export function createHolidayConfig(data) {
  return http.post('/api/holidayConfigs', data)
}
//删除节假日配置
export function deleteHolidayConfig(id) {
  return http.delete('/api/holidayConfigs/' + id)
}
//导入节假日配置数据
export function importHolidayConfigExcel(file) {
  return http.upload('/api/holidayConfigs/excel',file)
}
//读取数据存入数据库
export function importHolidayConfigFunction(data) {
  return http.post('/api/holidayConfigs/importExcel',data)


}
//考勤信息导入
export function importAttend(file,data) {
  return http.upload('/api/listEmpAttend/importAttend',file,data)
}
//模板下载
export function downloadTemplate(data) {
    return http.download('/api/listEmpAttend/Attend',data)
}

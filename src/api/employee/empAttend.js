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

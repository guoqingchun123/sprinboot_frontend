import http from '@/utils/http-portal'

export function initDicts(code) {
  return http.get('/api/dicts/' + code)
}
export function initEnums(code) {
  return http.get('/api/enums/' + code)
}
//查询系统字典
export function fetchDicts(query) {
  return http.get('/api/dicts', {
    params: query
  })
}
export function fetchCurrentDicts(current, query) {
  return http.get('/api/dicts/' + current, {
    params: query
  })
}
export function createDict(data) {
  return http.post('/api/dicts', data)
}
export function modifyDict(data) {
  return http.put('/api/dicts', data)
}
export function removeDicts(codes) {
  return http.delete('/api/dicts/' + codes)
}
import http from '@/utils/http'

export function initDepts() {
  return http.get('/api/departments')
}
export function initDicts(code) {
  return http.get('/api/dicts/' + code)
}
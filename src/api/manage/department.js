import http from '@/utils/http'

export function fetchAllDepartments() {
  return http.get('/api/departments/all')
}
export function fetchDepartments(query) {
  return http.get('/api/departments', {
    params: query
  })
}
export function createDepartment(data) {
  return http.post('/api/departments', data)
}
export function modifyDepartment(data) {
  return http.put('/api/departments', data)
}
export function removeDepartments(ids) {
  return http.delete('/api/departments/' + ids)
}

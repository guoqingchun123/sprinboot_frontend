import http from '@/utils/http'

export function fetchDepts(query) {
  return http.get('/api/systemManage/listDepts', {
    params: query
  })
}
export function modifyDept(data) {
  return http.put('/api/systemManage/modifyDept',data)
}
export function deleteDept(id) {
  return http.delete('/api/systemManage/' + id)
}
export function mergeDept(data) {
  return http.put('/api/systemManage/mergeDepts',data)
}
export function splitDept(data) {
  return http.put('/api/systemManage/splitDept',data)
}
export function fetchEmpByDeptId(query) {
  return http.get('/api/systemManage/fetchEmpByDeptId', {
    params: query
  })
}

export function fetchPrincipal(query) {
  return http.get('/api/systemManage/fetchPrincipal', {
    params: query
  })
}


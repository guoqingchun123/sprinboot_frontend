import http from '@/utils/http'

export function fetchListAreas(query) {
  return http.get('/api/empManage/listBranch', {
    params: query
  })
}
export function modifyAreaNode(data) {
  return http.put('/api/empManage/modifyBranch', data)
}
export function deleteBranch(id) {
  return http.delete('/api/empManage/' + id)
}


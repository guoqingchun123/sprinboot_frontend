import http from '@/utils/http'

//获取行政区信息
export function queryDepts(query) {
  return http.get('/center/api/dept/query', {params: query})
}

export function saveOrUpdateDept(query) {
  return http.post('/center/api/dept/insertOrUpdate', {params: query})
}

export function deleteDept(query) {
  return http.post('/center/api/dept/delete', {params: query})
}


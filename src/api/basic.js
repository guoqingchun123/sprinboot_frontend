import http from '@/utils/http'

// 查询用户列表
export function fetchDivisions(query) {
  return http.get('/api/center/divisions', {
    params: query
  })
}

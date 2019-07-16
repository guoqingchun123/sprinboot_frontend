import http from '@/utils/http'

//查询司龄信息
export function fetchWorkYear(query) {
  return http.get('/api/employee/ageAllowance', {
    params: query
  })
}


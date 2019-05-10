import http from '@/utils/http'


//获取银行信息
export function queryDepts(query) {
  return http.get('/center/api/BankController/query', {params: query})
}

export function saveOrUpdateDept(query) {
  return http.post('/center/api/BankController/insertOrUpdate', {params: query})
}

export function deleteDept(query) {
  return http.post('/center/api/BankController/delete', {params: query})
}


import http from '@/utils/http'

//根据获取从业机构信息
export function queryCompanys(query) {
  return http.get('/center/api/company/queryCompanys', {
    params: query
  })
}


//新增从业机构
export function insertCompany(query) {
  return http.post('/center/api/company/insertCompany', query,{
    ignoreToken :true
  })
}

//删除从业机构
export function deleteCompany(id) {
  return http.delete('/center/api/company/' + id)
}

//修改从业机构
export function updateCompany(query) {
  return http.post('/center/api/company/updateCompany', query)
}


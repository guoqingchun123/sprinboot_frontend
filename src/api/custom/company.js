import http from '@/utils/http'

//根据日期获取行事历信息
export function queryCompanys(query) {
  return http.get('center/api/company/queryCompanys', {
    params: query
  })
}


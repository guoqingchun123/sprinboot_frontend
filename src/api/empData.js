import request from '@/utils/request'

export function fetchEmpData(query) {
  return request({
    url: '/empData/empData',
    method: 'get',
    params: query
  })
}

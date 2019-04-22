import request from '@/utils/request'

export function fetchAreas(query) {
  return request({
    url: '/authority/areas',
    method: 'get',
    params: query
  })
}
export function fetchRoles(query) {
  return request({
    url: '/authority/roles',
    method: 'get',
    params: query
  })
}

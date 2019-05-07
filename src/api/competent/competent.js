import http from '@/utils/http'


export function fetchRoles(query) {
  return http.get('/center/api/competent/queryCompetents', {
    params: query
  })
}

export function createRole(query) {
  return http.post('/center/api/competent/insertCompetent', {params: query})
}

export function removeRoles(competentGuids) {
  return http.delete('/center/api/competent/removeCompetent/' + competentGuids)
}

export function modifyRole(data) {
  return http.put('/center/api/competent/updateCompetent', data)
}

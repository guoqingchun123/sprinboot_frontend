import http from '@/utils/http'

/*行政区域管理*/
export function fetchDivisions(query) {
  return http.get('/api/center/divisions', {
    params: query
  })
}

export function showRemoveBtn(ids) {
  return http.get('/api/center/showRemoveBtn/' + ids)
}

export function removeDivisions(ids) {
  return http.delete('/api/center/divisions/' + ids)
}

export function createDivision(data) {
  return http.post('/api/center/divisions', data)
}

export function modifyDivision(data) {
  return http.put('/api/center/divisions', data)
}

export function fetchAllDivisions() {
  return http.get('/api/center/fetchAllDivisions')
}

/*小区管理*/
export function fetchRegions(query) {
  return http.get('/api/center/regions', {
    params: query
  })
}

export function showRegionRemoveBtn(ids) {
  return http.get('/api/center/showRemoveBtn/' + ids)
}
//
// export function removeDivisions(ids) {
//   return http.delete('/api/center/divisions/' + ids)
// }
//
// export function createDivision(data) {
//   return http.post('/api/center/divisions', data)
// }
//
// export function modifyDivision(data) {
//   return http.put('/api/center/divisions', data)
// }
export function fetchProjects(query) {
  return http.get('/api/center/projects', {
    params: query
  })
}
export function fetchNoRegionProjects(query) {
  return http.get('/api/center/noRegionProjects', {
    params: query
  })
}
export function removeRegionProjects(ids) {
  return http.delete('/api/center/removeRegionProjects/' + ids)
}
export function addRegionProjects(data) {
  return http.post('/api/center/addRegionProjects', data)
}

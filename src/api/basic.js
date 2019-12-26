import http from '@/utils/http-center'

export function configUrl(url) {
  if (process.env.VUE_APP_CENTER_API !== '/' && url && url.indexOf(process.env.VUE_APP_CENTER_API) !== 0) {
    return process.env.VUE_APP_CENTER_API + url
  }
  return url
}

//文件上传通用接口
export function uploadFile(file, data) {
  return http.upload('/api/portal/files/upload', file, data)
}

export function deleteFile(ids) {
  return http.delete('/api/portal/files/' + ids)
}

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

export function fetchCityDivisionRegions() {
  return http.get('/api/center/cityDivisionRegions')
}

/*小区管理*/
export function fetchRegions(query) {
  return http.get('/api/center/regions', {
    params: query
  })
}

export function fetchAllRegions(query) {
  return http.get('/api/center/fetchAllRegions', {
    params: query
  })
}

export function showRegionRemoveBtn(ids) {
  return http.get('/api/center/showRemoveBtn/' + ids)
}

export function removeRegion(ids) {
  return http.delete('/api/center/region/' + ids)
}

export function createRegion(data) {
  return http.post('/api/center/region', data)
}

export function modifyRegion(data) {
  return http.put('/api/center/region', data)
}

export function checkRegionName(regionName) {
  return http.get('/api/center/checkRegionName/'+ regionName)
}
/*企业管理*/
export function fetchCorp(query) {
  return http.get('/api/center/corps', {
    params: query
  })
}

/*预售证管理*/
export function fetchProSaleCard(query) {
  return http.get('/api/center/fetchProSaleCard', {
    params: query
  })
}

/*未处理楼栋管理*/
export function fetchBldinfo(query) {
  return http.get('/api/center/fetchBldinfo', {
    params: query
  })
}

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
export function removeRegionProjects(data) {
  return http.delete('/api/center/removeRegionProjects', {
    params: data
  })
}

export function addRegionProjects(data) {
  return http.post('/api/center/addRegionProjects', data)
}

export function modifyRegionLnglat(data) {
  return http.put('/api/center/regionLnglat', data)
}

export function updateRegionState(data) {
  return http.put('/api/center/regionState', data)
}
export function updateRegionCheck(data) {
  return http.put('/api/center/regionCheck', data)
}
export function fetchRegionFiles(query) {
  return http.get('/api/portal/files', {
    params: query
  })
}

export function fetchRegion(id) {
  return http.get('/api/center/region/'+id)
}

export function addBldCoordinate(data) {
  return http.put('/api/center/bldCoordinate', data)
}

export function fetchRegionBlds(query) {
  return http.get('/api/center/blds', {
    params: query
  })
}

export function fetchBldFloors(query) {
  return http.get('/api/center/bldFloors', {
    params: query
  })
}

export function updateBldFloor(data) {
  return http.put('/api/center/bldFloor', data)
}

export function addCellCoordinate(data) {
  return http.post('/api/center/cellCoordinate', data)
}

export function fetchFloor(query) {
  return http.get('/api/center/floor', {
    params: query
  })
}

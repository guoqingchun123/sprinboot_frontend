import http from '@/utils/http'

export function fetchAllCatalogs() {
  return http.get('/api/file/catalogs/all')
}

export function fetchCatalogs(query) {
  return http.get('/api/file/catalogs', {
    params: query
  })
}

export function createCatalog(data) {
  return http.post('/api/file/catalogs', data)
}
export function modifyCatalog(data) {
  return http.put('/api/file/catalogs', data)
}
export function removeCatalog(id) {
  return http.delete('/api/file/catalogs/' + id)
}

export function createBatch(data) {
  return http.post('/api/file/catalogs/batches', data)
}

export function modifyBatch(data) {
  return http.put('/api/file/catalogs/batches', data)
}
export function removeBatch(data) {
  return http.post('/api/file/catalogs/batches/remove', data)
}

export function fetchDatas(query) {
  return http.get('/api/file/datas', {
    params: query
  })
}

export function modifyData(data) {
  return http.put('/api/file/datas', data)
}
export function modifyDatas(ids, data) {
  return http.put('/api/file/datas/' + ids, data)
}

export function removeDatas(ids) {
  return http.delete('/api/file/datas/' + ids)
}

export function uploadData(file, data) {
  return http.upload('/api/file/uploads', file, data)
}

export function rotateData(id, data) {
  return http.put('/api/file/datas/' + id + '/rotate', data)
}

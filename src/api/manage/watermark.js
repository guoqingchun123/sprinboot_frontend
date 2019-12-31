import http from '@/utils/http'

export function fetchWatermarks() {
  return http.get('/api/file/watermarks')
}
export function uploadWatermark(file, data) {
  return http.upload('/api/file/watermarks', file, data)
}
export function removeWatermarks(ids) {
  return http.delete('/api/file/watermarks/' + ids)
}
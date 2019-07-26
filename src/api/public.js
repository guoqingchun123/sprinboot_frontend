import http from '@/utils/http'

/*政务公开*/
export function fetchPublishes(query) {
  return http.get('/api/public/publishes', {
    params: query
  })
}

export function createPublish(data) {
  return http.post('/api/public/publishes', data)
}

export function modifyPublish(data) {
  return http.put('/api/public/publishes', data)
}

export function removePublish(ids) {
  return http.delete('/api/public/publishes/' + ids)
}

import http from '@/utils/http'

/*政务公开*/
export function fetchPublishes(query) {
  return http.get('/api/public/publishes', {
    params: query
  })
}


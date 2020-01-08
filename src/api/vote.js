import http from '@/utils/http-public'

/*公共事项表决*/
export function fetchVoteItems(query) {
  return http.get('/api/public/voteItems', {
    params: query
  })
}

export function createVoteItem(data) {
  return http.post('/api/public/voteItems', data)
}

export function modifyVoteItem(data) {
  return http.put('/api/public/voteItems', data)
}

export function removeVoteItem(ids) {
  return http.delete('/api/public/voteItems/' + ids)
}

export function fetchAllVoteItems() {
  return http.get('/api/public/voteItems/all')
}

export function fetchVoteStandards(query) {
  return http.get('/api/public/voteStandards', {
    params: query
  })
}

export function createVoteStandard(data) {
  return http.post('/api/public/voteStandards', data)
}

export function modifyVoteStandard(data) {
  return http.put('/api/public/voteStandards', data)
}

export function removeVoteStandard(ids) {
  return http.delete('/api/public/voteStandards/' + ids)
}

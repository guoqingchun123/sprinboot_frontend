import http from '@/utils/http-public'

/*公共事项表决*/
export function fetchVoteStandards(query) {
  return http.get('/api/public/voteStandards', {
    params: query
  })
}

export function createVoteStandard(data) {
  return http.post('/api/public/voteStandard', data)
}

export function modifyVoteStandard(data) {
  return http.put('/api/public/voteStandard', data)
}

export function removeVoteStandard(ids) {
  return http.delete('/api/public/voteStandard/' + ids)
}

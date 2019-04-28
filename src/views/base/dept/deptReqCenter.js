import http from '@/utils/http'
// import MD5 from 'crypto-js/md5'
// import Base64 from 'crypto-js/enc-base64'
// import Utf8 from 'crypto-js/enc-utf8'


export function fetchUsers(query) {
  return http.get('/api/users', {
    params: query
  })
}


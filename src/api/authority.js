import http from '@/utils/http'
import MD5 from 'crypto-js/md5'
import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'

export function login(authority) {
  /*const data = {
    id,
    password
  }*/
  // console.log(MD5('666666').toString())
  // console.log(Base64.stringify(Utf8.parse('666666')))
  authority.userPass = Base64.stringify(Utf8.parse(MD5(authority.userPass).toString()))
  return http.post('/api/authority/login', authority)
}

export function logout() {
  return http.post('/api/authority/logout', null, {
    ignoreToken: true
  })
}

export function refresh(refreshToken) {
  return http.post('/api/authority/token', {
    refreshToken: refreshToken
  }, {
    ignoreToken: true
  })
}

export function getInfo(token) {
  return http.get('/api/authority/info', {
    params: {
      token
    }
  })
}

export function fetchAreas(query) {
  return http.get('/api/authority/areas', {
    params: query
  })
}

export function fetchRoles(query) {
  return http.get('/api/roles', {
    params: query
  })
}

export function createRole(data) {
  return http.post('/api/roles', data)
}

export function modifyRole(data) {
  return http.put('/api/roles', data)
}

export function removeRoles(ids) {
  return http.delete('/api/roles/' + ids)
}

export function fetchAll2(query) {
  return http.get('/api/roles2', {
    params: query
  })
}

export function fetchRoutes(id) {
  return http.get('/api/roles/' + id + '/routes')
}

export function saveRoutes(id, data) {
  return http.post('/api/roles/' + id + '/routes', data)
}

export function fetchUsers(query) {
  return http.get('/api/users', {
    params: query
  })
}

// 保存用户头像
export function modifyAvatar(avatar) {
  return http.put('/api/users/avatar', avatar)
}

export function getUser(id) {
  return http.get('/api/users/' + id)
}

export function editUser(data) {
  return http.put('/api/users', data)
}

export function resetPass(data) {
  return http.put('/api/users/resetPass', data)
}

//查询用户权限
export function fetchGrants(id) {
  return http.get('/api/users/' + id + '/roles')
}

//保存用户授权角色
export function saveGrants(id, data) {
  return http.put('/api/users/' + id + '/roles', data)
}

//种子文件查询
export function fetchToken(query) {
  return http.get('/api/token', {
    params: query
  })
}

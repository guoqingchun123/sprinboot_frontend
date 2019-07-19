import http from '@/utils/http'
import MD5 from 'crypto-js/md5'
import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'

/******************************************************系统登录 BEGIN*******************************************************/
export function login(authority) {
  let authorityRequest = {...authority}
  authorityRequest.loginType = process.env.VUE_APP_LOGINTYPE
  if (process.env.VUE_APP_LOGINTYPE === 'password') {
    authorityRequest.password = Base64.stringify(Utf8.parse(MD5(authority.password).toString()))
  }
  return http.post('/api/authority/login', authorityRequest)
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

export function getInfo() {
  return http.get('/api/authority/info')
}

/******************************************************角色管理 BEGIN*******************************************************/
export function fetchRoles(query) {
  return http.get('/api/portal/roles', {
    params: query
  })
}

export function createRole(data) {
  return http.post('/api/portal/roles', data)
}

export function modifyRole(data) {
  return http.put('/api/portal/roles', data)
}

export function removeRoles(ids) {
  return http.delete('/api/portal/roles/' + ids)
}

export function showRemove(id) {
  return http.get('/api/portal/showRemove/' + id)
}

export function fetchAll2(query) {
  return http.get('/api/portal/roles2', {
    params: query
  })
}

export function fetchRoutes(id) {
  return http.get('/api/portal/roles/' + id + '/routes')
}

export function saveRoutes(id, data) {
  return http.post('/api/portal/roles/' + id + '/routes', data)
}

/******************************************************字典管理 BEGIN*******************************************************/
export function initDicts(code) {
  return http.get('/api/portal/dicts/' + code)
}

//查询系统字典
export function fetchDicts(query) {
  return http.get('/api/portal/dicts', {
    params: query
  })
}

export function createDict(data, path) {
  if (!path) {
    return http.post('/api/portal/dicts', data)
  }
  return http.post('/api/portal/dicts/' + path, data)
}

export function modifyDict(data, path) {
  if (!path) {
    return http.put('/api/portal/dicts', data)
  }
  return http.put('/api/portal/dicts/' + path, data)
}

export function removeDicts(codes, path) {
  if (!path) {
    return http.delete('/api/portal/dicts/' + codes)
  }
  return http.delete('/api/portal/dicts/' + path + '/' + codes)
}

/******************************************************用户管理 BEGIN*******************************************************/

// 查询用户列表
export function fetchUsers(query) {
  return http.get('/api/portal/users', {
    params: query
  })
}

// 新增用户
export function selectUser(userId) {
  return http.get('/api/portal/user/' + userId)
}

// 新增用户
export function createUser(data) {
  return http.post('/api/portal/users', data)
}

// 修改用户
export function updateUser(data) {
  return http.put('/api/portal/users', data)
}

// 删除用户
export function delUsers(userIds) {
  return http.delete('/api/portal/users/' + userIds)
}

// 保存用户头像
export function modifyAvatar(avatar) {
  return http.put('/api/portal/users/avatar', avatar)
}

// 密码重置
export function resetPass(userId) {
  return http.put('/api/portal/users/resetPass/' + userId)
}

//查询用户权限
export function fetchGrants(userId) {
  return http.get('/api/portal/users/' + userId + '/roles')
}

//保存用户授权角色
export function saveGrants(userId, data) {
  return http.put('/api/portal/users/' + userId + '/roles', data)
}

/******************************************************用户管理 END*******************************************************/

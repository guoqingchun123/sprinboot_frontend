import http from '@/utils/http'
import MD5 from 'crypto-js/md5'
import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'

export function fetchRoutes() {
  return http.get('/api/authority/routes')
}

/******************************************************系统登录 BEGIN*******************************************************/
export function login(authority) {
  /*const data = {
    id,
    password
  }*/
  // console.log(MD5('666666').toString())
  // console.log(Base64.stringify(Utf8.parse('666666')))
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
/******************************************************用户中心 BEGIN*******************************************************/
export function verifyPass(password) {
  return http.get('/api/users/verifyPass/' + password)
}
export function modifyPass(password) {
  return http.put('/api/users/modifyPass/' + password)
}
/******************************************************角色管理 BEGIN*******************************************************/
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

export function saveRoutes(id, data) {
  return http.post('/api/roles/' + id + '/routes', data)
}

/******************************************************字典管理 BEGIN*******************************************************/
export function initDicts(code) {
  return http.get('/api/dicts/' + code)
}
//查询系统字典
export function fetchDicts(query) {
  return http.get('/api/dicts', {
    params: query
  })
}
export function fetchCurrentDicts(current, query) {
  return http.get('/api/dicts/' + current, {
    params: query
  })
}
export function createDict(data, path) {
  if (!path) {
    return http.post('/api/dicts', data)
  }
  return http.post('/api/dicts/' + path, data)
}
export function modifyDict(data, path) {
  if (!path) {
    return http.put('/api/dicts', data)
  }
  return http.put('/api/dicts/' + path, data)
}
export function removeDicts(codes, path) {
  if (!path) {
    return http.delete('/api/dicts/' + codes)
  }
  return http.delete('/api/dicts/' + path + '/' + codes)
}
//增加系统字典
export function addDictInfo(query) {
  return http.post('/api/sysDict', query)
}
export function getDictByDictCode(query) {
  return http.post('/api/getDictByDictCode', query);
}
//删除一级字典
export function deleteSysDictInfo(id) {
  return http.delete('/api/sysDict/' + id)
}
//删除二级字典
export function deleteSysDictInfo2(id) {
  return http.delete('/api/sysDict2/' + id)
}
/******************************************************用户管理 BEGIN*******************************************************/
export function fetchUsers(query) {
  return http.get('/api/users', {
    params: query
  })
}

// 新增用户
export function selectUser(userId) {
  return http.get('/api/user/' + userId)
}

// 新增用户
export function createUser(data) {
  return http.post('/api/users', data)
}

// 修改用户
export function updateUser(data) {
  return http.put('/api/users', data)
}

// 删除用户
export function delUsers(userIds) {
  return http.delete('/api/users/' + userIds)
}
// 保存用户头像
export function modifyAvatar(avatar) {
  return http.put('/api/users/avatar', avatar)
}
export function modifyUser(data) {
  return http.put('/api/users', data)
}
export function resetPass(data) {
  return http.put('/api/resetPass', data)
}
//查询用户权限
export function fetchGrants(id) {
  return http.get('/api/users/' + id + '/roles')
}
//保存用户授权角色
export function saveGrants(id, data) {
  return http.put('/api/users/' + id + '/roles', data)
}
/******************************************************用户管理 END*******************************************************/

/******************************************************令牌管理 begin*******************************************************/

//导入令牌种子文件
export function importToken(file,data) {
  return http.upload('/api/import',file,data)
}

//令牌信息查询
export function fetchToken(query) {
  return http.get('/api/token', {
    params: query
  })
}

//未分配令牌查询
export function fetchUnallotToken() {
  return http.get('/api/unallotToken')
}

//个人令牌信息查询
export function fetchPersonToken(query) {
  return http.get('/api/personToken', {
    params: query
  })
}
//个人令牌解锁
export function fetchPersonUnlock(query) {
  return http.get('/api/unlock', {
    params: query
  })
}
//个人令牌挂失
export function lostPersonToken(query) {
  return http.get('/api/lost', {
    params: query
  })
}

//个人令牌禁用
export function deadPersonToken(query) {
  return http.get('/api/disable', {
    params: query
  })
}

//个人令牌启用
export function startPersonToken(query) {
  return http.get('/api/start', {
    params: query
  })
}
//个人令牌解挂
export function unlostPersonToken(query) {
  return http.get('/api/unlost', {
    params: query
  })
}
//个人令牌回收
export function backPersonToken(query) {
  return http.get('/api/back', {
    params: query
  })
}
//个人令牌新增
export function allotPersonToken(query) {
  return http.get('/api/allot', {
    params: query
  })
}

//令牌同步
export function tokenSync(query) {
  return http.get('/api/sync', {
    params: query
  })
}
/******************************************************令牌管理 END*******************************************************/

import http from '@/utils/http'
import MD5 from 'crypto-js/md5'
import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'

export function login(authority) {
  authority.userPass = Base64.stringify(Utf8.parse(MD5(authority.userPass).toString()))
  return http.post('/portal/api/authority/login', authority)
}

export function logout() {
  return http.post('/portal/api/authority/logout', null, {
    ignoreToken: true
  })
}

export function refresh(refreshToken) {
  return http.post('/portal/api/authority/token', {
    refreshToken: refreshToken
  }, {
    ignoreToken: true
  })
}

export function getInfo(token) {
  return http.get('/portal/api/authority/info', {
    params: {
      token
    }
  })
}

export function fetchAreas(query) {
  return http.get('/portal/api/authority/areas', {
    params: query
  })
}

/***********************************角色管理BEGIN***************************************/
export function fetchRoles(query) {
  return http.get('/portal/api/roles', {
    params: query
  })
}
export function createRole(data) {
  return http.post('/portal/api/roles', data)
}
export function modifyRole(data) {
  return http.put('/portal/api/roles', data)
}
export function removeRoles(ids) {
  return http.delete('/portal/api/roles/' + ids)
}
export function fetchAll2(query) {
  return http.get('/portal/api/roles2', {
    params: query
  })
}
/***********************************角色管理END***************************************/

export function fetchRoutes(id) {
  return http.get('/portal/api/roles/' + id + '/routes')
}
export function saveRoutes(id, data) {
  return http.post('/portal/api/roles/' + id + '/routes', data)
}

export function initDicts(code) {
  return http.get('/center/api/dicts/' + code)
}
//查询系统字典
export function fetchDicts(query) {
  return http.get('/center/api/dict/fetchDicts', {
    params: query
  })
}


export function fetchCurrentDicts(current, query) {
  return http.get('/center/api/dicts/' + current, {
    params: query
  })
}
export function createDict(data, parentCode) {
  data.parentCode=parentCode
  return http.post('/center/api/dict/saveDict', data)
}
export function modifyDict(data,parentCode) {
  return http.put('/center/api/dict/modifyDict' , data)
}
export function removeDicts(codes,parentCode) {
  if (!parentCode){
    //删除父类节点
    return http.delete('/center/api/dict/removeDictParent/' + codes)
  }
  return http.delete('/center/api/dict/removeDicts/' + codes)
}
//增加系统字典
export function addDictInfo(query) {
  return http.post('/center/api/sysDict', query)
}
export function getDictByDictCode(query) {
  return http.post('/center/api/getDictByDictCode', query);
}
//删除一级字典
export function deleteSysDictInfo(id) {
  return http.delete('/center/api/sysDict/' + id)
}
//删除二级字典
export function deleteSysDictInfo2(id) {
  return http.delete('/center/api/sysDict2/' + id)
}
//通过字典名称或字典代码查询字典信息
export function queryDict(query) {
  return http.post('/center/api/dict/queryDictInfo', {key:query})
}
//查询产品
export function getSysProduct(query) {
  return http.get('/portal/api/sysProduct', query)
}
//查询产品一览
export function getProducts(query) {
  return http.get('/portal/api/products', query)
}
//增加产品信息
export function addProductInfo(query) {
  return http.post('/portal/api/sysProduct', query)
}
//删除产品信息
export function deleteSysProductInfo(id) {
  return http.delete('/portal/api/sysProduct/' + id)
}
//查询产品项目信息
export function getPjInfos(query) {
  if (query.productId !== '') {
    return http.get('/portal/api/' + query.productId + '/pjInfos', {
      params: query
    });
  }
}


/******************************************************用户管理 BEGIN*******************************************************/

// 查询用户列表
export function fetchUsers(query) {
  return http.get('/portal/api/users', {
    params: query
  })
}

// 新增用户
export function createUser(data) {
  return http.post('/portal/api/users', data)
}
// 修改用户
export function updateUser(data) {
  return http.put('/portal/api/users', data)
}
// 删除用户
export function delUsers(userIds) {
  return http.delete('portal/api/users' + userIds)
}

// 保存用户头像
export function modifyAvatar(avatar) {
  return http.put('/portal/api/users/avatar', avatar)
}
// 密码重置
export function resetPass(userId) {
  return http.put('/portal/api/users/resetPass/'+ userId)
}
//查询用户权限
export function fetchGrants(id) {
  return http.get('/portal/api/users/' + id + '/roles')
}
//保存用户授权角色
export function saveGrants(id, data) {
  return http.put('/portal/api/users/' + id + '/roles', data)
}
//种子文件查询
export function fetchToken(query) {
  return http.get('/portal/api/token', {
    params: query
  })




}

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
export function fetchRoutes(id) {
  return http.get('/portal/api/roles/' + id + '/routes')
}
export function saveRoutes(id, data) {
  return http.post('/portal/api/roles/' + id + '/routes', data)
}

export function initDicts(code) {
  return http.get('/portal/api/dicts/' + code)
}
//查询系统字典
export function fetchDicts(query) {
  return http.get('/portal/api/dicts', {
    params: query
  })
}
export function fetchCurrentDicts(current, query) {
  return http.get('/portal/api/dicts/' + current, {
    params: query
  })
}
export function createDict(data, path) {
  if (!path) {
    return http.post('/portal/api/dicts', data)
  }
  return http.post('/portal/api/dicts/' + path, data)
}
export function modifyDict(data, path) {
  if (!path) {
    return http.put('/portal/api/dicts', data)
  }
  return http.put('/portal/api/dicts/' + path, data)
}
export function removeDicts(codes, path) {
  if (!path) {
    return http.delete('/portal/api/dicts/' + codes)
  }
  return http.delete('/portal/api/dicts/' + path + '/' + codes)
}
//增加系统字典
export function addDictInfo(query) {
  return http.post('/portal/api/sysDict', query)
}
export function getDictByDictCode(query) {
  return http.post('/portal/api/getDictByDictCode', query);
}
//删除一级字典
export function deleteSysDictInfo(id) {
  return http.delete('/portal/api/sysDict/' + id)
}
//删除二级字典
export function deleteSysDictInfo2(id) {
  return http.delete('/portal/api/sysDict2/' + id)
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
export function fetchUsers(query) {
  return http.get('/portal/api/users', {
    params: query
  })
}
// 保存用户头像
export function modifyAvatar(avatar) {
  return http.put('/portal/api/users/avatar', avatar)
}
export function modifyUser(data) {
  return http.put('/portal/api/users', data)
}
export function resetPass(data) {
  return http.put('/portal/api/resetPass', data)
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

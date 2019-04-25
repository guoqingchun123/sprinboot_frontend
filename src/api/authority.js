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
//查询产品
export function getSysProduct(query) {
  return http.get('/api/sysProduct', query)
}
//查询产品一览
export function getProducts(query) {
  return http.get('/api/products', query)
}
//增加产品信息
export function addProductInfo(query) {
  return http.post('/api/sysProduct', query)
}
//删除产品信息
export function deleteSysProductInfo(id) {
  return http.delete('/api/sysProduct/' + id)
}
//查询产品项目信息
export function getPjInfos(query) {
  if (query.productId !== '') {
    return http.get('/api/' + query.productId + '/pjInfos', {
      params: query
    });
  }
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
//种子文件查询
export function fetchToken(query) {
  return http.get('/api/token', {
    params: query
  })
}

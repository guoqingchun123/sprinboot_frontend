import http from '@/utils/http'
//查询销售合同信息
export function queryContractMessage(query) {
  return http.get('/api/custom/contractInfo', {
    params: query
  })
}
//新增销售合同信息
export function addContractInfo(data) {
  return http.post('/api/custom/contractInfo', data)
}
//修改销售合同信息
export function editContractInfo(data) {
  return http.put('/api/custom/contractInfo', data)
}
//删除销售合同信息
export function deleteContractInfo(id) {
  return http.delete('/api/custom/contractInfo/' + id)
}
//查询部门下员工
// export function fetchEmpByDept(query) {
//   return http.get('/api/custom/empByDept', {
//     params: query
//   })
// }
export function exportCustContractInfo(data) {
  http.post('/api/custom/exportCustContractInfo',data)
}
//查询客户信息
export function fetchTableDatas(query) {
  return http.get('/api/custom/custCorpInfo', {
    params: query
  })
}
//查询客户信息list,客户下拉框用
export function fetchCorps(data) {
  return http.get('/api/custom/custCorpInfoList', data)
}
//查询员工信息，负责人下拉框用
export function fetchEmps(data) {
  return http.get('/api/custom/contractEmpList', data)
}
//查询客户信息list,跳转客户详情form用
export function corpById(corpId) {
  return http.get('/api/custom/corpById/'+corpId)
}
//新增客户信息
export function addCustCorpInfo(data) {
  return http.post('/api/custom/custCorpInfo', data)
}
//修改客户信息
export function editCustCorpInfo(data) {
  return http.put('/api/custom/custCorpInfo', data)
}
//删除客户信息
export function deleteCustCorpInfo(id) {
  return http.delete('/api/custom/custCorpInfo/' + id)
}
//查询客户项目信息
export function queryCustProjInfo(query) {
  return http.get('/api/custom/custProjInfo', {
    params: query
  })
}
//查询客户合同信息
export function queryCustContractInfo(query) {
  return http.get('/api/custom/custContractInfo', {
    params: query
  })
}
//新增客户合同信息
export function addCustContractInfo(data) {
  return http.post('/api/custom/custContractInfo', data)
}
//修改客户合同信息
export function editCustContractInfo(data) {
  return http.put('/api/custom/custContractInfo', data)
}
//删除客户合同信息
export function deleteCustContractInfo(id) {
  return http.delete('/api/custom/custContractInfo/' + id)
}
//停用客户合同信息
export function stopCustContractInfo(data) {
  return http.put('/api/custom/stopCustContractInfo', data)
}
//查询客户联系人信息
export function queryCustomCardDetail(query) {
  return http.get('/api/custom/custCardInfo', {
    params: query
  })
}
//新增客户联系人信息
export function addCustCardInfo(data) {
  return http.post('/api/custom/custCardInfo', data)
}
//修改客户联系人信息
export function editCustCardInfo(data) {
  return http.put('/api/custom/custCardInfo', data)
}
//删除客户联系人信息
export function deleteCustCardInfo(id) {
  return http.delete('/api/custom/custCardInfo/' + id)
}
//查询客户设备信息
export function queryCustomEquipmentInfo(query) {
  return http.get('/api/custom/custEquipmentInfo', {
    params: query
  })
}
//新增客户设备信息
export function addCustEquipmentInfo(data) {
  return http.post('/api/custom/custEquipmentInfo', data)
}
//修改客户设备信息
export function editCustEquipmentInfo(data) {
  return http.put('/api/custom/custEquipmentInfo', data)
}
//删除客户设备信息
export function deleteCustEquipmentInfo(id) {
  return http.delete('/api/custom/custEquipmentInfo/' + id)
}
//查询客户服务器信息
export function queryCustomServerInfo(query) {
  return http.get('/api/custom/custServerInfo', {
    params: query
  })
}
//新增客户服务器信息
export function addCustServerInfo(data) {
  return http.post('/api/custom/custServerInfo', data)
}
//修改客户服务器信息
export function editCustServerInfo(data) {
  return http.put('/api/custom/custServerInfo', data)
}
//删除客户设备信息
export function deleteCustServerInfo(id) {
  return http.delete('/api/custom/custServerInfo/' + id)
}
//查询客户数据库信息
export function queryCustomDatabaseInfo(query) {
  return http.get('/api/custom/custDatabaseInfo', {
    params: query
  })
}
//新增客户数据库信息
export function addCustDatabaseInfo(data) {
  return http.post('/api/custom/custDatabaseInfo', data)
}
//修改客户数据库信息
export function editCustDatabaseInfo(data) {
  return http.put('/api/custom/custDatabaseInfo', data)
}
//删除客户数据库信息
export function deleteCustDatabaseInfo(id) {
  return http.delete('/api/custom/custDatabaseInfo/' + id)
}
//查询客户web服务器信息
export function queryCustomWebServerInfo(query) {
  return http.get('/api/custom/custWebServerInfo', {
    params: query
  })
}
//新增客户web服务器信息
export function addCustWebServerInfo(data) {
  return http.post('/api/custom/custWebServerInfo', data)
}
//修改客户web服务器信息
export function editCustWebServerInfo(data) {
  return http.put('/api/custom/custWebServerInfo', data)
}
//删除客户web服务器信息
export function deleteCustWebServerInfo(id) {
  return http.delete('/api/custom/custWebServerInfo/' + id)
}
//查询客户应用信息
export function queryCustomApplicationInfo(query) {
  return http.get('/api/custom/custApplicationInfo', {
    params: query
  })
}
//新增客户应用信息
export function addCustApplicationInfo(data) {
  return http.post('/api/custom/custApplicationInfo', data)
}
//修改客户应用信息
export function editCustApplicationInfo(data) {
  return http.put('/api/custom/custApplicationInfo', data)
}
//删除客户应用信息
export function deleteCustApplicationInfo(id) {
  return http.delete('/api/custom/custApplicationInfo/' + id)
}
//查询客户图档树
export function queryCustomFileTree(query) {
  return http.get('/api/custom/custFileTree', {
    params: query
  })
}
//新增客户图档树
export function addCustomFileTree(data) {
  return http.post('/api/custom/custFileTreeInfo', data)
}
//查询客户图档信息
export function queryCustomFileInfo(query) {
  return http.get('/api/custom/custFileInfo', {
    params: query
  })
}
//新增客户图档信息
export function addCustFileInfo(data) {
  return http.post('/api/custom/custFileInfo', data)
}
//修改客户图档信息
export function editCustFileInfo(data) {
  return http.put('/api/custom/custFileInfo', data)
}
//删除客户图档信息
export function deleteCustFileInfo(id) {
  return http.delete('/api/custom/custFileInfo/' + id)
}

//查询当前客户所有联系人信息
export function fetchCustomCardDetail(query) {
  return http.get('/api/custom/custCardInfo', {
    params: query
  })
}

//查询当前项目对应客户的所有网络设备信息
export function fetchEquipmentInfo(query) {
  return http.get('/api/custom/custEquipmentInfo', {
    params: query
  })
}

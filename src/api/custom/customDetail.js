import http from '@/utils/http'
//查询客户项目信息
export function queryCustProjInfo(query) {
  return http.get('/api/customDetail/custProjInfo', {
    params: query
  })
}
//下载客户项目信息
export function exportCustProjExcel(data) {
  return http.post('/api/customDetail/exportCustProjExcel',data)
}
//查询客户合同信息
export function queryCustContractInfo(query) {
  return http.get('/api/customDetail/custContractInfo', {
    params: query
  })
}
//下载客户项目信息
export function exportCustContractExcel(data) {
  return http.post('/api/customDetail/exportCustContractExcel',data)
}
//查询客户联系人信息
export function queryCustomCardDetail(query) {
  return http.get('/api/customDetail/custCardInfo', {
    params: query
  })
}
//新增客户联系人信息
export function addCustCardInfo(data) {
  return http.post('/api/customDetail/custCardInfo', data)
}
//修改客户联系人信息
export function editCustCardInfo(data) {
  return http.put('/api/customDetail/custCardInfo', data)
}
//删除客户联系人信息
export function deleteCustCardInfo(id) {
  return http.delete('/api/customDetail/custCardInfo/' + id)
}
//查询客户设备信息
export function queryCustomEquipmentInfo(query) {
  return http.get('/api/customDetail/custEquipmentInfo', {
    params: query
  })
}
//新增客户设备信息
export function addCustEquipmentInfo(data) {
  return http.post('/api/customDetail/custEquipmentInfo', data)
}
//修改客户设备信息
export function editCustEquipmentInfo(data) {
  return http.put('/api/customDetail/custEquipmentInfo', data)
}
//删除客户设备信息
export function deleteCustEquipmentInfo(ids) {
  return http.delete('/api/customDetail/custEquipmentInfo/' + ids)
}
//查询客户服务器信息
export function queryCustomServerInfo(query) {
  return http.get('/api/customDetail/custServerInfo', {
    params: query
  })
}
//新增客户服务器信息
export function addCustServerInfo(data) {
  return http.post('/api/customDetail/custServerInfo', data)
}
//修改客户服务器信息
export function editCustServerInfo(data) {
  return http.put('/api/customDetail/custServerInfo', data)
}
//删除客户设备信息
export function deleteCustServerInfo(ids) {
  return http.delete('/api/customDetail/custServerInfo/' + ids)
}
//查询客户数据库信息
export function queryCustomDatabaseInfo(query) {
  return http.get('/api/customDetail/custDatabaseInfo', {
    params: query
  })
}
//新增客户数据库信息
export function addCustDatabaseInfo(data) {
  return http.post('/api/customDetail/custDatabaseInfo', data)
}
//修改客户数据库信息
export function editCustDatabaseInfo(data) {
  return http.put('/api/customDetail/custDatabaseInfo', data)
}
//删除客户数据库信息
export function deleteCustDatabaseInfo(id) {
  return http.delete('/api/customDetail/custDatabaseInfo/' + id)
}
//查询客户web服务器信息
export function queryCustomWebServerInfo(query) {
  return http.get('/api/customDetail/custWebServerInfo', {
    params: query
  })
}
//查询当前项目/客户对应的所有web服务器信息,不分页,用于关联web服务器下拉框
export function custWebServerInfoAll(query) {
  return http.get('/api/customDetail/custWebServerInfoAll', {
    params: query
  })
}
//新增客户web服务器信息
export function addCustWebServerInfo(data) {
  return http.post('/api/customDetail/custWebServerInfo', data)
}
//修改客户web服务器信息
export function editCustWebServerInfo(data) {
  return http.put('/api/customDetail/custWebServerInfo', data)
}
//删除客户web服务器信息
export function deleteCustWebServerInfo(id) {
  return http.delete('/api/customDetail/custWebServerInfo/' + id)
}
//下载web服务器信息
export function exportWebServerExcel(data) {
  return http.post('/api/customDetail/exportWebServerExcel',data)
}
//查询客户应用信息
export function queryCustomApplicationInfo(query) {
  return http.get('/api/customDetail/custApplicationInfo', {
    params: query
  })
}
//查询当前项目/客户对应的所有web服务器信息,不分页,用于关联web服务器下拉框
export function custApplicationInfoAll(query) {
  return http.get('/api/customDetail/custApplicationInfoAll', {
    params: query
  })
}
//新增客户应用信息
export function addCustApplicationInfo(data) {
  return http.post('/api/customDetail/custApplicationInfo', data)
}
//修改客户应用信息
export function editCustApplicationInfo(data) {
  return http.put('/api/customDetail/custApplicationInfo', data)
}
//删除客户应用信息
export function deleteCustApplicationInfo(id) {
  return http.delete('/api/customDetail/custApplicationInfo/' + id)
}
//下载应用程序信息
export function exportApplicationExcel(data) {
  return http.post('/api/customDetail/exportApplicationExcel',data)
}
//查询客户图档树
export function queryCustomFileTree(query) {
  return http.get('/api/customDetail/custFileTree', {
    params: query
  })
}
//新增客户图档树
export function addCustomFileTree(data) {
  return http.post('/api/customDetail/custFileTree', data)
}
//查询客户图档信息
export function queryCustomFileInfo(query) {
  return http.get('/api/customDetail/custFileInfo', {
    params: query
  })
}
//下载客户图档信息
export function exportCustFileExcel(data) {
  return http.post('/api/customDetail/exportCustFileExcel',data)
}
//修改客户图档信息
export function editCustFileInfo(data) {
  return http.put('/api/customDetail/custFileInfo', data)
}
//删除客户图档信息
export function deleteCustFileInfo(id) {
  return http.delete('/api/customDetail/custFileInfo/' + id)
}
//上传客户图档信息
export function importCustFile(file,data) {
  return http.upload('/api/customDetail/uploadCustFile',file,data)
}
//查询项目图档信息
export function queryProjFileInfo(query) {
  return http.get('/api/customDetail/projFileInfo', {
    params: query
  })
}
//下载项目图档信息
export function exportProjFileExcel(data) {
  return http.post('/api/customDetail/exportProjFileExcel',data)
}
//查询销售合同图档信息
export function queryContractFileInfo(query) {
  return http.get('/api/customDetail/contractFileInfo', {
    params: query
  })
}
//下载项目图档信息
export function exportContractFileExcel(data) {
  return http.post('/api/customDetail/exportContractFileExcel',data)
}
//查询当前客户所有项目信息，不区分项目状态，不分页，项目下拉框用
export function fetchAllProjList(corpId) {
  return http.get('/api/customDetail/allProj/'+corpId)
}
//查询当前客户所有联系人信息
export function fetchCustomCardDetail(query) {
  return http.get('/api/customDetail/custCardInfo', {
    params: query
  })
}

//查询当前项目对应客户的所有网络设备信息
export function fetchEquipmentInfo(query) {
  return http.get('/api/customDetail/custEquipmentInfo', {
    params: query
  })
}
//查询当前项目/客户对应的所有网络设备信息,不分页
export function fetchEquipmentInfoById(query) {
  return http.get('/api/customDetail/custEquipmentInfoAll', {
    params: query
  })
}
//客户、项目图档预览、下载插入文件操作记录表
export function addFileOperateLog(data) {
  return http.post('/api/customDetail/fileOperateLog', data)
}

//查询当前项目/客户对应的所有服务器信息,不分页，查询当前客户关联的项目
export function fetchServerInfoById(query) {
  return http.get('/api/customDetail/custServerInfoAll', {
    params: query
  })
}

//查询当前项目/客户对应的所有数据库信息,不分页，查询当前客户关联的项目
export function fetchDatabaseById(query) {
  return http.get('/api/customDetail/custDatabaseInfoAll', {
    params: query
  })
}

//导出客户联系人数据
export function exportCustomData(data) {
  return http.post('/api/customDetail/customData', data)
}
//导出网络设备信息
export function exportEquipmentData(data) {
  return http.post('/api/customDetail/equipmentData', data)
}
//导出服务器信息
export function exportServerData(data) {
  return http.post('/api/customDetail/serverData', data)
}
//导出数据库信息
export function exportDatabase(data) {
  return http.post('/api/customDetail/database', data)
}

export function downLoadFunction(query) {
  return http.get('/api/excel/downloadExcel', {
    params: query
  })
}
export function queryEmpTravel(data) {
  return http.get('/api/EmpTravel/queryEmpTravelByprojId', {
    params: data
  })
}


//查询项目关联客户信息
export function fetchProjCustData(query) {
  return http.get('/api/customDetail/projCust',{
    params: query
  })
}

//查找所有的客户信息，不分页
export function fetchCustInitData() {
  return http.get('/api/customDetail/custParamData')
}

//项目添加客户信息
export function insertProjCustInfo(data) {
  return http.put('/api/customDetail/projCust',data)
}

//删除客户信息
export function deleteProjCustInfo(data) {
  return http.put('/api/customDetail/projCustInfo',data)
}

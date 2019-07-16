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
//上传到fileInfo表
export function uploadContract(file,data) {
  return http.upload('/api/custom/importContract',file,data)
}
//读取数据存入数据库
export function importContractInfoFunction(data) {
  return http.post('/api/custom/readContract',data)
}
//查询客户信息
export function fetchTableDatas(query) {
  return http.get('/api/custom/custCorpInfo', {
    params: query
  })
}
//读取数据存入数据库
export function importCustInfoFunction(data) {
  return http.post('/api/custom/readCust',data)
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


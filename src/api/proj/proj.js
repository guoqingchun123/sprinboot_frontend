import http from '@/utils/http'

//获取项目信息列表
export function fetchBasicProjInfo(query) {
  return http.get('/api/proj/projList', {
    params: query
  })
}

//根据项目id查询项目
export function fetchProjInfo(id) {
  return http.get('/api/proj/projInfo/' + id)
}

//添加项目信息
export function insertProjInfo(data) {
  return http.post('/api/proj/projList', data)
}

//修改项目信息
export function updateProjInfo(data) {
  return http.put('/api/proj/projList', data)
}

//删除项目信息
export function deleteProjInfo(id) {
  return http.delete('/api/proj/projList/' + id)
}

//获取任务信息列表
export function fetchTaskInfo(query) {
  return http.get('/api/proj/projTaskList', {
    params: query
  })
}

//添加任务信息
export function insertProjTaskInfo(data) {
  return http.post('/api/proj/projTask', data)
}

//修改任务信息
export function updateProjTaskInfo(data) {
  return http.put('/api/proj/projTask', data)
}

//删除任务信息
export function deleteProjTaskInfo(id) {
  return http.delete('/api/proj/projTask/' + id)
}

//审批同意
export function approvalAgree(data) {
  return http.post('/api/proj/approvalAgreeProject', data)
}

//审批拒绝
export function approvalRefuse(data) {
  return http.post('/api/proj/approvalRefuseProject', data)
}

//项目分发时确定操作
export function distribute(data) {
  return http.put('/api/proj/distributeProject', data)
}

//项目签收时的操作
export function endApproval(data) {
  return http.put('/api/proj/endApproval', data)
}

//获取审批及记录信息列表
export function fetchApproveLog(query) {
  return http.get('/api/proj/getApprovalLog', {
    params: query
  })
}

//获取售前项目信息列表
export function fetchPresaleProjInfo(query) {
  return http.get('/api/proj/presaleProjInfo', {
    params: query
  })
}

//添加/修改/删除售前项目信息
export function savePresaleProjInfo(data) {
  return http.post('/api/proj/presaleProjInfo', data)
}

//新增项目中初始数据查询
export function fetchProjData() {
  return http.get('/api/proj/projParam')
}

//根据选择客户查询客户联系人
export function fetchCustCard(query) {
  return http.get('/api/proj/custCardList', {
    params: query
  })
}

//上传文件数据
export function importProjFunction(data) {
  return http.post('/api/proj/importProjFunction', data)
}

export function deletePresaleProjInfo(data) {
  return http.delete('/api/proj/presaleProjInfo/' + data)
}

//4.19
export function fetchSaleManagersTrans(data) {
  return http.get('/api/empManage/SaleManagers', data)
}

export function fetchPresalePersonTrans(data) {
  return http.get('/api/empManage/presalePerson', data)
}

export function fetchPresaleDeptLinksTrans(data) {
  return http.get('/api/systemManage/listDepts', data)
}

export function fetchPresaleTechLinksTrans(data) {
  return http.get('/api/proj/allProjList', data)
}

export function fetchgetprojFieldTrans(data) {
  return http.get('/api/proj/allProjField', data)
}

//获取当前用户待审批列表
export function fetchApproval(query) {
  return http.get('/api/proj/projListByState', {
    params: query
  })
}

//获取所有有项目经理角色的员工
export function fetchProjManage() {
  return http.get('/api/proj/projManageRole')
}

//获取所有具有技术负责人角色的员工
export function fetchTechnologyLeaders() {
  return http.get('/api/proj/tecgnologyLeaderRole')
}

//根据当前项目信息  查找当前项目中的负责人和开发人员  选择任务中的负责人和开发人员
export function fetchTaskEmp(query) {
  return http.get('/api/proj/taskEmp', {
    params: query
  })
}

export function findDataById(query) {
  return http.get('/api/proj/custFiles/'+query)
}
export function findALLDataById(query) {
  return http.get('/api/proj/findAllDataById/'+query)
}

export function updatePresale(data) {
  return http.post('/api/proj/updatePresale',data
  )
}
export function deleteCustFIleById(data) {
  return http.delete('/api/proj/deleteCustFileById/'+data
  )
}

//查询销售项目信息
export function fetchSaleInfo(query) {
  return http.get('/api/sales', {
    params: query
  })
}
//新增销售项目信息
export function addSaleInfo(data) {
  return http.post('/api/sales', data)
}

//修改销售项目信息
export function editSaleInfo(data) {
  return http.put('/api/sales', data)
}
//删除销售项目信息
export function deleteSaleInfo(data) {
  return http.put('/api/saleInfo/saleId', data)
}
//获取新增/修改销售项目初始数据
export function fetchSaleData() {
  return http.get('/api/saleInfo/paramData')
}
//保存审批意见
export function saveApprovalSale(data) {
  return http.put('/api/saleInfo/approval',data)
}
export function fetchPresaleEmpList() {
  return http.get('/api/saleInfo/fetchPresaleEmpList')
}
//导入售前项目信息
export function importSale(file,data) {
  return http.upload('/api/saleInfo/importSale',file,data)
}
//模板下载
export function downloadTemplate(data) {
  return http.download('/api/travels/template',data)
}
export function fetchPresaleSupportInfos(data) {
  return http.get('/api/proj/presaleSupportInfos',{
    params:data
  })
}

export function savePresaleSupportInfo(data) {
  return http.post('/api/proj/savePresaleSupportInfo', data)
}
export function deletePresaleSupportInfo(projId) {
  return http.delete('/api/proj/deletePresaleSupportInfo/'+ projId)
}
// //下载模板
// export function downloadTemplate(data) {
//   return http.download('/api/employee/template',data)
// }
//导入售前记录
export function importPreaSaleInfo(file,data) {
  return http.upload('/api/proj/importProjRecord',file,data)
}
export function showAllData(id) {
  return http.get('/api/proj/showAllDataByPresaleId/'+id)
}

/**
 * 获取所有产品
 * @param id
 * @returns {*}
 * @constructor
 */
export function ProjProductSelectInfo() {
  return http.get('/api/product2Y')
}


import http from '@/utils/http'

//查询员工档案信息
export function fetchEmpInfo(query) {
  return http.get('/api/employee', {
    params: query
  })
}

//新增或编辑员工信息
export function modifyEmp(data) {
  return http.put('/api/employee', data)
}

//查询员工所属部门id
export function fetchDepts(query) {
  return http.get('/api/employee/depts', {
    params: query
  })
}

//员工开户
export function modifyAccount(data) {
  return http.post('/api/employee/account',data)
}
//员工销户
export function removeAccount(data){
  return http.put('/api/employee/account',data)
}
//续签合同
export function modifyEmpContract(data) {
  return http.put('/api/employee/contract',data)
}
//导入员工数据
export function importEmpInfoExcel(file,data) {
  return http.upload('/api/employee/excel',file,data)
}
//读取数据存入数据库
export function importEmpInfoFunction(data) {
  return http.post('/api/employee/empInfoExcel',data)
}
//下载模板
export function downloadTemplate(data) {
  return http.download('/api/employee/template',data)
}
//员工信息页面加载时-根据字典表的code查询所对应的下属值
export function fetchDictInfo(dictCode) {
  return http.post('/api/employee/dict', dictCode)
}
//点击查看详情时-获取详情数据
export function fetchTableInfo(data) {
  return http.post('/api/employee/deptByUser', data)
}
//新增、修改时，根据所属部门查询督导人
export function fetchUserByDept(query) {
  return http.get('/api/employee/userByDept', {
    params: query
  })
}
//新增时，查询该身份证号是否已经被添加
export function fetchUserByIdCard(query) {
  return http.get('/api/employee/userByIdCard', {
    params: query
  })
}
//员工附件上传
export function uploadAttach(file,data) {
  return http.upload('/api/employee/uploadAttach',file,data)//
}
//请求一张图片
export function fetchPicture(query) {
  return http.get('/api/employee/fetchPicture', {
    params: query
  })
}
//附件下载
export function downloadAttach(data) {
  return http.download('/api/empManage/downloadFile', data)
}
//获取历史合同签订信息
export function fetchContractInfo(data) {
  return http.get('/api/empManage/contractInfo', {
    params: data
  })
}
//获取部门调整记录
export function fetchDeptHistory(data) {
  return http.get('/api/empManage/deptHistory', {
    params: data
  })
}
//获取所有的员工信息，不分页
export function fetchAllEmpInfo() {
  return http.get('/api/employee/allEmpInfo')
}
//获取附件管理目录
export function catalog() {
  return http.get('/api/empManage/catalog')
}
export function fetchFileInfoByCode(query) {  //111111
  return http.get('/api/empManage/fileInfo', {
    params: query
  })
}
//删除附件
export function deletePic(id) {
  return http.delete('/api/empManage/removeCatalog/' + id)
}
//员工转正
export function empFormal(data) {
  return http.put('/api/employee/empFormal',data)
}
//员工试用
export function openEmpSave(data) {
  return http.put('/api/employee/openEmp',data)
}
//未分配令牌查询
export function fetchUnallotToken() {
  return http.get('/api/unallotToken')
}
//为导入员工开户
export function openCount(data) {
  return http.put('/api/employee/openCount',data)
}
//查询最大员工工号
export function fetchEmpId() {
  return http.get('/api/employee/fetchEmpId')
}
//导入员工岗级调整历史
export function importPostData(file,data) {
  return http.upload('/api/employee/importPost',file,data)
}



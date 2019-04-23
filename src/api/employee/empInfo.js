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
//点击查看详情时-查询员工所属部门id
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

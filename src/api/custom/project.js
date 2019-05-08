import http from '@/utils/http'

//查询项目列表
export function queryProjects(query) {
  return http.get('/center/api/project/queryProjects', {
    params: query
  })
}


//新增项目信息
export function insertProject(query) {
  return http.post('/center/api/project/insertProject', query,{
    ignoreToken :true
  })
}

//删除项目信息
export function deleteProject(id) {
  return http.delete('/center/api/project/deleteProject/' + id)
}

//修改项目信息
export function updateProject(query) {
  return http.post('/center/api/project/updateProject', query)
}
//项目信息回显查询
export function queryProjectInfo(id) {
  return http.get('/center/api/project/queryProjectInfo/'+id)
}

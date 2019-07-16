import http from '@/utils/http'

//查询员工档案信息
export function fetchColleges(query) {
  return http.get('/api/employee/colleges', {
    params: query
  })
}
//获取学校水平下拉框内容
export function collegesLevels() {
  return http.get('/api/employee/collegesData')
}
//学校信息保存
export function collegesSave(data) {
  return http.post('/api/employee/colleges',data)
}
//删除学校信息记录
export function deleteColledges(ids) {
  return http.delete('/api/employee/colleges/' + ids)
}

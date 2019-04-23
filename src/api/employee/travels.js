import http from '@/utils/http'

//查询差旅明细
export function fetchTravelDatas(query) {
  return http.get('/api/travels', {
    params: query
  })
}

//查询我的差旅明细
export function fetchTravels(query) {
  return http.get('/api/myTravels', {
    params: query
  })
}

//导入差旅明细文件
export function importTravel(file,data) {
  return http.upload('/api/importTravel',file,data)
}

//新增或者修改差旅
export function modifyTravel(data) {
  return http.put('/api/travels', data)
}
//删除差旅记录
export function deleteTravel(ids) {
  return http.delete('/api/travels/' + ids)
}

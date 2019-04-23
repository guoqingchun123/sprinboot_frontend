import http from '@/utils/http'

//会议信息查询
export function fetchMeetingDatas(query) {
  return http.get('/api/meetingManage', {
    params: query
  });
}
//会议信息新增
export function createMeetDatas(data) {
  return http.post('/api/meetingManage', data)
}
//会议信息修改
export function modifyMeetDatas(data) {
  return http.put('/api/meetingManage', data)
}
//会议信息删除
export function removeMeetDatas(ids) {
  return http.delete('/api/meetingManage/' + ids)
}
//会议纪要查询
export function fetchMeetSummary(query) {
  return http.get('/api/meetingSummary', {
    params: query
  })
}
//会议纪要修改
export function modifyMeetSummary(data) {
  return http.put('/api/meetingSummary', data)
}
//会议纪要删除
export function removeMeetSummary(ids) {
  return http.delete('/api/meetingSummary/' + ids)
}
//会议纪要新增
export function createMeetSummary(data) {
  return http.post('/api/meetingSummary', data)
}
//会议室查询
export function fetchMeetingRoom(query) {
  return http.get('/api/meetingRoom', {
    params: query
  });
}
//会议室查询
export function fetchRoomStyle(query) {
  return http.get('/api/meetingRoom2', {
    params: query
  });
}

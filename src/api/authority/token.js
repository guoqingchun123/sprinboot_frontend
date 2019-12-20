import http from '@/utils/http'

// 导入令牌种子文件
export function importToken(file, data) {
  return http.upload('/api/tokens/import', file, data)
}

// 令牌信息查询
export function fetchTokens(query) {
  return http.get('/api/tokens', {
    params: query
  })
}

// 个人令牌信息查询
export function fetchUserTokens(query) {
  const userId = query.userId
  delete query.userId
  return http.get('/api/tokens/users/' + userId, {
    params: query
  })
}

// 未分配令牌查询
export function fetchUnallottedTokens() {
  return http.get('/api/tokens/unallotted')
}

// 个人令牌新增
export function allotToken(userId, deviceSn) {
  return http.post('/api/tokens/' + deviceSn + '/' + userId)
}
// 个人令牌回收
export function unallotToken(deviceSn) {
  return http.delete('/api/tokens/' + deviceSn)
}

// 个人令牌解锁
export function unlockToken(deviceSn) {
  return http.put('/api/tokens/' + deviceSn + '/unlock')
}

// 个人令牌挂失
export function lostToken(deviceSn) {
  return http.put('/api/tokens/' + deviceSn + '/lost')
}
// 个人令牌解挂
export function unlostToken(deviceSn, passtoken) {
  return http.put('/api/tokens/' + deviceSn + '/unlost', passtoken)
}

//个人令牌禁用
export function stopToken(deviceSn) {
  return http.put('/api/tokens/' + deviceSn + '/stop')
}

//个人令牌启用
export function unstopToken(userId, deviceSn) {
  return http.put('/api/tokens/' + deviceSn + '/unstop', userId)
}

/////////////////////////////////////////////////////////////////////

//令牌同步
export function tokenSync(query) {
  return http.get('/api/ess/sync', {
    params: query
  })
}

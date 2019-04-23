import http from '@/utils/http';

// 查询流程信息
export function fetchFlowList(query) {
  return http.get('/api/flows', {
    params: query
  });
}

// 保存流程信息
export function saveFlow(query) {
  return http.post('/api/flows', query);
}

import http from '@/utils/http';

// 查询文件一览
export function tmplInfoListAll(query) {
  return http.get('/api/file/info', {
    params: query
  });
}

// 保存目录树
export function saveInfo(data) {
  return http.post('/api/file/info', data);
}

// 删除目录树
export function deleteInfo(data) {
  return http.put('/api/file/info', data);
}

// 查询文件历史信息
export function fetchTmplList(query) {
  return http.get('/api/file/list', {
    params: query
  });
}

// 文件操作记录并且下载量加一
export function addDownNumAndLog(data) {
  return http.post('/api/file/downNum', data);
}

// 获取文件保存路径
export function getPath(data) {
  return http.post('/api/file/path', data);
}

// 上传文件
export function uploads(file, data) {
  return http.upload('/api/sharedFile/upload', file, data);
}

// 文件下载
export function fileDownload(data) {
  return http.download('/api/file/download', data);
}

// 获取PDF预览信息
export function getPDF(data) {
  return http.pdf('/api/file/pdf', data);
}

// 查询文件操作记录
export function getFileOperate(query) {
  return http.get('/api/file/operates', {
    params: query
  });
}
//根据部门查员工
export function fetchEmpsForShared(query) {
  return http.get('/api/file/empForShared', {
    params: query
  });
}
//删除文件版本信息
export function deleteTmplList(id) {
  return http.delete('/api/file/tmplList/' + id)
}


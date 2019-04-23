import http from '@/utils/http'

//导入令牌种子文件
export function importToken(file,data) {
  return http.upload('/api/ess/import',file,data)
}



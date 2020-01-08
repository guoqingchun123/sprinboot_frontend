import http from '@/utils/http-public'

export function configUrl(url) {
  if (process.env.VUE_APP_PUBLIC_API !== '/' && url && url.indexOf(process.env.VUE_APP_PUBLIC_API) !== 0) {
    return process.env.VUE_APP_PUBLIC_API + url
  }
  return url
}

/*政务公开*/
/*信息公开*/
export function fetchPublishes(query) {
  return http.get('/api/public/publishes', {
    params: query
  })
}

export function createPublish(data) {
  return http.post('/api/public/publishes', data)
}

export function modifyPublish(data) {
  return http.put('/api/public/publishes', data)
}

export function removePublish(ids) {
  return http.delete('/api/public/publishes/' + ids)
}

/*下载中心*/
export function fetchDownloads(query) {
  return http.get('/api/public/downloads', {
    params: query
  })
}

export function createDownload(data) {
  return http.post('/api/public/downloads', data)
}

export function modifyDownload(data) {
  return http.put('/api/public/downloads', data)
}

export function removeDownload(ids) {
  return http.delete('/api/public/downloads/' + ids)
}

/*调查问卷*/
export function fetchSurveys(query) {
  return http.get('/api/public/surveys', {
    params: query
  })
}

export function createSurvey(data) {
  return http.post('/api/public/surveys', data)
}

export function modifySurvey(data) {
  return http.put('/api/public/surveys', data)
}

export function removeSurvey(ids) {
  return http.delete('/api/public/surveys/' + ids)
}

export function selectSurvey(id) {
  return http.get('/api/public/surveys/' + id)
}

export function publishSurvey(data) {
  return http.put('/api/public/publishSurvey', data)
}

/*调查问卷问题项*/
export function fetchSurveyItems(query) {
  return http.get('/api/public/surveyItems', {
    params: query
  })
}

export function createSurveyItem(data) {
  return http.post('/api/public/surveyItems', data)
}

export function modifySurveyItem(data) {
  return http.put('/api/public/surveyItems', data)
}

export function removeSurveyItem(ids) {
  return http.delete('/api/public/surveyItems/' + ids)
}

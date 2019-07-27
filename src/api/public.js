import http from '@/utils/http'

/*政务公开*/
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

import Mock from 'mockjs'
// import { defaults as utils } from '@bestvike/utils'

import authority from './authority'
/*import meetingManage from './meetingManage'
import tableData from './custom/tableData'
import customCard from './custom/customCard'
import contractMessage from './custom/contractMessage'
import customFileTree from './custom/customFileTree'
import customFile from './custom/customFile'
import empData from './empData'

import basicProjInfo from './projManage/basicProjInfo'
import taskInfo from './projManage/taskInfo'
import approveLog from './projManage/approveLog'
import presaleProjInfo from './projManage/presaleProjInfo'
import empInfo from './employee/empInfo'
import areas from './employee/areas'
import schedule from "./employee/schedule"
import empAttend from "./employee/empAttend"
import travel from "./employee/travel"*/

const mocks = [
  ...authority
  /*...meetingManage,
  ...tableData,
  ...customCard,
  ...contractMessage,
  ...basicProjInfo,
  ...taskInfo,
  ...approveLog,
  ...presaleProjInfo,
  ...empInfo,
  ...customFileTree,
  ...empData,
  ...customFileTree,
  ...areas,
  ...schedule,
  ...empAttend,
  ...customFile,
  ...customFile,
  ...travel*/
]

// for front mock
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
/*export function mockXHR() {
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(respond) {
    return function(options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: utils.param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  for (const i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }
}*/

// for mock server
const responseFake = (url, type, respond) => {
  return {
    url: new RegExp(`/mock${url}`),
    type: type || 'get',
    response(req, res) {
      res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
    }
  }
}

export default mocks.map(route => {
  return responseFake(route.url, route.type, route.response)
})

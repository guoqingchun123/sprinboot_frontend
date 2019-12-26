import { Message } from 'element-ui'
import router from '@/router'
import store from '@/store'
import createInstance from '@bestvike/utils/lib/http'

const instance = createInstance({
  baseURL: process.env.VUE_APP_MOCK === 'true' ? '' : process.env.VUE_APP_ROOT,
  appCode: process.env.VUE_APP_CODE,
  init() {
    return {
      router,
      store
    }
  },
  configUrl(url) {
    if (process.env.VUE_APP_BASE_API !== '/' && url && url.indexOf(process.env.VUE_APP_BASE_API) !== 0) {
      return process.env.VUE_APP_BASE_API + url
    }
    return url
  },
  showMessage(options) {
    Message(options)
  }
})

export default instance

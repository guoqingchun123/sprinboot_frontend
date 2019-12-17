import { Message } from 'element-ui'
import router from '@/router'
import store from '@/store'
import createInstance from '@bestvike/utils/lib/http'

const instance = createInstance({
  baseURL: process.env.VUE_APP_MOCK === 'true' ? '' : process.env.VUE_APP_PORTAL_ROOT,
  appCode: process.env.VUE_APP_CODE,
  router: router,
  store: store,
  showMessage: (options) => {
    Message(options)
  }
})

export default instance
import Vue from 'vue'

import { Loading } from 'element-ui'
import {
  Help, Button, Col, Form, FormItem, Hamburger, Input, Row, Scrollbar, Table, TableColumn, Tree, Pagination, Dialog, Tabs, TabPane,
  Select, RadioGroup, CheckboxGroup
} from '@bestvike/components'
import Ellipsis from '@bestvike/components/lib/directives/ellipsis'
import { fetchCatalogs, createBatch, modifyBatch, removeBatch, fetchDatas, modifyData, modifyDatas, removeDatas, rotateData } from '@/api/file'
import { modifySettings } from '@/api/authority/user'
import captureReadyImage from '@/assets/capture-ready.png'
import { showLoading } from '@bestvike/utils/lib/element'
import store from '@/store'

Vue.use(Help)
Vue.use(Button)
Vue.use(Col)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Hamburger)
Vue.use(Input)
Vue.use(Row)
Vue.use(Scrollbar)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tree)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Select)
Vue.use(RadioGroup)
Vue.use(CheckboxGroup)

Vue.use(Ellipsis)

Vue.prototype.$loading = param => {
  if (!param || !param.type || param.type !== 'click') {
    return Loading.service(param)
  }
  return showLoading(param)
}

Vue.prototype.$APP_ROOT = process.env.VUE_APP_ROOT === '/' ? '' : process.env.VUE_APP_ROOT
Vue.prototype.$APP_CODE = process.env.VUE_APP_CODE || ''
Vue.prototype.$SOCKET_SERVER = process.env.VUE_APP_SOCKET_SERVER === 'false' ? 'false' : (location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + location.host + Vue.prototype.$APP_ROOT
// process.env.VUE_APP_SOCKET_SERVER === '/' ? '' : process.env.VUE_APP_SOCKET_SERVER
Vue.prototype.$HELP_BASE = '@/assets/help/'
// 全局上传地址
/*
:fetch-catalog-api="fetchCatalogs"
            :create-batch-api="createBatch"
            :fetch-data-api="fetchDatas"
            :modify-data-api="modifyData"
            :remove-data-api="removeDatas"
            :rotate-data-api="rotateData"
*/
Vue.prototype.$COMPONENTS = {
  fileConfig: {
    batch: false,
    uploadAction: '/api/file/uploads',
    captureReadyImage: captureReadyImage,
    fetchCatalogApi: fetchCatalogs,
    createBatchApi: createBatch,
    modifyBatchApi: modifyBatch,
    removeBatchApi: removeBatch,
    fetchDataApi: fetchDatas,
    modifyDataApi: modifyData,
    modifyDatasApi: modifyDatas,
    removeDataApi: removeDatas,
    rotateDataApi: rotateData,
    initSettings(deviceType) {
      return {
        defaultCamera: store.state.settings.devices[deviceType].camera,
        defaultResolution: store.state.settings.devices[deviceType].resolution
      }
    },
    changeSettings(settings) {
      modifySettings(settings).then(() => {}).catch(() => {})
      store.dispatch('settings/changeSettings', settings)
    },
    installDriver(deviceType) {
      window.open(this.$APP_ROOT + '/drivers/' + deviceType + '.exe')
    }
  }
}
window.onunload = function() {
  if (window.__captureDialog) {
    window.__captureDialog.get_actionType("closeSignal")
    window.__captureDialog = null
  }
  if (window.__captureWebsocket) {
    window.__captureWebsocket.close()
    window.__captureWebsocket = null
  }
}
Vue.prototype.$MAXLENGTH = {
  id: 30,
  userId: 30,
  code: 30,
  name: 30
}
import '@bestvike/lightgallery/src/sass/lightgallery.scss'

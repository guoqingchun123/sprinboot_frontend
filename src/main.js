import Vue from 'vue'

//import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import './plugins/element'
import './plugins/component'
//import Element from 'element-ui'
//import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control

import * as filters from './filters' // global filters

if (process.env.VUE_APP_MOCK === 'true') {
  require('../mock') // simulation data
}
// 开启访问分析
if (process.env.VUE_APP_ANALYSIS === 'true') {
  const MtaH5 = require('mta-h5-analysis')
  MtaH5.init({
    "sid": '500675932', //必填，统计用的appid
    "cid": '500675953', //如果开启自定义事件，此项目为必填，否则不填
    "autoReport": 1,//是否开启自动上报(1:init完成则上报一次,0:使用pgv方法才上报)
    "senseHash": 1, //hash锚点是否进入url统计
    "senseQuery": 0, //url参数是否进入url统计
    "performanceMonitor": 0,//是否开启性能监控
    "ignoreParams": ['token'] //开启url参数上报时，可忽略部分参数拼接上报 => 目前该参数对于#后无效
  });
}

// mock api in github pages site build
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') { mockXHR() }
/*Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})*/

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.prototype.$filters = Vue.options.filters

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

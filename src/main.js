import Vue from 'vue'
import VueMatomo from 'vue-matomo'

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

/*if (process.env.VUE_APP_MOCK === 'true') {
  require('../mock') // simulation data
}*/

// matomo用户统计
if (process.env.VUE_APP_ANALYSIS) {
  Vue.use(VueMatomo, {
    // 这里配置你自己的piwik服务器地址和网站ID
    host: '/track',
    siteId: process.env.VUE_APP_TRACK_SITEID,
    // 根据router自动注册
    router: router,
    // 是否需要在发送追踪信息之前请求许可
    // 默认false
    requireConsent: false,
    // 是否追踪初始页面
    // 默认true
    trackInitialView: true,
    // 最终的追踪js文件名
    // 默认 'piwik'
    trackerFileName: 'piwik'
  })
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

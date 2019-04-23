import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
// import store from './store'

if (process.env.VUE_APP_ERRORLOG === 'true') {
  Raven.config(
    'http://7ea2b09bfdbc47209708d2250a48b9d1@sentry.bestvike.com/2',
    {
      environment: process.env.NODE_ENV,
      release: process.env.VUE_APP_VERSION
    }
  ).addPlugin(RavenVue, Vue).install()
  Vue.config.errorHandler = function(err) {
    Raven.captureException(err)
  }
}

// you can set only in production env show the error-log
/*if (process.env.NODE_ENV === 'production') {
  Vue.config.errorHandler = function(err, vm, info) {
  // Don't ask me why I use Vue.nextTick, it just a hack.
  // detail see https://forum.vuejs.org/t/dispatch-in-vue-config-errorhandler-has-some-problem/23500
    Vue.nextTick(() => {
      store.dispatch('addErrorLog', {
        err,
        vm,
        info,
        url: window.location.href
      })
      console.error(err, info)
    })
  }
}*/

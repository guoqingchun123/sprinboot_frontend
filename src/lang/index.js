import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import ElementLocale from 'element-ui/lib/locale'
import zhLocale from './zh'

Vue.use(VueI18n)

const messages = {
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
}

const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: Cookies.get('language') || 'zh',
  // set locale messages
  messages
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n

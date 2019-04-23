import Vue from 'vue'

import BvHamburger from '@/components/Hamburger/index.js'
import BvScrollbar from '@/components/Scrollbar/index.js'
import BvRow from '@/components/Row/index.js'
import BvCol from '@/components/Col/index.js'
import BvButton from '@/components/Button/index.js'
import BvForm from '@/components/Form/index.js'
import BvTable from '@/components/Table/index.js'
import BvTree from '@/components/Tree/index.js'
import BvPagination from '@/components/Pagination/index.js'
import BvDialog from '@/components/Dialog/index.js'

import BvNext from '@/directive/next/index.js'

Vue.use(BvHamburger)
Vue.use(BvScrollbar)
Vue.use(BvRow)
Vue.use(BvCol)
Vue.use(BvButton)
Vue.use(BvForm)
Vue.use(BvTable)
Vue.use(BvTree)
Vue.use(BvPagination)
Vue.use(BvDialog)

Vue.use(BvNext)

function analysisLog(actiontype, pagetype='', backup = {}){
  console.log(actiontype)
  console.log(pagetype)
  console.log(backup)
}

Vue.prototype.$log = analysisLog

///// 注意 下面常量计划删除 /////
Vue.prototype.$CONST = {
  form: {
    labelWidth: '90px'
  },
  row: {
    gutter: 20
  },
  col: {
    // 默认
    // :xs="24" :sm="12" :md="12" :lg="6" :xl="6"
    layout: {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 6,
      xl: 6
    },
    //设置一行三列
    layout1: {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 8,
      xl: 8
    },
    // 占两列宽度
    // :xs="24" :sm="24" :md="12" :lg="12" :xl="12"
    layout2: {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 12
    },
    //设置一行一列
    layout3: {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24,
      xl: 24
    },
    // 弹窗每行2列
    dialog2: {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 12,
      xl: 12
    },
    // 弹窗每行3列
    dialog3: {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 8,
      xl: 8
    },
    layout4: {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 16,
      xl: 16
    }
  }
}

import Vue from 'vue'
import BvIcon from '@/components/Icon'// svg组件

// register globally
Vue.component('BvIcon', BvIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

import BvTree from './tree.js'

BvTree.install = function (Vue) {
  Vue.component(BvTree.name, BvTree)
}

export default BvTree
import next from './next'

const install = function(Vue) {
  Vue.directive('next', next)
}

next.install = install
export default next

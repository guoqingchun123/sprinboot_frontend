import { Scrollbar } from 'element-ui'
import { defaults as utils } from '@bestvike/utils'

export default {
  name: 'BvScrollbar',
  extends: Scrollbar,
  mounted() {
    this.__resizeHandler = utils.debounce(() => {
      this.update()
    }, 100)

    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  }
}

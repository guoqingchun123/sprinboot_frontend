import { Tree } from 'element-ui'

export default {
  name: 'BvTree',
  extends: Tree,
  props: {
    props: {
      type: Object,
      default: () => {
        return {
          label: 'name',
          children: 'children'
        }
      }
    },
    expandOnClickNode: {
      type: Boolean,
      default: false
    },
    accordion: {
      type: Boolean,
      default: true
    },
    highlightCurrent: {
      type: Boolean,
      default: true
    }
  }
}

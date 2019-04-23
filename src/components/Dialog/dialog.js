import { Dialog } from 'element-ui'

export default {
  name: 'BvDialog',
  extends: Dialog,
  props: {
    closeOnClickModal: false,
    closeOnPressEscape: false
  }
}
import { Pagination } from 'element-ui'

export default {
  name: 'BvPagination',
  extends: Pagination,
  props: {
    layout: {
      type: String,
      default: 'total, prev, pager, next, jumper, slot'
    }
  }
}
// 改写el-row
export default {
  name: 'BvRow',

  componentName: 'ElRow',

  //////
  provide() {
    return {
      rowLayout: this.layout
    }
  },
  //////

  props: {
    tag: {
      type: String,
      default: 'div'
    },
    gutter: Number,
    type: String,
    justify: {
      type: String,
      default: 'start'
    },
    align: {
      type: String,
      default: 'top'
    },
    // 布局，支持 table-header,table-filter,dialog-2
    layout: {
      type: String,
      default: null
    }
  },
  //////////////
  data() {
    return {
      gutter__: this.gutter,
      type__: this.type,
      justify__: this.justify
    }
  },
  //////////////

  computed: {
    style() {
      const ret = {};

      if (this.gutter__) {
        ret.marginLeft = `-${this.gutter__ / 2}px`;
        ret.marginRight = ret.marginLeft;
      }

      return ret;
    }
  },
  ////////////
  created() {
    this.__class__ = this.layout
    if (this.layout === null) {
      this.gutter__ = this.gutter || 20
    } else if (this.layout === 'table-header') {
      this.type__ = 'flex'
      this.justify__ = 'space-between'
    }
  },

  render(h) {
    return h(this.tag, {
      class: [
        'el-row',
        this.justify__ !== 'start' ? `is-justify-${this.justify__}` : '',
        this.align !== 'top' ? `is-align-${this.align}` : '',
        { 'el-row--flex': this.type__ === 'flex' },
        /////
        this.__class__
      ],
      style: this.style
    }, this.$slots.default);
  }
};

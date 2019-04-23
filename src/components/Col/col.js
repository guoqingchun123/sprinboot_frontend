// 基于el-col修改
export default {
  name: 'BvCol',

  inject: {
    rowLayout: {
      default: ''
    }
  },

  props: {
    span: {
      type: Number,
      default: 24
    },
    tag: {
      type: String,
      default: 'div'
    },
    offset: Number,
    pull: Number,
    push: Number,
    xs: [Number, Object],
    sm: [Number, Object],
    md: [Number, Object],
    lg: [Number, Object],
    xl: [Number, Object],
    ////
    // 布局，支持operate,between
    layout: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      xs__: this.xs,
      sm__: this.sm,
      md__: this.md,
      lg__: this.lg,
      xl__: this.xl
    }
  },

  computed: {
    gutter() {
      let parent = this.$parent;
      while (parent && parent.$options.componentName !== 'ElRow') {
        parent = parent.$parent;
      }
      return parent ? parent.gutter : 0;
    }
  },
  /////////////
  created() {
    // 根据场景设置响应式布局
    // 如果需要考虑动态变化（比如布局由dialog-2修改为dialog-1等），将下面判断代码移至computed下
    // dialog-2意指每行显示两列的form表单
    if (this.rowLayout === 'dialog-2') {
      this.xs__ = 24
      this.sm__ = 24
      this.md__ = 12
      this.lg__ = 12
      this.xl__ = 12
    } else if (this.rowLayout === 'table-fuzzy') {
      this.xs__ = 24
      this.sm__ = 24
      this.md__ = 12
      this.lg__ = 12
      this.xl__ = 8
    } else if (this.rowLayout === 'table-filter') {
      if (this.layout === 'between') {
        // xx 至 xx 格式
        this.xs__ = 24
        this.sm__ = 24
        this.md__ = 12
        this.lg__ = 12
        this.xl__ = 8
      } else {
        this.xs__ = 24
        this.sm__ = 24
        this.md__ = 12
        this.lg__ = 8
        this.xl__ = 6
      }
    }
  },
  /////////////
  render(h) {
    let classList = [];
    let style = {};

    if (this.gutter) {
      style.paddingLeft = this.gutter / 2 + 'px';
      style.paddingRight = style.paddingLeft;
    }

    ['span', 'offset', 'pull', 'push'].forEach(prop => {
      if (this[prop] || this[prop] === 0) {
        classList.push(
          prop !== 'span'
            ? `el-col-${prop}-${this[prop]}`
            : `el-col-${this[prop]}`
        );
      }
    });

    ['xs', 'sm', 'md', 'lg', 'xl'].forEach(size => {
      if (typeof this[size + '__'] === 'number') {
        classList.push(`el-col-${size}-${this[size + '__']}`);
      } else if (typeof this[size + '__'] === 'object') {
        let props = this[size + '__'];
        Object.keys(props).forEach(prop => {
          classList.push(
            prop !== 'span'
              ? `el-col-${size}-${prop}-${props[prop]}`
              : `el-col-${size}-${props[prop]}`
          );
        });
      }
    });
    ////////////
    if (this.layout === 'operate') {
      classList.push('operate')
    }
    ////////////

    return h(this.tag, {
      class: ['el-col', classList],
      style
    }, this.$slots.default);
  }
};

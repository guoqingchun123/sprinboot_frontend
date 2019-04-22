<template>
  <el-scrollbar ref="scrollbar" class="scrollbar" wrap-class="scrollbar-wrapper">
    <slot />
  </el-scrollbar>
</template>

<script>
  import ResizeObserver from 'resize-observer-polyfill'

  export default {
    name: 'BvScrollbar',
    props: {
      // 监听大小变化的元素，如果为空则取slot内容
      observer: {
        type: Element,
        default: null
      }
    },
    mounted() {
      this.__observer__ = this.observer
      if (!this.__observer__) {
        if (this.$slots.default && this.$slots.default.length > 0) {
          this.__observer__ = this.$slots.default[0].elm
        }
      }
      this.create()
    },
    beforeDestroy() {
      this.destroy()
      this.__observer__ = null
    },
    methods: {
      create() {
        if (this.__observer__) {
          var vm = this
          this.__ro__ = new ResizeObserver(() => {
            vm.$refs.scrollbar.update()
          });

          this.__ro__.observe(this.__observer__)
        }
      },
      destroy() {
        if (this.__ro__) {
          this.__ro__.unobserve(this.__observer__)
          this.__ro__.disconnect()
          this.__ro__ = null
        }
      },
      recreate() {
        this.destroy()
        this.create()
      }
    }
  }
</script>
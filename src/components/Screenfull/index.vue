<template>
  <div class="screenfull">
    <bv-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" />
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'BvScreenfull',
  data() {
    return {
      isFullscreen: this.$store.getters.screenfull
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
      this.$store.dispatch('toggleScreenfull')
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', () => {
          this.$store.dispatch('toggleScreenfull', screenfull.isFullscreen)
          // this.isFullscreen = screenfull.isFullscreen
        })
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>

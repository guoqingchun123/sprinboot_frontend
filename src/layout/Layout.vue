<template>
  <el-container :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <bv-navbar />
    <el-container>
      <div class="sidebar-container">
        <bv-sidebar />
      </div>
      <el-container class="main-container">
        <bv-view />
        <bv-main class="app-main-container" />
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { BvNavbar, BvSidebar, BvMain, BvView } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    BvSidebar,
    BvNavbar,
    BvMain,
    BvView
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        'sidebar-mini': !this.sidebar.opened,
        'sidebar-normal': this.sidebar.opened,
        'no-animation': this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

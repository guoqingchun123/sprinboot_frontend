<template>
  <el-container :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <bv-sidebar class="sidebar-container" />
    <bv-scrollbar v-if="!fixedHeader" ref="scrollbar">
      <div :class="{'has-tags-view': needTagsView, 'fixed-header':fixedHeader}" class="main-container">
        <bv-navbar />
        <bv-tags-view v-if="needTagsView" />
        <bv-main class="app-main-container" />
      </div>
    </bv-scrollbar>
    <div v-else :class="{'has-tags-view': needTagsView, 'fixed-header':fixedHeader}" class="main-container">
      <bv-navbar />
      <bv-tags-view v-if="needTagsView" />
      <bv-main class="app-main-container" />
    </div>
  </el-container>
</template>

<script>
import { BvNavbar, BvSidebar, BvMain, BvTagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    BvSidebar,
    BvNavbar,
    BvMain,
    BvTagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      needTagsView: state => state.settings.layout.tagsView,
      fixedHeader: state => state.settings.layout.fixedHeader
    }),
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
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

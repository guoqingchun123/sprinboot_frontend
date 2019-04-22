<template>
  <bv-scrollbar>
    <section class="app-main">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
      </transition>
    </section>
  </bv-scrollbar>
</template>

<script>
import BvScrollbar from '@/components/Scrollbar'

export default {
  name: 'AppMain',
  components: {
    BvScrollbar
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>



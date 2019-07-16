<template>
  <!-- eslint-disable-next-line -->
  <component :is="fixedHeader ? 'bv-scrollbar' : 'div'">
    <section class="app-main">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
      </transition>
    </section>
  </component>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AppMain',
  computed: {
    ...mapState({
      fixedHeader: state => state.settings.fixedHeader
    }),
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.app-main {
  /* 50= navbar  50  */
  /// min-height: calc(100vh - #{$headerHeight});
  width: 100%;
  position: relative;
  /// overflow: hidden;
}

/*.fixed-header+.app-main {
  padding-top: 50px;
}*/

/*.has-tags-view {
  .app-main {
    min-height: calc(100vh - #{$headerHeight} - #{$tagsViewHeight});
  }

  &.fixed-header > .app-main {
    padding-top: 84px;
  }
}*/
</style>

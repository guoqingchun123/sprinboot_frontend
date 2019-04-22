<template>
  <bv-scrollbar>
    <el-aside width="100%">
      <el-menu
        class="app-menu"
        :default-active="$route.path"
        :collapse="isCollapse"
        :unique-opened="true"
        mode="vertical"
        :collapse-transition="false"
      >
        <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-aside>
  </bv-scrollbar>
</template>

<script>
import BvScrollbar from '@/components/Scrollbar'
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: {
    BvScrollbar,
    SidebarItem
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

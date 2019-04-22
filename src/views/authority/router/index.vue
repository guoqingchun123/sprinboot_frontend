<template>
  <div class="app-container">
    <bv-scrollbar>
      <el-tree :data="items" node-key="path" :props="defaultProps" accordion />
    </bv-scrollbar>
  </div>
</template>

<script>
  import i18n from '@/lang'
  import BvScrollbar from '@/components/Scrollbar'
  import { asyncRouterMap, constantRouterMap } from '@/router'

  export default {
    name: 'ListRouter',
    components: {
      BvScrollbar
    },
    data() {
      return {
        defaultProps: {
          label: this.showLabel
        },
        items: [...constantRouterMap, ...asyncRouterMap]
      }
    },
    methods: {
      showLabel(data) {
        if (!data.meta) {
          return data.path || '首页'
        }
        if (data.meta.title.indexOf('${') === 0 && data.meta.title.indexOf('}') === data.meta.title.length - 1 ) {
          const titleName = data.meta.title.substring(2, data.meta.title.length - 1)
          return i18n.t(`route.${titleName}`)
        }
        return data.meta.title
      }
    }
  }
</script>

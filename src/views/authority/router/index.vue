<template>
  <el-tree :data="routes" node-key="id" :props="defaultProps" :default-expand-all="true">
    <span slot-scope="{ node, data }" class="tree-node-operates">
      <span>{{ node.label }}</span>
      <span v-if="data.authority && data.authority.operates && data.authority.operates.length > 0" class="operates-container">
        <bv-button v-for="el in data.authority.operates" :key="el.name" type="text"> {{ el.label }} </bv-button>
      </span>
    </span>
  </el-tree>
</template>

<script>
  import { fetchRoutes } from '@/api/authority'

  export default {
    name: 'ListRouter',
    data() {
      return {
        defaultProps: {
          label: this.showLabel
        },
        items: []
      }
    },
    computed: {
      routes() {
        return this.items.filter(route => {
          return !route.hidden && route.meta
        })
      }
    },
    created() {
      fetchRoutes().then(res => {
        this.items = res.data
      }).catch(() => {})
    },
    methods: {
      showLabel(data) {
        return this.$filters.translate(data.meta)
      }
    }
  }
</script>
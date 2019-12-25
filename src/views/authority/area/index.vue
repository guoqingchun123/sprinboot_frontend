<template>
  <bv-row type="flex" class="fit-scroll">
    <bv-col>
      <bv-scrollbar>
        <el-tree :data="items" node-key="code" :props="defaultProps" :expand-on-click-node="false" accordion />
      </bv-scrollbar>
    </bv-col>
    <bv-col />
  </bv-row>
</template>

<script>
  import { fetchAreas } from '@/api/authority'

  export default {
    name: 'ListArea',
    data() {
      return {
        items: null,
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    created() {
      this.initItems()
    },
    methods: {
      initItems() {
        fetchAreas().then(response => {
          this.items = response.data
        })
      }
    }
  }
</script>

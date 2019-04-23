<template>
  <el-row type="flex" class="fit-scroll">
    <el-col>
      <bv-scrollbar>
        <el-tree :data="items" node-key="code" :props="defaultProps" :expand-on-click-node="false" accordion />
      </bv-scrollbar>
    </el-col>
    <el-col>
      safsdsdfsdfsdf
    </el-col>
  </el-row>
</template>

<script>
  // import BvScrollbar from '@/components/Scrollbar'
  import { fetchAreas } from '@/api/authority'

  export default {
    name: 'ListArea',
    /*components: {
      BvScrollbar
    },*/
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

<template>
  <div class="app-container">
    <bv-table title="企业管理" :pagination="true" :filter.sync="filter" :fetch-api="fetchCorp" @on-mounted="(table) => tableInstance = table">
      <div slot="search">
        <bv-col>
          <bv-form-item label="企业名称" prop="regionName">
            <el-input v-model="filter.compName" />
          </bv-form-item>
        </bv-col>
      </div>
      <bv-table-column label="企业编号" prop="corpId" align="center" sortable="custom" />
      <bv-table-column label="企业名称" prop="compName" align="center" sortable="custom" />
    </bv-table>
  </div>
</template>

<script>
  
  import {fetchCorp} from '@/api/basic'
  
  export default {
    name: 'ListDivision',
    data() {
      return {
        filter: {},
        tableInstance: {},
        item: {},
        fetchCorp,
      }
    },
    created() {
    },
    methods: {

    }
  }
</script>

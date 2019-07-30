<template>
  <div class="app-container">
    <bv-table title="企业管理" :pagination="true" :filter.sync="filter" :fetch-api="fetchCorp" @on-mounted="(table) => tableInstance = table">
      <div slot="search">
        <bv-col>
          <el-form-item label="企业名称" prop="regionName">
            <el-input v-model="filter.compName" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column label="企业编号" prop="corpId" align="center" sortable="custom" />
      <el-table-column label="企业名称" prop="compName" align="center" sortable="custom" />
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

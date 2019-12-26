<template>
  <div class="app-container">
    <bv-table title="预售证管理" :pagination="true" :filter.sync="filter" :fetch-api="fetchProSaleCard" @on-mounted="(table) => tableInstance = table">
      <div slot="search">
        <bv-col>
          <bv-form-item label="预售证号" prop="presaleNo">
            <el-input v-model="filter.presaleNo" />
          </bv-form-item>
        </bv-col>
        <bv-col>
          <bv-form-item label="楼盘坐落" prop="address">
            <el-input v-model="filter.address" />
          </bv-form-item>
        </bv-col>
      </div>
      <bv-table-column label="预售证号" prop="presaleNo" align="center" sortable="custom" />
      <bv-table-column label="楼盘坐落" prop="address" align="center" sortable="custom" />
      <bv-table-column label="规划用途" prop="bldFunction" align="center" sortable="custom" />
      <bv-table-column label="发证时间" prop="certificateTime" align="center" sortable="custom" />
    </bv-table>
  </div>
</template>

<script>
  
  import {fetchProSaleCard} from '@/api/basic'
  
  export default {
    name: 'ListDivision',
    data() {
      return {
        filter: {},
        tableInstance: {},
        item: {},
        fetchProSaleCard,
      }
    },
    created() {
    },
    methods: {

    }
  }
</script>

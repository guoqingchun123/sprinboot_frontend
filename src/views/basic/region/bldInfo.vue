<template>
  <div class="app-container">
    <bv-table title="未处理的楼栋" :pagination="true" :filter.sync="filter" :fetch-api="fetchBldinfo" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button type="primary" icon="el-icon-back" @click="returnRegion()">返回</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="楼栋名称" prop="bldName">
            <el-input v-model="filter.bldName" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column label="楼栋编号" prop="bldId" align="center" sortable="custom" />
      <el-table-column label="预售证编号" prop="preSaleNo" align="center" sortable="custom" />
      <el-table-column label="预售证日期" prop="preSaleDate" align="center" sortable="custom" />
      <el-table-column label="楼栋名称" prop="bldName" align="center" sortable="custom" />
      <el-table-column label="楼栋地址" prop="bldAddress" align="center" sortable="custom" />
    </bv-table>
  </div>
</template>

<script>

  import {fetchBldinfo} from '@/api/basic'

  export default {
    name: 'Bldinfo',
    data() {
      return {
        filter: {},
        tableInstance: {},
        item: {},
        fetchBldinfo,
      }
    },
    created() {
    },
    methods: {
      //返回小区列表页面
      returnRegion() {
        this.$emit('on-bld-return')
      },

    }
  }
</script>

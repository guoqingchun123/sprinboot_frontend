<template>
  <div class="app-container">
    <bv-table title="楼栋一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchRegions_"
              @on-mounted="(table) => tableInstance = table">
      <bv-table-column label="楼栋编号" prop="bldNo" align="center" sortable="custom"/>
      <bv-table-column label="楼栋坐落" prop="bldAddress" align="center" sortable="custom"/>
      <bv-table-column label="预售许可日期" prop="preSaleDate" align="center" sortable="custom"/>
      <bv-table-column label="结构属性" prop="frameAttr" align="center" sortable="custom"/>
      <bv-table-column label="楼层数" prop="heightAttr" align="center" sortable="custom"/>
      <bv-table-column align="center" label="操作">
        <template slot-scope="scope">
          <bv-button icon="el-icon-edit-outline" type="text" @click="handleBldInfo(scope.row)">查看楼层信息</bv-button>
        </template>
      </bv-table-column>
    </bv-table>
  </div>
</template>

<script>
  import {fetchRegionBlds} from '@/api/basic'

  export default {
    name: 'ListBld',
    props: {
      region: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        filter: {},
        tableInstance: {},
        fetchRegionBlds
      }
    },
    methods: {
      fetchRegions_(data) {
        data.regionId = this.region.regionId;
        return this.fetchRegionBlds(data)
      },
      handleBldInfo(row) {
        //console.info(row)
        this.$emit('on-bld-floor', row)
      }
    }
  }
</script>

<template>
  <div class="app-container">
    <bv-table title="楼层一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchFloors_"
              @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button type="success" icon="el-icon-back" @click="returnBld()">返回</bv-button>
      </div>
      <bv-table-column label="项目编号" prop="projectId" align="center" sortable="custom"/>
      <bv-table-column label="楼号" prop="bldNo" align="center" sortable="custom"/>
      <bv-table-column label="楼层" prop="floorNo" align="center" sortable="custom"/>
      <bv-table-column align="center" label="操作">
        <template slot-scope="scope">
          <bv-button icon="el-icon-edit-outline" type="text" @click="handleFloorInfo(scope.row)">维护楼层档案</bv-button>
        </template>
      </bv-table-column>
    </bv-table>
  </div>
</template>

<script>
  import {fetchBldFloors} from '@/api/basic'

  export default {
    name: 'ListFloor',
    props: {
      region: {
        type: Object,
        default: null
      },
      bld: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        filter: {},
        tableInstance: {},
        fetchBldFloors
      }
    },
    methods: {
      fetchFloors_(data) {
        data.regionId = this.region.regionId;
        data.projectId = this.bld.projectId;
        data.bldNo = this.bld.bldNo;
        return fetchBldFloors(data)
      },
      returnBld() {
        this.$emit('on-bld-return')
      },
      handleFloorInfo(row) {
        this.$emit('on-maintain-floor', row)
      }
    }
  }
</script>

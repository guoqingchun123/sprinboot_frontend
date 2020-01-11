<template>
  <div class="app-container">
    <div v-if="bldListShow">
      <bv-table :title="title" :pagination="true" :filter.sync="filter"
                :fetch-api="fetchRegionBlds_" @on-mounted="(table) => tableInstance = table">
        <div slot="operates">
          <bv-button type="primary" icon="el-icon-back" @click="returnRegion()">返回</bv-button>
        </div>
        <div slot="search">
          <bv-col>
            <el-form-item label="楼栋名称" prop="bldName">
              <el-input v-model="filter.bldName"/>
            </el-form-item>
          </bv-col>
        </div>
        <el-table-column label="楼栋名称" prop="bldName" align="center" sortable="custom"/>
        <el-table-column label="楼栋地址" prop="bldAddress" align="center" sortable="custom"/>
        <el-table-column label="预售证日期" prop="preSaleDate" align="center" sortable="custom"/>
        <el-table-column label="预售证编号" prop="preSaleNo" align="center" sortable="custom"/>
        <bv-table-column align="center" label="操作">
          <template slot-scope="scope">
            <bv-button icon="el-icon-picture" type="text" @click="showBldView(scope.row)">楼盘视图</bv-button>
          </template>
        </bv-table-column>
      </bv-table>
    </div>
    <div v-if="bldViewShow">
      <bld-view :bld="bld" @on-bld-view-return="onBldViewReturn"></bld-view>
    </div>
  </div>
</template>

<script>

  import {fetchRegionBlds} from '@/api/basic'
  import BldView from './bldView'

  export default {
    name: 'BldList',
    props: {
      region: {
        type: Object
      }
    },
    components: {
      BldView
    },
    data() {
      return {
        filter: {},
        tableInstance: {},
        item: {},
        fetchRegionBlds,
        title: '',
        bldViewShow: false,
        bldListShow: true,
        bld: {}
      }
    },
    created() {
      this.title = this.region.regionName + "楼栋列表一览"
    },
    methods: {
      showBldView(row) {
        this.bld = row;
        this.bldListShow = false;
        this.bldViewShow = true;
      },
      fetchRegionBlds_(data) {
        data.regionId = this.region.regionId;
        data.sort = 'bldName';
        return fetchRegionBlds(data);
      },
      //返回小区列表页面
      returnRegion() {
        this.$emit('on-bld-return')
      },
      onBldViewReturn() {
        this.bld = {};
        this.bldListShow = true;
        this.bldViewShow = false;
      }
    }
  }
</script>

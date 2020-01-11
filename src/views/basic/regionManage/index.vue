<template>
  <div class="app-container">
    <div v-if="regionListShow">
      <bv-table title="小区一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchRegions_"
                @on-mounted="(table) => tableInstance = table">
        <div slot="search">
          <bv-col>
            <bv-form-item label="小区名称" prop="regionName">
              <el-input v-model="filter.regionName"/>
            </bv-form-item>
          </bv-col>
        </div>
        <bv-table-column type="selection" width="55"/>
        <bv-table-column label="小区名称" prop="regionName" align="center" sortable="custom"/>
        <bv-table-column label="小区地址" prop="address" align="center" sortable="custom"/>
        <bv-table-column label="所属行政区" prop="divisionCode" :formatter="divisionFormat" align="center"
                         sortable="custom"/>
        <bv-table-column label="预售许可日期" prop="preSaleDate" align="center" sortable="custom"/>
        <bv-table-column label="发布日期" prop="publishDate" align="center" sortable="custom"/>
        <bv-table-column label="状态" prop="state" :formatter="stateFormat" align="center" sortable="custom"/>
        <bv-table-column align="center" label="操作">
          <template slot-scope="scope">
            <bv-button icon="el-icon-picture" type="text" @click="showBldList(scope.row)">楼栋管理</bv-button>
          </template>
        </bv-table-column>
      </bv-table>
    </div>
    <div v-if="bldListShow">
      <bld-list :region="region" @on-bld-return="onBldReturn"></bld-list>
    </div>
  </div>
</template>

<script>
  import {
    fetchRegions,
    fetchAllDivisions
  } from '@/api/basic'

  import BldList from './bldList'

  export default {
    name: 'RegionManage',
    components: {
      BldList
    },
    data() {
      return {
        filter: {},
        tableInstance: {},
        item: {
          options: []
        },
        fetchRegions,
        bldListShow: false,
        regionListShow: true,
        region: {}
      }
    },
    created() {
      fetchAllDivisions().then((res) => {
        this.divisions = res.data;
      })
    },
    methods: {
      fetchRegions_(data) {
        data.state = '0000';
        return fetchRegions(data);
      },
      divisionFormat(row, column, cellValue) {
        for (let i in this.divisions) {
          if (cellValue && cellValue == this.divisions[i].divisionCode) {
            return this.divisions[i].divisionName
          }
        }
      },
      stateFormat(row, column, cellValue) {
        if (cellValue) {
          if (cellValue == '9999') {
            return '暂存'
          } else if (cellValue == '1000') {
            return '申报中'
          } else if (cellValue == '2000') {
            return '申报未通过'
          } else if (cellValue == '0000') {
            return '发布'
          } else {
            return ''
          }
        }
      },
      showBldList(row) {
        this.region = row;
        this.regionListShow = false;
        this.bldListShow = true;
      },
      onBldReturn() {
        this.regionListShow = true;
        this.bldListShow = false;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .time-case {
    padding-left: 12px;
  }
</style>

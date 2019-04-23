<template>
  <div class="app-container">
    <bv-table ref="table" v-loading="loading" title="信息列表" :pagination="true" :filter.sync="filter" :fetch-api="fetchToken" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="refresh" authority="refresh" @click="refreshTokenTable()">刷新</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="系列号" prop="deviceSn">
            <el-input v-model="filter.deviceSn" />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="令牌状态" prop="state">
            <el-select v-model="filter.state" placeholder="请选择令牌状态">
              <el-option
                v-for="item in tokenStateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column label="序列号" prop="deviceSn" align="center" sortable="custom" />
      <el-table-column label="状态" prop="state" align="center" sortable="custom" :formatter="tokenStateFormatter" />
      <el-table-column label="最后修改日期" prop="lastModifyDate" align="center" :formatter="dateFormatter" />
    </bv-table>
  </div>
</template>

<script>
  // import Vue from 'vue'
  // import i18n from '@/lang'
  // import BvScrollbar from '@/components/Scrollbar'
  import { fetchToken } from '@/api/authority'
  import moment from 'moment'

  export default {
    name: 'ListRole',
    /*components: {
      BvScrollbar
    },*/
    data() {
      return {
        filter: {},
        dialogFormVisible: false,
        dialogGrantVisible: false,
        modifyType: null,
        //是否加载中
        loading: false,
        role: {
          deviceSn: null,
          state: null,
          lastModifyDate: null,
        },
        tokenStateOptions: [
          {
            label:'未激活',
            value:'9999'
          },
          {
            label:'已激活',
            value:'0000'
          },
          {
            label:'已锁定',
            value:'0001'
          },
          {
            label:'已挂失',
            value:'0002'
          }
        ],
        tableInstance: {},
        fetchToken
      }
    },
    methods: {
      // 辅助函数
      isIndeterminate(meta) {
        // data.meta
        return meta.authorityOperates__.length > 0 && meta.authorityOperates__.length < meta.operates.length
      },
      //令牌状态
      tokenStateFormatter(row){
        switch (row.state) {
          case '9999':return "未激活";
          case '0000':return "已激活";
          case '0001':return "已锁定";
          case '0002':return "已挂失";
        }
      },
     dateFormatter(row) {
        return moment(row.lastModifyDate).format('YYYY-MM-DD')
      },
      //刷新
      refreshTokenTable() {
      console.log(this.tableInstance)
      this.tableInstance.fetchData()
    }
    }
  }
</script>


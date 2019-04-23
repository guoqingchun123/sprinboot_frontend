<template>
  <div>
    <bv-table ref="table"
              title="服务到期信息列表"
              :pagination="false"
              :filter.sync="filter"
              :fetch-api="queryServiceDueInfo"
              @on-mounted="(table) => tableInstance = table"
    >
      <div slot="search">
        <bv-col>
          <el-form-item label="客户名称">
            <el-input v-model="filter.corpName" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column prop="corpName" label="客户名称" />
      <el-table-column prop="contractName" label="项目名称" />
      <el-table-column prop="salesEmp" label="销售经理" />
      <el-table-column prop="salesAssistant" label="销售助理" />
      <el-table-column prop="manageEmp" label="项目经理" />
      <el-table-column prop="checkDate" label="验收日期" :formatter="checkDateFormatter" />
      <el-table-column prop="handoverDate" label="交接日期" :formatter="handoverDateFormatter" />
      <el-table-column prop="serveStartDate" label="服务开始日期" :formatter="serveStartDateFormatter" />
      <el-table-column prop="serveEndDate" label="服务截止日期" :formatter="serveEndDateFormatter" />
    </bv-table>
  </div>
</template>

<script>
  import {queryServiceDueInfo} from '@/api/remind/remind'
  import moment from 'moment'

  export default {
    name: 'ServiceDueRemind',
    data() {
      return{
        queryServiceDueInfo,
        tableInstance:{},
        // serviceDueInfo:{},
        // 过滤条件
        filter: {
          corpName:''
        },
      }
    },
    computed:{

    },
    created() {
    },
      methods:{
      checkDateFormatter(row) {
        if(row.checkDate!=null){
          return moment(row.checkDate).format('YYYY-MM-DD')
        }
      },
      handoverDateFormatter(row) {
        if(row.handoverDate!=null){
          return moment(row.handoverDate).format('YYYY-MM-DD')
        }
      },
      serveStartDateFormatter(row) {
        if(row.serveStartDate!=null){
          return moment(row.serveStartDate).format('YYYY-MM-DD')
        }
      },
      serveEndDateFormatter(row) {
        if(row.serveEndDate!=null){
          return moment(row.serveEndDate).format('YYYY-MM-DD')
        }
      },
    }
  }
</script>

<style>

</style>


<template>
  <div>
    <bv-table ref="table"
              title="巡检回访信息列表"
              :pagination="false"
              :filter.sync="filter"
              :fetch-api="queryInspectionlVisitRemind"
              @on-mounted="(table) => tableInstance = table"
    >
      <div slot="search">
        <bv-col>
          <el-form-item label="客户名称" prop="corpName">
            <el-input v-model="filter.corpName" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column prop="corpName" label="客户名称" />
      <el-table-column prop="corpLevel" label="客户分级" :formatter="corpLevelFormatter" />
      <el-table-column prop="contractName" label="项目名称" />
      <el-table-column prop="serveStartDate" label="服务开始日期" :formatter="serveStartDateFormatter" />
      <el-table-column prop="serveEndDate" label="服务截止日期" :formatter="serveEndDateFormatter" />
      <el-table-column prop="isEnd" label="服务是否到期" :formatter="isEndFormatter" />
      <el-table-column prop="visitDate" label="应巡检日期" :formatter="visitDateFormatter" />
    </bv-table>
  </div>
</template>

<script>
  import {queryInspectionlVisitRemind} from '@/api/remind/remind'
  import moment from 'moment'

  export default {
    name: 'InspectionVisitRemind',
    data() {
      return{
        items:[],
        // 过滤条件
        filter: {
          corpName:''
        },
        loading:false,
        queryInspectionlVisitRemind,
        tableInstance:{}
      }
    },
    computed:{

    },
    created(){
    },
    methods: {
      visitDateFormatter(row){
        return moment(row.visitDate).format('YYYY-MM-DD')
      },
      serveEndDateFormatter(row) {
        if(row.serveEndDate!=null){
          return moment(row.serveEndDate).format('YYYY-MM-DD')
        }
      },
      serveStartDateFormatter(row) {
        if(row.serveStartDate!=null){
          return moment(row.serveStartDate).format('YYYY-MM-DD')
        }
      },
      isEndFormatter(row){
        let resultDay=row.serveEndDate;
        let today=new Date();
        if(resultDay<today){
          return '是'
        } else if(resultDay==null){
          return ''
        }else if(resultDay>=today){
          return '否'
        }
      },
      corpLevelFormatter(row) {
        switch (row.corpLevel) {
          case 'A':return "A级";
          case 'B':return "B级";
          case 'C':return "C级";
          case 'D':return "D级";
        }
      },
    }
  }
</script>

<style>

</style>


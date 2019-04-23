<template>
  <div class="app-container">
    <bv-table ref="table" title="项目审批记录列表" :pagination="true" :filter.sync="filter" :fetch-api="fetchApproveLog" @on-mounted="(table) => tableInstance = table">
      <div slot="search">
        <bv-col>
          <el-form-item label="项目编号" prop="projId">
            <el-input v-model="filter.projId" placeholder="项目编号" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column label="序号" type="index" />
      <el-table-column label="项目编号" sortable="projId" prop="projId">
        <template slot-scope="scope"><img src="../../assets/wenjianjia.png" style="width:20px;height:20px; margin-right:6px">{{ scope.row.projId }}</template>
      </el-table-column>
      <el-table-column label="审批状态" :formatter="flowStateFormatter" prop="flowState" />
      <el-table-column label="审批结果" :formatter="resultFormatter" prop="result" />
      <el-table-column label="总经理审批意见" prop="approvalOpinion" />
      <el-table-column label="技术负责人" prop="technologyLeader" />
      <el-table-column label="项目经理" prop="projManager" />
      <el-table-column label="维护日期" prop="manageTime" :formatter="dateFormatter" />
      <el-table-column label="维护人员" prop="manageUser" />
      <el-table-column label="总经理备注" prop="remark1" />
      <el-table-column label="技术总监备注" prop="remark2" />
    </bv-table>
  </div>
</template>

<script>
  import {fetchApproveLog} from '../../api/proj/proj'

  export default {
    data() {
      return {
        //精确查询表单内容
        filter: {
          projId: ''
        },
        tableInstance:{},
        fetchApproveLog
      }
    },
    methods: {
      //过滤器用法
      resultFormatter(row) {
        if(row.result==0){
          return '通过'
        }else {
          return '未通过'
        }
      },
      //时间过滤器
      dateFormatter(row) {
        let date = new Date(row.manageTime)
        return this.dateFtt("yyyy-MM-dd",date)
      },
      /**************************************时间格式化处理************************************/
      dateFtt:function(fmt,date)
      {
        let o = {
          "M+" : date.getMonth()+1,                 //月份
          "d+" : date.getDate(),                    //日
          "h+" : date.getHours(),                   //小时
          "m+" : date.getMinutes(),                 //分
          "s+" : date.getSeconds(),                 //秒
          "q+" : Math.floor((date.getMonth()+3)/3), //季度
          "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
          fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
          if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
      },
      flowStateFormatter(row) {
        if(row.flowState=='0000'){
          return '总经理已审批'
        }else if(row.flowState=='0001'){
          return '技术负责人已审批'
        }else {
          return '项目经理已签收'
        }
      }
    }
  }
</script>
<style scoped>
  @import "../../styles/simpleTable.scss";
</style>

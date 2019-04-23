<template>
  <div>
    <bv-table ref="table"
              title="我的工作信息列表"
              :pagination="false"
              :filter.sync="filter"
              :fetch-api="queryMyWorkRemind"
              @on-mounted="(table) => tableInstance = table"
    >
      <div slot="search">
        <bv-col>
          <el-form-item label="客户单位" prop="corpName">
            <el-input v-model="filter.corpName" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column prop="recordId" label="记录编号" />
      <el-table-column prop="corpName" label="客户单位" />
      <el-table-column prop="custName" label="联系人" />
      <el-table-column prop="custMobilePhone" label="联系信息" />
      <el-table-column prop="feedbackMode" label="反馈方式" :formatter="feedbackModeFormatter" />
      <el-table-column prop="systemType" label="系统类型" :formatter="systemTypeFormatter" />
      <el-table-column prop="state" label="状态" :formatter="stateFormatter" />
      <el-table-column prop="problemType" label="问题分类" :formatter="problemTypeFormatter" />
      <el-table-column prop="proDescribe" label="问题描述" />
      <el-table-column prop="proHandle" label="处理建议" />
      <el-table-column
        label="操作"
        align="left"
      >
        <template scope="scope">
          <el-button type="text" size="small">&nbsp;结束处理</el-button>
          <el-button type="text" size="small">图档</el-button>
          <el-button type="text" size="small" @click="clickShowDetail(scope.row)">查看</el-button>
          <el-button type="text" size="small">放弃处理</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="enterEmp" label="录入人员" />
      <el-table-column prop="handleUser" label="处理人员" />
      <el-table-column prop="enterDate" label="录入日期" />
      <el-table-column prop="handleTime" label="处理开始时间" />
    </bv-table>
    <bv-dialog title="查看详情" :visible.sync="dialogVisible" top="5vh">
      <el-form ref="myWorkInfo" status-icon :model="myWorkInfo" label-width="100px" label-position="right" style="width: 90%;">
        <el-row :gutter="$CONST.row.gutter">
          <el-form-item label="记录编号" prop="recordId">
            <el-input v-model="myWorkInfo.recordId" />
          </el-form-item>
          <el-form-item label="客户单位" prop="corpName">
            <el-input v-model="myWorkInfo.corpName" />
          </el-form-item>
          <el-form-item label="联系信息" prop="custMobilePhone">
            <el-input v-model="myWorkInfo.custMobilePhone" />
          </el-form-item>
          <el-form-item label="反馈方式" prop="feedbackMode">
            <el-input v-model="myWorkInfo.feedbackMode" />
          </el-form-item>
          <el-form-item label="系统类型" prop="systemType">
            <el-input v-model="myWorkInfo.systemType" />
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-input v-model="myWorkInfo.state" />
          </el-form-item>
          <el-form-item label="问题分类" prop="problemType">
            <el-input v-model="myWorkInfo.problemType" />
          </el-form-item>
          <el-form-item label="问题描述" prop="proDescribe">
            <el-input v-model="myWorkInfo.proDescribe" />
          </el-form-item>
          <el-form-item label="问题分类" prop="problemType">
            <el-input v-model="myWorkInfo.problemType" />
          </el-form-item>
          <el-form-item label="录入人员" prop="enterEmp">
            <el-input v-model="myWorkInfo.enterEmp" />
          </el-form-item>
          <el-form-item label="处理人员" prop="handleUser">
            <el-input v-model="myWorkInfo.handleUser" />
          </el-form-item>
          <el-form-item label="录入日期" prop="enterDate">
            <el-input v-model="myWorkInfo.enterDate" />
          </el-form-item>
          <el-form-item label="处理开始时间" prop="handleTime">
            <el-input v-model="myWorkInfo.handleTime" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer">
        <bv-button view="cancel" @click="cancelShowDetail">关闭</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  import {queryMyWorkRemind} from '@/api/remind/remind'

  export default {
    name: 'MyWork',
    data() {
      return{
        queryMyWorkRemind,
        tableInstance:{},
        // 过滤条件
        filter: {
          corpName:''
        },
        myWorkInfo:[],
        dialogVisible:false
      }
    },
    computed:{

    },
    created(){
    },
    methods:{
      clickShowDetail(row){
        this.myWorkInfo=row;
        this.dialogVisible=true
      },
      cancelShowDetail(){
        this.dialogVisible=false
      },
      feedbackModeFormatter(row) {
        switch (row.feedbackMode) {
          case '01':return "电话";
          case '02':return "QQ";
          case '03':return "Email";
        }
      },
      systemTypeFormatter(row) {
        switch (row.systemType) {
          case '01':return "硬件及环境";
          case '02':return "保修金";
          case '03':return "维修资金";
          case '04':return "预售网签";
          case '05':return "监管";
          case '06':return "物业平台";
          case '07':return "公房";
          case '08':return "用友财务";
          case '09':return "BVOA";
          case '10':return "产权产籍";
          case '11':return "存量房";
          case '12':return "数据中心";
          case '13':return "其他";
        }
      },
      stateFormatter(row) {
        switch (row.state) {
          case '01':return "未处理";
          case '02':return "处理中";
          case '03':return "已处理";
        }
      },
      problemTypeFormatter(row) {
        switch (row.state) {
          case '01':return "数据问题";
          case '02':return "系统缺陷";
          case '03':return "功能需求";
          case '04':return "操作问题";
          case '05':return "环境问题";
          case '06':return "业务咨询";
          case '07':return "其他";

        }
      },
    }
  }
</script>

<style>

</style>


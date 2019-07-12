<template>
  <div class="app-container">
    <!--项目查询列表-->
    <bv-table ref="table" title="项目一览" :pagination="true" :filter.sync="filter" :fetch-api="queryProjects" @on-mounted="(table) => tableInstance = table">
      <div slot="search">
        <bv-col>
          <el-form-item label="项目编号" prop="projectId">
            <el-input v-model="filter.projectId" />
          </el-form-item>
        </bv-col>

        <bv-col>
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="filter.projectName" />
          </el-form-item>
        </bv-col>

        <bv-col>
          <el-form-item label="项目地址:" prop="address">
            <el-input v-model="filter.address" clearable />
          </el-form-item>
        </bv-col>
      </div>
      <!--列表展示字段-->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="projectId" label="项目编号" />
      <el-table-column label="项目名称" prop="projectName" sortable="custom" />
      <el-table-column label="项目地址" prop="address" sortable="custom" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button view="details" type="text" @click="selectBuildInfo(scope.row)">查看楼栋详情</el-button>
        </template>
      </el-table-column>
    </bv-table>
  </div>
</template>

<script>
  import { queryProjects } from '@/api/custom/project'
  import moment from 'moment'

  export default {
    name: 'projectManage',
    components: {
    },
    data() {
      return {
        visitedViews:this.$store.state.tagsView.visitedViews,
        projectStateS:this.$store.getters.dicts.projectState ,
        project: {},
        // 过滤条件
        filter: {},
        dialogFormVisible: false,
        projectId: '',
        tableInstance: {},
        editType: '', // add/edit
        tableInstanceDialog : {},
        role:{
          projectId : null,
          projectName : null,
          address : null
        },
        queryProjects
      }
    },

    methods: {
     selectBuildInfo :function(row){
      //  this.$store.dispatch('tagsView/delView', this.$router)
       //this.$router.push('/authority/buildInfo')
       for (let i in this.visitedViews) {
         if (this.visitedViews[i].name == 'project') {
           this.$store.dispatch('tagsView/delView', this.visitedViews[i])
           break
         }
       }
       this.$router.push({
                           name: 'buildInfo'
                         })
     },
      dateFormat: function (row, column){
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
      },
      projectStateFormat(row){
        for (let i = 0; i < this.projectStateS.length; i++) {
          if (this.projectStateS[i].value === row.projectState) {
            return this.projectStateS[i].label;
          }
        }
      }
    }
  }
</script>

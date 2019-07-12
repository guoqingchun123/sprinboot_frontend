<template>
  <div class="app-container">
    <bv-table ref="table" title="楼栋一览" :pagination="true" :filter.sync="filter" :fetch-api="listBldInfo" @on-mounted="(table)=> tableInstanceDialog = table">
      <div slot="operates">
        <bv-button show="none" view="add" @click="backToProject()">返回</bv-button>
      </div>
      <el-table-column label="楼栋名称" prop="bldName" sortable="custom" />
      <el-table-column label="楼栋地址" prop="bldAddress" sortable="custom" />
      <el-table-column label="销售许可证号" prop="preSaleNo" sortable="custom" />
      <el-table-column label="销售许可日期" prop="preSaleDate" sortable="custom" />
      <el-table-column label="开始日期" prop="startDate" sortable="custom" />
      <el-table-column label="截止日期" prop="stopDate" sortable="custom" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button view="details" type="text" @click="selectBuildView(scope.row)">查看楼盘视图</el-button>
        </template>
      </el-table-column>
    </bv-table>
  </div>
</template>

<script>
  import {} from '@/api/custom/project'
  export default {
    components: {
    },
    data() {
      return {
        visitedViews:this.$store.state.tagsView.visitedViews,
        // 过滤条件
        filter: {},
        tableInstance: {},
        editType: '', // add/edit
        tableInstanceDialog : {},
        role:{
          projectId : null,
          projectName : null,
          address : null
        }
      }
    },
    methods: {
      //刷新
      refreshBuildTable :function() {
        this.tableInstanceDialog.fetchData()
      },
     selectBuildInfo :function(row){
      this.role = row
      this.refreshBuildTable()
     },
     backToProject :function () {
        for (let i in this.visitedViews) {
          if (this.visitedViews[i].name == 'buildInfo') {
            this.$store.dispatch('tagsView/delView', this.visitedViews[i])
            break
          }
        }
        this.$router.push({
                            name: 'project'
                          })
      }

    }
  }
</script>

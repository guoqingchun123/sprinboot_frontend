<template>
  <div class="app-container">
    <bv-table title="项目一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchProjs_" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button view="add" @click="initProject()">新增项目</bv-button>
        <bv-button type="primary" icon="el-icon-back" @click="returnPre()">返回</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <bv-form-item label="项目名称" prop="projectName">
            <el-input v-model="filter.projectName" />
          </bv-form-item>
        </bv-col>
      </div>
      <bv-table-column label="项目名称" prop="projectName" align="center" sortable="custom" />
      <bv-table-column label="项目地址" prop="address" align="center" sortable="custom" />
      <bv-table-column align="center" label="操作">
        <template slot-scope="scope">
          <bv-button icon="el-icon-delete" type="text" @click="handleRegionInfo(scope.row)">移除项目</bv-button>
        </template>
      </bv-table-column>
    </bv-table>
    <bv-dialog title="新增项目" :visible.sync="dialogTableVisible">
      <bv-table ref="table" :pagination="true" :filter.sync="dialogFilter" :fetch-api="fetchNoRegionProjects" @on-mounted="(table) => dialogTableInstance = table">
        <div slot="operates">
          <bv-button show="oneOrMore" view="add" @click="addRegionProjecs">新增</bv-button>
        </div>
        <bv-table-column type="selection" width="50" />
        <bv-table-column prop="projectId" label="项目编号" sortable />
        <bv-table-column prop="projectName" label="项目名称" sortable />
        <bv-table-column prop="address" label="项目地址" sortable />
      </bv-table>
    </bv-dialog>
  </div>
</template>

<script>
import {fetchProjects, fetchNoRegionProjects, removeRegionProjects, addRegionProjects} from '@/api/basic'

export default {
  name: 'ListProjectByRegion',
  props: {
    regionId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      filter: {},
      tableInstance: {},
      //Dialog
      dialogTableVisible: false,
      dialogFilter: {},
      dialogTableInstance:{},
      fetchProjects,
      fetchNoRegionProjects
    }
  },
  methods: {
    fetchProjs_(data) {
      data.regionId = this.regionId
      return fetchProjects(data)
    },
    //打开新增项目弹窗
    initProject() {
      this.dialogTableVisible = true
      if (this.dialogTableInstance.fetchData) {
        this.dialogTableInstance.fetchData()
      }
    },
    //返回小区列表页面
    returnPre() {
      this.$emit('on-project-return')
    },
    //移除项目
    handleRegionInfo(row) {
      this.$confirm('此操作将移除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          regionId: this.regionId,
          projectId: row.projectId
        }
        removeRegionProjects(param).then(response => {
          if (this.tableInstance.fetchData) {
            this.tableInstance.fetchData()
          }
          this.$message({
            type: 'success',
            message: '移除项目成功'
          })
        }).catch(() => {
          this.$message({
            message: '移除项目失败',
            type: 'error'
          })
        })
      })
    },
    //小区新增项目
    addRegionProjecs() {
      let param = {
        regionId: this.regionId,
        projects: this.dialogTableInstance.table.selection
      }
      addRegionProjects(param).then(response => {
        if (this.tableInstance.fetchData) {
          this.tableInstance.fetchData()
        }
        this.dialogTableVisible = false
        this.$message({
          type: 'success',
          message: '新增项目成功'
        })
      }).catch(() => {
        this.$message({
          showClose: true,
          type: 'error',
          message: '新增项目失败'
        })
      })
    }
  }
}
</script>

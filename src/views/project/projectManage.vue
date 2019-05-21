<template>
  <div class="app-container">
    <!--项目查询列表-->
    <bv-table ref="table" title="项目一览" :pagination="true" :filter.sync="filter" :fetch-api="queryProjects" @on-mounted="(table) => tableInstance = table">
      <!--按钮操作-->
      <div slot="operates">
        <bv-button show="none" view="add" authority="add" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" @click="initProjectEdit()">修改</bv-button>
        <bv-button show="oneOrMore" view="remove" @click="startRemove()">删除</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="项目编号" prop="projectId">
            <el-input v-model="filter.projectId" />
          </el-form-item>
        </bv-col>

        <bv-col>
          <el-form-item label="企业名称" prop="compName">
            <el-input v-model="filter.compName" />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="filter.projectName" />
          </el-form-item>
        </bv-col>

        <bv-col>
          <el-form-item label="项目地址:" prop="address">
            <el-input v-model="filter.address"  clearable />
          </el-form-item>
        </bv-col>

        <bv-col>
          <el-form-item label="状态:" prop="projectState">
            <el-select  v-model="filter.projectState" placeholder="请选择"    width="80%" >
              <el-option
                v-for="item in projectStateS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </bv-col>
      </div>
      <!--列表展示字段-->
      <el-table-column type="selection" width="55" />
      <el-table-column  prop="projectId" label="项目编号" />
      <el-table-column label="项目名称" prop="projectName" sortable="custom" />
      <el-table-column label="企业名称" prop="compName" sortable="custom" />
      <el-table-column label="项目地址" prop="address" sortable="custom" />
      <el-table-column label="状态" prop="projectState"  :formatter="projectStateFormat"  />
      <el-table-column label="最后更新时间" prop="lastModifyTime"  :formatter="dateFormat"  />
    </bv-table>
    <!--新增，修改项目信息-->
    <project-edit :visible="dialogFormVisible" :project="project" :editType="editType" @on-edit="projectEdited" />
  </div>
</template>

<script>
  import {deleteProject, queryProjectInfo, queryProjects} from '@/api/custom/project'
  import projectEdit from './projectEdit'
  import moment from 'moment'
  export default {
    name: 'projectManage',
    components: {
      projectEdit
    },
    data() {
      return {
        projectStateS:this.$store.getters.dicts.projectState ,
        project: {},
        // 过滤条件
        filter: {},
        dialogFormVisible: false,
        projectId: '',
        tableInstance: {},
        editType: '', // add/edit
        queryProjects
      }
    },
    methods: {
      // 新增项目,弹窗
      startCreate() {
        // item 置空
        this.project = {}
        this.editType = 'add'
        // 展示弹窗
        this.dialogFormVisible = true
        // 表单重置，表单验证重置
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      // 修改项目，弹窗
      initProjectEdit() {
        this.editType = 'edit'
        // 后台查询选中的项目信息
        let projectId = this.tableInstance.table.selection[0].projectId
        queryProjectInfo(projectId).then((res) => {
          if (res.data) {
            this.project = res.data
            // 展示弹出框
            this.dialogFormVisible = true
          }
        });
        // 表单重置，表单验证重置
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      // 关闭弹出框
      projectEdited(refresh) {
        this.dialogFormVisible = false;
        if (refresh) {
          this.tableInstance.fetchData();
          this.$message({
            message: '操作成功...',
            type: 'success'
          })
        }
      },
      // 删除用户
      startRemove() {
        this.$confirm('此操作将删除所选项目，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( () => {
          let projectIds = this.tableInstance.table.selection.map(item => item.projectId)
          deleteProject(projectIds).then(() => {
            // 刷新table
            this.tableInstance.fetchData()
            this.$message({
              message: '删除项目成功',
              type: 'success'
            })
          })
        })
      },
     dateFormat:function(row, column) {
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
      },
    }
  }
</script>

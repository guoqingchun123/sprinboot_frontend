<template>
  <div class="app-container">
    <!--用户查询列表-->
    <bv-table ref="table" title="用户一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchUsers" @on-mounted="(table) => tableInstance = table">
      <!--按钮操作-->
      <div slot="operates">
        <bv-button show="one" view="grant" @click="initGrant()">授权</bv-button>
        <bv-button show="none" view="add" authority="add" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" @click="initUserEdit()">修改</bv-button>
        <bv-button show="one" view="remove" @click="resetPass()">重置密码</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="用户姓名" prop="userName">
            <el-input v-model="filter.userName" />
          </el-form-item>
        </bv-col>
      </div>
      <!--列表展示字段-->
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户编号" prop="userId" sortable="custom" />
      <el-table-column label="用户姓名" prop="userName" sortable="custom" />
      <el-table-column label="用户别名" prop="userAlias" sortable="custom" />
      <el-table-column label="状态" prop="userState" sortable="custom" />
    </bv-table>

    <!--新增/修改弹窗-->
    <bv-dialog title="用户维护" :visible.sync="dialogFormVisible" />

    <user-edit :visible="dialogFormVisible" :item="item" @on-edit="userEdited" />
  </div>
</template>

<script>
  import {fetchUsers, resetPass, fetchGrants} from '@/api/authority'
  import http from '@/utils/http'
  import userEdit from './edit'
  export default {
    name: 'ListUser',
    components: {
      userEdit
    },
    data() {
      return {
        item: {
          userName: '',
          userAlias: '',
          checkKey: 'Y'
        },
        // 过滤条件
        filter: {},
        dialogFormVisible: false,
        dialogGrantVisible: false,
        userId: '',
        // 授权用
        roles: [],
        grants: [],
        tableInstance: {},
        editType: '', // add/edit
        user: {},
        fetchUsers
      }
    },
    methods: {
      // 新增用户,弹窗
      startCreate() {
        // item 置空
        this.item = {}
        this.editType = 'add'
        // 展示弹窗
        this.dialogFormVisible = true
        // 表单重置，表单验证重置
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      // 修改用户，弹窗
      initUserEdit() {
        this.editType = 'edit'
        // 后台查询选中的用户信息
        let userId = this.tableInstance.table.selection[0].userId
        http.get('/portal/api/users/' + userId).then( (response) => {
          if (response.data) {
            this.item = response.data
            // 展示弹出框
            this.dialogFormVisible = true
          }
          else {
            this.tableInstance.fetchData()
            this.$message ({
              message: '用户已被删除...',
              type: 'error'
            })
          }
        })
        // 展示弹窗
        this.dialogFormVisible = true
        // 表单重置，表单验证重置
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      // 关闭弹窗
      cancelModify() {
        // 关闭弹窗
        this.dialogFormVisible = false
      },
      // 保存用户信息
      // confirmModify() {
      //   // 表单验证
      //   this.$refs.dialogForm.validate((valid) => {
      //     if (!valid) {
      //       return false
      //     }
      //     // 保存
      //     if ( 'add' === this.editType ) {
      //       // 验证通过，提交表单
      //       http.post('/portal/api/users/addUser', this.item).then( () => {
      //         // 关闭弹窗，刷新列表，提示成功
      //         this.dialogFormVisible = false
      //         this.tableInstance.fetchData()
      //         this.$message({
      //           message: '保存成功',
      //           type: 'success'
      //         })
      //       })
      //     }
      //     // 修改
      //     else if ('edit' == this.editType) {
      //       http.put('/portal/api/users/editUser', this.item).then( () => {
      //         // 关闭弹窗
      //         this.dialogFormVisible = false
      //         // 刷新列表
      //         this.tableInstance.fetchData()
      //         // 提示成功
      //         this.$message({
      //           message: '修改成功',
      //           type: 'success'
      //         })
      //       })
      //     }
      //     else {
      //       this.$message({
      //         message: '请刷新页面后重试',
      //         type: 'error'
      //       })
      //       return false
      //     }
      //   })
      // },
      userEdited(visible, refresh) {
        this.dialogFormVisible = visible;
        if (refresh) {
          this.tableInstance.fetchData();
          this.$message({
            message: '修改成功...',
            type: 'success'
          })
        }
      },
      initGrant() {
        //置空
        this.roles = [];
        this.grants = [];
        this.userId = this.tableInstance.table.selection[0].userId;
        // 授权
        fetchGrants(this.userId).then((response) => {
          let roles = response.data.roles;
          for (let i in roles) {
            this.roles.push({
              key: roles[i].roleId,
              label: roles[i].roleName,
              disabled: false
            })
          }
          let grants = response.data.grants;
          for (let i in grants) {
            this.grants.push(grants[i].roleId);
          }
          this.dialogGrantVisible = true;
        })
      },
      resetPass() {
        let data = {...this.tableInstance.table.selection[0]}
        resetPass(data).then(() => {
          this.tableInstance.fetchData()
          this.$message({
            message: '重置密码成功',
            type: 'success'
          })
        })
      },
    }
  }
</script>

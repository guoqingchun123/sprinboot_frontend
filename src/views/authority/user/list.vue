<template>
  <div class="app-container">
    <!--用户查询列表-->
    <bv-table ref="table" title="用户一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchUsers" @on-mounted="(table) => tableInstance = table">
      <!--按钮操作-->
      <div slot="operates">
        <bv-button show="one" view="grant" authority="grant" @click="initGrant()">授权</bv-button>
        <bv-button show="none" view="create" authority="create" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="initUserEdit()">修改</bv-button>
        <bv-button show="oneOrMore" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
        <bv-button show="one" icon="el-icon-refresh-left" authority="reset" @click="resetPass()">重置密码</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <bv-form-item label="用户姓名" prop="userName">
            <el-input v-model="filter.userName" />
          </bv-form-item>
        </bv-col>
      </div>
      <!--列表展示字段-->
      <bv-table-column type="selection" />
      <bv-table-column label="用户编号" prop="userId" sortable="custom" />
      <bv-table-column label="用户姓名" prop="userName" sortable="custom" />
      <bv-table-column label="用户别名" prop="alias" sortable="custom" />
      <bv-table-column label="证件号码" prop="certNo" sortable="custom" />
      <bv-table-column label="联系电话" prop="phoneNo" sortable="custom" />
      <bv-table-column label="状态" prop="userStatus" sortable="custom" :formatter="userStatusFormatter" />
    </bv-table>
    <!--新增，修改用户信息-->
    <user-edit :visible="dialogFormVisible" :item="item" @on-edit="userEdited" />
    <!--授权-->
    <user-grant :visible="dialogGrantVisible" :grants="grants" :user-id="userId" :roles="roles" @on-grant="userEdited" @on-change-grant="changeGrants" />
  </div>
</template>

<script>
  import {fetchUsers, delUsers, resetPass, fetchGrants, selectUser} from '@/api/authority'
  import userEdit from './edit'
  import userGrant from './grant'
  
  export default {
    name: 'ListUser',
    components: {
      userEdit,
      userGrant
    },
    data() {
      return {
        item: {
          type: Object
        },
        // 过滤条件
        filter: {},
        dialogFormVisible: false,
        dialogGrantVisible: false,
        userStatusDict: [],
        userId: '',
        // 授权用
        roles: [],
        grants: [],
        tableInstance: {},
        editType: '',
        user: {},
        fetchUsers
      }
    },
    created() {
      this.$store.dispatch('app/fetchDicts', 'userStatus').then(data => {
        this.userStatusDict = data
      })
    },
    methods: {
      // 新增用户,弹窗
      startCreate() {
        // item 置空
        this.item = {};
        this.editType = 'add';
        // 展示弹窗
        this.dialogFormVisible = true;
      },
      // 修改用户，弹窗
      initUserEdit() {
        this.editType = 'edit';
        // 后台查询选中的用户信息
        let userId = this.tableInstance.table.selection[0].userId;
        selectUser(userId).then((response) => {
          if (response.data) {
            this.item = response.data;
            // 展示弹出框
            this.dialogFormVisible = true
          }
          else {
            this.tableInstance.fetchData();
            this.$message({
              message: '用户已被删除...',
              type: 'error'
            })
          }
        });
        // 展示弹窗
        this.dialogFormVisible = true;
      },
      // 关闭弹出框
      userEdited(refresh) {
        this.dialogFormVisible = false;
        this.dialogGrantVisible = false;
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
        this.$confirm('此操作将删除所选用户，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let userIds = this.tableInstance.table.selection.map(item => item.userId);
          delUsers(userIds).then(() => {
            // 刷新table
            this.tableInstance.fetchData();
            this.$message({
              message: '删除用户成功...',
              type: 'success'
            })
          })
        })
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
        let userId = this.tableInstance.table.selection[0].userId
        resetPass(userId).then(() => {
          this.tableInstance.fetchData();
          this.$message({
            message: '重置密码成功',
            type: 'success'
          })
        })
      },
      userStatusFormatter(row, column, cellValue) {
        for (let i in this.userStatusDict) {
          if (cellValue == this.userStatusDict[i].code) {
            return this.userStatusDict[i].name
          }
        }
      },
      changeGrants(val) {
        this.grants = val;
      }
    }
  }
</script>

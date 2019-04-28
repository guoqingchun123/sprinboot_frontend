<template>
  <div class="app-container">
    <!--用户查询列表-->
    <bv-table ref="table" title="用户一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchUsers" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="one" view="grant" @click="initGrant()">授权</bv-button>
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
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户编号" prop="userId" sortable="custom" />
      <el-table-column label="用户姓名" prop="userName" sortable="custom" />
    </bv-table>
    
    <!--用户维护页面-->
    <user-edit :visible="dialogFormVisible" :user="user" @on-edit="userEdited" />
    
    <!--用户授权页面-->
    <user-grant :visible="dialogGrantVisible" :userId="userId" @on-grant="userGranted" :roles="roles" :grants="grants"/>
  </div>
</template>

<script>
  import {fetchUsers, getUser, resetPass, fetchGrants} from '@/api/authority'
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
        // 过滤条件
        filter: {},
        dialogFormVisible: false,
        dialogGrantVisible: false,
        user: {},
        userId: "",
        // 授权用
        roles: [],
        grants: [],
        tableInstance: {},
        fetchUsers
      }
    },
    methods: {
      initUserEdit() {
        getUser(this.tableInstance.table.selection[0].userId).then((response) => {
          if (response.data) {
            this.user = response.data;
            this.dialogFormVisible = true
          } else {
            this.$message({
              message: '数据丢失...',
              type: 'error'
            })
          }
        });
      },
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
      userGranted(visible, refresh) {
        this.dialogGrantVisible = visible;
        if (refresh) {
          this.$message({
            message: '授权成功...',
            type: 'success'
          })
        }
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

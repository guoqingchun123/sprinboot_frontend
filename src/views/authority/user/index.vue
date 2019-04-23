<template>
  <div class="app-container">
    <bv-table ref="table" title="用户一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchUsers" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="one" view="grant" @click="startGrant()">授权</bv-button>
        <bv-button show="one" view="modify" @click="startModify()">修改</bv-button>
        <bv-button show="one" view="remove" @click="resetPass()">重置密码</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="用户姓名" prop="name">
            <el-input v-model="filter.name" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户编号" prop="empId" sortable="custom" />
      <!--<el-table-column label="用户登录名" prop="avatar" align="center" sortable="custom" />-->
      <el-table-column label="用户姓名" prop="name" sortable="custom" />
    </bv-table>

    <bv-dialog title="维护用户信息" :visible.sync="dialogFormVisible">
      <bv-form>
        <bv-row layout="dialog-2">
          <!--<bv-col>
            <el-form-item label="用户登录名" prop="id">
              <el-input v-model="user.avatar" />
            </el-form-item>
          </bv-col>-->
          <bv-col>
            <el-form-item label="用户姓名" prop="name">
              <el-input v-model="user.name" />
            </el-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModify()">保存</bv-button>
        <bv-button view="cancel" @click="cancelModify()">取消</bv-button>
      </div>
    </bv-dialog>

    <bv-dialog title="用户授权" width="550px" :visible.sync="dialogGrantVisible">
      <el-transfer v-model="grants" :data="roles" :titles="['未授权','已授权']" />
      <div slot="footer">
        <bv-button view="save" @click="saveGrant">保存</bv-button>
        <bv-button view="cancel" @click="cancelGrant">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  import { fetchUsers, modifyUser,resetPass, fetchGrants, saveGrants } from '@/api/authority'

  export default {
    name: 'ListUser',
    data() {
      return {
        // 过滤条件
        filter: {},
        dialogFormVisible: false,
        dialogGrantVisible: false,
        user: {
          id: null,
          // avatar: null,
          name: null
        },
        // 授权用
        roles: [],
        grants: [],
        tableInstance: {},
        fetchUsers
      }
    },
    methods: {
      // 弹窗用
      initUser() {
        this.user ={
          id: null,
          // avatar: null,
          name: null
        }
      },
      startModify() {
        this.user = {...this.tableInstance.table.selection[0]}
        this.dialogFormVisible = true
      },
      cancelModify() {
        this.initUser()
        this.dialogFormVisible = false
      },
      confirmModify() {
        modifyUser(this.user).then(() => {
          this.tableInstance.table.clearSelection()
          this.afterModify()
        })
      },
      afterModify() {
        this.tableInstance.fetchData()
        this.initUser()
        this.dialogFormVisible = false
        this.$message({
          message: '保存成功',
          type: 'success'
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
      startGrant() {
        //置空
        this.roles = []
        this.grants = []
        // 授权
        fetchGrants(this.tableInstance.table.selection[0].id).then((response) =>{
          let roles = response.data.roles
          for (let i in roles) {
            this.roles.push({
              key: roles[i].id,
              label: roles[i].name,
              disabled: false
            })
          }
          let grants = response.data.grants
          for (let i in grants) {
            this.grants.push(grants[i].id)
          }
          this.dialogGrantVisible = true
        })
      },
      // 保存授权
      saveGrant() {
        saveGrants(this.tableInstance.table.selection[0].id, this.grants).then(() =>{
          this.dialogGrantVisible = false
          this.tableInstance.fetchData()
          this.$message({
            type: 'success',
            message: '保存授权成功'
          })
        })
      },
      cancelGrant() {
        this.dialogGrantVisible = false
      }
    }
  }
</script>

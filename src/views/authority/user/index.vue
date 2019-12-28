<template>
  <div>
    <bv-table ref="table" title="用户一览" :layout="0.7" :pagination="true" :filter.sync="filter" :fetch-api="fetchUsers">
      <div slot="operates">
        <bv-button show="one" view="grant" @click="startGrant()">授权</bv-button>
        <bv-button show="none" view="create" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" @click="startModify()">修改</bv-button>
        <bv-button show="one" svg-icon="token" @click="manageToken()">动态令牌</bv-button>
        <bv-button v-show="checkResetPass()" view="reset" @click="resetPass()">重置密码</bv-button>
        <bv-button v-show="checkRemove()" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <bv-form-item label="用户姓名" prop="name">
            <bv-input v-model="filter.name"/>
          </bv-form-item>
        </bv-col>
        <!--
        <bv-col>
          <bv-form-item label="用户状态" prop="status">
            <bv-radio-group v-model="filter.status" store-action="app/fetchEnums" dict-code="userStatus" />
          </bv-form-item>
        </bv-col>
        -->
      </div>
      <bv-table-column type="selection"/>
      <bv-table-column label="用户编号" prop="userId" sortable="custom"/>
      <!--<bv-table-column label="用户登录名" prop="avatar" align="center" sortable="custom" />-->
      <bv-table-column label="用户姓名" prop="name" sortable="custom" class-name="with-image">
        <template slot-scope="scope">
          <el-avatar :size="30" :src="scope.row.avatar ? $APP_ROOT + '/file/view/' + scope.row.avatar : defaultAvatar">
            <img :src="defaultAvatar">
          </el-avatar>
          <div>{{ scope.row.name }}</div>
        </template>
      </bv-table-column>
      <bv-table-column label="手机号" prop="mobile"/>
      <bv-table-column label="电子邮箱" prop="email"/>
      <bv-table-column label="身份证号" prop="certNo"/>
    </bv-table>
    <bv-dialog title="维护用户信息" :visible.sync="dialogFormVisible">
      <bv-form ref="dialogForm" :model="user" :rules="rules" label-width="120px">
        <bv-row :layout="2">
          <!--<bv-col>
            <bv-form-item label="用户登录名" prop="id">
              <bv-input v-model="user.avatar" />
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="用户编号" prop="userId">
              <bv-input v-if="modifyType === 'create'" v-model.trim="user.userId" />
              <span v-else v-text="user.userId" />
            </bv-form-item>
          </bv-col>-->
          <bv-col>
            <bv-form-item label="用户编号" prop="userId">
              <div slot="help">登录用的编号，不能跟其他用户重复</div>
              <bv-input v-model="user.userId"/>
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="用户姓名" prop="name">
              <bv-input v-model="user.name"/>
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="用户类型" prop="userType">
              <bv-select type="enum" dict-code="portal.userType" v-model="user.userType"/>
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="手机号" prop="mobile">
              <bv-input v-model="user.mobile"/>
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="电子邮箱" prop="email">
              <bv-input v-model="user.email"/>
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="身份证号" prop="certNo">
              <bv-input v-model="user.certNo"/>
            </bv-form-item>
          </bv-col>
          <bv-col layout="100%">
            <bv-form-item label="授权" prop="grants">
              <el-transfer v-model="user.grants" :data="roles" :titles="['未授权','已授权']"/>
            </bv-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModify">保存</bv-button>
        <bv-button view="cancel" @click="resetModify">取消</bv-button>
      </div>
    </bv-dialog>

    <bv-dialog title="用户授权" width="550px" :visible.sync="dialogGrantVisible">
      <el-transfer v-model="grants" :data="roles" :titles="['未授权','已授权']"/>
      <div slot="footer">
        <bv-button view="save" @click="saveGrant">保存</bv-button>
        <bv-button view="cancel" @click="cancelGrant">取消</bv-button>
      </div>
    </bv-dialog>

    <user-token v-if="userId" :visible.sync="tokenManageVisible" :user-id="userId"/>
  </div>
</template>

<script>
  import {Avatar} from 'element-ui'
  import {fetchAllRoles} from '@/api/authority/role'
  import {
    fetchUsers,
    createUser,
    modifyUser,
    removeUsers,
    resetPass,
    fetchGrants,
    saveGrants
  } from '@/api/authority/user'
  import UserToken from './components/token'
  import defaultAvatar from '@/assets/avatar.png'

  export default {
    name: 'ListUser',
    components: {
      ElAvatar: Avatar,
      UserToken
    },
    data() {
      return {
        items: [],
        currentDeptId: null,
        currentDeptName: null,
        modifyType: null,

        // 过滤条件
        filter: {},
        dialogFormVisible: false,
        dialogModifyDeptFormVisible: false,
        dialogGrantVisible: false,
        tokenManageVisible: false,
        user: {
          id: null,
          // avatar: null,
          name: null
        },
        userId: null,
        rules: {
          userId: [
            {required: true, message: '请输入用户编号'}
          ],
          name: [
            {required: true, message: '请输入用户姓名'}
          ]
        },
        // 授权用
        roles: [],
        grants: [],
        fetchUsers,
        defaultAvatar
      }
    },
    created() {
      // this.fetchTreeData()
      fetchAllRoles().then(res => {
        let roles = []
        // let roles = response.data.roles
        for (let i in res.data) {
          roles.push({
            key: res.data[i].id,
            label: res.data[i].name,
            disabled: false
          })
        }
        this.roles = roles
      }).catch(() => {
      })
    },
    methods: {
      checkResetPass() {
        return this.$refs.table && this.$refs.table.selection && this.$refs.table.selection.length === 1 && this.$refs.table.selection[0].userId != 'admin' && this.$refs.table.selection[0].userId != '0000'
      },
      checkRemove() {
        return this.$refs.table && this.$refs.table.selection && this.$refs.table.selection.length >= 1 && this.$refs.table.selection.every(item => item.userId !== 'admin' && item.userId !== '0000')
      },
      // 弹窗用
      initUser() {
        this.user = {
          id: null,
          // avatar: null,
          deptId: this.currentDeptId,
          name: null,
          grants: []
        }
      },
      startCreate() {
        this.dialogFormVisible = true
        this.modifyType = 'create'
        this.initUser()
      },
      startModify() {
        let user = {...this.$refs.table.selection[0]}
        if (user.grants == null) {
          user.grants = []
        }
        this.user = user
        this.dialogFormVisible = true
        this.modifyType = 'modify'
      },
      manageToken() {
        this.tokenManageVisible = true
        this.userId = this.$refs.table.selection[0].userId
      },
      resetModify() {
        this.dialogFormVisible = false
        this.$nextTick(() => {
          this.initUser()
          this.$refs.dialogForm && this.$refs.dialogForm.resetFields()
        })
      },
      confirmModify(event) {
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false
          }

          const loading = this.$loading(event)
          if (this.modifyType === 'modify') {
            modifyUser(this.user).then(() => {
              this.$refs.table.clearSelection()
              this.afterModify()
              loading.hide()
            }).catch(() => loading.close())
          } else {
            createUser(this.user).then(() => {
              this.afterModify()
              loading.hide()
            }).catch(() => loading.close())
          }
        })
      },
      afterModify() {
        this.$refs.table.fetchData()
        this.resetModify()
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      },
      startRemove() {
        this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading()
          removeUsers(this.$refs.table.selection.map(item => item.id).join()).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            loading.close()
            this.$refs.table.fetchData()
          }).catch(() => loading.close())
        }).catch(() => {
          /*this.$message({
            message: '取消删除',
            type: 'warning'
          })*/
        })
      },
      resetPass() {
        this.$confirm('确定要将该用户的密码重置吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading()
          resetPass(this.$refs.table.selection[0].id).then(() => {
            loading.close()
            this.$refs.table.fetchData()
            this.$message({
              message: '重置密码成功',
              type: 'success'
            })
          }).catch(() => {
            loading.close()
          })
        })
      },
      startGrant() {
        //防止页面滞留，添加加载状态
        this.$refs.table.loading = true
        //置空
        this.roles = []
        this.grants = []
        // 授权
        fetchGrants(this.$refs.table.selection[0].id).then((response) => {
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
          this.$refs.table.loading = false
          this.dialogGrantVisible = true
        })
      },
      // 保存授权
      saveGrant() {
        saveGrants(this.$refs.table.selection[0].id, this.grants).then(() => {
          this.dialogGrantVisible = false
          this.$refs.table.fetchData()
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
<style lang="scss">
  .el-table {
    .with-image {
      > .cell {
        display: flex;
        line-height: 30px;

        > img {
          max-width: 30px;
          height: 30px;
        }

        > div {
          margin-left: 5px;
        }
      }
    }
  }
</style>

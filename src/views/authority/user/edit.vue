<template>
  <bv-dialog title="维护用户信息" :visible.sync="visible" :show-close="showClose">
    <el-form ref="dialogForm" :model="item" :rules="rules" label-width="150px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="item.userName" clearable placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="别名" prop="userAlias">
        <el-input v-model="item.userAlias" clearable placeholder="请输入别名" />
      </el-form-item>
      <el-form-item label="令牌验证标志" prop="checkKey">
        <el-radio v-model="item.checkKey" label="Y">验证</el-radio>
        <el-radio v-model="item.checkKey" label="N">不验证</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="confirmModify()">保存</el-button>
      <el-button @click="cancelModify()">取消</el-button>
    </div>
  </bv-dialog>
</template>

<script>
  import http from '@/utils/http'
  export default {
    props: {
      visible: {
        type: Boolean,
        default: true
      },
      showClose: {
        type: Boolean,
        default: false
      },
      item: {
        type: Object
      },
      rules: {
        userName: [
          {required: true, message: '请输入用户名称', trigger: 'blur'}
        ],
        userAlias: [
          {required: true, message: '请输入用户别名', trigger: 'blur'}
        ],
        checkKey: [
          {required: true, message: '请选择是否验证密钥', trigger: 'blur'}
        ]
      },
    },
    data() {
      return {}
    },
    methods: {
      cancelModify() {
        this.$emit('on-edit', false, false)
      },
      confirmModify() {
        // 表单验证
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false
          }
          // 新增
          let userId = this.item.userId
          if (!userId) {
            // userId为空，表示新增
            // 验证通过，提交表单
            http.post('/portal/api/users/addUser', this.item).then(() => {
              this.$emit('on-edit', false, true)
            })
          }
          // 修改
          else {
            http.put('/portal/api/users/editUser', this.item).then(() => {
              this.$emit('on-edit', false, true)
            })
          }
        })
      }
    }
  }
</script>

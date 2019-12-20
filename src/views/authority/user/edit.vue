<template>
  <bv-dialog title="维护用户信息" :visible.sync="visible" :show-close="showClose">
    <bv-form ref="dialogForm" :model="item" :rules="rules" label-width="150px">
      <bv-form-item label="用户名" prop="userName">
        <el-input v-model="item.userName" clearable placeholder="请输入用户名" />
      </bv-form-item>
      <bv-form-item label="别名" prop="alias">
        <el-input v-model="item.alias" clearable placeholder="请输入别名" />
      </bv-form-item>
      <bv-form-item label="证件号码" prop="certNo">
        <el-input v-model="item.certNo" clearable placeholder="请输入证件号码" />
      </bv-form-item>
      <bv-form-item label="联系电话" prop="phoneNo">
        <el-input v-model="item.phoneNo" clearable placeholder="请输入联系电话" />
      </bv-form-item>
    </bv-form>
    <div slot="footer">
      <el-button type="primary" @click="confirmModify()">保存</el-button>
      <el-button @click="cancelModify()">取消</el-button>
    </div>
  </bv-dialog>
</template>

<script>
  import { createUser, updateUser} from '@/api/authority'
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
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        rules: {
          userName: [
            {required: true, message: '请输入用户名称', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      cancelModify() {
        this.$emit('on-edit',false)
      },
      confirmModify() {
        // 表单验证
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false
          }
          // 新增
          let userId = this.item.userId;
          if (!userId) {
            // userId为空，表示新增
            // 验证通过，提交表单
            createUser(this.item).then(() => {
              this.$emit('on-edit', true)
            })
          }
          // 修改
          else {
            updateUser(this.item).then(() => {
              this.$emit('on-edit', true)
            })
          }
        })
      }
    }
  }
</script>

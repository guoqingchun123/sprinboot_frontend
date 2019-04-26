<template>
  <bv-dialog title="维护用户信息" :visible.sync="visible">
    <bv-form>
      <bv-row layout="dialog-2">
        <bv-col>
          <el-form-item label="用户姓名" prop="userName">
            <el-input v-model="user.userName" />
          </el-form-item>
        </bv-col>
      </bv-row>
    </bv-form>
    <div slot="footer">
      <bv-button view="save" @click="confirmModify()">保存</bv-button>
      <bv-button view="cancel" @click="cancelModify()">取消</bv-button>
    </div>
  </bv-dialog>
</template>

<script>
  import {editUser} from '@/api/authority'
  
  export default {
    props: {
      visible: {
        type: Boolean,
        default: true
      },
      user: {
        type: Object
      }
    },
    data() {
      return {}
    },
    methods: {
      cancelModify() {
        this.$emit('on-edit', false, false)
      },
      confirmModify() {
        editUser(this.user).then(() => {
          this.$emit('on-edit', false, true)
        })
      }
    }
  }
</script>

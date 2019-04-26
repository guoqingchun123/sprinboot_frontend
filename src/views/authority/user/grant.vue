<template>
  <bv-dialog title="用户授权" width="550px" :visible.sync="visible">
    <el-transfer v-model="grants" :data="roles" :titles="['未授权','已授权']" />
    <div slot="footer">
      <bv-button view="save" @click="saveGrant">保存</bv-button>
      <bv-button view="cancel" @click="cancelGrant">取消</bv-button>
    </div>
  </bv-dialog>
</template>

<script>
  import {saveGrants} from '@/api/authority'
  
  export default {
    props: {
      visible: {
        type: Boolean,
        default: true
      },
      grants: {
        type: Array
      },
      roles: {
        type: Array
      },
      userId: {
        type: String
      }
    },
    data() {
      return {}
    },
    methods: {
      cancelGrant() {
        this.$emit('on-grant', false, false)
      },
      saveGrant() {
        saveGrants(this.userId, this.grants).then(() => {
          this.$emit('on-grant', false, true)
        })
      }
    }
  }
</script>

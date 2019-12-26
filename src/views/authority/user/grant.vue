<template>
  <bv-dialog title="用户授权" width="550px" :visible.sync="visible" :show-close="showClose">
    <el-transfer v-model="grants_" :data="roles" :user-id="userId" :titles="['未授权','已授权']" />
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
      showClose: {
        type: Boolean,
        default: false
      },
      grants: {
        type: Array,
        default() {
          return [];
        }
      },
      roles: {
        type: Array,
        default() {
          return [];
        }
      },
      userId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {}
    },
    computed: {
      grants_: {
        get() {
          return this.grants;
        },
        set(val) {
          //grants_改变由父组件控制
          this.$emit("on-change-grant", val);
        }
      }
    },
    methods: {
      cancelGrant() {
        this.$emit('on-grant', false)
      },
      saveGrant() {
        saveGrants(this.userId, this.grants_).then(() => {
          this.$emit('on-grant', true)
        })
      }
    }
  }
</script>

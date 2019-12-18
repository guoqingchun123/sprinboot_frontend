<template>
  <div class="app-container">
    <bv-table ref="table" title="在线用户" :auto-fetch="false" :search="false" :fetch-api="fetchOnlineUsers">
      <div slot="operates">
        <bv-button show="none" svg-icon="message" @click="startSend">群发消息</bv-button>
        <bv-button show="oneOrMore" svg-icon="message" @click="startSend">推送消息</bv-button>
        <bv-button show="oneOrMore" svg-icon="offline" @click="offline">下线</bv-button>
      </div>
      <bv-table-column type="selection" />
      <bv-table-column label="用户编号" prop="userId" align="center" />
      <bv-table-column label="用户姓名" prop="name" align="center" />
      <bv-table-column label="登录时间" prop="loginTime" align="center" />
      <bv-table-column label="登录地址" prop="remoteAddr" align="center" />
      <!--
      <bv-table-column label="用户状态" prop="processing" align="center">
        <template slot-scope="scope">
          {{ scope.row.processing ? '使用中' : '后台' }}
        </template>
      </bv-table-column>
      -->
    </bv-table>
    <bv-dialog title="推送消息" :visible.sync="dialogFormVisible">
      <bv-form ref="dialogForm" :model="item" :rules="rules">
        <bv-row :layout="2">
          <bv-col>
            <bv-form-item label="消息类型" prop="type">
              <bv-radio-group v-model="item.type" :items="[{code: 'alert', name: '弹窗'}]" />
            </bv-form-item>
          </bv-col>
          <bv-col layout="100%">
            <bv-form-item label="标题" prop="title">
              <bv-input v-model.trim="item.title" />
            </bv-form-item>
          </bv-col>
          <bv-col layout="100%">
            <bv-form-item class="form-item-fill" label="消息内容" prop="content">
              <bv-input type="textarea" :rows="2" v-model.trim="item.content" />
            </bv-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="sendMessage">发送</bv-button>
        <bv-button view="cancel" @click="cancelSend">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  import { fetchOnlineUsers, notifyAllUsers, notifyUsers, offlineUsers } from '@/api/authority'

  export default {
    name: 'ListOnlineUsers',
    data() {
      return {
        fetchOnlineUsers,

        dialogFormVisible: false,
        item: {},
        rules: {
          content: [
            {required: true, message: '请输入消息内容', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.$store.dispatch('message/initSocket').then(() => {
        this.fetchData()
        this.$store.dispatch('message/subscribeOnline', res => {
          this.fetchData(res.data)
        })
      }).catch(() => {})
    },
    beforeDestroy() {
      this.$store.dispatch('message/unsubscribeOnline')
    },
    methods: {
      fetchData(data) {
        this.$refs.table.fetchData(data)
      },
      startSend() {
        this.item = {
          type: 'alert',
          title: '',
          content: ''
        }
        this.dialogFormVisible = true
      },
      sendMessage() {
        if (!this.$refs.table.selection || this.$refs.table.selection.length === 0) {
          // 群发
          notifyAllUsers(this.item).then(() => {
            this.dialogFormVisible = false
          }).catch(() => {})
        } else {
          notifyUsers(this.$refs.table.selection.map(item => item.sessionId).join(), this.item).then(() => {
            this.dialogFormVisible = false
          }).catch(() => {})
        }
      },
      cancelSend() {
        this.dialogFormVisible = false
      },
      offline() {
        offlineUsers(this.$refs.table.selection.map(item => item.sessionId).join()).then(() => {
          this.$refs.table.clearSelection()
        }).catch(() => {})
      }
    }
  }
</script>

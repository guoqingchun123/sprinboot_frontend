<template>
  <div>
    <bv-dialog title="令牌管理" :visible.sync="visibleComputed">
      <bv-table ref="table" :filter-switch="false" :pagination="true" :filter.sync="filter" :params="{userId: userId}" :fetch-api="fetchUserTokens">
        <div slot="operates">
          <el-popover
            ref="popover"
            placement="bottom"
            trigger="click"
          >
            <bv-form ref="allotForm" title="令牌发放" :model="token" :rules="tokenRules">
              <bv-row>
                <bv-col>
                  <bv-form-item label="令牌序列号" prop="deviceSn">
                    <el-select v-model="token.deviceSn" placeholder="请输入令牌序列号" filterable>
                      <el-option
                        v-for="itemToken in tokens"
                        :key="itemToken.deviceSn"
                        :label="itemToken.deviceSn"
                        :value="itemToken.deviceSn"
                      />
                    </el-select>
                  </bv-form-item>
                </bv-col>
              </bv-row>
              <bv-row>
                <bv-col>
                  <bv-button view="save" @click="confirmAllotToken">保存</bv-button>
                </bv-col>
              </bv-row>
            </bv-form>
            <bv-button slot="reference" show="none" view="create" @click="startAllot">分配</bv-button>
          </el-popover>
          <bv-button :show="unlockShow" @click="unlock">解锁</bv-button>
          <bv-button :show="lostShow" @click="lost">挂失</bv-button>
          <el-popover
            ref="passtokenPopver"
            popper-class="button-popover"
            placement="bottom"
            trigger="click"
          >
            <bv-form ref="form" :model="item" :rules="rules">
              <bv-row :layout="1">
                <bv-col>
                  <bv-form-item label="动态令牌密码：" prop="passtoken">
                    <el-input v-model="item.passtoken" placeholder="请输入动态令牌密码" />
                  </bv-form-item>
                </bv-col>
              </bv-row>
              <bv-row>
                <bv-col>
                  <bv-button view="save" @click="unlost">保存</bv-button>
                </bv-col>
              </bv-row>
            </bv-form>
            <bv-button slot="reference" :show="unlostShow">解挂</bv-button>
          </el-popover>
          <bv-button :show="stopUseShow" @click="stop">停用</bv-button>
          <bv-button :show="startUseShow" @click="unstop">启用</bv-button>
          <bv-button :show="takebackShow" @click="unallot">收回</bv-button>
        </div>
        <bv-table-column type="selection" />
        <bv-table-column label="序列号" prop="deviceSn" align="center" sortable="custom" />
        <bv-table-column label="状态" prop="state" align="center" sortable="custom">
          <template slot-scope="scope">
            {{ scope.row.statusName }}
          </template>
        </bv-table-column>
        <bv-table-column label="最后修改日期" prop="lastModifyDate" align="center" />
      </bv-table>
    </bv-dialog>
    <bv-dialog title="验证密码">
      
    </bv-dialog>
  </div>
</template>
<script>
  import { fetchUserTokens, fetchUnallottedTokens, allotToken, unallotToken, unlockToken, lostToken, unlostToken, stopToken, unstopToken } from '@/api/authority/token'

  export default {
    name: 'UserToken',
    props: {
      visible: Boolean,
      userId: String
    },
    data() {
      return {
        fetchUserTokens,
        
        filter: {},
        item: {},
        token: {},
        tokens: [],

        //表单校验规则
        rules: {
          passtoken: [
            { required: true, message: '动态令牌密码不能为空', trigger: 'blur' },
          ]
        },
        tokenRules: {
          deviceSn: [
            { required: true, message:'新增令牌序列号不能为空', trigger: 'change' }
          ]
        }
      }
    },
    computed: {
      visibleComputed: {
        get() {
          return this.visible
        },
        set(value) {
          this.$emit('update:visible', value)
        }
      }
    },
    watch: {
      userId(value) {
        if (value) {
          this.$refs.table.fetchData({
            userId: value
          })
        }
      }
    },
    methods: {
      fetchData() {
        this.$refs.table.fetchData({
          userId: this.userId
        })
      },
      // 令牌新增输入序列号弹框
      startAllot() {
        this.initUnallotedTokens()
        // this.confirmVisible = true
      },
      initUnallotedTokens() {
        if (this.tokens.length === 0) {
          // 查询未分配令牌
          fetchUnallottedTokens().then(res => {
            this.tokens = res.data
          }).catch(() => {})
        }
      },
      // 令牌新增
      confirmAllotToken(event) {
        const loading = this.$loading(event)
        this.$refs.allotForm.validate(valid => {
          if (!valid) {
            loading.close()
            return false
          }
          allotToken(this.userId, this.token.deviceSn).then(() => {
            // this.$emit('update:visible', false)
            this.$refs.popover.doClose()
            this.$refs.allotForm.resetFields()
            this.token = {}
            this.fetchData()
            this.tokens = []
            loading.close()
          }).catch(() => {
            this.$refs.popover.doClose()
            loading.close()
          });
        })
      },

      unlockShow(selection) {
        return selection && selection.length === 1 && selection[0].state === '0001'
      },
      lostShow(selection) {
        return selection && selection.length === 1 && (selection[0].state === '0000' || selection[0].state === '0001')
      },
      unlostShow(selection) {
        return selection && selection.length === 1 && selection[0].state === '0002'
      },
      stopUseShow(selection) {
        return selection && selection.length === 1 && (selection[0].state === '0000' || selection[0].state === '0001' || selection[0].state === '0002')
      },
      startUseShow(selection) {
        return selection && selection.length === 1 && selection[0].state === '9999'
      },
      takebackShow(selection) {
        return selection && selection.length === 1 && (selection[0].state === '0000' || selection[0].state === '0001' || selection[0].state === '0002')
      },

      //令牌解锁
      unlock(event) {
        const loading = this.$loading(event)
        unlockToken(this.$refs.table.selection[0].deviceSn).then(() => {
          // this.$emit('update:visible', false)
          this.$message.success('解锁成功')
          this.$refs.table.fetchData()
          loading.close()
        }).catch(() => loading.close());
      },
      //令牌挂失
      lost(event) {
        const loading = this.$loading(event)
        lostToken(this.$refs.table.selection[0].deviceSn).then(() => {
          // this.$emit('update:visible', false)
          this.$message.success('挂失成功')
          this.$refs.table.fetchData()
          loading.close()
        }).catch(() => loading.close());
      },
      //令牌解挂
      unlost(event) {
        const loading = this.$loading(event)
        this.$refs.form.validate((valid) => {
          if (!valid) {
            loading.close()
            return false
          }
          unlostToken(this.$refs.table.selection[0].deviceSn, this.item.passtoken).then(() => {
            this.$refs.passtokenPopver.doClose()
            this.$message.success('解挂成功')
            this.$refs.table.fetchData()
            loading.close()
          }).catch(() => {
            this.$refs.passtokenPopver.doClose()
            loading.close()
          });
        })
      },
      // 令牌停用
      stop(event) {
        const loading = this.$loading(event)
        stopToken(this.$refs.table.selection[0].deviceSn).then(() => {
          this.$message.success('停用成功')
          this.$refs.table.fetchData()
          loading.close()
        }).catch(() => loading.close());
      },
      // 令牌启用
      unstop(event) {
        const loading = this.$loading(event)
        unstopToken(this.$refs.table.selection[0].userId, this.$refs.table.selection[0].deviceSn).then(() => {
          this.$message.success('启用成功')
          this.$refs.table.fetchData()
          loading.close()
        }).catch(() => loading.close());
      },
      // 令牌收回
      unallot(event) {
        const loading = this.$loading(event)
        unallotToken(this.$refs.table.selection[0].deviceSn).then(() => {
          this.$message.success('回收成功')
          this.tokens = []
          this.$refs.table.fetchData()
          loading.close()
        }).catch(() => loading.close());
      }
    }
  }
</script>

<template>
  <div class="app-container">
    <div>
      <h3>时间戳同步</h3>
    </div>
    <el-form ref="tokenSynForm" :rules="rules" :model="filter" status-icon label-width="100px" label-position="right" style="width: 90%;">
      <bv-row :layout="2">
        <bv-col>
          <bv-form-item label="设备类型:" prop="deviceType">
            <el-select v-model="filter.deviceId" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </bv-form-item>
        </bv-col>
        <bv-col>
          <bv-form-item label="设备编号" prop="deviceSn">
            <el-input v-model="filter.deviceSn" placeholder="请输入设备编号" name="deviceSn" auto-complete="on" />
          </bv-form-item>
        </bv-col>
        <bv-col>
          <bv-form-item label="动态密码1" prop="firstDevicePwd">
            <el-input v-model="filter.firstDevicePwd" placeholder="请输入动态密码1" name="firstDevicePwd" auto-complete="on" />
          </bv-form-item>
        </bv-col>
        <bv-col>
          <bv-form-item label="动态密码2" prop="secondDevicePwd">
            <el-input v-model="filter.secondDevicePwd" placeholder="请输入动态密码2" name="secondDevicePwd" auto-complete="on" />
          </bv-form-item>
        </bv-col>
      </bv-row>
      <div align="center">
        <bv-button view="save" @click="tokenSyn()">同步</bv-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import {tokenSync } from '@/api/authority'
  export default {
    data() {
      return {
        filter: {
          deviceId: '1102',
          deviceSn: null,
          firstDevicePwd: null,
          secondDevicePwd: null
        },
        options: [{
          value: '1102',
          label: '时间事件型'
        }],
        //上传的文件列表
        fileList: [],
        //表单校验规则
        rules: {
          deviceSn: [
            {required: true, message:'设备编号不能为空', trigger: 'blur'},
          ],
          firstDevicePwd: [
            {required: true, message: '动态密码1不能为空', trigger: 'blur'},
          ],
          secondDevicePwd: [
            {required: true, message: '动态密码2不能为空', trigger: 'blur'},
          ]
        }
      }
    },
    methods:{
      //令牌同步
      tokenSyn(){
        this.$refs.tokenSynForm.validate((valid) => {
          if (!valid) {
            return false
          }
        let data = {}
        data.deviceId = this.filter.deviceId;
        data.deviceSn = this.filter.deviceSn;
        data.firstDevicePwd = this.filter.firstDevicePwd;
        data.secondDevicePwd = this.filter.secondDevicePwd;
        tokenSync(data).then(ret => {
          this.$message({
            type: ret.data.level,
            message: ret.data.retMsg
          });
          if (ret.data.retCode === '00000') {
            // 隐藏版本弹窗
            this.dialogFormVisible = false
          }
        }).catch(() => {
          console.log('同步失败')
        });
        })
      }
    }
  }
</script>

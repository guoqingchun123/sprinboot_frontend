<template>
  <div class="app-container">
    <div>
      <h3>种子信息导入</h3>
    </div>
    <el-form ref="role" :rules="rules" :model="role" label-width="100px" label-position="right">
      <bv-row layout="dialog-2">
        <bv-col>
          <el-form-item label="设备类型:" prop="deviceType">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </bv-col>
        <bv-col>
          请选择种子文件:
          <el-button type="primary" @click="insertTokenData">浏览<i class="el-icon-upload el-icon--right" /></el-button>
        </bv-col>
      </bv-row>
    </el-form>
    <el-dialog title="种子文件导入" :visible.sync="exportTokenModal" :close-on-click-modal="false" :close-on-press-escape="false" width="30%">
      <el-upload
        ref="uploadFile"
        class="upload-demo"
        drag
        :action="upload_url"
        :auto-upload="false"
        :on-change="demo2Change"
        :file-list="fileList"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <bv-button size="small" type="success" @click="submitUpload">上传并导入</bv-button>
        <bv-button @click="exportTokenModal = false">取 消</bv-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { importToken } from '@/views/authority/token/travels'
  export default {
    data() {
      return {
        options: [{
          value: '1101',
          label: '时间型'
        }, {
          value: '1102',
          label: '时间事件型'
        }],
        value: '1102',
        //导入数据弹窗是否显示
        exportTokenModal: false
      }
    },
    methods:{
      insertTokenData() {
        this.exportTokenModal = true
      },
      submitUpload(){
        let path = '\\travel';
        let isHaveFiles = false;
        let file = [];
        let fileSource = [];
        if (this.$refs.uploadFile.uploadFiles.length > 0) {
          isHaveFiles = true;
          file.push(this.$refs.uploadFile.uploadFiles[0].raw);
          fileSource.push("令牌种子文件");
        }

        // 没有上传文件时
        if (!isHaveFiles) {
          this.$message({
            type: 'warning',
            message: '请至少上传1个文件!'
          });
          return;
        }
        let data = {
          fileSource: fileSource,
          path: path,
        };
        data.deviceId = this.value
        importToken(file, data).then(ret => {
          //上传文件成功  返回文件id  插入数据
          if (ret.data.retCode === '00000') {
              // 隐藏版本弹窗
              this.exportTokenModal = false;
              this.$message({
                type: ret.data.level,
                message: ret.data.retMsg
              });
              //清除上传的文件
              this.$refs.uploadFile.clearFiles()
          }
        }).catch(() => {
          console.log('上传失败')
          this.$refs.uploadFile.clearFiles()
        });
      }
    }
  }
</script>

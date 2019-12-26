<template>
  <div class="app-container">
    <div>
      <h3>种子信息导入</h3>
    </div>
    <bv-col>
      <el-form ref="role" label-width="110px" label-position="right" label-suffix=":">
        <bv-col>
          <bv-form-item label="设备类型" prop="deviceType">
            <el-select v-model="value" placeholder="请选择" style="width: 360px;">
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
          <bv-form-item label="请选择种子文件" prop="devicePwd" style="white-space: nowrap">
            <el-upload
              ref="uploadFile"
              class="upload-demo"
              drag
              :action="upload_url"
              accept=".xml"
              :auto-upload="false"
              :on-change="fileChange"
              :file-list="fileList"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">请上传xml类型的文件，可以将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <bv-button size="small" type="success" :disabled="saveAndUploadDisabled" @click="submitUpload">上传并导入</bv-button>
            <bv-button @click="cancleUpload">取 消</bv-button>
          </bv-form-item>
        </bv-col>
      </el-form>
    </bv-col>
  </div>
</template>

<script>
  import { importToken } from '@/views/authority/token/travels'
  const maxFileSize = 20;
  export default {
    data() {
      return {
        options: [{
          value: '1102',
          label: '时间事件型'
        }],
        value: '1102',
        //上传的文件列表
        fileList: [],
        saveAndUploadDisabled:false,
        upload_url: 'url'
      }
    },
    methods:{
      fileChange(file, fileList) {
        let isLt = file.size / 1024 / 1024 < 20;
        if (!isLt) {
          this.$message.error('上传文件大小不能超过' + maxFileSize + 'MB!');
          this.fileList = fileList.slice(1, 1);
          return;
        }
        this.fileList = fileList.slice(-1);
      },
      cancleUpload(){
        this.$refs.uploadFile.clearFiles()
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
        this.saveAndUploadDisabled=true

        importToken(file, data).then(ret => {
          //上传文件成功  返回文件id  插入数据
          this.$message({
            type: ret.data.level,
            message: ret.data.retMsg

          }
          );
          if (ret.data.retCode === '00000') {
              // 隐藏版本弹窗
              this.exportTokenModal = false;
              //清除上传的文件
              this.$refs.uploadFile.clearFiles()
          }
          this.saveAndUploadDisabled=false
        }).catch(() => {
          console.log('上传失败')
          this.$refs.uploadFile.clearFiles()
          this.saveAndUploadDisabled=false
        });
      }
    }
  }
</script>

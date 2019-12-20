<template>
  <bv-dialog :visible.sync="visibleComputed" title="种子信息导入">
    <bv-form>
      <bv-row :layout="1">
        <bv-col>
          <el-form-item label="设备类型" prop="deviceType">
            <el-select v-model="value" placeholder="请选择" style="width: 360px;">
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
          <el-form-item label="请选择种子文件" prop="devicePwd" style="white-space: nowrap">
            <el-upload
              ref="uploadFile"
              class="upload-demo"
              drag
              action="/"
              accept=".xml"
              :auto-upload="false"
              :on-change="fileChange"
              :file-list="fileList"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">请上传xml类型的文件，可以将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <bv-button size="small" type="success" :disabled="saveAndUploadDisabled" @click="submitUpload">上传并导入</bv-button>
            <bv-button @click="cancleUpload">取消</bv-button>
          </el-form-item>
        </bv-col>
      </bv-row>
    </bv-form>
  </bv-dialog>
</template>

<script>
  import { importToken } from '@/api/authority/token'

  const maxFileSize = 20;
  export default {
    name: 'TokenImport',
    props: {
      visible: Boolean
    },
    data() {
      return {
        options: [{
          value: '1102',
          label: '时间事件型'
        }],
        value: '1102',
        //上传的文件列表
        fileList: [],
        saveAndUploadDisabled: false
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
        this.$emit('update:visible', false)
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
        }
        data.deviceId = this.value
        this.saveAndUploadDisabled=true

        importToken(file, data).then(() => {
          // 上传文件成功  返回文件id  插入数据
          this.$message.success('上传文件成功')
          // 隐藏版本弹窗
          this.exportTokenModal = false
          //清除上传的文件
          this.$refs.uploadFile.clearFiles()
          this.saveAndUploadDisabled = false
          this.$emit('update:visible', false)
        }).catch(() => {
          console.log('上传失败')
          this.$refs.uploadFile.clearFiles()
          this.saveAndUploadDisabled = false
          this.$emit('update:visible', false)
        });
      }
    }
  }
</script>

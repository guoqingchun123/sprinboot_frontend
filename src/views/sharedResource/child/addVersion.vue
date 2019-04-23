<template>
  <bv-dialog title="文件上传" :visible.sync="visible" width="30%" :before-close="dialogClose" top="1vh">
    <bv-scrollbar>
      <bv-form ref="versionForm" :model="versionForm" :rules="versionRules" label-width="120px" label-position="right">
        <bv-row :gutter="$CONST.row.gutter">
          <bv-col v-bind="$CONST.col.layout3">
            <el-form-item label="版本号:" prop="version">
              <el-input v-model="versionForm.version" placeholder="请输入版本号" clearable />
            </el-form-item>
          </bv-col>
          <bv-col v-bind="$CONST.col.layout3">
            <el-form-item label="模板文件">
              <el-upload
                id="eu1"
                ref="uploadTemplate"
                drag
                :action="upload_url"
                :auto-upload="false"
                :on-change="tempChange"
                :file-list="tempFileList"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload
              id="eu1"
              >
            </el-form-item>
          </bv-col>
          <bv-col v-bind="$CONST.col.layout3">
            <el-form-item label="示例文件1">
              <el-upload
                id="eu2"
                ref="uploadDemo1"
                drag
                :action="upload_url"
                :auto-upload="false"
                :on-change="demo1Change"
                :file-list="demo1FileList"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
          </bv-col>
          <bv-col v-bind="$CONST.col.layout3">
            <el-form-item label="示例文件2">
              <el-upload
                id="eu3"
                ref="uploadDemo2"
                drag
                :action="upload_url"
                :auto-upload="false"
                :on-change="demo2Change"
                :file-list="demo2FileList"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
          </bv-col>
        </bv-row>
        </bv-row>
      </bv-form>
    </bv-scrollbar>
    <span slot="footer">
      <bv-col>
        <bv-button size="small" view="add" @click="onUpload">上传并导入</bv-button>
        <bv-button @click="cancelDialog">取 消</bv-button>
      </bv-col>
    </span>
  </bv-dialog>
</template>

<script>
  import {uploads} from '@/api/sharedResource'

  const maxFileSize = 20;
  export default {
    name: 'AddVersion',
    props: {
      sysGuid: {
        type: String,
        default: ''
      },
      tree: {
        type: Object,
        default: null
      },
      dialogVisible: {
        type: Boolean,
        default: false
      },
      addPath: {
        type: String,
        default: ''
      }
    },
    inject: {
      fileSource: {
        default: ''
      }
    },
    data() {
      return {
        versionForm: {},
        versionRules: {
          version: [
            {required: true, message: '请输入版本号', trigger: 'blur'},
            {max: 20, message: '限制为20位以下', trigger: 'blur'}
          ]
        },
        tempFileList: [],
        demo1FileList: [],
        demo2FileList: [],
        upload_url: 'url',
        visible: false
      }
    },
    watch: {
      //监听切换标签状态
      'dialogVisible': function () {
        this.getList()
      }
    },
    created() {
      this.getList()
    },
    methods: {
      // 初期数据取得
      getList() {
        this.visible = this.dialogVisible;
        this.versionForm = {};
        this.tempFileList = [];
        this.demo1FileList = [];
        this.demo2FileList = [];
        // 去掉校验
        if (this.$refs.versionForm) {
          this.$refs.versionForm.clearValidate();
        }
      },
      tempChange(file, fileList) {
        let isLt = file.size / 1024 / 1024 < maxFileSize;
        if (!isLt) {
          this.$message.error('上传文件大小不能超过' + maxFileSize + 'MB!');
          this.tempFileList = fileList.slice(1, 1);
          return;
        }

        this.tempFileList = fileList.slice(-1);
      },
      demo1Change(file, fileList) {
        let isLt = file.size / 1024 / 1024 < maxFileSize;
        if (!isLt) {
          this.$message.error('上传文件大小不能超过' + maxFileSize + 'MB!');
          this.demo1FileList = fileList.slice(1, 1);
          return;
        }
        this.demo1FileList = fileList.slice(-1);
      },
      demo2Change(file, fileList) {
        let isLt = file.size / 1024 / 1024 < 20;
        if (!isLt) {
          this.$message.error('上传文件大小不能超过' + maxFileSize + 'MB!');
          this.demo2FileList = fileList.slice(1, 1);
          return;
        }
        this.demo2FileList = fileList.slice(-1);
      },
      onUpload() {
        this.$refs.versionForm.validate((valid) => {
          if (valid) {
            let pathList = [];
            let path = '';

            let node = this.tree.store.getNode(this.sysGuid);

            this.getGuid(node, pathList);

            for (let i = pathList.length - 1; i >= 0; i--) {
              path += '/' + pathList[i];
            }

            console.log(path)

            let isHaveFiles = false;
            let file = [];
            let fileSource = [];
            // 模板文件
            if (this.$refs.uploadTemplate.uploadFiles.length > 0) {
              isHaveFiles = true;
              file.push(this.$refs.uploadTemplate.uploadFiles[0].raw);
              fileSource.push("模板文件");
            }
            // 示例文件1
            if (this.$refs.uploadDemo1.uploadFiles.length > 0) {
              isHaveFiles = true;
              file.push(this.$refs.uploadDemo1.uploadFiles[0].raw);
              fileSource.push("示例文件1");
            }
            // 示例文件2
            if (this.$refs.uploadDemo2.uploadFiles.length > 0) {
              isHaveFiles = true;
              file.push(this.$refs.uploadDemo2.uploadFiles[0].raw);
              fileSource.push("示例文件2");
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
              version: this.versionForm.version,
              sysGuid: this.sysGuid,
              path: path,
              parentId: node.parent.data.sysGuid,
              parentFileNm: node.parent.data.fileName,
              fileNm: node.data.fileName,
              taskType: this.fileSource
            };

            uploads(file, data).then(ret => {
              // 上传成功
              this.$message({
                type: ret.data.level,
                message: ret.data.retMsg
              });

              if (ret.data.retCode === '0000') {
                this.$emit('refreshFlag', 1)
                this.$emit('dialogVisible', false)
                this.tempFileList = [];
                this.demo1FileList = [];
                this.demo2FileList = [];
                console.log('上传成功')
              }
            }).catch(() => {
              console.log('上传失败')
            });
          } else {
            return false
          }
        })
      },
      getGuid(current, path) {
        path.push(current.data.sysGuid);
        if (current.data.parentId === 'ROOT') {
          path.push(this.addPath);
        } else {
          this.getGuid(current.parent, path);
        }
      },
      dialogClose(done) {
        // 隐藏版本弹窗
        this.$emit('dialogVisible', false)
        done();
      },
      cancelDialog() {
        // 隐藏版本弹窗
        this.$emit('dialogVisible', false)
      }
    }
  }
</script>
<style>
  /*修改拖动上传的默认样式*/
  #eu1 .el-upload-dragger {
    width: 118%;
    height: 110px;
  }

  #eu2 .el-upload-dragger {
    width: 118%;
    height: 110px;
  }

  #eu3 .el-upload-dragger {
    width: 118%;
    height: 110px;
  }
</style>
<style scoped>
  .el-icon-upload {
    line-height: 0px !important;
  }
</style>

<template>
  <div class="app-container">
    <bv-table title="下载中心一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchDownloads" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="create" authority="create" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button v-if="deleteShow()" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <bv-form-item label="文件名称" prop="title">
            <el-input v-model="filter.title"/>
          </bv-form-item>
        </bv-col>
      </div>
      <bv-table-column type="selection" />
      <bv-table-column label="文件名称" prop="title" align="center" />
      <bv-table-column label="下载次数" prop="downloadNum" align="center" sortable="custom" />
      <bv-table-column label="上传时间" prop="createTime" align="center" sortable="custom" />
      <bv-table-column label="上传用户" prop="createUser" align="center" sortable="custom" />
    </bv-table>

    <bv-dialog v-if="dialogFormVisible" title="文件维护" :visible.sync="dialogFormVisible">
      <bv-form ref="dialogForm" :model="item" :rules="rules">
        <bv-row :layout="1">
          <bv-col layout="100%">
            <bv-form-item label="标题" prop="title" class="form-item-fill">
              <el-input v-model="item.title" />
            </bv-form-item>
          </bv-col>
          <bv-col class="upload-step">
            <bv-form-item label="文件" prop="uploadSeed" class="form-item-fill">
              <el-upload
                ref="uploadFile"
                drag
                :action="uploadUrl"
                :auto-upload="true"
                :limit="1"
                :file-list="fileList"
                :on-success="uploadSuccess"
              >
                <i class="el-icon-upload"/>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </bv-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModify()">保存</bv-button>
        <bv-button view="cancel" @click="cancelModify()">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>

  import {fetchDownloads, createDownload, modifyDownload, removeDownload, configUrl} from '@/api/public'

  export default {
    name: 'ListDownload',
    components: {
    },
    data() {
      return {
        filter: {},
        tableInstance: {},
        item: {},
        fetchDownloads,
        fileList: [],
        rules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          uploadFile: [
            {required: true, message: '请选择上传文件', trigger: 'blur'}
          ]
        },
        dialogFormVisible: false,
        modifyType: null,
        uploadUrl: ''
      }
    },
    created() {
      this.uploadUrl = configUrl("/api/public/uploads");
    },
    methods: {
      // 弹窗用
      initData() {
        this.item = {};
        this.fileList = []
      },
      deleteShow() {
        if (!this.tableInstance || !this.tableInstance.selection || this.tableInstance.selection.length === 0) {
          return false
        }
        return true;
      },
      startCreate() {
        this.initData();
        this.dialogFormVisible = true;
        this.modifyType = 'create';
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate();
      },
      startModify() {
        this.item = {...this.tableInstance.table.selection[0]};
        this.dialogFormVisible = true;
        this.modifyType = 'modify';
        this.fileList = [{
          name: this.item.fileName,
          url: this.item.filePath
        }];
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate();
      },
      cancelModify() {
        this.initData();
        this.dialogFormVisible = false;
        this.modifyType = null;
      },
      confirmModify() {
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          if (this.modifyType === 'modify') {
            modifyDownload(this.item).then(() => {
              this.tableInstance.table.clearSelection()
              this.afterModify()
            })
          } else {
            createDownload(this.item).then(() => {
              this.afterModify()
            })
          }
        });
      },
      afterModify() {
        this.tableInstance.fetchData();
        this.initData();
        this.dialogFormVisible = false;
        this.modifyType = null;
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      },
      startRemove() {
        this.$confirm('此操作将删除该下载文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeDownload(this.tableInstance.table.selection.map(item => item.sysGuid).join()).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.tableInstance.fetchData()
          })
        }).catch(() => {
        })
      },
      uploadSuccess(response) {
        let vm = this;
        vm.$set(vm.item, 'fileName', response.fileName);
        vm.$set(vm.item, 'filePath', response.filePath);
      }
    }
  }
</script>

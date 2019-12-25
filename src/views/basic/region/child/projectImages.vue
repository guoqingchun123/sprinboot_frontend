<template>
  <div>
    <bv-file
      catalog-types="project-image"
      :key-id="region.regionId"
      :titles="{dataTitle: '项目相册一览'}"
    />
  <!--<div v-loading="loading" class="app-container">
    <bv-row type="flex" class="fit-scroll">
      <bv-col :sm="6">
        <bv-scrollbar>
          <bv-tree ref="tree"
                   :data="items"
                   :default-expand-all="true"
                   style="margin-bottom: 20px"
                   @node-click="changeSelect"
          >
            <span slot-scope="{ node, data }" class="tree-node-operates">
              <span>{{ node.label }}</span>
            </span>
          </bv-tree>
        </bv-scrollbar>
      </bv-col>
      <bv-col :sm="18">
        <bv-scrollbar>
          <bv-table :title="tableTitle"
                    :pagination="true"
                    :fetch-api="fetchTableData_"
                    style="margin-bottom: 20px"
                    @on-mounted="(table) => tableInstance = table"
          >
            <div slot="operates">
              <el-upload
                class="upload-demo"
                action="upload_url"
                :auto-upload="true"
                :http-request="uploadImg"
                :show-file-list="false"
                accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                :limit="1"
                :file-list="fileList"
              >
                <bv-button v-if="uploadShow" icon="el-icon-picture">点击上传</bv-button>
              </el-upload>
            </div>
            <bv-table-column label="文件名" prop="showName" align="center" sortable="custom" />
            <bv-table-column label="上传时间" prop="manageTime" align="center" sortable="custom">
              <template slot-scope="scope">
                {{ scope.row.manageTime | formatDateTime }}
              </template>
            </bv-table-column>
            <bv-table-column align="center" label="操作">
              <template slot-scope="scope">
                <bv-button icon="el-icon-picture-outline" type="text" @click="preview(scope.row)">预览</bv-button>
                <bv-button icon="el-icon-delete" type="text" @click="deleteFile(scope.row)">删除</bv-button>
              </template>
            </bv-table-column>
          </bv-table>
        </bv-scrollbar>
      </bv-col>
    </bv-row>-->
  </div>
</template>

<script>
  import { File } from '@bestvike/components'

  import {fetchRegionFiles, uploadFile, deleteFile} from '@/api/basic'
  export default {
    name: 'ProjectImages',
    components: {
      BvFile: File
    },
    props: {
      region: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        items: [
          {
            code: 'regionImage',
            name: '项目相册',
            children: [
              {
                code: 'aerialView',
                name: '鸟瞰图',
                isLeaf: true
              },
              {
                code: 'salesOffice',
                name: '售楼处',
                isLeaf: true
              },
              {
                code: 'constructionSite',
                name: '施工现场',
                isLeaf: true
              }
            ]
          }
        ],
        tableTitle: '项目相册一览',
        //上传的文件列表
        fileList: [],
        fetchRegionFiles,
        fileType: 'regionImage',
        subType: null,
        subTypeName: null,
        uploadShow: false,
        loading: false
      }
    },
    methods: {
      fetchTableData_(data) {
        data.keyId = this.region.regionId;
        data.fileType = this.fileType;
        if (this.subType) {
          data.subType = this.subType;
        }
        return fetchRegionFiles(data)
      },
      //tree on-change
      changeSelect(node) {
        this.tableTitle = node.name + '一览';
        if (node.isLeaf) {
          this.uploadShow = true;
          this.subType = node.code;
          this.subTypeName = node.name;
        } else {
          this.uploadShow = false;
          this.subType = null;
          this.subTypeName = null;
        }
        this.tableInstance.fetchData();
      },
      //自定义上传接口
      uploadImg(item) {
        let _that = this;
        _that.loading = true;
        //校验文件类型
        let isLt = item.file.size / 1024 / 1024 < 15;
        if (!isLt) {
          this.$message.warning('上传文件大小不能超过15MB!');
          _that.loading = false;
          _that.fileList = []
          return;
        }

        //校验文件类型
        let fileExt = item.file.name.replace(/.+\./, "")
        if (['jpg','jpeg','png'].indexOf(fileExt.toLowerCase()) === -1){
          this.$message({
            type: 'warning',
            message: '请上传后缀名为.jpg,.jpeg,.png,.JPG,.JPEG的文件！'
          });
          _that.loading = false;
          _that.fileList = []
          return;
        }

        let file = [item.file]
        let data = {
          name: item.file.name,
          keyId: _that.region.regionId,
          fileType: _that.fileType,
          subType: _that.subType,
          subTypeName: _that.subTypeName
        }
        uploadFile(file, data).then(() => {
          _that.fileList = [];
          _that.loading = false;
          this.tableInstance.fetchData();
        }).catch(() => {
          _that.fileList = [];
          _that.loading = false;
          _that.$message.error('上传图片失败');
        })
      },
      //删除文件
      deleteFile(row) {
        if (row && row.fileId) {
          let fileId = row.fileId;
          this.$confirm('此操作将删除该图片, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteFile(fileId).then(() => {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.tableInstance.fetchData()
            })
          }).catch(() => {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          })
        }
      },
      preview(row) {
        window.open(row.viewUrl)
      }
    }
  }
</script>

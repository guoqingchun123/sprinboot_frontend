<template>
  <div class="app-container" v-loading="loading">
    <el-row type="flex" class="fit-scroll">
      <el-col :sm="6">
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
      </el-col>
      <el-col :sm="18">
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
                :file-list="fileList">
                <bv-button icon="el-icon-picture" v-if="uploadShow">点击上传</bv-button>
              </el-upload>
            </div>
            <el-table-column label="文件名" prop="showName" align="center" sortable="custom" />
            <el-table-column label="上传时间" prop="manageTime" align="center" sortable="custom" />
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <bv-button icon="el-icon-delete" type="text" @click="deleteFile(scope.row)">删除</bv-button>
              </template>
            </el-table-column>
          </bv-table>
        </bv-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {fetchRegionFiles, uploadFile, deleteFile} from '@/api/basic'
  export default {
    name: 'HousePicture',
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
            code: 'familyRelationship',
            name: '户型关系',
            children: [
              {
                code: 'roomHold',
                name: '户型图'
              },
              {
                code: 'prototypeRoom',
                name: '样板间'
              }
            ]
          }
        ],
        tableTitle: '户型关系一览',
        //上传的文件列表
        fileList: [],
        fetchRegionFiles,
        subType: 'familyRelationship',
        subTypeName: '户型关系',
        uploadShow: false,
        loading: false
      }
    },
    methods: {
      fetchTableData_(data) {
        data.keyId = this.region.regionId;
        data.subType = this.subType;
        return fetchRegionFiles(data)
      },
      //tree on-change
      changeSelect(node) {
        this.tableTitle = node.name+'一览';
        this.subType = node.code;
        this.subTypeName = node.name;
        if (this.subType != 'familyRelationship') {
          this.uploadShow = true
        } else {
          this.uploadShow = false
        }
        this.tableInstance.fetchData();
      },
      //自定义上传接口
      uploadImg(item) {
        let _that = this;
        _that.loading = true;
        let isLt = item.file.size / 1024 / 1024 < 10;
        if (!isLt) {
          this.$message.warning('上传文件大小不能超过10MB!');
          _that.loading = false;
          _that.fileList = []
          return;
        }

        let file = [item.file]
        let data = {
          name: item.file.name,
          keyId: _that.region.regionId,
          fileType: _that.subType,
          subType: _that.subType,
          subTypeName: _that.subTypeName
        }
        uploadFile(file, data).then(response => {
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
      }
    }
  }
</script>

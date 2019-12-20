<template>
  <div class="app-container" v-loading="loading">
    <bv-row>
      <bv-form :model="item">
        <bv-col v-bind="$CONST.col.layout3">
          <bv-form-item label="上传楼栋图" prop="uploadSeed">
            <el-upload
              ref="uploadFile"
              drag
              class="upload-demo"
              :action="upload_url"
              :auto-upload="true"
              :file-list="fileList"
              :http-request="uploadImg"
              accept=".jpg,.jpeg,.png,.JPG,.JPEG"
              :limit="1"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">
                <i class="el-icon-warning" style="color:red;margin-right:5px"></i>
                只能上传.jpg/.jpeg/.png/.JPG/.JPEG文件
              </div>
            </el-upload>
          </bv-form-item>
        </bv-col>
        <bv-col v-bind="$CONST.col.layout3" style="margin-left: 12vw">
          <bv-button type="success" icon="el-icon-finished" @click="saveBldData">保存</bv-button>
        </bv-col>
      </bv-form>
    </bv-row>
  </div>
</template>

<script>
  import {uploadFile, updateBldFloor} from '@/api/basic'

  export default {
    name: 'BldImage',
    props: {
      region: {
        type: Object,
        default: null
      },
      bld: {
        type: Object,
        default: null
      },
      floor: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        loading: false,
        item: {},
        upload_url: 'url',
        fileList: [],
        viewPath: ''
      }
    },
    methods: {
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
          fileType: 'floorLogo',
          subType: 'floorLogo',
          subTypeName: '楼层图'
        }
        uploadFile(file, data).then(response => {
          _that.viewPath = response.data.viewUrl;
          _that.loading = false;
        }).catch(() => {
          _that.$message.error('上传图片失败');
          _that.loading = false;
        })
      },
      saveBldData() {
        let data = {
          regionId: this.region.regionId,
          regionName: this.region.regionName,
          projectId: this.floor.projectId,
          bldNo: this.floor.bldNo,
          floorNo: this.floor.floorNo,
          viewPath: this.viewPath
        }
        updateBldFloor(data).then(() => {
          this.$message.success('保存图片成功')
        }).catch(() => {
          this.$message.error('保存图片失败')
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-upload.el-upload--text {
    width: 100%;
  }

  .el-upload-dragger {
    width: 100%;
  }
</style>

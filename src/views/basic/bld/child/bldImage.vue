<template>
  <div class="app-container" v-loading="loading">
    <bv-row>
      <bv-form :model="item">
        <bv-col>
          <bv-form-item label="上传楼栋图" prop="uploadSeed">
            <el-upload
              ref="uploadFile"
              drag
              class="upload-demo"
              :action="upload_url"
              :auto-upload="true"
              :file-list="fileList"
              :on-change="fileChange"
              :on-remove="fileRemove"
              :http-request="uploadImg"
              list-type="picture"
              accept=".jpg,.jpeg,.png,.JPG,.JPEG"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">
                <i class="el-icon-warning" style="color:red;margin-right:5px"></i>
                只能上传.jpg/.jpeg/.png/.JPG/.JPEG文件,且大小不超过15M
              </div>
            </el-upload>
          </bv-form-item>
        </bv-col>
        <bv-col style="margin-left: 12vw">
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
      //点击上传文件列表移除时
      fileRemove() {
        this.viewPath = ''
      },
      fileChange() {
        //不限制文件列表大小，但是每次上传先将文件列表置为空
        this.fileList = []
      },
      //自定义上传接口
      uploadImg(item) {
        let _that = this;
        _that.loading = true;
        let isLt = item.file.size / 1024 / 1024 < 15;
        if (!isLt) {
          this.$message.warning('上传文件大小不能超过15MB!');
          _that.loading = false;
          _that.fileList = [];
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
          fileType: 'floorLogo',
          subType: 'floorLogo',
          subTypeName: '楼层图'
        }
        uploadFile(file, data).then(response => {
          //添加当前上传的文件到列表中，前端文件列表中只显示当前上传成功的文件信息
          const currFile = {
            name: item.file.name,
            url: response.data.thumbUrl
          };
          _that.fileList.push(currFile);
          _that.viewPath = response.data.viewUrl;
          _that.loading = false;
        }).catch(() => {
          _that.$message.error('上传图片失败');
          _that.loading = false;
        })
      },
      saveBldData() {
        if (this.viewPath) {
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
        } else {
          this.$message.warning("未上传图片信息")
        }
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

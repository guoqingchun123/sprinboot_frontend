<template>
  <div class="app-container" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="16" id="mapContainer">
        <div class="regionMap">
          <span style="width:8rem;">请输入关键字检索</span>
          <input id='tipinput' type="text" autocomplete="off" style="z-index:999">
        </div>
      </el-col>
      <el-col :span="8">
        <bv-form :model="item" :rules="rules">
          <el-row :gutter="$CONST.row.gutter">
            <el-col v-bind="$CONST.col.layout3">
              <el-form-item label="坐标" prop="lnglat">
                <el-input v-model.trim="item.lnglat" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout3">
              <el-form-item label="上传小区logo" prop="uploadSeed">
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
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout3" style="text-align: center">
              <bv-button type="success" icon="el-icon-finished" @click="saveRegionData">保存</bv-button>
            </el-col>
          </el-row>
        </bv-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import AMapJS from "amap-js"
  import {uploadFile, modifyRegionLnglat} from '@/api/basic'

  export default {
    name: 'RegionCoordinate',
    props: {
      region: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        loading: false,
        item: {
          lnglat: this.region.x + ',' + this.region.y
        },
        rules: {
          lnglat: [
            {required: true, message:'小区坐标不能为空', trigger: 'blur'},
          ]
        },
        //上传的文件列表
        fileList: [],
        //自定义上传，这里随便填
        upload_url: 'url',
        //logo缩略图
        logoPath: this.region.logoPath,
        //楼栋坐标描点图
        viewPath: this.region.viewPath
      }
    },
    mounted() {
      let _that = this;
      const aMapJSAPILoader = new AMapJS.AMapJSAPILoader({
        key: "8493be8a99d103cbed76edb91479bf7f",
        v: "1.4.14", // 版本号
        params: {}, // 请求参数
        //pulgins:['AMap.Autocomplete'],
        protocol: "https:" // 请求协议
      });
      const aMapUILoader = new AMapJS.AMapUILoader({
        v: "1.0" // UI组件库版本号
      });
      aMapJSAPILoader.load().then(AMap => {
        aMapUILoader.load().then(initAMapUI => {
          const regionMap = new AMap.Map('mapContainer', {
              center: [_that.region.x, _that.region.y], //初始地图中心点
              resizeEnable: true, //是否监控地图容器尺寸变化
              zoom: 15,
              zooms: [10, 18]
            }
          );
          let marker = new AMap.Marker({
            position: regionMap.getCenter(),
            icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
            draggable: true,
            cursor: 'move',
            raiseOnDrag: true
          });
          marker.setMap(regionMap);
          marker.on("dragend", function (e) {
            _that.item.lnglat = e.lnglat.getLng() + ',' + e.lnglat.getLat();
          });

          AMap.plugin('AMap.Autocomplete', () => {
            //输入提示
            let autoOptions = {
              input: "tipinput",
              city: "赤峰市",
              citylimit: "true"
            };
            let auto = new AMap.Autocomplete(autoOptions);
            let placeSearch = new AMap.PlaceSearch({
              pageSize: 1, // 单页显示结果条数
              pageIndex: 1, // 页码
              map: regionMap
            });  //构造地点查询类
            AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
            function select(e) {
              placeSearch.search(e.poi.name, function (status, result) {
                if (!util.isEmpty(result.poiList.pois)) {
                  let poi = result.poiList.pois[0];
                  marker.setPosition(poi.location); //更新点标记位置
                }
              });
            }
          })
        });
      })
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
          fileType: 'regionLogo',
          subType: 'regionLogo',
          subTypeName: '小区logo'
        }
        uploadFile(file, data).then(response => {
          _that.logoPath = response.data.thumbUrl;
          _that.viewPath = response.data.viewUrl;
          _that.loading = false;
        }).catch(() => {
          _that.$message.error('上传图片失败');
          _that.loading = false;
        })
      },
      saveRegionData() {
        let data = {
          regionId: this.region.regionId,
          submitCoo: this.item.lnglat,
          logoPath: this.logoPath,
          viewPath: this.viewPath
        }
        modifyRegionLnglat(data).then(response => {
            this.$message.success('保存成功')
        }).catch(() => {
          this.$message.error('保存失败')
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  #mapContainer {
    min-height: 600px;
    .regionMap {
      position: absolute;
      top: 12px;
      left: 15px;
      z-index: 999;
      background: white;
    }
  }
  .el-upload.el-upload--text {
    width: 100%;
  }

  .el-upload-dragger {
    width: 100%;
  }
</style>

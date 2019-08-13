<template>
  <div class="app-container" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="16" id="mapContainer">
        <div class="regionMap">
          <span style="width:8rem;">请输入关键字检索</span>
          <input id='tipinput' type="text" autocomplete="off" style="z-index:999">
          <div class="input-card" style='width: 24rem;'>
            <div class="input-item">
              <input id="polygon" type="radio" name='func' value='polygon' >
              <label for="polygon" class="input-text">划定小区范围</label>
            </div>
            <div class="input-item">
              <bv-button id="clear" type="success" icon="el-icon-error" class="btn">清除</bv-button>
              <bv-button id="close" type="success" icon="el-icon-circle-close" class="btn">关闭绘图</bv-button>
              <bv-button id="save" type="success" icon="el-icon-success" class="btn">保存</bv-button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <bv-form ref="dialogForm" :model="item" :rules="rules">
          <el-row :gutter="$CONST.row.gutter">
            <el-col v-bind="$CONST.col.layout3">
              <el-form-item label="坐标" prop="lnglat">
                <el-input v-model.trim="item.lnglat" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout3">
              <el-form-item label="坐标组" prop="lnglats">
                <el-input type="textarea" :rows="4" v-model.trim="item.lnglats" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout3" class="upload-step">
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
            <el-col v-bind="$CONST.col.layout3" style="text-align: center" class="save-step">
              <bv-button type="success" icon="el-icon-finished" @click="saveRegionData">保存</bv-button>
            </el-col>
          </el-row>
        </bv-form>
      </el-col>
    </el-row>
    <!--<v-tour name="myTour" :steps="steps" :options="myOptions"></v-tour>-->
  </div>
</template>

<script>
  import {modifyRegionLnglat, uploadFile} from '@/api/basic'
  import {lazyAMapApiLoaderInstance} from 'vue-amap';

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
          lnglat: (this.region.x && this.region.y) ? this.region.x + ',' + this.region.y : '',
          lnglats: this.region.lnglats
        },
        rules: {
          lnglat: [
            {required: true, message:'小区坐标不能为空', trigger: 'blur'},
          ],
          lnglats: [
            {required: true, message:'小区区域坐标不能为空', trigger: 'blur'},
          ]
        },
        //上传的文件列表
        fileList: [],
        //自定义上传，这里随便填
        upload_url: 'url',
        //logo缩略图
        logoPath: this.region.logoPath,
        //楼栋坐标描点图
        viewPath: this.region.viewPath,
        //vue-tour
        /*myOptions: {
          useKeyboardNavigation: false,
          labels: {
            buttonSkip: '跳过引导',
            buttonPrevious: '上一步',
            buttonNext: '下一步',
            buttonStop: '完成引导'
          }
        },
        steps: [
          {
            target: '#mapContainer',
            content: `选取小区坐标`,
            params: {
              placement: 'right'
            }
          },
          {
            target: '.upload-step',
            content: '上传小区logo',
            params: {
              placement: 'left'
            }
          },
          {
            target: '.save-step',
            content: '保存数据',
            params: {
              placement: 'top'
            }
          }
        ]*/
      }
    },
    mounted: function () {
      let _that = this;
      lazyAMapApiLoaderInstance.load().then(() => {
        const regionMap = new AMap.Map('mapContainer', {
          center: (this.region.x && this.region.y) ? [_that.region.x, _that.region.y] : [118.916202, 42.271235], //初始地图中心点
          resizeEnable: true, //是否监控地图容器尺寸变化
          zoom: 15,
          zooms: [10, 18]
        });

        var mouseTool = new AMap.MouseTool(regionMap);
        //监听draw事件可获取画好的覆盖物
        var overlays = [];
        mouseTool.on('draw',function(e){
          overlays.push(e.obj);
        })
        function draw(){
          mouseTool.polygon({
                              fillColor:'#00b0ff',
                              strokeColor:'#80d8ff'
                              //同Polygon的Option设置
                            });

        }
        var radios = document.getElementsByName('func');
        for(var i=0;i<radios.length;i+=1){
          radios[i].onchange = function(e){
            draw()
          }
        }
        document.getElementById('clear').onclick = function(){
          regionMap.remove(overlays)
          overlays = [];
        }
        document.getElementById('save').onclick = function(){
          if (overlays[0]!=null){
            var lnglatsMap = overlays[0].B.path;
            console.log(lnglatsMap);
            var lnglats = '';
             for(var i = 0; i<lnglatsMap.length; i++){
              lnglats += lnglatsMap[i].lng + ',' +lnglatsMap[i].lat;
               if (i != lnglatsMap.length-1) {
                 lnglats += ';'
               }
             }
             _that.item.lnglats = lnglats
          }else {
            _that.$message({
                            message: '小区范围不能为空',
                            type: 'warning'
                          });
          }
        }
        document.getElementById('close').onclick = function(){
          mouseTool.close(true)//关闭，并清除覆盖物
          for(var i=0;i<radios.length;i+=1){
            radios[i].checked = false;
          }
        }

        const marker = new AMap.Marker({
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

        //显示小区范围
        let lnglatList = []
        if (_that.region.lnglats){
          var pathLnglat = _that.region.lnglats.split(';');
          for (let i in pathLnglat) {
            lnglatList.push(pathLnglat[i].split(","))
          }
        }
        /*var path = [
          [118.95355,42.251746],
          [118.954371,42.250443],
          [118.957509,42.251007],
          [118.956839,42.252163]
        ]
        console.log(path)*/
        var polygon = new AMap.Polygon({
                                         path: lnglatList,
                                         strokeColor: "#FF33FF",
                                         strokeWeight: 6,
                                         strokeOpacity: 0.2,
                                         fillOpacity: 0.4,
                                         fillColor: '#1791fc',
                                         zIndex: 50,
                                       })

        regionMap.add(polygon)
        regionMap.setFitView([polygon])
        //输入提示
        const autoOptions = {
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
            if (result.poiList.pois && result.poiList.pois.length>0) {
              let poi = result.poiList.pois[0];
              if(poi.location) {
                _that.item.lnglat = poi.location.lng + ',' + poi.location.lat;
                marker.setPosition(poi.location); //更新点标记位置
              }
            }
          });
        }
      });

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
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          let data = {
            regionId: this.region.regionId,
            submitCoo: this.item.lnglat,
            submitCooS: this.item.lnglats,
            logoPath: this.logoPath,
            viewPath: this.viewPath
          }
          modifyRegionLnglat(data).then(response => {
            this.$message.success('保存成功')
          }).catch(() => {
            this.$message.error('保存失败')
          })
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

      .input-text {
        width:5rem;
        cursor: pointer;
      }
    }
  }
  .el-upload.el-upload--text {
    width: 100%;
  }

  .el-upload-dragger {
    width: 100%;
  }
</style>

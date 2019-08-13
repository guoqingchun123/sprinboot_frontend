<template>
  <div>
    <div id="mapContainer" class="regionMap"></div>
    <div id="markerContent" v-for="region in regions">
      <div class="region" :id="region.regionId">
        <p class="region-text" v-text="region.regionName"></p>
        <i class="region-jiantou"></i>
      </div>
      <el-card :id="region.regionId+'Div'">
        <div slot="header">
          {{region.regionName}}
        </div>
        <div>
          <img :src="region.logoPath" style="width:150px;height:150px">
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import {lazyAMapApiLoaderInstance} from 'vue-amap';
  import {fetchAllRegions} from '@/api/basic'

  var infoWindow = null;
  export default {
    name: 'DashboardEditor',
    data() {
        return {
          regions: [],
          dialogVisible: false,
          color1: '#1791fc',
          colors: ['#FF1A12','#F3FF12','#2EFF12','#1226FF','#0780FC','#FC07D7','#FC0775','#7D0521','#85636B','#5C787B']
        }
      },

    /*mounted() {
      fetchAllRegions().then((res) => {
        this.Regions = res.data;
      })
    },*/
    mounted: function () {
      let _that = this;
      fetchAllRegions().then((res) => {
        this.regions = res.data;
        const regions = res.data;
        lazyAMapApiLoaderInstance.load().then(() => {
          const regionMap = new AMap.Map('mapContainer', {
            center: [118.916202, 42.271235], //初始地图中心点
            resizeEnable: true, //是否监控地图容器尺寸变化
            zoom: 15,
            zooms: [10, 18]
          });

          let polygonList = [];
          //显示小区范围
          let count = 0;
          if (regions && regions.length >0){
            for (let i in regions) {
              let lnglatList = [];
              if (regions[i].lnglats ==null){
                continue;
              }
              var pathLnglat = regions[i].lnglats.split(';');
              for (let j in pathLnglat) {
                lnglatList.push(pathLnglat[j].split(","))
              }
              var polygon = new AMap.Polygon({
                                               path: lnglatList,
                                               strokeColor: _that.radomColor(),
                                               strokeWeight: 6,
                                               strokeOpacity: 0.2,
                                               fillOpacity: 0.4,
                                               // fillColor: _that.colors[Math.floor(Math.random()*10)],
                                               fillColor: _that.radomColor(),
                                               zIndex: 50,
                                             })
              regionMap.add(polygon)
              polygonList.push(polygon)

              this.$nextTick(() => {
                let markerContent = document.getElementById(regions[i].regionId).outerHTML;
                var marker = new AMap.Marker({
                                               position: [regions[i].x, regions[i].y],
                                               content: markerContent,
                                               // 以 icon 的 [center bottom] 为原点
                                               offset: new AMap.Pixel(-50, -27),
                                               extData: {
                                                 id: regions[i].regionId,
                                                 region: regions[i]
                                               }
                                             });
                // 鼠标滑过marker浮在最上层
                marker.on("mouseover", function () {
                  $(".amap-marker").css("z-index", "100");
                  // 添加infowindow项目简介
                  var content = document.getElementById(regions[i].regionId+'Div').outerHTML;
                  infoWindow = new AMap.InfoWindow(
                    {
                       content: content,  //使用默认信息窗体框样式，显示信息内容
                       offset: new AMap.Pixel(0, -27)
                     }
                   );
                  infoWindow.open(regionMap, [regions[i].x, regions[i].y]);
                });
                marker.on("mouseout", function () {
                  if (infoWindow) {
                    infoWindow.close();
                  }
                });
                // 将 markers 添加到地图
                regionMap.add(marker);
              })
            }
          }
          regionMap.setFitView(polygonList)
        })
      });
    },
    methods: {
       radomColor(){
        let color = "#";
        for( let i = 0; i < 6; i++ ){
          color += ( Math.random()*16 | 0 ).toString(16);
        }
        return color;
      }
    }

  }

</script>
<style lang="scss" scoped>
.regionMap {
  min-height: 600px;
  width: 100%;
  position: absolute;
  top: 12px;
  left: 15px;
  z-index: 999;
  background: white;
}
#markerContent {
  display: none;
}
.region {
  line-height: 24px;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  display: inline-block;
}
.region-text {
  margin: 0;
  padding: 2px 10px;
  border-radius: 3px;
  background-color: rgba(0, 167, 91, 0.9);
  white-space: nowrap;
}
.region-jiantou {
  border: 5px solid transparent;
  display: block;
  width: 0;
  height: 0;
  margin: 0 auto;
  border-top-color: rgba(0, 167, 91, 0.9);
}
.region.current .region-text {
  background-color: rgba(255, 0, 0, 0.9);
}
.region.current .region-jiantou {
  border-top-color: rgba(255, 0, 0, 0.9);
}

.region:hover .region-text {
  background-color: rgba(255, 0, 0, 0.9);
}

.region:hover .region-jiantou {
  border-top-color: rgba(255, 0, 0, 0.9);
}
</style>


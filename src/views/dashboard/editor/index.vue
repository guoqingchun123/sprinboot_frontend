<template>
  <div>
    <div id="mapContainer" class="regionMap"></div>
  </div>
</template>

<script>
  import {lazyAMapApiLoaderInstance} from 'vue-amap';
  import {fetchAllRegions} from '@/api/basic'

  export default {
    name: 'DashboardEditor',
    data() {
        return {
        }
      },

    /*mounted() {
      fetchAllRegions().then((res) => {debugger
        this.Regions = res.data;
      })
    },*/
    mounted: function () {
      fetchAllRegions().then((res) => {
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
          if (regions && regions.length >0){
            for (let i in regions) {
              let lnglatList = [];
              if (regions[i].lnglats ==null){
                continue;
              }
              var pathLnglat = regions[i].lnglats.split(';');
              for (let i in pathLnglat) {
                lnglatList.push(pathLnglat[i].split(","))
              }
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
              polygonList.push(polygon)
            }
          }
          /*var path = [
			[118.95355,42.251746],
			[118.954371,42.250443],
			[118.957509,42.251007],
			[118.956839,42.252163]
		  ]
		  console.log(path)*/

          regionMap.setFitView(polygonList)
        })
      });
    }
  }
</script>
<style scoped>
  .regionMap {
    min-height: 600px;
    width: 100%;
    position: absolute;
    top: 12px;
    left: 15px;
    z-index: 999;
    background: white;
  }
</style>


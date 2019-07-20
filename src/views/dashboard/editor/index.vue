<template>
  <div class="app">
    <div ref="map" id="map" style="height: 450px"></div>
  </div>
</template>

<script>
  import AMapJS from "amap-js"

  export default {
    name: 'DashboardEditor',
    data() {
      return {
        graph: {},
        nodeLabel: '测试节点',
        data: null
      }
    },
    mounted() {
      const aMapJSAPILoader = new AMapJS.AMapJSAPILoader({
        key: "8493be8a99d103cbed76edb91479bf7f",
        v: "1.4.14", // 版本号
        params: {}, // 请求参数
        protocol: "https:" // 请求协议
      });
  
      const aMapUILoader = new AMapJS.AMapUILoader({
        v: "1.0" // UI组件库版本号
      });
  
      aMapJSAPILoader.load().then(AMap => {
        aMapUILoader.load().then(initAMapUI => {
          const AMapUI = initAMapUI(); // 这里调用initAMapUI初始化并返回AMapUI
          // 其他逻辑
          console.log(AMap);
          console.log(AMapUI);
          new AMap.Map(this.$refs.map);
        });
      })
    }
  }
</script>
<style>
  .g6-tooltip {
    padding: 10px 6px;
    color: #ffffff;
    background-color: #303133;
    border: 1px solid #303133;
    border-radius: 4px;
  }
</style>


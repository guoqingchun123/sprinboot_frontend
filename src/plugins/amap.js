import Vue from 'vue'
import VueAMap from 'vue-amap'

Vue.use(VueAMap)

// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '8493be8a99d103cbed76edb91479bf7f',
  v: "1.4.14", // 版本号
  // 插件集合 （插件按需引入）
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch']
});

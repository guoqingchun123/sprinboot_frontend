<template>
  <div class="amap-wrapper">
    <el-amap class="amap-box" :vid="'amap-vue'"></el-amap>
  </div>
</template>

<script>
  export default {
    name: 'DashboardEditor',
    data() {
      return {
      }
    }
  }
</script>
<style scoped>
  .amap-wrapper {
    /*width: 500px;*/
    height: 500px;
  }
</style>


<template>
  <div class="app-container">
    <el-tabs type="card">
      <el-tab-pane label="小区坐标" name="regionCoordinate" lazy="true">
        <region-coordinate :region-id="region.regionId" />
      </el-tab-pane>
      <el-tab-pane label="户型图" name="housePicture" lazy="true">
        <house-picture :region-id="region.regionId" />
      </el-tab-pane>
      <el-tab-pane label="项目相册" name="projectImages" lazy="true">
        <project-images :region-id="region.regionId" />
      </el-tab-pane>
      <el-tab-pane label="楼栋坐标" name="bldCoordinate" lazy="true">
        <bld-coordinate :region-id="region.regionId" />
      </el-tab-pane>
      <el-tab-pane label="楼栋详情" name="bldInfo" lazy="true">
        <bld-info :region-id="region.regionId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'RegionMaintain',
    components: {

    },
    data() {
      return {
        region: {}
      }
    },
    created() {
      this.region = this.$route.query.region
    },
    methods: {

    }
  }
</script>

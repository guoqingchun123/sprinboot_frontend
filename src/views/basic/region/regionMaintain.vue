<template>
  <div class="app-container">
    <bv-row layout="table-header">
      <el-col :span="12">
        <div v-if="region.regionName">
          <h3>{{region.regionName}}档案信息</h3>
        </div>
      </el-col>
      <el-col :span="12" class="operates">
        <bv-button type="danger" icon="el-icon-finished" @click="publise">发布</bv-button>
        <bv-button type="primary" icon="el-icon-back" @click="returnPrePage">返回</bv-button>
      </el-col>
    </bv-row>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="小区坐标" name="regionCoordinate" lazy>
        <region-coordinate :region-id="region.regionId" />
      </el-tab-pane>
      <el-tab-pane label="户型图" name="housePicture" lazy>
        <house-picture :region-id="region.regionId" />
      </el-tab-pane>
      <el-tab-pane label="项目相册" name="projectImages" lazy>
        <project-images :region-id="region.regionId" />
      </el-tab-pane>
      <el-tab-pane label="楼栋坐标" name="bldCoordinate" lazy>
        <bld-coordinate :region-id="region.regionId" />
      </el-tab-pane>
      <el-tab-pane label="楼栋详情" name="bldInfo" lazy>
        <bld-info :region-id="region.regionId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import './child'

  export default {
    name: 'RegionMaintain',
    props: {
      region: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        activeName: 'regionCoordinate'
      }
    },
    methods: {
      //发布
      publise() {

      },
      //返回
      returnPrePage() {
        this.$emit("on-region-return")
      }
    }
  }
</script>

<style lang="scss" scoped>
  h3 {
    line-height: 40px;
    margin: 0;
  }
  .operates {
    text-align: right;
  }
</style>

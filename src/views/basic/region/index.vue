<template>
  <div>
    <div v-if="regionListShow">
      <list-region @on-query-project="onQueryProject" @on-query-region="onQueryRegion"></list-region>
    </div>
    <div v-if="listProjectByRegionShow">
      <list-project-by-region :region-id="regionIdByProject" @on-project-return="onProjectReturn"></list-project-by-region>
    </div>
    <div v-if="regionMaintainShow">
      <region-maintain :region="currRegion" @on-region-return="onRegionReturn"></region-maintain>
    </div>
  </div>
</template>

<script>
  import ListRegion from './listRegion'
  import ListProjectByRegion from './listProjectByRegion'
  import RegionMaintain from './regionMaintain'

  export default {
    name: 'Regions',
    components: {
      ListRegion,
      ListProjectByRegion,
      RegionMaintain
    },
    data() {
      return {
        //当前项目列表的小区编号
        regionIdByProject: null,
        //小区列表页面是否显示
        regionListShow: true,
        //项目一览页面是否显示
        listProjectByRegionShow: false,
        //维护小区档案选中的小区
        currRegion: {},
        //小区维护页面是否显示
        regionMaintainShow: false
      }
    },
    methods: {
      //查看项目详情
      onQueryProject(regionId) {
        this.regionIdByProject = regionId
        this.regionListShow = false
        this.listProjectByRegionShow = true
        this.regionMaintainShow = false
      },
      //维护小区档案
      onQueryRegion(row) {
        this.currRegion = row
        this.regionListShow = false
        this.listProjectByRegionShow = false
        this.regionMaintainShow = true
      },
      //项目一览返回
      onProjectReturn() {
        this.regionListShow = true
        this.listProjectByRegionShow = false
        this.regionMaintainShow = false
      },
      //维护小区档案返回
      onRegionReturn() {
        this.regionListShow = true
        this.listProjectByRegionShow = false
        this.regionMaintainShow = false
      }
    }
  }
</script>

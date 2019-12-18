<template>
  <div class="app-container">
    <bv-row layout="table-header">
      <el-col :span="12">
        <div v-if="bld.bldNo && region.regionName && floor.floorNo">
          <h3>{{region.regionName}}-{{bld.bldNo}}{{floor.floorNo}}层单元维护</h3>
        </div>
      </el-col>
      <el-col :span="12" class="operates">
        <bv-button icon="el-icon-back" @click="returnPrePage">返回</bv-button>
      </el-col>
    </bv-row>
    <el-tabs v-model="activeName" type="card" :before-leave="tabClick">
      <el-tab-pane label="楼栋图片" name="bldImage" lazy>
        <bld-image :region="region" :bld="bld" :floor="floor"></bld-image>
      </el-tab-pane>
      <el-tab-pane label="单元坐标" name="cellCoordinate" lazy>
        <cell-coordinate :region="region" :bld-sign-img="bldSignImg" :floor="floor"></cell-coordinate>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import BldImage from './bldImage'
  import CellCoordinate from './cellCoordinate'
  import {fetchFloor} from '@/api/basic'

  export default {
    name: 'BldMaintain',
    components: {
      BldImage,
      CellCoordinate
    },
    props: {
      region: {
        type: Object,
        default: null
      },
      bld: {
        type: Object,
        default: null
      },
      floor: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        activeName: 'bldImage',
        bldSignImg: ''
      }
    },
    methods: {
      tabClick(activeName) {
        let _that = this;
        if (activeName && activeName == 'cellCoordinate') {
          let data = {
            regionId: this.region.regionId,
            projectId: this.bld.projectId,
            bldNo: this.floor.bldNo,
            floorNo: this.floor.floorNo
          }
          return fetchFloor(data).then(response => {
            _that.bldSignImg = response.data.viewPath;
          })
        } else {
          return true
        }
      },
      returnPrePage() {
        this.$emit('on-return')
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

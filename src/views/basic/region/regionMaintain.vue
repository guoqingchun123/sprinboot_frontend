<template>
  <div class="app-container">
    <bv-row layout="table-header">
      <bv-col :span="12">
        <div v-if="region.regionName">
          <h3>{{region.regionName}}档案信息</h3>
        </div>
      </bv-col>
      <bv-col :span="12" class="operates">
        <bv-button type="warning" icon="el-icon-picture" @click="startPreview">小区预览</bv-button>
        <bv-button v-if="checkShow" type="primary" authority="Check" icon="el-icon-s-check" @click="startCheck">申报</bv-button>
        <bv-button type="primary" icon="el-icon-back" @click="returnPrePage">返回</bv-button>
      </bv-col>
    </bv-row>
    <el-tabs v-model="activeName" type="card" :before-leave="tabClick">
      <el-tab-pane label="小区坐标" name="regionCoordinate" lazy>
        <region-coordinate :region="region" />
      </el-tab-pane>
      <el-tab-pane label="户型图" name="housePicture" lazy>
        <house-picture :region="region" />
      </el-tab-pane>
      <el-tab-pane label="项目相册" name="projectImages" lazy>
        <project-images :region="region" />
      </el-tab-pane>
      <el-tab-pane label="楼栋坐标" name="bldCoordinate" lazy>
        <bld-coordinate :region="region" :region-sign-img="regionSignImg" />
      </el-tab-pane>
      <el-tab-pane label="楼栋详情" name="bldInfo" lazy>
        <list-bld :region="region" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import './child'
  import {fetchRegion, updateRegionCheck} from '@/api/basic'

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
        activeName: 'regionCoordinate',
        regionSignImg: '',
        checkShow: true
      }
    },
    /*mounted() {
      //按钮显示逻辑
      const roles = this.$store.getters.roles;
      if (roles) {
        if (roles.indexOf("0001") != -1) {
          //管理员
          this.checkShow = true;
        } else {
          if (roles.indexOf("0003") != -1) {
            //主管单位
            this.checkShow = false;
          } else {
            //企业
            this.checkShow = true;
          }
        }
      }
    },*/
    methods: {
      //返回
      returnPrePage() {
        this.$emit("on-region-return")
      },
      //切换tab事件
      tabClick(activeName) {
        let _that = this;
        if (activeName && activeName == 'bldCoordinate') {
           return fetchRegion(this.region.regionId).then(response => {
            _that.regionSignImg = response.data.viewPath;
          })
        } else {
          return true
        }
      },
      //申报
      startCheck() {
        this.$confirm('是否确定进行此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            regionId: this.region.regionId,
            updateParam: '1000'
          }
          updateRegionCheck(data).then(response => {
            this.$message.success('申报成功');
            this.$emit("on-region-return");
          })
        }).catch(() => {
          console.log('取消操作')
        })
      },
      //小区预览
      startPreview() {
        // window.open('http://172.10.10.196:81/houses/sales/'+this.region.regionId)
        window.open(process.env.VUE_APP_ADDR + '/sales/'+this.region.regionId)
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

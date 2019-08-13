<template>
  <div class="app-container">
    <bv-row layout="table-header">
      <el-col :span="12">
        <div v-if="region.regionName">
          <h3>{{region.regionName}}档案信息</h3>
        </div>
      </el-col>
      <el-col :span="12" class="operates">
        <bv-button type="success" icon="el-icon-picture" @click="startPreview">小区预览</bv-button>
        <bv-button type="danger" icon="el-icon-position" @click="startPublise">发布</bv-button>
        <bv-button type="primary" icon="el-icon-back" @click="returnPrePage">返回</bv-button>
      </el-col>
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
    <bv-dialog title="小区发布" :visible.sync="dialogVisible" width="40vw">
      <div slot="footer">
        <bv-form ref="dialogForm" :model="item" :rules="rules">
          <bv-row>
            <bv-col v-bind="$CONST.col.layout2">
              <el-form-item label="发布日期" prop="publishDate">
                <el-date-picker
                  v-model="item.publishDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                />
              </el-form-item>
            </bv-col>
          </bv-row>
        </bv-form>
        <bv-button view="save" @click="confirmPublise()">保存</bv-button>
        <bv-button view="cancel" @click="cancelPublise()">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  import './child'
  import {updateRegionState, fetchRegion} from '@/api/basic'

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
        dialogVisible: false,
        item: {},
        rules: {
          publishDate: [
            {required: true, message: '请选择发布日期', trigger: 'blur'}
          ]
        },
        regionSignImg: ''
      }
    },
    methods: {
      // 弹窗用
      initData() {
        this.item = {}
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      startPublise() {
        this.initData()
        this.dialogVisible = true
      },
      startPreview() {
        // window.open('http://222.74.69.146:180/houses/sales/'+this.region.regionId)
        window.open(process.env.VUE_APP_ADDR + '/houses/sales/'+this.region.regionId)
      },
      //确认发布
      confirmPublise() {
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          let data = {
            regionId: this.region.regionId,
            publishDate: this.item.publishDate
          }
          updateRegionState(data).then(response => {
            this.$message.success('发布成功')
          }).catch(() => {
            this.$message.error('发布失败')
          })
          this.dialogVisible = false
        })
      },
      //取消发布
      cancelPublise() {
        this.dialogVisible = false
      },
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

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="20">
        <image-label v-bind="config" ref="child">
          <div id="bld" style="border: 1px red solid;"></div>
        </image-label>
      </el-col>
      <el-col :span="4">
        <el-row>
          <el-col :span="12" style="text-align: center">
            <bv-button icon="el-icon-success" @click="saveData" :disabled="disabledBtn">确定</bv-button>
          </el-col>
          <el-col :span="12" style="text-align: center">
            <bv-button icon="el-icon-delete-solid" @click="clearData" :disabled="disabledBtn">清空</bv-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import '@/plugins/imageLabel'
  import {addBldCoordinate} from '@/api/basic'

  export default {
    name: 'BldCoordinate',
    props: {
      region: {
        type: Object,
        default: null
      },
      regionSignImg: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        config: {
          container: 'bld',
          img: this.regionSignImg,
          shade: false,
          show: false,
          editText: '选择楼栋',
          select: {
            url: '/api/center/bldListByRegionId/'+this.region.regionId,
            code: 'bldId',
            desc: 'bldName'
          }
        },
        disabledBtn: true
      }
    },
    created() {
      let _that = this;
      let img = new Image();
      img.src = _that.regionSignImg;
      img.onload = function () {
        let width = document.body.scrollWidth*0.65;
        let b = document.getElementById('bld');
        b.style.width = width+'px';
        b.style.height = (img.height/img.width*width)+'px';
        _that.$nextTick(() => {
          _that.config.show = true;
          _that.disabledBtn = false;
        })
      };
      img.onerror = function () {
        _that.$message.warning('未上传图片');
        _that.config.show = false;
        _that.disabledBtn = true;
      }
    },
    methods: {
      saveData() {
        let data = {
          regionId: this.region.regionId,
          bldSigns: this.$refs.child.getData()
        }
        addBldCoordinate(data).then(() => {
          this.$message({
            type: 'success',
            message: '保存楼栋标记成功'
          })
          this.$refs.child.clearArea()
        })
      },
      clearData() {
        this.$refs.child.clearArea()
      }
    }
  }
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="20">
        <image-label v-bind="config" ref="child">
          <div id="cell" style="border: 1px red solid;"></div>
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
  import {addCellCoordinate} from '@/api/basic'

  export default {
    name: 'BldCoordinate',
    props: {
      region: {
        type: Object,
        default: null
      },
      floor: {
        type: Object,
        default: null
      },
      bldSignImg: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        config: {
          container: 'cell',
          img: this.bldSignImg,
          shade: false,
          show: false,
          editText: '选择单元',
          select: {
            url: '/api/center/cellList?regionId='+this.region.regionId+'&bldNo='+this.floor.bldNo+'&floorNo='+this.floor.floorNo,
            code: 'cellNo',
            desc: 'cellName'
          }
        },
        disabledBtn: true
      }
    },
    created() {
      let _that = this;
      let img = new Image();
      img.src = _that.bldSignImg;
      img.onload = function () {
        let width = document.body.scrollWidth*0.65;
        let b = document.getElementById('cell');
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
          bldNo: this.floor.bldNo,
          floorNo: this.floor.floorNo,
          cellSigns: this.$refs.child.getData()
        }
        addCellCoordinate(data).then(() => {
          this.$message({
            type: 'success',
            message: '保存单元标记成功'
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

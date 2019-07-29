<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="16" id="image-container">
        <image-label v-bind="config" ref="child">
          <div id="bld" style="border: 2px red solid;"></div>
        </image-label>
      </el-col>
      <el-col :span="8">
        <el-row>
          <el-col :span="12" style="text-align: center">
            <bv-button type="success" icon="el-icon-success" @click="saveData" :disabled="disabledBtn">确定</bv-button>
          </el-col>
          <el-col :span="12" style="text-align: center">
            <bv-button type="danger" icon="el-icon-delete-solid" @click="clearData" :disabled="disabledBtn">清空</bv-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import '@/plugins/imageLabel'
  import {addBldCoordinate} from '@/api/basic'

  function getImgInfo(url) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = url;
      img.onload = function () {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.onerror = function () {
        reject(new Error("图片加载错误！"));
      }

    });
  }
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
          show: true,
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
    mounted() {
      let _that = this;
      getImgInfo(_that.regionSignImg).then(imgInfo => {
        let o = document.getElementById('image-container');
        let width = o.clientWidth||o.offsetWidth;
        let b = document.getElementById('bld');
        b.style.width = width+'px';
        b.style.height = (imgInfo.height/imgInfo.width*width)+'px';
        _that.config.show = true;
        _that.disabledBtn = false;
      }).catch(error => {
        _that.$message.warning('未上传图片')
        _that.config.show = false;
        _that.disabledBtn = true;
      });
    },
    methods: {
      saveData() {
        console.log(this.$refs.child.getData())
      },
      clearData() {
        this.$refs.child.clearArea()
      }
    }
  }
</script>

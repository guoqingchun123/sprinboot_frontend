<template>
  <div class="app-container">
    <bv-row :gutter="20">
      <bv-col :span="20">
        <image-label v-bind="config" ref="child">
          <div id="bld" style="border: 1px red solid;"></div>
        </image-label>
      </bv-col>
      <bv-col :span="4">
        <bv-row>
          <bv-col :span="12" style="text-align: center">
            <bv-button type="success" icon="el-icon-success" @click="saveData" :disabled="disabledBtn">确定</bv-button>
          </bv-col>
          <bv-col :span="12" style="text-align: center">
            <bv-button type="danger" icon="el-icon-delete-solid" @click="clearData" :disabled="disabledBtn">清空</bv-button>
          </bv-col>
        </bv-row>
      </bv-col>
    </bv-row>
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
    watch: {
      //监听 regionSignImg，解决tab切换时图片不改变的bug
      regionSignImg: {
        immediate: true,
        handler(value) {
          let _that = this;
          _that.$set(_that.config, 'show', false);
          _that.disabledBtn = true;
          let img = new Image();
          img.src = value;
          img.onload = function () {
            let width = document.body.scrollWidth*0.65;
            let b = document.getElementById('bld');
            b.style.width = width+'px';
            b.style.height = (img.height/img.width*width)+'px';
            _that.$nextTick(() => {
              _that.$set(_that.config, 'img', value);
              _that.$set(_that.config, 'show', true);
              // _that.config.show = true;
              _that.disabledBtn = false;
            })
          };
          img.onerror = function () {
            _that.$message.warning('未上传图片');
            _that.$set(_that.config, 'show', false);
            // _that.config.show = false;
            _that.disabledBtn = true;
          }
        }
      }
    },
    created() {

    },
    methods: {
      saveData() {
        //剔除未选的描点数据
        const coordList = this.$refs.child.getData();
        let _list = [];
        for (let i in coordList) {
          if (coordList[i].id) {
            _list.push(coordList[i])
          }
        }
        //判断是否有效描点
        if (_list.length > 0) {
          let data = {
            regionId: this.region.regionId,
            bldSigns: this.$refs.child.getData()
          }
          addBldCoordinate(data).then(() => {
            this.$message({
              type: 'success',
              message: '保存楼栋标记成功'
            })
            // this.$refs.child.clearArea()
          })
        } else {
          this.$message.warning("未维护楼栋信息")
        }
      },
      clearData() {
        this.$refs.child.clearArea()
      }
    }
  }
</script>

<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  import imageLabel from './scripts/jquery.imageLabel.js'

  export default {
    name: 'ImageLabel',
    props: {
      //图片路径，必填
      img: {
        type: String,
        default: '',
      },
      //区域数据，默认渲染
      data: {
        type: Array,
        default: null
      },
      //选中单个区域是否隐藏其他区域
      only: {
        type: Boolean,
        default: false
      },
      //是否显示遮罩
      shade: {
        type: Boolean,
        default: true
      },
      //DOM容器
      container: {
        type: String,
        default: ''
      },
      // 编辑框标题
      editText: {
        type: String,
        default: '编辑内容'
      },
      //编辑框下拉菜单查询接口定义
      select: {
        type: Object,
        default: {
          url: '',
          code: '',
          desc: ''
        }
      },
      //是否显示
      show: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        //启用默认修改弹窗
        editPop: true,
        $imageLabel: imageLabel({
          container: this.container,
          editText: this.editText,
          img: this.img,
          editPop: this.editPop,
          only: this.only,
          shade: this.shade,
          data: this.data,
          show: this.show,
          util: this.$message,
          select: this.select
        }),
        dataImage: {}
      };
    },
    mounted() {
      // let data = {
      //   container: this.container,
      //   editText: this.editText,
      //   img: this.img,
      //   editPop: this.editPop,
      //   only: this.only,
      //   shade: this.shade,
      //   data: this.data,
      //   show: this.show,
      //   util: this.$message,
      //   select: this.select
      // }
      // this.dataImage = data
      // // this.$imageLabel = imageLabel(data);
      // this.$imageLabel = imageLabel(data);
    },
    methods: {
      //获取选区数据，返回array
      getData() {
        debugger
        return this.$imageLabel.getData()
      },
      //清除选区
      clearArea() {
        return this.$imageLabel.clearArea()
      }
    }
  }
</script>
<style scoped>
  @import "./styles/jquery.imageLabel.css";
</style>

<template>
  <bv-dialog v-loading="loading"
             :element-loading-text="loadingText"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             title="在线预览"
             :visible.sync="visible"
             :close-on-press-escape="true"
             top="1vh"
  >
    <iframe class="iframeClass" frameborder="1" :src="pdfUrl" />
  </bv-dialog>
</template>

<script>
  import {getPDF} from '@/api/sharedResource'

  export default {
    name: 'OnlineShow',
    props: {
      fileId: {
        type: String,
        default: ''
      },
      dialogVisible: {
        type: Boolean,
        default: false
      },
      reFreshFlag: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        loading: false,
        pdfUrl: null,
        visible: false,
        loadingText: 'PDF文件拼命加载中，请稍后片刻！',
        fullscreenLoading: false
      }
    },
    watch: {
      //监听切换标签状态
      'fileId': function () {
        this.getList();
      },
      'reFreshFlag': function () {
        this.getList();
      }
    },
    created() {
      this.getList()
    },
    methods: {
      // 初期数据取得
      getList() {
        this.pdfUrl = null;

        if (this.fileId === '') {
          return;
        }

        this.loading = true;
        let getPDFData = {
          fileId: this.fileId
        };
        this.visible = this.dialogVisible;
        getPDF(getPDFData).then(data => {
          var binaryData = [];
          binaryData.push(data.data);
          let url = this.getObjectURL(new Blob(binaryData, {type:"application/pdf"}));
          this.pdfUrl = url;
          setTimeout(() => {
            this.loading = false
          }, 500);
        }).catch(() => {
          setTimeout(() => {
            this.loading = false
          }, 100);
          this.visible = false;
          this.$message({
            type: 'error',
            message: '此文件不能进行预览！'
          });
        });
      },
      getObjectURL(file) {
        let url = null;
        if (window.createObjectURL !== undefined) {
          url = window.createObjectURL(file);
        } else if (window.webkitURL !== undefined) {
          url = window.webkitURL.createObjectURL(file);
        } else if (window.URL !== undefined) {
          url = window.URL.createObjectURL(file);
        }
        return url;
      }
    }
  }
</script>

<style>
  .iframeClass {
    width: 100%;
    height: 650px;
  }
</style>

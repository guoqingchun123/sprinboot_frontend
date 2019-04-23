<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" tab-position="top">
      <el-tab-pane key="TP" :label="tpTitle">
        <flow-pane v-if="isTp" :type="tpFlow" :title="tpTitle" />
      </el-tab-pane>
      <!--<el-tab-pane key="SP" :label="spTitle">
        <flow-pane v-if="isSp" :type="spFlow" :title="spTitle" />
      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
  import FlowPane from "./flowPane";

  export default {
    name: 'ListFlow',
    components: {FlowPane},
    data() {
      return {
        // 技术项目审批
        tpTitle: "技术项目审批",
        tpFlow: 'tpFlow',
        isTp: false,
        // 销售项目审批
        spTitle: "销售项目审批",
        spFlow: 'spFlow',
        isSp: false,
        // tabs标签默认为第一个
        activeName: ''
      }
    },
    watch: {
      //监听切换标签状态
      'activeName': function (val) {
        // 技术项目审批
        if (0 == val) {
          this.isTp= true;
          this.isSp= false;
        } else {
          // 销售项目审批
          this.isTp= false;
          this.isSp= true;
        }
      }
    },
    created() {
    },
    methods: {
    }
  }
</script>

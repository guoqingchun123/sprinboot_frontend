<template>
  <div>
    <div style="margin-left: 38%;font-size: 20px">【{{ routeCorpId+'  '+routeCorpName }}】</div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="客户信息" name="basicDetail">
        <corp-detail :corp-id="routeCorpId" />
      </el-tab-pane>
      <el-tab-pane label="项目信息" name="projDetail">
        <proj-detail :corp-id="routeCorpId" />
      </el-tab-pane>
      <el-tab-pane label="合同信息" name="contractDetail">
        <contract-detail :corp-id="routeCorpId" />
      </el-tab-pane>
      <el-tab-pane label="联系人信息" name="customDetail">
        <custom-detail :corp-id="routeCorpId" />
      </el-tab-pane>
      <el-tab-pane label="图档信息" name="fileDetail">
        <file-detail :corp-id="routeCorpId" />
      </el-tab-pane>
      <el-tab-pane label="返回" @click="goBack()" />
    </el-tabs>
  </div>
</template>


<script>
  import customDetail from '@/views/project/child/customDetail'
  import projDetail from '@/views/project/child/projDetail'
  import contractDetail from '@/views/project/child/contractDetail'
  import fileDetail from '@/views/project/child/fileDetail'
  import corpDetail from '@/views/project/child/corpDetail'

  export default {
    name: 'CustomManageDetail',
    components:{
      customDetail,projDetail,fileDetail,contractDetail,corpDetail
    },
    data() {
      return{
        items:[],
        routeCorpId:'',
        routeCorpName:'',
        activeName:'basicDetail'
      }
    },
    computed:{

    },
    watch: {
      '$route': 'getParams'
    },
    created(){
      this.getParams();

    },
    methods:{
      getParams(){
        // 取到路由带过来的参数
        this.items= this.$route.params.corpInfo;
        this.routeCorpId=this.items.corpId;
        this.routeCorpName= this.items.corpName;
        if(this.routeCorpId===undefined){
          this.$router.push({
            path: '/custom/customManage',
            name: 'CustomManage',
          });
        }
        // 将数据放在当前组件的数据内
      },
      goBack() {
        this.$router.push({
          path: '/custom/customManage',
          name: 'CustomManage',
        })
      },
    }
  }
</script>

<style>
.custom-manage-detail-header{
  margin-left: 20px;
}
.contract-message-detail-button-group-1{
  margin-left:1056px ;
}
  .custom-manage-file-table{
    width: 1000px;
    float: right;
  }
  .custom-manage-filter-input-1{
    width: 300px;
    margin-left: 380px;
    margin-bottom: 20px;
  }
.custom-manage-filter-input-2{
  width: 300px;
  margin-left: 380px;
  margin-bottom: -95px;
}
  .custom-detail-div-1{
    margin-left: 500px;
    margin-bottom: 20px;
    font-size: 20px;
  }
/*.el-tree-node:focus > .el-tree-node__content {*/
  /*background-color: red;*/
/*}*/
</style>


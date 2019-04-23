<template>
  <div>
    <div style="margin-left: 38%;font-size: 20px">【{{ routeContractId+'  '+routeContractName }}】</div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="项目信息" name="basicDetail">
        <proj-detail :corp-id="routeCorpId" />
      </el-tab-pane>
      <el-tab-pane label="返回" @click="goBack()" />
    </el-tabs>
  </div>
</template>


<script>
  import projDetail from '@/views/project/child/projDetail'

  export default {
    name: 'ContractMessageDetail',
    components:{
      projDetail
    },
    data() {
      return{
        routeContractId:'',
        routeContractName:'',
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
        this.routeContractId= this.$route.params.contractId;
        this.routeContractName= this.$route.params.contractName;
        if(this.routeContractId===undefined){
          this.$router.push({
            path: '/custom/contractMessage',
            name: 'ContractMessage',
          });
        }
        // 将数据放在当前组件的数据内
      },
      goBack() {
        this.$router.push({
          path: '/custom/contractMessage',
          name: 'ContractMessage',
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


<template>
  <el-form>
    <bv-row>
      <bv-col :span="4" style="margin-right: 100px">
        <el-form-item label="客户名称">
          <el-input v-model="corpInfo.corpName" disabled />
        </el-form-item>
      </bv-col>
      <bv-col :span="4" style="margin-right: 100px">
        <el-form-item label="客户代码">
          <el-input v-model="corpInfo.corpCode" disabled />
        </el-form-item>
      </bv-col>
      <bv-col :span="4">
        <el-form-item label="城市级别">
          <el-input v-model="corpInfo.cityLevelName" disabled />
        </el-form-item>
      </bv-col>
    </bv-row>
    <bv-row>
      <bv-col :span="4" style="margin-right: 100px">
        <el-form-item label="客户级别" prop="corpLevel">
          <el-input v-model="corpInfo.corpLevelName" disabled />
        </el-form-item>
      </bv-col>
      <bv-col :span="4" style="margin-right: 100px">
        <el-form-item label="客户电话" prop="corpPhone">
          <el-input v-model="corpInfo.corpPhone" disabled />
        </el-form-item>
      </bv-col>
      <bv-col :span="4">
        <el-form-item label="客户地址" prop="corpAddress">
          <el-input v-model="corpInfo.corpAddress" disabled />
        </el-form-item>
      </bv-col>
    </bv-row>
  </el-form>
</template>

<script>
  import {corpById} from '@/api/custom/contractMessage'

  export default {
    props:{
      corpId:{
        type: String,
        default: ''
      }
    },
    data(){
      return{
        corpInfo:[]
      }
    },
    watch:{
      corpId(){
        this.getCorpDetail();
      }
    },
    created(){
      this.getCorpDetail();
    },
    methods:{
      getCorpDetail(){
        let corpId=this.corpId;
        corpById(corpId).then(response=>{
          this.corpInfo=response.data;
        })
      },
    }
  }
</script>

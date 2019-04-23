<template>
  <div>
    <bv-table ref="table"
              title="联系客户信息列表"
              :pagination="false"
              :filter.sync="filter"
              :fetch-api="queryContactCustomInfo"
              @on-mounted="(table) => tableInstance = table"
    >
      <div slot="search">
        <bv-col>
          <el-form-item label="客户名称" prop="corpName">
            <el-input v-model="filter.corpName" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column prop="corpId" label="单位编号" />
      <el-table-column prop="corpName" label="客户名称" />
      <el-table-column prop="contractName" label="项目名称" />
      <el-table-column prop="serveEndDate" label="服务到期日" :formatter="serveEndDateFormatter" />
      <el-table-column prop="contactDate" label="最近联系日期" :formatter="contactDateFormatter" />
      <el-table-column prop="uncontactDate" label="未联系天数" />
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template scope="scope">
          <el-button type="text" size="small" @click="refreshContactDate(scope.row)">更新联系日期</el-button>
        </template>
      </el-table-column>
    </bv-table>
    <bv-dialog title="更新联系日期" :visible.sync="dialogVisible" top="5vh">
      <el-form ref="contactCustomInfo" status-icon :model="contactCustomInfo" :rules="rules" label-width="100px" label-position="right" style="width: 90%;">
        <el-row :gutter="$CONST.row.gutter">
          <el-form-item label="客户名称" prop="corpName">
            <el-input v-model="contactCustomInfo.corpName" disabled />
          </el-form-item>
          <el-form-item label="项目名称" prop="contractName">
            <el-input v-model="contactCustomInfo.contractName" disabled />
          </el-form-item>
          <el-form-item label="最近联系日期" prop="contactDate" style="white-space: nowrap">
            <el-date-picker
              v-model="contactCustomInfo.contactDate"
              type="date"
              placeholder="请选择"
            />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer">
        <bv-button view="save" type="primary" @click="confirm('contactCustomInfo')">保存</bv-button>
        <bv-button view="cancel" @click="cancelEdit">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  import {queryContactCustomInfo,editContactCustomInfo} from '@/api/remind/remind'
  import moment from 'moment'

  export default {
    name: 'ContactCustomRemind',
    data() {
      return{
        items:[],
        contactCustomInfo:{
          contactDate:''
        },
        rules: {
          contactDate: [
            {required: true, message:'请选择最近联系时间', trigger: 'change'},
          ]
        },
        dialogVisible:false,
        // 过滤条件
        filter: {
          corpName:''
        },
        queryContactCustomInfo,
        tableInstance:{}
      }
    },
    computed:{

    },
    created(){
    },
    methods:{
      serveEndDateFormatter(row) {
        if(row.serveEndDate!=null){
          return moment(row.serveEndDate).format('YYYY-MM-DD')
        }
      },
      contactDateFormatter(row) {
        if(row.contactDate!=null){
          return moment(row.contactDate).format('YYYY-MM-DD')
        }
      },
      refreshContactDate (row) {
        this.contactCustomInfo=row;
        this.dialogVisible=true;
      },
      confirm(formName) {
        //表单校验
        let _that=this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
              editContactCustomInfo(_that.contactCustomInfo).then(() =>{
                  // 修改成功后执行
                    //刷新页面
                    _that.getContactCustomInfo();
                    //关闭弹窗
                    _that.dialogVisible = false;
                    //清空选中
                  this.$message({
                    message:'保存成功',
                    type:'success'
                  })
                }
              )

          }else {
            //校验没有通过时的处理
            return false
          }
        })
      },
      cancelEdit() {
        //清除表单校验
        this.$nextTick(function () {
          this.$refs.contactCustomInfo.clearValidate()
        });
        this.dialogVisible=false
      }
    }
  }
</script>

<style>

</style>


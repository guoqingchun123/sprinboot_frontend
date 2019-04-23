<template>
  <div>
    <bv-table ref="table"
              title="巡检回访维护信息列表"
              :pagination="false"
              :filter.sync="filter"
              :fetch-api="queryPotralVisitInfo"
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
      <el-table-column prop="visitDate" label="应巡检日期" :formatter="visitDateFormatter" />
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template scope="scope">
          <el-button type="text" size="small" @click="refreshVisitDate(scope.row)">修改应巡检日期</el-button>
        </template>
      </el-table-column>
    </bv-table>

    <bv-dialog title="更新应巡检日期" :visible.sync="dialogVisible" top="5vh">
      <el-form ref="potralVisitInfo" status-icon :model="potralVisitInfo" :rules="rules" label-width="100px" label-position="right" style="width: 90%;">
        <el-row :gutter="$CONST.row.gutter">
          <el-form-item label="客户名称" prop="corpName">
            <el-input v-model="potralVisitInfo.corpName" disabled />
          </el-form-item>
          <el-form-item label="项目名称" prop="contractName">
            <el-input v-model="potralVisitInfo.contractName" disabled />
          </el-form-item>
          <el-form-item label="应巡检日期" prop="visitDate" style="white-space: nowrap">
            <el-date-picker
              v-model="potralVisitInfo.visitDate"
              type="date"
              placeholder="请选择"
            />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer">
        <bv-button view="save" type="primary" @click="confirm('potralVisitInfo')">保存</bv-button>
        <bv-button view="cancel" @click="cancelEdit">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  import {queryPotralVisitInfo,editPotralVisitInfo} from '@/api/remind/remind'
  import moment from 'moment'

  export default {
    name: 'PotralVisitCheck',
    data() {
      return{
        tableInstance:{},
        queryPotralVisitInfo,
        items:[],
        dialogVisible:false,
        potralVisitInfo:{
          visitDate:''
        },
        rules: {
          visitDate: [
            {required: true, message:'请选择应巡检日期', trigger: 'change'},
          ]
        },
        isFuzzy: true,
        // 模糊查询条件
        fuzzy: null,
        // 过滤条件
        filter: {
          corpName:''
        },
        loading:false
      }
    },
    computed:{

    },
    created(){
    },
    methods:{
      serveEndDateFormatter(row) {
        return moment(row.serveEndDate).format('YYYY-MM-DD')
      },
      visitDateFormatter(row){
        return moment(row.visitDate).format('YYYY-MM-DD')
      },
      refreshVisitDate (row) {
        this.potralVisitInfo=row;
        this.dialogVisible=true;
      },
      confirm(formName) {
        //表单校验
        let _that=this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            editPotralVisitInfo(_that.potralVisitInfo).then(() =>{
                // 修改成功后执行
                //刷新页面
                _that.getPotralCheckInfo();
                //关闭弹窗
                _that.dialogVisible = false;
                //清空选中
                this.$message({
                  message:'保存成功',
                  type:'success'
                })}
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
          this.$refs.potralVisitInfo.clearValidate()
        });
        this.dialogVisible=false
      }
    }
  }
</script>

<style>

</style>


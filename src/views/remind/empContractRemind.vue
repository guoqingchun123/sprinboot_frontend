<template>
  <div>
    <bv-table ref="table"
              title="员工合同到期信息列表"
              :pagination="false"
              :filter.sync="filter"
              :fetch-api="queryEmpContractEndDate"
              @on-mounted="(table) => tableInstance = table"
    >
      <div slot="search">
        <bv-col>
          <el-form-item label="员工姓名" prop="empName">
            <el-input v-model="filter.empName" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column prop="empId" label="员工编号" />
      <el-table-column prop="empName" label="员工姓名" />
      <el-table-column prop="contractType" label="合同类型" :formatter="contractTypeFormatter" />
      <el-table-column prop="endDate" label="合同到期时间" :formatter="endDateFormatter" />
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template scope="scope">
          <el-button type="text" size="small" @click="continueContract(scope.row)">续签</el-button>
          <el-button type="text" size="small" @click="stopContract(scope.row)">中止</el-button>
        </template>
      </el-table-column>
    </bv-table>
    <bv-dialog title="续签员工合同" :visible.sync="dialogVisible" top="5vh">
      <el-form ref="contractEndInfo" status-icon :model="contractEndInfo" :rules="rules" label-width="100px" label-position="right" style="width: 90%;">
        <el-row :gutter="$CONST.row.gutter">
          <el-form-item label="合同类型" prop="contractType">
            <el-select v-model="contractEndInfo.contractType" placeholder="请选择">
              <el-option
                v-for="item in contractTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="contractEndInfo.contractType=='A'" label="合同结束日期" prop="endDate" style="white-space: nowrap">
            <el-date-picker
              v-model="contractEndInfo.endDate"
              type="date"
              placeholder="请选择"
            />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer">
        <bv-button view="save" type="primary" @click="continueConfirm('contractEndInfo')">保存</bv-button>
        <bv-button view="cancel" @click="cancelContinue">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  import {queryEmpContractEndDate,changeSignState,stopEmpContract} from '@/api/remind/remind'
  import moment from 'moment'

  export default {
    name: 'EmpContractRemind',
    data() {
      return{
        queryEmpContractEndDate,
        tableInstance:{},
        contractEndInfo:{
          empId:'',
          contractType:'',
          endDate:'',
        },
        items:[],
        dialogVisible:false,
        rules: {
          contractType: [
            {required: true, message:'请选择合同类型', trigger: 'change'},
          ],
          endDate: [
            {required: true, message:'请选择续约截止日期', trigger: 'change'},
          ]
        },
        contractTypeOptions: [
          {
            value:'A',
            label:'普通合同'
          },{
            value:'B',
            label:'无固定期限'
          }
        ],
        isFuzzy: true,
        // 模糊查询条件
        fuzzy: null,
        // 过滤条件
        filter: {
          empName:''
        },
      }
    },
    computed:{

    },
    created(){
    },
    methods:{
      continueContract (row) {
          this.dialogVisible=true;
          this.contractEndInfo.empId=row.empId;
          this.contractEndInfo.contractType=row.contractType;
          this.contractEndInfo.endDate=row.endDate;
          // this.contractEndInfo.contractState='0001'
      },
      stopContract (row) {
        this.contractEndInfo=row;
        let _that = this;
        _that.$confirm('确定要中止该员工合同吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _that.contractEndInfo.contractState='0002';
          //根据this.selection[0] 中的对象的id进行删除
          stopEmpContract(_that.contractEndInfo).then(() =>{
              //刷新页面
              _that.getContractMessageDetail();
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          })

        }).catch(() => {
        });
      },
      cancelContinue() {
        //清除表单校验
        this.$nextTick(function () {
          this.$refs.contractEndInfo.clearValidate()
        });
        //关闭弹窗
        this.dialogVisible = false
      },
      continueConfirm(formName) {
        //表单校验
        let _that=this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(_that.contractEndInfo.contractType=='B'){
              _that.contractEndInfo.endDate=''
            }
            changeSignState(_that.contractEndInfo).then(() =>{
                // 修改成功后执行
                  //刷新页面
                  _that.getContractMessageDetail();
                  //关闭弹窗
                  _that.dialogVisible = false;
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  });
              }
            )
          }else {
            return false
          }
        })
      },
      contractTypeFormatter(row) {
        switch (row.contractType) {
          case 'A':return "普通合同";
          case 'B':return "无固定期限";
        }
      },
      endDateFormatter(row) {
        if(row.endDate!=null){
          return moment(row.endDate).format('YYYY-MM-DD')
        }
      },
    }
  }
</script>

<style>

</style>


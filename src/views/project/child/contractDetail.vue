<template>
  <div class="app-container">
    <div v-show="basicProjShow">
      <bv-table
        ref="table"
        v-loading="loading"
        tooltip-effect="dark" stripe
        title="销售合同信息列表"
        :pagination="true"
        :filter.sync="filter"
        :fetch-api="fetchCustContractDetail"
        @sort-change="onSort"
        @select="checkboxSelect"
        @on-mounted="(table) => tableInstance = table"
      >
        <div slot="operates">
          <bv-button show="none" view="grant" authority="grant">导出数据</bv-button>
          <bv-button show="none" view="add" authority="add" @click="clickInsert()">新增</bv-button>
        </div>
        <div slot="search">
          <bv-col>
            <el-form-item label="合同名称" prop="contractName">
              <el-input v-model="filter.contractName" />
            </el-form-item>
          </bv-col>
        </div>
        <el-table-column label="序号" type="index" />
        <el-table-column label="销售合同编号" prop="contractId" width="141px" />
        <el-table-column label="合同名称" prop="contractName" />
        <el-table-column label="合同类型" prop="contractType" :formatter="contractTypeFormatter" />
        <el-table-column label="财政年度" prop="contractYear" :formatter="contractYearFormatter" />
        <el-table-column label="承办方" prop="corpSponsor" />
        <el-table-column label="业务部门" prop="businessDept" />
        <el-table-column label="销售负责人" prop="salesEmp" />
        <el-table-column label="售前负责人" prop="preSalesEmp" />
        <el-table-column label="签约日期" prop="signDate" :formatter="signDateFormatter" />
        <el-table-column label="服务到期日" prop="serveDate" :formatter="serveDateFormatter" />
      </bv-table>
    </div>
    <!-- 添加/修改/查看项目弹窗 -->
    <bv-dialog title="维护销售合同信息" :visible.sync="dialogVisible" top="5vh" @close="cancelInsertOrUpdate">
      <bv-scrollbar>
        <el-form ref="insertForm" :model="projInfo" status-icon :rules="rules" label-width="100px" label-position="right" style="width: 90%;">
          <el-row :gutter="$CONST.row.gutter">
            <!--<el-form-item label="销售合同编号" prop="contractId">-->
            <!--<el-input v-model="projInfo.contractId" :disabled="!isAdd" />-->
            <!--</el-form-item>-->
            <el-form-item label="合同名称" prop="contractName">
              <el-input v-model="projInfo.contractName" />
            </el-form-item>
            <el-form-item label="合同类型" prop="contractType">
              <el-select v-model="projInfo.contractType" placeholder="请选择">
                <el-option
                  v-for="item in contractTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="财政年度" prop="contractYear">
              <el-date-picker
                v-model="projInfo.contractYear"
                type="year"
                placeholder="请选择"
              />
            </el-form-item>
            <el-form-item label="承办方" prop="corpSponsor">
              <el-input v-model="projInfo.corpSponsor" />
            </el-form-item>
            <el-form-item label="业务部门" prop="businessDept">
              <el-select v-model="projInfo.businessDept" placeholder="请选择">
                <el-option
                  v-for="item in deptInfo"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="销售负责人" prop="salesEmp">
              <el-input v-model="projInfo.salesEmp" />
            </el-form-item>
            <el-form-item label="售前负责人" prop="preSalesEmp">
              <el-input v-model="projInfo.preSalesEmp" />
            </el-form-item>
            <el-form-item label="签约日期" prop="signDate">
              <el-date-picker
                v-model="projInfo.signDate"
                type="date"
                placeholder="请选择"
              />
            </el-form-item>
            <el-form-item label="服务到期日" prop="serveDate">
              <el-date-picker
                v-model="projInfo.serveDate"
                type="date"
                placeholder="请选择"
              />
            </el-form-item>
          </el-row>
        </el-form>
      </bv-scrollbar>
      <div slot="footer">
        <bv-button view="save" type="primary" @click="handleInsertOrEdit('insertForm')">保存</bv-button>
        <bv-button view="cancel" @click="cancelInsertOrUpdate">取 消</bv-button>
        <bv-button view="cancel" @click="dialogVisible=false">关闭</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  import {queryContractMessage,addContractInfo,editContractInfo,deleteContractInfo} from '@/api/custom/contractMessage'
  import moment from 'moment'
  import {fetchDepts} from '@/api/system/depts'

  export default {
    props:{
      corpId:{
        type: String,
        default: ''
      }
    },
    data() {
      return {
        tableInstance:{},
        queryContractMessage,
        //判断是否是新增，false是修改
        isAdd: false,
        //新增弹窗是否显示
        dialogVisible: false,
        //点击查看详情显示详情页弹窗
        showDetailInfoVisible:false,
        //弹框表单校验规则
        rules: {
          contractType: [
            {required: true, message:'合同类型不能为空', trigger: 'blur'},
          ],
          contractName: [
            {required: true, message: '合同名称不能为空', trigger: 'blur'},
          ],
        },
        //项目类型字典
        contractTypeOptions: [
          {
            value:'0000',
            label:'新签'
          },{
            value:'0001',
            label:'续签'
          }
        ],
        projInfo1:{},
        deptInfo:[],
      }
    },
    computed:{

    },
    watch:{
      corpId(){
        if(this.corpId!=''){
          this.filter.corpId = this.corpId;
          this.tableInstance.fetchData()
        }
      }
    },
    created() {
      this.getDepts();
    },
    methods: {
      getDepts:function(){
        fetchDepts().then(response=>{
          this.deptInfo=response.data;
        })
      },
      fetchCustContractDetail(data){
        data.corpId = this.corpId;
        return this.queryCustContractInfo(data)
      },
      clickInsert() {
        //弹窗显示标志置为true
        this.dialogVisible=true;
        //新增标志置为true
        this.isAdd=true;
        //清空this.projInfo
        this.projInfo={}
      },
      clickEdit() {
        //弹窗显示标志置为true
        this.dialogVisible=true;
        //新增标志置为false
        this.isAdd=false;
        //将选中的数据赋值给this.projInfo
        this.projInfo={...this.tableInstance.table.selection[0]}
      },
      handleDelete () {
        let _that = this;
        _that.$confirm('确定要删除此信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //根据this.selection[0] 中的对象的id进行删除
          deleteContractInfo(_that.selection[0].contractId).then(res =>{
            if(res.data.level=="success"){
              //刷新页面
              _that.initTable();
              //清空选中
              _that.selection.pop()
            }
            _that.$message({
              message:res.data.retMsg,type: res.data.level
            })
          })

        }).catch(() => {
        });

      },
      //新增或修改页面中保存按钮的操作
      handleInsertOrEdit(formName) {
        //表单校验
        let _that=this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (_that.isAdd) {
              //将数据存入数据库
              addContractInfo(_that.projInfo).then(res =>{
                //刷新页面
                _that.initTable();
                //关闭弹窗
                _that.dialogVisible = false;
                this.$message({
                  message:res.data.retMsg,type: res.data.level
                })
              })

            } else {
              //将修改的数据更新到数据库
              editContractInfo(_that.projInfo).then(res =>{
                  // 修改成功后执行
                  if(res.data.level=="success"){
                    //刷新页面
                    _that.initTable();
                    //关闭弹窗
                    _that.dialogVisible = false;
                    //清空选中
                    _that.selection.pop()
                  }
                  this.$message({
                    message:res.data.retMsg,type: res.data.level
                  })
                }
              )
            }
          }else {
            //校验没有通过时的处理
            this.$message({
              message:'请检查您输入的信息！',type: 'warning'
            })
          }
        })
      },
      //新增弹窗关闭事件
      cancelInsertOrUpdate() {
        //清除表单校验
        this.$nextTick(function () {
          this.$refs.insertForm.clearValidate()
        });
        //关闭弹窗
        this.dialogVisible = false
      },
      contractTypeFormatter(row) {
        switch (row.contractType) {
          case '0000':return "新签";
          case '0001':return "续签";
        }
      },
      contractYearFormatter(row) {
        if(row.contractYear!=null){
          return moment(row.contractYear).format('YYYY')+'年'
        }
      },
      signDateFormatter(row) {
        if(row.signDate!=null){
          return moment(row.signDate).format('YYYY-MM-DD')
        }
      },
      serveDateFormatter(row) {
        if(row.serveDate!=null){
          return moment(row.serveDate).format('YYYY-MM-DD')
        }
      },
    }
  }
</script>

<style>
  .step{
    width: 80%;
  }
  .step-row{
    min-width:500px;
    margin-bottom:30px;
    margin-top:12px;
  }
</style>

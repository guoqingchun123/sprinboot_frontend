<template>
  <div class="app-container">
    <bv-table
      ref="table"
      title="项目信息"
      :pagination="true"
      :filter.sync="filter"
      :fetch-api="fetchCustProjDetail"
      @on-mounted="(table) => tableInstance = table"
    >
      <div slot="operates">
        <el-button type="primary" icon="el-icon-upload">数据导出</el-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="项目名称:">
            <el-input v-model="filter.projName" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column prop="projId" label="立项编号" align="center" />
      <el-table-column prop="projName" label="项目名称" align="center" />
      <el-table-column prop="projTime" label="立项日期" align="center" width="95" />
      <el-table-column prop="isManageCity" label="主管城市" align="center" :formatter="isManageCityFormatter" />
      <el-table-column prop="isOtherInterface" label="其他接口" align="center" :formatter="isOtherInterfaceFormatter" />
      <el-table-column prop="salesEmp" label="销售经理" align="center" />
      <!--<el-table-column prop="salesAssistant" label="销售助理" align="center" />-->
      <el-table-column prop="projManagerEmp" label="项目经理" align="center" />
      <el-table-column prop="version" label="版本" align="center" />
      <el-table-column prop="checkTime" label="验收日期" align="center" :formatter="checkDateFormatter" width="95" />
      <el-table-column prop="isHandover" label="是否交接" align="center" :formatter="isHandoverFormatter" />
      <el-table-column prop="handoverEmp" label="交接人员" align="center" />
      <el-table-column prop="handoverDate" label="交接日期" align="center" :formatter="handoverDateFormatter" width="95" />
      <el-table-column prop="serveStartDate" label="服务开始日期" align="center" :formatter="serveStartDateFormatter" width="95" />
      <el-table-column prop="serveEndDate" label="服务截止日期" align="center" :formatter="serveEndDateFormatter" width="95" />
      <!--<el-table-column prop="interfaceDesc" label="接口描述" align="center" />-->
      <!--<el-table-column prop="projDescribe" label="项目描述" align="center" />-->
      <el-table-column prop="projState" label="状态" align="center" :formatter="stateFormatter" />
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template scope="scope">
          <el-button type="text" size="small" @click="editProjDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </bv-table>
    <el-dialog title="查看项目信息" :visible.sync="dialogContractVisible" :close-on-click-modal="false"
               :close-on-press-escape="false"
    >
      <el-form ref="projForm" :model="projForm" :inline="true" label-width="90px" label-position="right"
               :rules="projRules"
      >
        <el-form-item label="立项编号:" prop="projId">
          <el-input v-model="projForm.projId" disabled />
        </el-form-item>
        <el-form-item label="立项日期:" prop="projTime">
          <el-date-picker
            v-model="projForm.projTime"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="项目名称:" prop="projName">
          <el-input v-model="projForm.projName" />
        </el-form-item>
        <el-form-item label="项目领域" prop="projField">
          <el-select v-model="projForm.projField" placeholder="请选择">
            <el-option
              v-for="item in fieldOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目类型" prop="projMode">
          <el-select v-model="projForm.projMode" placeholder="请选择">
            <el-option
              v-for="item in modeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目类别" prop="projType">
          <el-select v-model="projForm.projType" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="年度" prop="projYear">
          <el-date-picker v-model="projForm.projYear" value-format="yyyy" type="year" placeholder="请选择年份" clearable />
        </el-form-item>
        <el-form-item label="业务部门" prop="projDept">
          <el-input v-model="projForm.projDept" clearable />
        </el-form-item>
        <el-form-item label="所属客户" prop="projCust">
          <el-input v-model="projForm.projCust" />
        </el-form-item>
        <el-form-item label="开发人员" prop="developer">
          <el-input v-model="projForm.developer" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" />
        </el-form-item>
        <el-form-item label="销售经理:" prop="salesEmp">
          <el-input v-model="projForm.salesEmp" />
        </el-form-item>
        <el-form-item label="销售助理:" prop="salesAssistant">
          <el-input v-model="projForm.salesAssistant" />
        </el-form-item>
        <el-form-item label="售前负责人" prop="preSalesEmp">
          <el-input v-model="projForm.preSalesEmp" />
        </el-form-item>
        <el-form-item label="项目经理:" prop="projManagerEmp">
          <el-input v-model="projForm.projManagerEmp" />
        </el-form-item>
        <el-form-item label="版本:" prop="version">
          <el-input v-model="projForm.version" />
        </el-form-item>
        <el-form-item label="功能要求" prop="projClaim">
          <el-input v-model="projForm.projClaim" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" />
        </el-form-item>
        <el-form-item label="是否主管城市:" prop="isManageCity" style="white-space: nowrap">
              &nbsp;&nbsp;&nbsp;
          <el-select v-model="projForm.isManageCity" placeholder="请选择">
            <el-option
              v-for="item in isManageCityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="其他接口:" prop="isOtherInterface">
          <el-select v-model="projForm.isOtherInterface" placeholder="请选择">
            <el-option
              v-for="item in isOtherInterfaceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="接口描述:" prop="interfaceDesc">
          <el-input v-model="projForm.interfaceDesc" />
        </el-form-item>
        <el-form-item label="验收日期:" prop="checkTime">
          <el-date-picker
            v-model="projForm.checkTime"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="验收情况说明" prop="checkDetail">
          <el-input v-model="projForm.checkDetail" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" />
        </el-form-item>
        <el-form-item label="是否交接:" prop="isHandover">
          <el-select v-model="projForm.isHandover" placeholder="请选择">
            <el-option
              v-for="item in isHandoverOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目描述:" prop="projDescribe">
          <el-input v-model="projForm.projDescribe" type="textarea" style="width: 526px" :rows="5"
                    placeholder="请输入以下项目相关信息：（1）系统除核心功能外的模块（2）业务流程以及各个部门在业务流程中的职责（3）影响业务流程的大需求（4）历史数据移植方式、计划及移植情况"
          />
        </el-form-item>
        <el-form-item label="交接人员:" prop="handoverEmp">
          <el-input v-model="projForm.handoverEmp" />
        </el-form-item>
        <el-form-item label="交接日期:" prop="handoverDate">
          <el-date-picker
            v-model="projForm.handoverDate"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="服务开始日期:" style="white-space: nowrap" prop="serveStartDate">
              &nbsp;&nbsp;&nbsp;
          <el-date-picker
            v-model="projForm.serveStartDate"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="服务截止日期:" style="white-space: nowrap" prop="serveEndDate">
              &nbsp;&nbsp;&nbsp;
          <el-date-picker
            v-model="projForm.serveEndDate"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="免费服务期" prop="freeTime">
          <el-input v-model="projForm.freeTime" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" />
        </el-form-item>
        <el-form-item label="项目状态" prop="projState">
          <el-select v-model="projForm.projState" placeholder="请选择">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProjConfirm()">保存</el-button>
        <el-button @click="cancelEdit()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { queryCustProjInfo} from '@/api/custom/contractMessage'
  import {insertProjInfo,updateProjInfo,deleteProjInfo} from '@/api/proj/proj'
  import moment from 'moment'

  export default {
    props:{
      corpId:{
        type: String,
        default: ''
      }
    },
    data(){
      return{
        tableInstance:{},
        queryCustProjInfo,
        // 过滤条件
        filter: {},
        //弹窗
        dialogContractVisible: false,
        isAdd:false,
        //弹窗数据Form
        projForm:{
          corpId:'',
          projId:'',
          projName:'',
          projTime:'',
          isManageCity:'',
          isOtherInterface:'',
          salesEmp:'',
          salesAssistant:'',
          projmanagerEmp:'',
          version:'',
          checkTime:'',
          isHandover:'',
          handoverEmp:'',
          handoverDate:'',
          serveStartDate:'',
          serveEndDate:'',
          interfaceDesc:'',
          projDescribe:'',
          projState:''
        },
        //规则控制
        // projRules:{
        //   projName: [
        //     {required: true,message:"请输入项目名称",trigger:'blur'}
        //   ],
        //   isManageCity: [
        //     {required: true,message:"请选择是否主管城市",trigger:'change'}
        //   ],
        //   isOtherInterface: [
        //     {required: true,message:"请选择是否其他接口",trigger:'change'}
        //   ],
        //   salesEmp: [
        //     {required: true,message:"请输入销售经理",trigger:'blur'}
        //   ],
        //   projmanagerEmp: [
        //     {required: true,message:"请输入项目经理",trigger:'blur'}
        //   ],
        //   isHandover: [
        //     {required: true,message:"请选择是否交接" ,trigger:'change'}
        //   ],
        //   projDescribe: [
        //     {required: true,message:"请输入项目描述" ,trigger:'blur'}
        //   ]
        // },
        isManageCityOptions: [{
          value: '01',
          label: '是'
        }, {
          value: '02',
          label: '否'
        }],
        isOtherInterfaceOptions: [{
          value: '01',
          label: '是'
        }, {
          value: '02',
          label: '否'
        }],
        isHandoverOptions: [{
          value: '01',
          label: '是'
        }, {
          value: '02',
          label: '否'
        }],
        stateOptions: [
          {
            value: '0001',
            label: '新建/售前'
          }, {
            value: '0002',
            label: '立项'
          }, {
            value: '0003',
            label: '执行中'
          }, {
            value: '0004',
            label: '结束'
          }, {
            value: '0005',
            label: '取消'
          }, {
            value: '0006',
            label: '服务'
          }, {
            value: '0007',
            label: '服务中'
          }, {
            value: '0008',
            label: '终验完成'
          }, {
            value: '0000',
            label: '验收'
          }],
        //项目类别字典
        modeOptions : [
          {
            value:'0001',
            label:'内部'
          },{
            value:'0002',
            label:'外部'
          },{
            value:'0003',
            label:'产品推广'
          }
        ],//项目类型字典
        typeOptions: [
          {
            value:'0000',
            label:'新启'
          },{
            value:'0001',
            label:'二次开发'
          },{
            value:'0002',
            label:'升级'
          },{
            value:'0004',
            label:'其他'
          }
        ],
        //项目领域字典
        fieldOptions: [
          {
            value:'0001',
            label:'消费金融'
          },{
            value:'0002',
            label:'商业银行'
          },{
            value:'0003',
            label:'住建房管'
          },{
            value:'0004',
            label:'其他'
          }
        ],
      }
    },
    watch:{
      corpId(){
        if(this.corpId!=''){
          this.filter.corpId = this.corpId;
          this.tableInstance.fetchData()
        }
      }
    },
    methods:{
      fetchCustProjDetail(data){
        data.corpId = this.corpId;
        return this.queryCustProjInfo(data)
      },
      //添加项目
      addProjDetail(){
        this.projForm={};
        this.dialogContractVisible = true;
        this.isAdd=true
      },
      editProjDetail(row){
          this.projForm= {...row};
        this.dialogContractVisible = true;
        this.isAdd=false
      },
      deleteProjDetail(row){
        this.$confirm('此操作将删除该项目信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let custProjId = row;
          deleteProjInfo(custProjId).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        })
      },
      addProjConfirm(){
        let _that = this;
        _that.projForm.corpId=_that.corpId;
        _that.$refs.projForm.validate((valid) => {
          if (valid) {
            if(!_that.isAdd){
              updateProjInfo(_that.projForm).then(() => {
                this.dialogContractVisible = false;
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              })
            }else{
              insertProjInfo(_that.projForm).then(res => {
                if(res.data.level=="success"){
                  _that.fetchCustProjDetail();
                }
                _that.$message({
                  message:res.data.retMsg,type: res.data.level
                })
              });
            }
          } else {
            return false;
          }
        });
      },
      cancelEdit(){
        this.dialogContractVisible = false;
        this.$nextTick(function () {
          this.$refs.projForm.clearValidate()
        });
        // this.projForm = {};
      },
      // stopCustContract(row){
      //   this.$confirm('此操作将停用该客户项目信息, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     stopCustContractInfo(row).then(()=>{
      //       this.$message({
      //         message: '停用成功',
      //         type: 'success'
      //       });
      //     })
      //   })
      // },
      isManageCityFormatter(row) {
        switch (row.isManageCity) {
          case '01':return "是";
          case '02':return "否";
        }
      },
      isOtherInterfaceFormatter(row) {
        switch (row.isOtherInterface) {
          case '01':return "是";
          case '02':return "否";
        }
      },
      isHandoverFormatter(row) {
        switch (row.isHandover) {
          case '01':return "是";
          case '02':return "否";
        }
      },
      stateFormatter(row) {
        switch (row.state) {
          case '01':return "正常";
          case '02':return "停用";
        }
      },
      // approvalDateFormatter(row) {
      //   if(row.approvalDate!=null){
      //     return moment(row.approvalDate).format('YYYY-MM-DD')
      //   }
      // },
      checkDateFormatter(row) {
        if(row.checkDate!=null){
          return moment(row.checkDate).format('YYYY-MM-DD')
        }
      },
      handoverDateFormatter(row) {
        if(row.handoverDate!=null){
          return moment(row.handoverDate).format('YYYY-MM-DD')
        }
      },
      serveStartDateFormatter(row) {
        if(row.serveStartDate!=null){
          return moment(row.serveStartDate).format('YYYY-MM-DD')
        }
      },
      serveEndDateFormatter(row) {
        if(row.serveEndDate!=null){
          return moment(row.serveEndDate).format('YYYY-MM-DD')
        }
      },
    }
  }
</script>

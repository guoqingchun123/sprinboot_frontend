<template>
  <div class="app-container">
    <div>
      <bv-table
        ref="table"
        tooltip-effect="dark" stripe
        title="销售合同信息列表"
        :pagination="true"
        :filter.sync="filter"
        :fetch-api="queryContractMessage"
        @on-mounted="(table) => tableInstance = table"
      >
        <div slot="operates">
          <bv-button show="none" view="grant" authority="grant" @click="exportModal=true">导入数据</bv-button>
          <bv-button show="none" view="add" authority="add" @click="clickInsert()">新增</bv-button>
          <bv-button show="one" view="modify" authority="modify" @click="clickEdit()">修改</bv-button>
          <bv-button show="oneOrMore" view="remove" authority="remove" @click="handleDelete()">删除</bv-button>
        </div>
        <div slot="search">
          <bv-col>
            <el-form-item label="合同名称" prop="contractName">
              <el-input v-model="filter.contractName" />
            </el-form-item>
          </bv-col>
        </div>
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" />
        <el-table-column label="销售合同编号" prop="contractId" width="141px" />
        <el-table-column label="合同名称" prop="contractName" />
        <el-table-column label="合同类别" prop="contractTypeName" />
        <el-table-column label="合同领域" prop="contractFieldName" />
        <el-table-column label="财政年度" prop="contractYear" :formatter="contractYearFormatter" />
        <el-table-column label="承办方" prop="corpSponsor" />
        <el-table-column label="业务部门" prop="deptName" width="115px" />
        <el-table-column label="销售负责人" prop="emp1" width="115px" />
        <el-table-column label="售前负责人" prop="emp2" width="115px" />
        <el-table-column label="所属客户" prop="corpName" />
        <el-table-column label="签约日期" prop="signDate" :formatter="signDateFormatter" width="100" />
        <el-table-column label="服务到期日" prop="serveDate" :formatter="serveDateFormatter" width="100" />
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="clickShowDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </bv-table>
    </div>
    <!-- 添加/修改/查看项目弹窗 -->
    <bv-dialog title="维护销售合同信息" :visible.sync="dialogVisible" top="5vh" @close="cancelInsertOrUpdate">
      <bv-scrollbar>
        <el-form ref="insertForm" :model="projInfo" status-icon :rules="rules" label-width="100px" label-position="right" style="width: 90%;">
          <el-row :gutter="$CONST.row.gutter">
            <el-form-item v-show="!isAdd" label="销售合同编号" prop="contractId">
              <el-input v-model="projInfo.contractId" disabled />
            </el-form-item>
            <el-form-item label="合同名称" prop="contractName">
              <el-input v-model="projInfo.contractName" />
            </el-form-item>
            <el-row>
              <el-col v-bind="$CONST.col.layout2">
                <el-form-item label="合同类别" prop="contractType">
                  <el-select v-model="projInfo.contractType" placeholder="请选择">
                    <el-option
                      v-for="item in contractTypeOptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout2">
                <el-form-item label="合同领域" prop="contractField">
                  <el-select v-model="projInfo.contractField" placeholder="请选择">
                    <el-option
                      v-for="item in contractFieldOptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col v-bind="$CONST.col.layout2">
                <el-form-item label="财政年度" prop="contractYear">
                  <el-date-picker
                    v-model="projInfo.contractYear"
                    type="year"
                    placeholder="请选择"
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout2">
                <el-form-item label="业务部门" prop="businessDept">
                  <el-select v-model="projInfo.businessDept" placeholder="请选择">
                    <el-option
                      v-for="item in deptInfo"
                      :key="item.deptId"
                      :label="item.deptName"
                      :value="item.deptId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col v-bind="$CONST.col.layout2">
                <el-form-item label="销售负责人" prop="salesEmp">
                  <el-select v-model="projInfo.salesEmp" placeholder="请选择">
                    <el-option
                      v-for="item in empInfo"
                      :key="item.empId"
                      :label="item.empName"
                      :value="item.empId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout2">
                <el-form-item label="售前负责人" prop="preSalesEmp">
                  <el-select v-model="projInfo.preSalesEmp" placeholder="请选择">
                    <el-option
                      v-for="item in preEmpInfo"
                      :key="item.empId"
                      :label="item.empName"
                      :value="item.empId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="所属客户" prop="corpId">
              <el-select v-model="projInfo.corpId" placeholder="请选择">
                <el-option
                  v-for="item in corpInfo"
                  :key="item.corpId"
                  :label="item.corpName"
                  :value="item.corpId"
                />
              </el-select>
            </el-form-item>
            <el-row>
              <el-col v-bind="$CONST.col.layout2">
                <el-form-item label="签约日期" prop="signDate">
                  <el-date-picker
                    v-model="projInfo.signDate"
                    type="date"
                    placeholder="请选择"
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout2">
                <el-form-item label="服务到期日" prop="serveDate">
                  <el-date-picker
                    v-model="projInfo.serveDate"
                    type="date"
                    placeholder="请选择"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="承办方" prop="corpSponsor">
              <el-input v-model="projInfo.corpSponsor" />
            </el-form-item>
          </el-row>
        </el-form>
      </bv-scrollbar>
      <div slot="footer">
        <bv-button view="save" type="primary" @click="handleInsertOrEdit('insertForm')">保存</bv-button>
        <bv-button view="cancel" @click="cancelInsertOrUpdate">取 消</bv-button>
      </div>
    </bv-dialog>

    <bv-dialog title="销售合同数据导入" :visible.sync="exportModal" top="5vh">
      <el-upload
        ref="uploadFile"
        class="upload-demo"
        drag
        :action="upload_url"
        :auto-upload="false"
        :on-change="fileChange"
        :file-list="fileList"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <bv-button size="small" type="success" @click="submitContractUpload">上传并导入</bv-button>
        <bv-button @click="exportModal = false">取 消</bv-button>
      </span>
    </bv-dialog>
  </div>
</template>

<script>
  import {queryContractMessage,addContractInfo,editContractInfo,deleteContractInfo,
    importContractInfoFunction} from '../../api/custom/contractMessage'
  import { importEmpInfoExcel } from '@/api/employee/empInfo'
  import moment from 'moment'
  import {fetchDepts} from '@/api/system/depts'
  import {fetchCorps,fetchEmps} from '../../api/custom/contractMessage'

  const maxFileSize = 20;

  export default {
    name:'ContractMessage',
    data() {
      return {
        //选中的数据
        selection: [],
        //复选框最后选中的值
        row: {},
        filter:{},
        //判断是否是新增，false是修改
        isAdd: false,
        // 上传文件列表
        fileList: [],
        //新增/修改/查看详情时存储数据的容器
        projInfo: {
          salesEmp:[],
          preSalesEmp:[]
        },
        queryContractMessage,
        tableInstance: {},
        //新增弹窗是否显示
        dialogVisible: false,
        //导入数据弹窗是否显示
        exportModal: false,
        //弹框表单校验规则
        rules: {
          contractType: [
            {required: true, message:'合同类别不能为空', trigger: 'blur'},
          ],
          contractName: [
            {required: true, message: '合同名称不能为空', trigger: 'blur'},
          ],
        },
        //项目类型字典
        contractTypeOptions: [],
        contractFieldOptions:[],
        deptInfo:[],
        corpInfo:[],
        empInfo:[],
        preEmpInfo:[],
        upload_url: 'url',
        // salesEmpOptions:[]
      }
    },
    computed:{
      // showInput(){
      //   return !this.isAdd||this.projInfo.emp1!==''
      // },
      // showCascader(){
      //   return this.isAdd||this.projInfo.emp1 ===''
      // }
    },
    created() {
      this.getDepts();
      this.getCorps();
      this.getEmps();
      this.$store.dispatch('app/fetchDicts', 'contractType').then(data => {
        this.contractTypeOptions = data
      });
      this.$store.dispatch('app/fetchDicts', 'contractField').then(data => {
        this.contractFieldOptions = data
      })
    },
    methods: {
      getEmps() {
        //查询负责人
        fetchEmps().then(response=>{
          this.empInfo=response.data;
          this.preEmpInfo=response.data;
        })
      },
      //查询部门
      getDepts:function(){
        fetchDepts().then(response=>{
          this.deptInfo=response.data;
        })
      },
      //查询客户
      getCorps:function(){
        fetchCorps().then(response=>{
          this.corpInfo=response.data;
        })
      },
      clickInsert() {
        //弹窗显示标志置为true
        this.dialogVisible=true;
        //新增标志置为true
        this.isAdd=true;
        //清空this.projInfo
        this.projInfo={};
        this.$nextTick(function () {
          this.$refs.insertForm.clearValidate()
        });
      },
      clickEdit() {
        //弹窗显示标志置为true
        this.dialogVisible=true;
        //新增标志置为false
        this.isAdd=false;
        //将选中的数据赋值给this.projInfo
        this.projInfo={...this.tableInstance.table.selection[0]};
        this.$nextTick(function () {
          this.$refs.insertForm.clearValidate()
        });
      },

      //新增或修改页面中保存按钮的操作
      handleInsertOrEdit(formName) {
        //表单校验
        let _that=this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            for(let i in this.projInfo.preSalesEmp){
              this.projInfo.preSalesEmp+=this.projInfo.preSalesEmp[i]
            }
            if (_that.isAdd) {
              //将数据存入数据库
              addContractInfo(_that.projInfo).then(res =>{
                //刷新页面
                _that.tableInstance.fetchData();
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
                    _that.tableInstance.fetchData();
                    //关闭弹窗
                    _that.dialogVisible = false;
                  }
                  this.$message({
                    message:res.data.retMsg,type: res.data.level
                  })
                }
              )
            }
          }else {
            //校验没有通过时的处理
            return false
          }
        })
      },
      handleDelete () {
        let _that = this;
        _that.$confirm('确定要删除此信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //根据this.selection[0] 中的对象的id进行删除
          deleteContractInfo(_that.tableInstance.table.selection.map(item => item.contractId).join()).then(res =>{
            if(res.data.level=="success"){
              //刷新页面
              _that.tableInstance.fetchData();
            }
            _that.$message({
              message:res.data.retMsg,type: res.data.level
            })
          })

        }).catch(() => {
        });

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
      clickShowDetail(row) {
        this.$router.push({
          path: '/custom/contractMessageDetail',
          name: 'ContractMessageDetail',
          params: {
            contractId: row.contractId,
            contractName: row.contractName
          }
        })
      },
      fileChange(file, fileList) {
        let isLt = file.size / 1024 / 1024 < 20;
        if (!isLt) {
          this.$message.error('上传文件大小不能超过' + maxFileSize + 'MB!');
          this.fileList = fileList.slice(1, 1);
          return;
        }
        this.fileList = fileList.slice(-1);
      },
      //TODO:上传文件
      submitContractUpload(){
        let path = '\\销售合同管理';
        let isHaveFiles = false;
        let file = [];
        let fileSource = [];
        if (this.$refs.uploadFile.uploadFiles.length > 0) {
          isHaveFiles = true;
          file.push(this.$refs.uploadFile.uploadFiles[0].raw);
          fileSource.push("销售合同文件");
        }

        // 没有上传文件时
        if (!isHaveFiles) {
          this.$message({
            type: 'warning',
            message: '请至少上传1个文件!'
          });
          return;
        }
        //传递当前用户id  ==  manageUser
        let data = {
          fileSource: fileSource,
          manageUser: 'admin',
          path: path
        };
        importEmpInfoExcel(file, data).then(ret => {
          //上传文件成功  返回文件id  插入数据
          if (ret.data.retCode === '0000') {
            //获取文件id  上传文件中的数据
            let data = {};
            data.fileId = ret.data.fileId;
            importContractInfoFunction(data).then(res => {
              // 隐藏版本弹窗
              this.exportModal = false;
              this.$message({
                type: res.data.level,
                message: res.data.retMsg
              });
              //清除上传的文件
              this.$refs.uploadFile.clearFiles()
            })
          }
        }).catch(() => {
          console.log('上传失败');
          this.$refs.uploadFile.clearFiles()
        });
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
      //根据部门获取员工
      // getEmpByDept(){
      //   fetchEmpByDept().then( res => {
      //     //设置一级级联下拉框
      //     for(let i = 0; i < res.data.dept.length; i++){
      //       let obj = {};
      //       obj.value = res.data.dept[i].deptId;
      //       obj.label = res.data.dept[i].deptName;
      //       obj.children = [];
      //       //设置二级级联下拉框
      //       for(let j = 0; j < res.data.emp.length; j++){
      //         if(obj.value == res.data.emp[j].deptId ){
      //           let obj2 = {};
      //           obj2.value = res.data.emp[j].empId;
      //           obj2.label = res.data.emp[j].remark;
      //           obj.children.push(obj2);
      //         }else{
      //           if(!obj.children){
      //             obj.children = [];
      //           }
      //         }
      //       }
      //       this.salesEmpOptions.push(obj);
      //     }
      //
      //
      //
      //   });
      //
      // },
    }
  }
</script>

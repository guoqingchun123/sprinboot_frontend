<template>
  <div class="app-container">
    <bv-table ref="table" title="员工差旅明细" :pagination="true" :filter.sync="filter" :fetch-api="fetchTravelDatas" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="add" @click="insertTravelDetail">增加</bv-button>
        <bv-button show="one" view="modify" @click="modifyTravelDetail">修改</bv-button>
        <bv-button show="oneOrMore" view="remove" @click="deleteTravelDetail">删除</bv-button>
        <bv-button type="primary" @click="insertTravelData">导入数据</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="出差月份">
            <el-input v-model="filter.travelMonth" />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="出差人:">
            <el-input v-model="filter.empName" clearable />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" type="index" />
      <el-table-column label="出差月份" sortable="travelMonth" prop="travelMonth" align="center" />
      <el-table-column label="员工代码" sortable="empId" prop="empId" align="center" />
      <el-table-column label="出差人" prop="empName" align="center" />
      <el-table-column label="岗位级别" prop="postId" align="center" />
      <el-table-column label="部门" prop="deptId" align="center" />
      <el-table-column label="起始日期" prop="startDate" align="center" />
      <el-table-column label="结束日期" prop="endDate" align="center" />
      <el-table-column label="出差地点" prop="travelPlace" align="center" />
      <el-table-column label="项目名称" prop="projIdName" align="center" />
      <el-table-column label="费用类别" prop="feeType" align="center" />
      <el-table-column label="总天数" prop="days" align="center" />
      <el-table-column label="补助金额" prop="travelAmount" align="center" />
      <el-table-column label="补助金额合计" prop="totalAmount" align="center" />
      <el-table-column label="实际报销期间" prop="payProid" align="center" />
      <el-table-column label="相关费用单据归属期" prop="vstingPriod" align="center" />
      <el-table-column label="是否已执行" prop="travelFlag" align="center" />
    </bv-table>
    <el-dialog title="添加差旅明细" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" top="5vh" width="60%">
      <bv-scrollbar>
        <!--<bv-form ref="insertTravelForm" v-model="insertTravelForm" :rules="travelRules">-->
        <el-form ref="insertTravelForm" :model="insertTravelForm" status-icon :rules="travelRules" label-width="120px" label-position="right" class="dialog-form">
          <el-row :gutter="$CONST.row.gutter">
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="出差人:">
                <el-select v-model="insertTravelForm.empId">
                  <el-option v-for="(item,index) in empNames" :key="index" :label="item.empName" :value="item.empId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="部门名称:" prop="deptId">
                <el-select v-model="insertTravelForm.deptId" @change="getEmpNames">
                  <el-option v-for="(item) in sysDept" :key="item.deptId" :label="item.deptName" :value="item.deptId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="出差月份:" prop="travelMonth">
                <el-date-picker v-model="insertTravelForm.travelMonth" type="month" format="yyyy-MM" value-format="yyyy-MM" />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="起始日期:" prop="startDate">
                <el-date-picker v-model="insertTravelForm.startDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="结束日期:" prop="endDate">
                <el-date-picker v-model="insertTravelForm.endDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="出差地点:" prop="travelPlace">
                <el-input v-model="insertTravelForm.travelPlace" />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="总天数:" prop="days">
                <el-input v-model="insertTravelForm.days" />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="补助金额:" prop="travelAmount">
                <el-input v-model="insertTravelForm.travelAmount" />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="补助金额合计:">
                <el-input v-model="totalAmount" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="项目名称:">
                <el-select v-model="insertTravelForm.projIdName" clearable class="proj-width-change">
                  <el-option label="群众" value="13" />
                  <el-option label="中共党员" value="01" />
                  <el-option label="中共预备党员" value="02" />
                  <el-option label="共青团员" value="03" />
                  <el-option label="其他" value="04" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="费用类别:" prop="feeType">
                <el-select v-model="insertTravelForm.feeType" clearable>
                  <el-option label="差旅补贴" value="01" />
                  <el-option label="驻地补贴" value="02" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="实际报销期间:" prop="payProid">
                <el-date-picker v-model="insertTravelForm.payProid" type="month" format="yyyy-MM" value-format="yyyy-MM" />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="相关费用单据归属期:" style="white-space: nowrap;">
                <el-date-picker v-model="insertTravelForm.vstingPriod" type="month" format="yyyy-MM" value-format="yyyy-MM" />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="是否已执行:" prop="travelFlag">
                <el-select v-model="insertTravelForm.travelFlag" clearable>
                  <el-option label="已执行" value="1" />
                  <el-option label="未执行" value="2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </bv-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmSave">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="员工差旅明细导入" :visible.sync="exportTravelModal" :close-on-click-modal="false" :close-on-press-escape="false" width="30%">
      <el-upload
        ref="uploadFile"
        class="upload-demo"
        drag
        :action="upload_url"
        :auto-upload="false"
        :on-change="demo2Change"
        :file-list="fileList"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <bv-button size="small" type="success" @click="submitUpload">上传并导入</bv-button>
        <bv-button @click="exportTravelModal = false">取 消</bv-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchTravelDatas,importTravel,modifyTravel,deleteTravel } from '@/api/employee/travels'
  import { fetchDepts,fetchEmpByDeptId } from '@/api/system/depts'

  const maxFileSize = 20;

  export default {
    name: 'ListEmpTravel',
    data() {
      return {
        //精确查询内容
        filter:{
          travelMonth: '',
          empName: ''
        },
        //新增弹窗是否显示
        dialogVisible: false,
        //导入数据弹窗是否显示
        exportTravelModal: false,
        //选择部门  岗位代码  区域
        sysDept: [],
        //选择部门之后可以选择部门下的员工
        empNames: [],
        //弹窗显示内容
        insertTravelForm:{
          empId: '',
          deptId: '',
          travelMonth: '',
          startDate: '',
          endDate: '',
          travelPlace: '',
          days: '',
          travelAmount: '',
          projIdName: '',
          feeType: '',
          payProid: '',
          vstingPriod: '',
          travelFlag: ''
        },
        //弹窗校验规则
        travelRules:{
          deptId:[
            {required:true,trigger: 'blur'}
          ],
          travelMonth:[
            {required:true,trigger: 'blur'}
          ],
          startDate:[
            {required:true,trigger: 'blur'}
          ],
          endDate:[
            {required:true,trigger: 'blur'}
          ],
          travelPlace:[
            {required:true,trigger: 'blur'}
          ],
          days:[
            {required:true,trigger: 'blur'}
          ],
          travelAmount:[
            {required:true,trigger: 'blur'}
          ],
          feeType:[
            {required:true,trigger: 'blur'}
          ],
          payProid:[
            {required:true,trigger: 'blur'}
          ],
          travelFlag:[
            {required:true,trigger: 'blur'}
          ]
        },
        //上传的文件列表
        fileList: [],
        upload_url: 'url',
        fetchTravelDatas,
        tableInstance: {}
      }
    },
    computed:{
      //补助金额合计
      totalAmount() {
        if(this.insertTravelForm.days && this.insertTravelForm.travelAmount){
          return this.insertTravelForm.days * this.insertTravelForm.travelAmount
        }else{
          return ''
        }
      }
    },
    created(){
      //获取其他初始化数据
      this.getDepts()
    },
    methods:{
      getDepts:function(){
        fetchDepts().then(response=>{
          this.sysDept = response.data;
        })
      },
      getEmpNames:function(){
        var data = {}
        data.deptId = this.insertTravelForm.deptId
        fetchEmpByDeptId(data).then(res => {
          this.empNames = res.data
        })
      },
      //增加数据
      insertTravelDetail() {
        this.insertTravelForm = {}
        this.dialogVisible = true
      },
      modifyTravelDetail(){
        this.insertTravelForm = {...this.tableInstance.table.selection[0]}
        this.dialogVisible = true
      },
      //删除数据
      deleteTravelDetail(){
        let _that = this;
        this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          debugger
          // 根据this.selection 中的对象的id进行删除
          let travelGuids= "";
          for(let i = 0; i < _that.tableInstance.table.selection.length; i++){
            if (i == _that.tableInstance.table.selection.length-1) {
              travelGuids = travelGuids + _that.tableInstance.table.selection[i].travelGuid;
            } else {
              travelGuids = travelGuids + _that.tableInstance.table.selection[i].travelGuid +",";
            }

          }

          deleteTravel(travelGuids).then(res =>{
            if(res.data.level=="success"){
              //刷新页面
              _that.tableInstance.fetchData();
              //清空选中
              _that.tableInstance.table.selection.pop()
            }
            _that.$message({
              message:res.data.retMsg,
              type: res.data.level
            })
          });

        }).catch(() => {
        });
      },
      insertTravelData() {
        this.exportTravelModal = true
      },
      //弹窗关闭的方法
      insertModalClose:function () {
        this.$refs.insertTravelForm.resetFields();
      },
      //弹窗保存方法
      confirmSave(){
        this.$refs.insertTravelForm.validate(valid => {
          if (valid) {
            modifyTravel(this.insertTravelForm).then(res => {
              this.$message({
                message: res.data.retMsg,
                type:  res.data.level
              })
              if(res.data.retCode == '00'){
                this.afterModify();
              }
            })
          }
          else{
            return false
          }
        })
      },
      afterModify() {
        this.tableInstance.fetchData();
        this.insertTravelForm = {};
        this.$refs.insertTravelForm.clearValidate();
        this.dialogVisible = false;
        this.$message({
          message: "保存成功",
          type: "success"
        });
      },
      demo2Change(file, fileList) {
        let isLt = file.size / 1024 / 1024 < 20;
        if (!isLt) {
          this.$message.error('上传文件大小不能超过' + maxFileSize + 'MB!');
          this.fileList = fileList.slice(1, 1);
          return;
        }
        console.log(file)
        this.fileList = fileList.slice(-1);
      },
      submitUpload(){
        let path = '\\travel';
        let isHaveFiles = false;
        let file = [];
        let fileSource = [];
        if (this.$refs.uploadFile.uploadFiles.length > 0) {
          isHaveFiles = true;
          file.push(this.$refs.uploadFile.uploadFiles[0].raw);
          fileSource.push("差旅数据文件");
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

        importTravel(file, data).then(ret => {


          this.$message({
            type: ret.data.level,
            message: ret.data.retMsg
          });

          if (ret.data.retCode === '0000') {
            // 隐藏版本弹窗
            this.exportTravelModal = false;
          }
          //清除上传的文件
          this.$refs.uploadFile.clearFiles()
        }).catch(() => {
          console.log('上传失败')
          this.$refs.uploadFile.clearFiles()
        });
      }
    }
  }
</script>

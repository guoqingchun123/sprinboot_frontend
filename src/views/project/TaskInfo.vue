<template>
  <div class="app-container">
    <bv-table ref="table" title="用户信息列表" :pagination="true" :filter.sync="filter" :fetch-api="fetchTaskInfo1_" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="add" @click="clickInsert">增加</bv-button>
        <bv-button v-if="oneShow&&executing" view="modify" @click="update('0002')">更新为执行中</bv-button>
        <bv-button v-if="oneShow&&stoped" view="modify" @click="update('0000')">更新为已结束</bv-button>
        <bv-button show="one" view="modify" @click="clickEdit">修改</bv-button>
        <el-button show="one" view="remove" @click="handleDelete">删除</el-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="任务名称">
            <el-input v-model="filter.taskName" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" type="index" />
      <el-table-column label="任务名称" prop="taskName" />
      <el-table-column label="任务状态" prop="taskState" :formatter="taskStateFormatter" />
      <el-table-column label="主要负责人" prop="taskEmp" />
      <el-table-column label="其他参与人员" prop="assistantEmps" />
      <el-table-column label="计划开始日期" prop="planStartDate" />
      <el-table-column label="计划结束日期" prop="planEndDate" />
      <el-table-column label="计划工作量（天）" prop="planDays" />
      <el-table-column label="实际开始日期" prop="actualStartDate" />
      <el-table-column label="实际结束日期" prop="actualEndDate" />
      <el-table-column label="实际工作量（天）" prop="actualDays" />
    </bv-table>
  </div>
</template>

<script>
  import {fetchTaskInfo,insertProjTaskInfo,updateProjTaskInfo,deleteProjTaskInfo} from '../../api/proj/proj'

  export default {
    props:{
      projId: {
        type: String,
        default: ''
      }
    },
    data(){
      return {
        // 过滤条件
        filter: {
          taskName: ''
        },
        //选中的数据
        selection: [],
        //判断是否是新增，false是修改
        isAdd: false,
        //新增/修改/查看详情时存储数据的容器
        taskInfo: {
          taskId:'',
          projId:'',
          taskName:'',
          taskState:'',
          taskDescribe:'',
          taskOrder:'',
          taskEmp:'',
          assistantEmps:'',
          planStartDate:'',
          planEndDate:'',
          planDays:0,
          actualStartDate:'',
          actualEndDate:'',
          actualDays:0,
          manageTime:'',
          manageUser:'',
          remark:''
        },
        //新增弹窗是否显示
        dialogVisible: false,
        //导入数据弹窗是否显示
        exportModal: false,
        //弹框表单校验规则
        rules: {
          assistantEmps: [
            { min: 0, max: 200, message: '长度必须小于200个字', trigger: 'blur' }
          ],
          taskName: [
            {required: true, message: '请输入任务名', trigger: 'blur'},
            { min: 1, max: 150, message: '长度必须小于150个字', trigger: 'blur' }
          ],
          planDays: [
            {  type: 'number', message: '计划工作量需为数字值'}
          ],
          actualDays: [
            {  type: 'number', message: '实际工作量需为数字值'}
          ],
          taskDescribe:[
            { min: 0, max: 300, message: '长度必须小于300个字', trigger: 'blur' }
          ]
        },
        test1:'',
        // 当前排序
        tableInstance: {},
        fetchTaskInfo
      }
    },
    computed: {
      //复选框未选中显示的按钮
      noShow() {
        return this.selection.length == 0
      },
      //复选框选中一个显示的按钮
      oneShow() {
        return this.selection.length == 1
      },
      //复选框选中一个或多个显示的按钮
      oneOrMoreShow() {
        return !(this.selection.length == 0)
      },
      //选中的数据的状态为0001即新建时显示更新为执行中按钮
      executing() {
        return this.selection[0].taskState === '0001'
      },
      //选中的数据的状态为0002即执行中时显示更新为已结束按钮
      stoped() {
        return this.selection[0].taskState === '0002'
      }
    },
    watch:{
      projId(){
        if(this.projId != ''){
          this.filter.projId = this.projId;
          this.tableInstance.fetchData()
        }
      }
    },

    methods: {
      fetchTaskInfo1_(data){
        data.projId = this.projId
        return this.fetchTaskInfo(data)
      },
      clickInsert() {
        //弹窗显示标志置为true
        this.dialogVisible=true
        //新增标志置为true
        this.isAdd=true
        //清空this.taskInfo
        this.taskInfo={}
        //并给taskInfo.projId赋值
        this.taskInfo.projId= this.projId
        this.taskInfo.taskState='0001'
      },
      clickEdit() {
        //弹窗显示标志置为true
        this.dialogVisible=true
        //新增标志置为false
        this.isAdd=false
        //将选中的数据赋值给this.taskInfo
        this.taskInfo=this.row
      },
      handleDelete () {
        let _that = this
        _that.$confirm('确定要删除此信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //删除该条数据
          deleteProjTaskInfo(_that.tableInstance.table.selection[0].taskId).then(res =>{
            if("success"==res.data.level){
              this.refreshTable()
            }
            _that.$message({
              message:res.data.retMsg,type: res.data.level
            })
          })

        }).catch(() => {
        });
        //根据this.row 中的对象的id进行删除
      },
      //新增或修改页面中保存按钮的操作
      handleInsertOrEdit(formName) {
        //表单校验
        let _that=this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (_that.isAdd) {
              //将数据存入数据库
              insertProjTaskInfo(_that.taskInfo).then(res =>{
                if('success'==res.data.level){
                  //关闭弹窗
                  _that.dialogVisible = false
                  this.refreshTable()
                }
                this.$message({
                  message:res.data.retMsg,type: res.data.level
                })
              })
            } else {
              //将修改的数据更新到数据库
              updateProjTaskInfo(_that.taskInfo).then(res =>{
                if('success'==res.data.level){
                  //关闭弹窗
                  _that.dialogVisible = false
                  this.refreshTable()
                }
                this.$message({
                  message:res.data.retMsg,type: res.data.level
                })
              })
            }
          }else {
            //校验没有通过时的处理
            this.$message({
              message:'请检查数据的合法性！',type: 'warning'
            })
          }
        })
      },
      //表格操作列查看详情点击事件
      clickShowDetail(row) {
        //置弹窗显示标志位true
        this.dialogVisible = true
        //置新增标志为false
        this.isAdd = false
        //清空form表单数据校验
        this.$nextTick(function () {
          this.$refs.insertForm.clearValidate()
        })
        //给taskInfo赋值为当前点击行的数据
        this.taskInfo=row

      },
      //新增弹窗关闭事件
      cancelInsertOrUpdate() {
        //清除表单校验
        this.$nextTick(function () {
          this.$refs.insertForm.clearValidate()
        })
        //关闭弹窗
        this.dialogVisible = false
      },
      exportModalShow() {
        this.exportModal = true
      },
      //任务状态字典
      taskStateFormatter(row) {
        switch (row.taskState) {
          case '0000':return "已结束"
          case '0001':return "新建"
          case '0002':return "执行中"
        }
      },
      //更新任务的状态
      update(state){
        let _that = this
        _that.tableInstance.table.selection[0].taskState=state
        //然后将数据更新到数据库
        updateProjTaskInfo(_that.tableInstance.table.selection[0]).then(res =>{
          if('success'==res.data.level){
            this.refreshTable()
          }
          this.$message({
            message:res.data.retMsg,type: res.data.level
          })
        })
      },
      //刷新table
      refreshTable(){
        this.tableInstance.table.selection.pop()
        this.tableInstance.fetchData()
      }
    },
  }
</script>

<style scoped>
  @import "../../styles/simpleTable.scss";
</style>

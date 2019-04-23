<template>
  <div class="app-container">
    <bv-table-header title="待审批项目列表">
      <el-button v-if="oneShow&&approvalBtnShow" type="primary" @click="approval">审批</el-button>
      <el-button v-if="oneShow&&distributBtnShow" type="primary" @click="distribute">项目分配</el-button>
      <el-button v-if="oneShow&&signBtnShow" type="primary" @click="sign">签收</el-button>
    </bv-table-header>
    <bv-table-search
      :is-fuzzy.sync="isFuzzy"
      :fuzzy.sync="fuzzy"
      :filter.sync="filter"
      @on-fuzzy-start="initTable"
      @on-filter-start="initTable"
      @on-filter-reset="initTable"
    >
      <bv-col>
        <el-form-item label="项目名称" prop="projName">
          <el-input v-model="filter.projName" />
        </el-form-item>
      </bv-col>
    </bv-table-search>
    <el-table
      ref="table" v-loading="loading" :data="items"
      tooltip-effect="dark" stripe
      @select="checkboxSelect"
      @sort="onSort"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        type="index"
        fixed
      />
      <el-table-column
        fixed
        sortable
        label="项目编号"
      >
        <template slot-scope="scope"><img src="../../assets/wenjianjia.png" style="width:20px;height:20px; margin-right:6px">{{ scope.row.projId }}</template>
      </el-table-column>
      <el-table-column
        label="项目名称"
        fixed
        sortable
        prop="projName"
      />
      <el-table-column
        label="年度"
        sortable
        prop="projYear"
      />
      <el-table-column
        label="立项日期"
        sortable
        :formatter="dateFormatter"
        prop="projTime"
      />
      <el-table-column
        label="项目状态"
        sortable
        prop="projState"
        :formatter="stateFormatter"
      />
      <el-table-column
        label="领域"
        sortable
        prop="projField"
        :formatter="fieldFormatter"
      />
      <el-table-column
        label="业务部门"
        sortable
        prop="projDept"
      />
      <el-table-column
        label="承办方"
        sortable
        prop="projSponsor"
      />
    </el-table>
    <bv-pagination
      :total="total" :current-page.sync="currentPage" :page-size="limit"
      @current-change="handlePageChange"
    />
    <!-- 审批项目弹窗 -->
    <div class="dialog">
      <el-dialog :title="isaApprove?'项目审批':'项目分配'" width="50%" top="5vh" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" @close="cancelInsertOrUpdate">
        <bv-scrollbar>
          <el-form ref="insertForm" :model="approveInfo" status-icon :rules="rules" label-width="100px" label-position="right" style="width: 95%;">
            <el-row v-if="isaApprove" :gutter="$CONST.row.gutter">
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="技术负责人" prop="technologyLeader">
                  <el-input v-model="approveInfo.technologyLeader" />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout3">
                <el-form-item label="审批意见" prop="approvalOpinion">
                  <el-input v-model="approveInfo.approvalOpinion" type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入审批意见" clearable
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout3">
                <el-form-item label="备注" prop="remark1">
                  <el-input v-model="approveInfo.remark1" type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注" clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="!isaApprove" :gutter="$CONST.row.gutter">
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="项目经理" prop="projManager">
                  <el-input v-model="approveInfo.projManager" clearable />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout3">
                <el-form-item label="备注" prop="remark2">
                  <el-input v-model="approveInfo.remark2" clearable />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </bv-scrollbar>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="isaApprove" type="primary" @click="agreeOrreject('insertForm',true)">同意</el-button>
          <el-button v-if="isaApprove" @click="agreeOrreject('insertForm',false)">拒绝</el-button>
          <el-button v-if="!isaApprove" @click="save('insertForm')">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {fetchBasicProjInfo,approvalAgree,approvalRefuse,distribute,endApproval} from '../../api/proj/proj'
  import { defaults as utils } from '@bestvike/utils'
  export default {
    data() {
      return {
        loading: false,
        //总数据
        items: null,
        //查询类型切换（默认初始显示模糊查询）
        isFuzzy: true,
        // 模糊查询条件
        fuzzy: null,
        // 过滤条件
        filter: {},
        // 当前排序
        sort: null,
        //选中的数据
        selection: [],
        //复选框最后选中的值
        row: {},
        //判断是否是第一步（总经理）审批，false为技术总监分配项目
        isaApprove: false,
        //审批时存储数据的容器
        approveInfo: {},
        //弹窗是否显示
        dialogVisible: false,
        //每页的大小
        limit: 10,
        //当前页码
        currentPage: 1,
        //符合条件的数据总数
        total: 0,
        //弹框表单校验规则
        rules: {
          approveOpinion: [
            {required: true, message:'请填写审批意见', trigger: 'blur'},
            {min: 1, max: 1000, message: '长度必须小于1000个字', trigger: 'blur' }
          ],
          technologyLeader: [
            {required: true, message: '请指定技术负责人', trigger: 'blur'}
          ],
          remark1: [
            {min: 0, max: 200, message: '长度必须小于200个字', trigger: 'blur' }
          ],
          remark2: [
            {min: 0, max: 200, message: '长度必须小于200个字', trigger: 'blur' }
          ],
          projManager: [
            {required: true, message: '请指定项目经理', trigger: 'blur'}
      ]
        }
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
      approvalBtnShow(){
        return '0001'==this.selection[0].projState
      },
      distributBtnShow(){
        return '0002'==this.selection[0].projState
      },
      signBtnShow(){
        return '0003'==this.selection[0].projState
      }
    },
    created() {
      this.initTable()
    },
    methods: {
      onSort(sort) {
        this.sort = utils.transTableSort(sort)
        this.initTable()
      },
      initTable() {
        let _that = this
        _that.loading = true
        let data = {}
        if (_that.isFuzzy) {
          if (_that.fuzzy) {
            data.fuzzy = _that.fuzzy
          }
        } else {
          for (let item in _that.filter) {
            data[item] = _that.filter[item]
          }
        }
        if (_that.sort) {
          data.sort = _that.sort
        }
        // 分页信息
        data.currentPage = _that.currentPage
        data.limit = _that.limit
        fetchBasicProjInfo(data).then(response => {
          _that.total = response.data.total
          _that.items = response.data.list
          setTimeout(() => {
            _that.loading = false
          }, 500);
        }).catch(() => {
          setTimeout(() => {
            _that.loading = false
          }, 500);
        })
      },
      approval() {
        //弹窗显示标志置为true
        this.dialogVisible=true
        //第一步（总经理）审批标志置为true
        this.isaApprove=true
        //清空this.approveInfo
        this.approveInfo={}
        //将选中的数据的projId赋值给approveInfo中的projId
        this.approveInfo.projId = this.selection[0].projId

      },
      distribute() {
        //弹窗显示标志置为true
        this.dialogVisible=true
        //第一步（总经理）审批标志置为false
        this.isaApprove=false
        //清空this.approveInfo
        this.approveInfo={}
        //将选中的数据的projId赋值给approveInfo中的projId
        this.approveInfo.projId = this.selection[0].projId
      },
      sign () {
        let _that = this
        //清空this.approveInfo
        _that.approveInfo={}
        //将选中的数据的projId赋值给approveInfo中的projId
        _that.approveInfo.projId = _that.selection[0].projId
        //操作数据库
        endApproval(_that.approveInfo).then(res =>{
          if('success'==res.data.level){
            //成功后刷新数据
            _that.initTable()
          }
          _that.$message({
            message: res.data.retMsg,
            type: res.data.level
          })
        })

      },
      //审批同意和拒绝按钮的操作
      agreeOrreject(formName,bool) {
        //表单校验
        let _that=this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //同意时的处理
            if (bool) {
              //将数据存入数据库
              approvalAgree(_that.approveInfo).then(res =>{
                if('success'==res.data.level){
                  //关闭弹窗
                  _that.dialogVisible = false
                  //更新数据
                  _that.initTable()
                }
                _that.$message({
                  message:res.data.retMsg,type: res.data.level
                })
              })


            } else {
              //拒绝时的处理
              //将数据更新到数据库
              this.$confirm('确定要拒绝此申请吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                approvalRefuse(_that.approveInfo).then(res =>{
                  if('warning'==res.data.level){
                    //关闭弹窗
                    _that.dialogVisible = false
                    //更新数据
                    _that.initTable()
                  }
                  _that.$message({
                    message:res.data.retMsg,type: res.data.level
                  })
                })
              }).catch(() => {

              });
            }
          }else {
            //校验没有通过时的处理
            _that.$message({
              message:'请检查数据的合法性',type: 'warning'
            })
          }
        })
      },
      //技术总监点击确定按钮时的操作
      save(formName) {
        //表单校验
        let _that=this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            distribute(_that.approveInfo).then(res =>{
              if('success'==res.data.level){
                //关闭弹窗
                _that.dialogVisible = false
                //更新数据
                _that.initTable()
              }
              _that.$message({
                message: res.data.retMsg,
                type: res.data.level
              })
            })


            //根据选中数据的id到数据库修改审批状态和添加审批记录
          }else {
            _that.$message({
              message: '请检查数据的合法性！',
              type: 'warning'
            })
          }
        })

        console.log(this.row.projId)

      },

      //弹窗关闭事件
      cancelInsertOrUpdate() {
        //清除表单校验
        this.$nextTick(function () {
          this.$refs.insertForm.clearValidate()
        })
        //关闭弹窗
        this.dialogVisible = false

      },
      //分页点击
      handlePageChange(value) {
        this.currentPage = value;
        this.initTable()
      },
      //点击选择框时将所有选中的数据(selection)和最后一次选中的行(row)传过来
      checkboxSelect(selection,row) {
        this.selection=selection
        // 将row数据存储在row中，供后面修改时使用
        this.row = row
      },
      //过滤器用法
      dateFormatter(row) {
        return row.projTime
      },
      stateFormatter(row) {
        switch (row.projState) {
          case '0000':return "验收"
          case '0001':return "新建/售前"
          case '0002':return "立项"
          case '0003':return "执行中"
          case '0004':return "结束"
          case '0005':return "取消"
          case '0006':return "服务"
          case '0007':return "服务中"
          case '0008':return "终验完成"
        }
      },
      fieldFormatter(row) {
        switch (row.projField) {
          case '0001':return "消费金融"
          case '0002':return "商业银行"
          case '0003':return "住建房管"
          case '0004':return "其他"
        }
      }
    },
  }
</script>

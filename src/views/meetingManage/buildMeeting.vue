<template>
  <div class="app-container">
    <bv-table-header title="会议安排">
      <bv-button v-show="$refs.table && $refs.table.selection.length === 0" view="add" @click="startCreate()">新增</bv-button>
      <bv-button v-show="$refs.table && $refs.table.selection.length === 1" view="modify" @click="startModify()">修改</bv-button>
      <bv-button v-show="$refs.table && $refs.table.selection.length > 0" view="remove" @click="startRemove()">删除</bv-button>
    </bv-table-header>

    <bv-table-search
      :is-fuzzy.sync="isFuzzy"
      :fuzzy.sync="fuzzy"
      :filter.sync="filter"
      @on-fuzzy-start="fetchData"
      @on-filter-start="fetchData"
      @on-filter-reset="fetchData"
    >
      <bv-col>
        <el-form-item label="会议负责人" prop="fzName">
          <el-input v-model="filter.fzName" placeholder="会议负责人" />
        </el-form-item>
      </bv-col>
      <bv-col>
        <el-form-item label="会议状态" prop="status">
          <el-select v-model="filter.status" placeholder="请选择会议状态" clearable>
            <el-option label="未开始" value="01" />
            <el-option label="进行中" value="02" />
            <el-option label="已延期" value="03" />
            <el-option label="已结束" value="04" />
          </el-select>
        </el-form-item>
      </bv-col>
    </bv-table-search>

    <el-table ref="table" v-loading="loading" :data="items" @sort-change="onSort">
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="false" label="会议编号" prop="meetingId" />
      <el-table-column label="会议名称" prop="meetingName" align="center" />
      <el-table-column label="会议负责人" prop="fzName" align="center" />
      <el-table-column v-if="false" label="与会人员" prop="attendName" />
      <el-table-column v-if="false" label="通知方式" prop="noticeMode" />
      <el-table-column label="会议地点" prop="meetingPlace" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.meetingPlace === '1' ">大会议室</span>
          <span v-else-if="scope.row.meetingPlace === '2' ">中会议室</span>
          <span v-else-if="scope.row.meetingPlace === '3' ">小会议室</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" prop="startTime" align="center" sortable="custom" />
      <el-table-column label="结束时间" prop="endTime" align="center" sortable="custom" />
      <el-table-column label="组织部门" prop="organizeDept" align="center" />
      <el-table-column v-if="false" label="会议目的" prop="meePurpose" />
      <el-table-column label="会议状态" prop="status" align="center" sortable="custom">
        <template slot-scope="scope">
          <span v-if="scope.row.status === '01' ">未开始</span>
          <span v-else-if="scope.row.status === '02' " style="color: #3a8ee6; font-weight: bold">进行中</span>
          <span v-else-if="scope.row.status === '03' ">已延期</span>
          <span v-else-if="scope.row.status === '04' ">已结束</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button view="details" type="text" @click="viewDetails(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <bv-pagination :total="total" :current-page.sync="currentPage" :page-size="limit" @current-change="handlePageChange" />

    <bv-dialog title="会议维护" :visible.sync="dialogFormVisible">
      <bv-form ref="role" :rules="rules" :model="role">
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item v-if="false" label="会议编号" prop="meetingId">
              <el-input v-if="modifyType === 'create'" v-model="role.meetingId" />
              <span v-else v-text="role.meetingId" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="会议名称" prop="meetingName">
              <el-input v-model="role.meetingName" placeholder="请输入会议名称" suffix-icon="el-icon-edit el-input__icon" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="开始时间">
              <bv-col :span="11">
                <el-form-item prop="startTime">
                  <el-date-picker v-model="role.startTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" />
                </el-form-item>
              </bv-col>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="结束时间">
              <bv-col :span="11">
                <el-form-item prop="endTime">
                  <el-date-picker v-model="role.endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" />
                </el-form-item>
              </bv-col>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="会议地点" prop="meetingPlace">
              <el-select v-model="role.meetingPlace" placeholder="请选择会议地点">
                <el-option
                  v-for="item in placeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="会议负责人" prop="fzName">
              <el-input v-model="role.fzName" placeholder="请输入会议负责人" suffix-icon="el-icon-edit el-input__icon" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="组织部门" prop="organizeDept">
              <el-input v-model="role.organizeDept" placeholder="请输入组织部门" suffix-icon="el-icon-edit el-input__icon" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="与会人员" prop="attendName">
              <!--<el-cascader v-model="role.attendName" placeholder="请添加与会人员" :options="options" filterable change-on-select />-->
              <el-input v-model="role.attendName" placeholder="请输入与会人员" suffix-icon="el-icon-edit el-input__icon" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="通知方式" prop="noticeMode">
              <el-select v-model="role.noticeMode" placeholder="请选择通知方式">
                <el-option
                  v-for="item in modeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="会议目的" prop="meePurpose">
              <el-input v-model="role.meePurpose" type="textarea" placeholder="请输入会议目的" :autosize="{ minRows: 2, maxRows: 8}" />
            </el-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModify('role')">保存</bv-button>
        <bv-button view="grant" @click="submitGrant()">审核</bv-button>
        <bv-button view="cancel" @click="cancelModify()">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  import { fetchMeetingDatas, createMeetDatas, modifyMeetDatas, removeMeetDatas } from '@/api/meetingManage'
  import { defaults as utils } from '@bestvike/utils'

  export default {
    meetingName: 'BuildMeeting',
    data() {
      return {
        tableTitle: '会议安排',
        //是否加载中
        loading: false,
        isFilter: false,
        dialogFormVisible: false,
        //授权
        dialogGrantVisible: false,
        modifyType: null,
        items: null,
        isFuzzy: true,
        // 模糊查询条件
        fuzzy: null,
        // 过滤条件
        filter: {},
        // 当前排序
        sort: null,

        options: [],
        //新增弹窗表单内容
        role: {
          meetingId: null,
          meetingName: null,
          fzName: null,
          meetingPlace: null,
          startTime: null,
          endTime: null,
          meePurpose: null,
          organizeDept: null,
          attendName: null,
          noticeMode: null
        },
        total: 0,
        limit: 10,
        currentPage: 1,

        //弹框表单校验规则
        rules: {
          meetingId: [
            { required: true, message: '请填写会议编号', trigger: 'blur' }
          ],
          meetingName: [
            { required: true, message: '请输入会议名称', trigger: 'blur' },
            { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
          ],
          startTime: [
            { type: 'string', required: true, message: '请选择开始日期时间', trigger: 'change' }
          ],
          endTime: [
            { type: 'string', required: true, message: '请选择结束日期时间', trigger: 'change' }
          ],
          meetingPlace: [
            { required: true, message: '请选择会议地点', trigger: 'change' }
          ],
          meePurpose: [
            { required: true, message: '请填写会议目的', trigger: 'blur' }
          ],
          fzName: [
            { required: true, message: '请填写会议负责人', trigger: 'blur' }
          ],
          organizeDept: [
            { required: true, message: '请填写组织部门', trigger: 'blur' }
          ],
          attendName: [
            { required: true, message: '请添加与会人员', trigger: 'blur' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一项服务', trigger: 'change' }
          ],
          noticeMode: [
            { required: true, message: '请选择通知方式', trigger: 'change' }
          ],
        },
        //会议室字典
        placeOptions: [
          {
            label:'大会议室',
            value:'1'
          },
          {
            label:'中会议室',
            value:'2'
          },
          {
            label:'小会议室',
            value:'3'
          }
        ],
        modeOptions:[
          {
            label:'不通知',
            value:'0'
          },
          {
            label:'短信通知',
            value:'1'
          },
          {
            label:'邮件通知',
            value:'2'
          },
          {
            label:'钉钉通知',
            value:'3'
          },
        ]
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      onSort(sort) {
        this.sort = utils.transTableSort(sort)
        this.fetchData()
      },
      fetchData() {
        this.loading = true
        let data = {}
        if (this.isFuzzy) {
          if (this.fuzzy) {
            data.fuzzy = this.fuzzy
          }
        } else {
          for (let item in this.filter) {
            data[item] = this.filter[item]
          }
        }
        if (this.sort) {
          data.sort = this.sort
        }
        // 分页信息
        data.page = this.currentPage
        data.limit = this.limit
        fetchMeetingDatas(data).then(response => {debugger
          this.total = response.data.total
          this.items = response.data.list
          setTimeout(() => {
            this.loading = false
          }, 500);
        }).catch(() => {
          setTimeout(() => {
            this.loading = false
          }, 500);
        })
      },
      handlePageChange(value) {
        this.currentPage = value;
        this.fetchData()
      },
      // 弹窗用
      initRole() {
        this.role = {
          meetingId: null,
          meetingName: null,
          fzName: null,
          meetingPlace: null,
          startTime: null,
          endTime: null,
          meePurpose: null,
          organizeDept: null,
          attendName: null,
          noticeMode: null
        }
      },
      startCreate() {
        this.dialogFormVisible = true;
        this.modifyType = 'create';
        this.role={};
      },
      startModify() {
        this.role = {...this.$refs.table.selection[0]}
        this.dialogFormVisible = true
        this.modifyType = 'modify'
      },
      //点击查看详情
      viewDetails(row) {
        this.role = row
        this.dialogFormVisible = true
        this.modifyType = 'details'
      },
      cancelModify() {
        this.initRole();
        this.dialogFormVisible = false;
        this.modifyType = null;
        this.$message({
                        message: '取消保存',
                        type: 'warning'
                      })
      },
      confirmModify(formName) {
        //表单校验
        let _that=this;
        this.$refs[formName].validate((valid) => {debugger
          if (this.modifyType === 'modify' && valid) {
            //将数据存入数据库
            modifyMeetDatas(_that.role).then(result =>{debugger
              //刷新页面
              _that.fetchData();
              _that.initRole();
              //关闭弹窗
              _that.dialogFormVisible = false;
              _that.modifyType = null;
              this.$message({
                              message:result.data.message,
                              type: result.data.level
                            })
            })
          }else if(this.modifyType === 'create' && valid){
            //将数据存入数据库
            createMeetDatas(_that.role).then(result =>{debugger
              if(result.data.level == 'warning'){
                //刷新页面
                _that.fetchData();
                //关闭弹窗
                _that.dialogFormVisible = true;
                _that.modifyType = null;
                this.$message({
                                message:result.data.message,
                                type: result.data.level
                              })
                _that.role.startTime = null;
                _that.role.endTime = null;
              }else {
                //刷新页面
                _that.fetchData();
                _that.initRole();
                //关闭弹窗
                _that.dialogFormVisible = false;
                _that.modifyType = null;
                this.$message({
                                message:result.data.message,
                                type: result.data.level
                              })
              }
            })
          }
          else {
            //校验没有通过时的处理
            return false
          }
        })
      },
      submitGrant(){
        console.log("会议提交审核")
      },
      afterModify() {
        this.fetchData()
        this.initRole()
        this.dialogFormVisible = false
        this.modifyType = null
        this.$message({
                        message: '保存成功',
                        type: 'success'
                      })
      },
      startRemove() {
        this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeMeetDatas(this.$refs.table.selection.map(item => item.meetingId).join()).then(result => {
            this.fetchData()
            this.$message({
                            message:result.data.message,
                            type: result.data.level
                          })
          })
        })
      }
    }
  }
</script>


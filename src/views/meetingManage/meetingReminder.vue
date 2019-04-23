<template>
  <div class="app-container">
    <bv-table-header title="会议纪要">
      <!--<bv-button v-show="$refs.table && $refs.table.selection.length === 0" view="add" @click="startCreate()">新增</bv-button>-->
      <bv-button v-show="$refs.table && $refs.table.selection.length === 1" view="modify" @click="startModify()">纪要</bv-button>
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
        <el-form-item label="纪要人员" prop="summaryName">
          <el-input v-model="filter.summaryName" placeholder="纪要人员" />
        </el-form-item>
      </bv-col>
    </bv-table-search>


    <el-table ref="table" v-loading="loading" :data="items" @sort-change="onSort">
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="false" label="会议纪要编号" prop="meetSmId" align="center" />
      <el-table-column v-if="false" label="会议编号" prop="meetingId" align="center" />
      <el-table-column v-if="false" label="组织部门" prop="organizeDept" align="center" />
      <el-table-column label="会议名称" prop="meetingName" align="center" />
      <el-table-column label="会议负责人" prop="fzName" align="center" />
      <el-table-column label="会议地点" prop="meetingPlace" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.meetingPlace === '1' ">大会议室</span>
          <span v-else-if="scope.row.meetingPlace === '2' ">中会议室</span>
          <span v-else-if="scope.row.meetingPlace === '3' ">小会议室</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" prop="startTime" type="datetime" align="center" sortable="custom" />
      <el-table-column label="结束时间" prop="endTime" type="datetime" align="center" sortable="custom" />
      <el-table-column label="纪要人员" prop="summaryName" align="center" />
      <el-table-column label="录入时间" prop="inputTime" type="datetime" align="center" sortable="custom" />
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button view="details" type="text" @click="viewDetails(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <bv-pagination
      :total="total" :current-page.sync="currentPage" :page-size="limit"
      @current-change="handlePageChange"
    />

    <!--form表单-->
    <bv-dialog title="会议维护" :visible.sync="dialogFormVisible">
      <bv-form ref="role" :rules="rules" :model="role">
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item v-if="false" label="会议纪要编号" prop="meetSmId">
              <el-input v-if="modifyType === 'create'" v-model="role.meetSmId" placeholder="请输入会议纪要编号" />
              <span v-else v-text="role.meetSmId" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item v-if="false" label="会议编号" prop="meetingId">
              <el-input v-model="role.meetingId" placeholder="请输入会议编号" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="会议名称" prop="meetingName">
              <el-input v-model="role.meetingName" placeholder="请输入会议名称" suffix-icon="el-icon-edit el-input__icon" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="会议负责人" prop="fzName">
              <el-input v-model="role.fzName" placeholder="请输入会议负责人" suffix-icon="el-icon-edit el-input__icon" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="会议地点" prop="meetingPlace">
              <el-select v-model="role.meetingPlace" placeholder="请选择会议地点" clearable>
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
            <el-form-item label="组织部门" prop="organizeDept">
              <el-input v-model="role.organizeDept" placeholder="请输入组织部门" suffix-icon="el-icon-edit el-input__icon" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="开始时间" required>
              <el-col :span="11">
                <el-form-item prop="startTime">
                  <el-date-picker v-model="role.startTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" />
                </el-form-item>
              </el-col>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="结束时间" required>
              <el-col :span="11">
                <el-form-item prop="endTime">
                  <el-date-picker v-model="role.endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" />
                </el-form-item>
              </el-col>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="纪要人员" prop="summaryName">
              <el-input v-model="role.summaryName" placeholder="请输入纪要人员" suffix-icon="el-icon-edit el-input__icon" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="录入时间" required>
              <el-col :span="11">
                <el-form-item prop="inputTime">
                  <el-date-picker v-model="role.inputTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" />
                </el-form-item>
              </el-col>
            </el-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModify('role')">保存</bv-button>
        <bv-button view="cancel" @click="cancelModify()">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  import { fetchMeetSummary, createMeetSummary, modifyMeetSummary, removeMeetSummary } from '@/api/meetingManage'
  import { defaults as utils } from '@bestvike/utils'
  export default {
    meetingName: 'meetingSummary',
    data() {
      return {
        tableTitle: '会议纪要',
        dialogFormVisible: false,
        //授权
        dialogGrantVisible: false,
        modifyType: null,
        loading: false,
        items: null,
        isFuzzy: true,
        // 模糊查询条件
        fuzzy: null,
        // 过滤条件
        filter: {},
        // 当前排序
        sort: null,

        total: 0,
        limit: 10,
        currentPage: 1,

        //新增弹窗表单内容
        role: {
          meetSmId: null,
          meetingId: null,
          meetingName: null,
          fzName: null,
          meetingPlace: null,
          organizeDept: null,
          startTime: null,
          endTime: null,
          summaryName: null,
          inputTime: null
        },
        //弹框表单校验规则
        rules: {
          meetingId: [
            { required: true, message: '请填写会议编号', trigger: 'blur' }
          ],
          meetingName: [
            { required: true, message: '请输入会议名称', trigger: 'blur' },
            { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
          ],
          fzName: [
            { required: true, message: '请填写会议负责人', trigger: 'blur' }
          ],
          organizeDept: [
            { required: true, message: '请填写组织部门', trigger: 'blur' }
          ],
          meetingPlace: [
            { required: true, message: '请选择会议地点', trigger: 'change' }
          ],
          startTime: [
            { type: 'string', required: true, message: '请选择开始日期时间', trigger: 'change' }
          ],
          endTime: [
            { type: 'string', required: true, message: '请选择结束日期时间', trigger: 'change' }
          ],
          summaryName: [
            { required: true, message: '请填写纪要人员', trigger: 'blur' }
          ],
          inputTime: [
            { type: 'string', required: true, message: '请选择录入日期时间', trigger: 'change' }
          ]
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
      }
    },
    // computed: {
    //   //弹窗标题
    //   modalTitle() {
    //     return this.modalFlag ? '会议纪要' : '新增会议纪要'
    //   },
    //
    // },
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
        fetchMeetSummary(data).then(response => {
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
          meetSmId: null,
          meetingId: null,
          meetingName: null,
          fzName: null,
          meetingPlace: null,
          organizeDept: null,
          startTime: null,
          endTime: null,
          summaryName: null,
          inputTime: null
        }
      },
      startCreate() {
        this.dialogFormVisible = true
        this.modifyType = 'create'
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
        this.initRole()
        this.dialogFormVisible = false
        this.modifyType = null
        this.$message({
                        message: '取消保存',
                        type: 'warning'
                      })
      },
      // confirmModify() {
      //   if (this.modifyType === 'modify') {
      //     modifyMeetSummary(this.role).then(() => {
      //       this.$refs.table.clearSelection()
      //       this.afterModify()
      //     })
      //   } else {
      //     createMeetSummary(this.role).then(() => {
      //       this.afterModify()
      //     })
      //   }
      // },
      confirmModify(formName) {
        //表单校验
        let _that=this;
        this.$refs[formName].validate((valid) => {debugger
          if (this.modifyType === 'modify' && valid) {
            //将数据存入数据库
            modifyMeetSummary(_that.role).then(result =>{debugger
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
            createMeetSummary(_that.role).then(result =>{
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
          }
          else {
            //校验没有通过时的处理
            return false
          }
        })
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
          removeMeetSummary(this.$refs.table.selection.map(item => item.meetSmId).join()).then(result => {
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

<template>
  <div class="app-container">
    <bv-table ref="table" title="项目周报" :is-fuzzy="false" :filter-switch="false" :pagination="true" :filter.sync="filter" :fetch-api="fetchProWeekly" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="one" view="grant" authority="approval" @click="startApproval()">审核</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="项目名称" prop="projName">
            <el-input v-model="filter.projName" />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="查询周" prop="projWeek">
            <el-date-picker
              v-model="filter.projWeek"
              type="week"
              format="yyyy 第 WW 周"
              placeholder="选择周"
              :picker-options="pickOption"
            />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" type="index" align="center" />
      <el-table-column label="项目编号" prop="projId" align="center" sortable="projId">
        <!--<template slot-scope="scope"><img src="../../assets/wenjianjia.png" style="width:20px;height:20px; margin-right:6px">{{ scope.row.projId }}</template>-->
      </el-table-column>
      <el-table-column label="项目名称" prop="projName" align="center" />
      <el-table-column v-if="false" label="员工姓名" prop="empName" align="center" />
      <el-table-column v-if="false" label="员工代码" prop="empId" align="center" />
      <el-table-column v-if="false" label="任务名称" prop="taskName" align="center" />
      <el-table-column v-if="false" label="任务总工时(/h)" prop="workHours" align="center" sortable />
      <el-table-column v-if="false" label="任务简报" prop="briefing" />
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button view="details" type="text" @click="viewDetails(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </bv-table>

    <bv-dialog :visible.sync="dialogTableVisible">
      <bv-table ref="table" title="信息详情" :filter-switch="false" :pagination="true" :filter.sync="filter" :fetch-api="fetchWeeklyLog" @on-mounted="(table) => tableInstance = table">
        <el-table-column v-if="false" label="员工代码" prop="empId" align="center" />
        <el-table-column v-if="false" label="项目编号" prop="projId" align="center" sortable="projId" />
        <el-table-column fixed prop="empName" label="项目成员" align="center" />
        <el-table-column prop="briefing" label="工作内容" :show-overflow-tooltip="true" align="center" width="230" />
        <el-table-column v-if="false" prop="scheduleDate" label="执行日期" align="center" sortable />
        <el-table-column prop="planWorkload" label="计划工作量" align="center" />
        <el-table-column prop="completeState" label="完成百分比" align="center" />
        <el-table-column prop="autualWorkload" label="实际工作量" align="center" />
        <el-table-column prop="overtime" label="加班" align="center" />
        <el-table-column v-if="false" prop="taskName" label="任务名称" />
        <el-table-column v-if="false" prop="workHours" label="任务工时(/h)" />
      </bv-table>
    </bv-dialog>
    <!--form表单-->
    <bv-dialog title="周报详情" :visible.sync="dialogFormVisible">
      <bv-form ref="role" :rules="rules" :model="role">
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item label="项目编号" prop="projId">
              <el-input v-if="modifyType === 'create'" v-model="role.projId" placeholder="请输入项目编号" />
              <span v-else v-text="role.projId" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="项目名称" prop="projName">
              <el-input v-model="role.projName" placeholder="请输入项目名称" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="项目状态" prop="projState">
              <el-select v-model="role.projState" placeholder="请选择">
                <el-option
                  v-for="item in stateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="项目类别" prop="projType">
              <el-select v-model="role.projType" placeholder="请选择">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="项目类型" prop="projMode">
              <el-select v-model="role.projMode" placeholder="请选择">
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
            <el-form-item label="年度" required>
              <el-col :span="11">
                <el-form-item prop="projYear">
                  <el-date-picker v-model="role.projYear" value-format="yyyy" type="datetime" placeholder="请选择年度" />
                </el-form-item>
              </el-col>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="项目成员" prop="developer">
              <el-input v-model="role.developer" placeholder="请输入项目成员" suffix-icon="el-icon-edit el-input__icon" />
            </el-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModify()">保存</bv-button>
        <bv-button view="cancel" @click="cancelModify()">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  import { fetchProWeekly,fetchWeeklyLog ,approvalSchedule} from '@/api/employee/otherManage'

  export default {
    proWeekly: 'proWeekly',
    data() {
      return {
        tableTitle: '项目周报',
        dialogFormVisible: false,
        dialogTableVisible: false,
        //授权
        dialogGrantVisible: false,
        modifyType: null,

        dialogItems: null,

        // 过滤条件
        filter: {},

        tableInstance: {},
        fetchProWeekly,
        fetchWeeklyLog,
        //新增弹窗表单内容
        role: {
          projId: null,
          projName: null,
          projYear: null,
          developer: null,
          projState: null,
          projType: null,
          projMode: null,
        },
        //弹框表单校验规则
        rules: {
          projId: [
            { required: true, message: '请填写项目编号', trigger: 'blur' }
          ],
          projName: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
            { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
          ],
          projYear: [
            { type: 'string', required: true, message: '请选择年度', trigger: 'change' }
          ],
          projState: [
            { type: 'string', required: true, message: '请选择项目状态', trigger: 'change' }
          ],
          projType: [
            { type: 'string', required: true, message: '请选择项目类别', trigger: 'change' }
          ],
          projMode: [
            { type: 'string', required: true, message: '请选择项目类型', trigger: 'change' }
          ],
          developer: [
            { required: true, message: '请填写项目成员', trigger: 'blur' }
          ]
        },
        //项目状态下拉选项
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
        //项目类型字典
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
        ],
        pickOption: {
          firstDayOfWeek: 1
        }
      }
    },
    created() {
      // this.fetchData()
    },
    methods: {
      // 弹窗用
      initRole() {
        this.role = {
          projId: null,
          projName: null,
          projYear: null,
          developer: null,
          projState: null,
          projType: null,
          projMode: null,
          projWeek: null
        }
      },
      startApproval() {
        this.role = {...this.tableInstance.table.selection[0]}
        this.dialogTableVisible = true
        this.modifyType = 'approval'
      },
      cancelModify() {
        this.initRole()
        this.dialogTableVisible = false
        this.modifyType = null
      },
      //点击查看详情
      viewDetails(row) {
        this.role = row
        this.dialogTableVisible = true
        this.modifyType = 'details'
        this.modifyType = 'approval'
      },
      confirmModify() {
        if (this.modifyType === 'approval') {
          let role = {...this.role}
          delete role.permissions
          approvalSchedule(role).then(result => {
            this.tableInstance.table.clearSelection()
            this.afterModify(result)
          })
        } else {
          return false
        }
      },
      afterModify(result) {
        this.tableInstance.fetchData()
        this.initRole()
        this.dialogTableVisible = false
        this.modifyType = null
        this.$message({
                        message:result.data.message,
                        type: result.data.level
                      })
      },
    }
  }
</script>

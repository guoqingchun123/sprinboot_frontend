<template>
  <div class="app-container">
    <bv-table ref="table" title="季度自评" :pagination="true" :filter.sync="filter" :fetch-api="fetchQuqEvaluate" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="add" authority="add" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="grant" authority="approval" @click="startApproval()">审核</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button show="oneOrMore" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="年度" prop="evaluateYear">
            <el-date-picker
              v-model="filter.evaluateYear"
              type="year"
              placeholder="选择年"
            />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="季度" prop="quarter">
            <el-select v-model="filter.quarter" placeholder="请选择季度" clearable>
              <el-option label="第一季度" value="1" />
              <el-option label="第二季度" value="2" />
              <el-option label="第三季度" value="3" />
              <el-option label="第四季度" value="4" />
            </el-select>
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" type="index" />
      <el-table-column v-if="false" label="系统编号" prop="evaluateId" align="center" />
      <el-table-column label="员工名称" prop="empName" align="center" />
      <el-table-column v-if="false" label="工作内容" prop="workContent" align="center" />
      <el-table-column label="年度" prop="evaluateYear" align="center" sortable />
      <el-table-column label="季度" prop="quarter" align="center" sortable />
      <el-table-column label="投入总工时(/h)" prop="workHours" align="center" sortable />
      <el-table-column v-if="false" label="工作收获" prop="workHarvest" align="center" />
      <el-table-column v-if="false" label="工作业绩" prop="workAchieve" align="center" />
      <el-table-column v-if="false" label="工作不足" prop="workDefect" align="center" />
      <el-table-column v-if="false" label="改进措施" prop="workMeasures" align="center" />
      <el-table-column v-if="false" label="目标实现情况" prop="workImplSituation" />
      <el-table-column v-if="false" label="下季度工作目标" prop="workTarget" />
      <el-table-column v-if="false" label="实现目标措施" prop="workImplMeasures" />
      <el-table-column v-if="false" label="下季度学习计划" prop="nextStudyPlan" />
      <el-table-column v-if="false" label="下季度工作规划" prop="workPlan" />
      <el-table-column v-if="false" label="对公司建议" prop="companyProposal" />
      <el-table-column v-if="false" label="工作中优点" prop="workAdvantage" />
      <el-table-column v-if="false" label="工作中不足" prop="workShortcoming" />
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button view="details" type="text" @click="viewDetails(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </bv-table>

    <!--form表单-->
    <bv-dialog title="自评维护" :visible.sync="dialogFormVisible">
      <el-form ref="role" :rules="rules" :model="role" label-width="100px" label-position="right">
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item v-if="false" label="系统编号" prop="evaluateId">
              <el-input v-model="role.evaluateId" placeholder="请输入系统编号" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="年度" required>
              <el-form-item prop="evaluateYear">
                <el-date-picker v-model="role.evaluateYear" type="year" placeholder="请选择年度" />
              </el-form-item>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="季度" prop="quarter">
              <el-select v-model="role.quarter" placeholder="请选择季度">
                <el-option
                  v-for="item in quarterOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
        </bv-row>
        <bv-row layout="dialog-1">
          <bv-col>
            <el-form-item label="工作及业绩" prop="workContent">
              <el-input v-model="role.workContent" type="textarea" placeholder="请输入工作内容" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item v-if="role.quarter === '4'" label="本年度工作及业绩" prop="workAchieve">
              <el-input v-model="role.workAchieve" type="textarea" placeholder="请输入评价" suffix-icon="el-icon-edit el-input__icon" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="工作收获" prop="workHarvest">
              <el-input v-model="role.workHarvest" type="textarea" placeholder="请输入工作收获" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="工作不足" prop="workDefect">
              <el-input v-model="role.workDefect" type="textarea" placeholder="请输入工作不足" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="改进措施" prop="workMeasures">
              <el-input v-model="role.workMeasures" type="textarea" placeholder="请输入改进措施" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="目标实现情况" prop="workImplSituation">
              <el-input v-model="role.workImplSituation" type="textarea" placeholder="请输入目标实现情况" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="下季度工作目标" prop="workTarget">
              <el-input v-model="role.workTarget" type="textarea" placeholder="请输入下季度工作目标" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="下季度目标实现措施" prop="workImplMeasures">
              <el-input v-model="role.workImplMeasures" type="textarea" placeholder="请输入实现目标措施" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="下季度学习计划" prop="nextStudyPlan">
              <el-input v-model="role.nextStudyPlan" type="textarea" placeholder="请输入下季度学习计划" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item v-if="role.quarter === '4'" label="下一年工作期望及规划" prop="workPlan">
              <el-input v-model="role.workPlan" type="textarea" placeholder="请输入下季度工作规划" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="对公司建议" prop="companyProposal">
              <el-input v-model="role.companyProposal" type="textarea" placeholder="请输入对公司建议" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="工作中优点" prop="workAdvantage">
              <el-input v-model="role.workAdvantage" type="textarea" placeholder="请输入工作中优点" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="工作中不足" prop="workShortcoming">
              <el-input v-model="role.workShortcoming" type="textarea" placeholder="请输入工作中不足" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item v-if="modifyType === 'approval'" label="回复建议" prop="evaluateReply">
              <el-input v-model="role.evaluateReply" type="textarea" placeholder="请输入回复建议" />
            </el-form-item>
          </bv-col>
        </bv-row>
      </el-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModify()">保存</bv-button>
        <bv-button view="cancel" @click="cancelModify()">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  import { fetchQuqEvaluate,createQuaEvaluate,modifyQuaEvaluate,removeQuaEvaluate,approvalQuaEvaluate } from '@/api/employee/otherManage'
  export default {
    meetingName: 'quaEvaluate',
    data() {
      return {
        tableTitle: '季度自评',
        dialogFormVisible: false,
        //授权
        dialogGrantVisible: false,
        modifyType: null,
        // 过滤条件
        filter: {},

        //新增弹窗表单内容
        role: {
          evaluateId: null,
          workContent: null,
          evaluateYear: null,
          workAchieve: null,
          workHarvest: null,
          workDefect: null,
          workMeasures: null,
          workImplSituation: null,
          workTarget: null,
          workImplMeasures: null,
          nextStudyPlan: null,
          workPlan: null,
          companyProposal: null,
          workAdvantage: null,
          workShortcoming: null,
          evaluateTime: null,
          quarter: null,
          evaluateReply: null,
        },
        //弹框表单校验规则
        rules: {
          evaluateId: [
            { required: true, message: '请填写系统编号', trigger: 'blur' }
          ],
          workContent: [
            { type: 'string', required: true, message: '请填写工作内容', trigger: 'blur' }
          ],
          evaluateYear: [
            { type: 'string', required: true, message: '请选择年度', trigger: 'blur' }
          ],
          quarter: [
            { type: 'string', required: true, message: '请选择季度', trigger: 'blur' }
          ],
          workHours: [
            { type: 'string', required: true, message: '请填写工时', trigger: 'blur' }
          ],
          workHarvest: [
            { type: 'string', required: true, message: '请填写工作收获', trigger: 'blur' }
          ],
          workAchieve: [
            { type: 'string', required: true, message: '请填写工作业绩', trigger: 'blur' }
          ],
          workDefect: [
            { type: 'string', required: true, message: '请填写工作不足', trigger: 'blur' }
          ],
          workMeasures: [
            { type: 'string', required: true, message: '请填写改进措施', trigger: 'blur' }
          ],
          workImplSituation: [
            { type: 'string', required: true, message: '请填写目标实现情况', trigger: 'blur' }
          ],
          workTarget: [
            { type: 'string', required: true, message: '请填写工作目标', trigger: 'blur' }
          ],
          workImplMeasures: [
            { type: 'string', required: true, message: '请填写实现目标措施', trigger: 'blur' }
          ],
          nextStudyPlan: [
            { type: 'string', required: true, message: '请填写下季度学习计划', trigger: 'blur' }
          ],
          workPlan: [
            { type: 'string', required: true, message: '请填写下季度工作规划', trigger: 'blur' }
          ],
          companyProposal: [
            { type: 'string', required: true, message: '请填写对公司建议', trigger: 'blur' }
          ],
          workAdvantage: [
            { type: 'string', required: true, message: '请填写工作优点', trigger: 'blur' }
          ],
          workShortcoming: [
            { type: 'string', required: true, message: '请填写工作不足', trigger: 'blur' }
          ]
        },
        //季度
        quarterOptions: [
          {
            label:'第一季度',
            value:'1'
          },
          {
            label:'第二季度',
            value:'2'
          },
          {
            label:'第三季度',
            value:'3'
          },
          {
            label:'第四季度',
            value:'4'
          }
        ],
        tableInstance: {},
        fetchQuqEvaluate
      }
    },
    created() {
      // this.fetchData()
    },
    methods: {
      // 弹窗用
      initRole() {
        this.role = {
          evaluateId: null,
          workContent: null,
          evaluateYear: null,
          workAchieve: null,
          workHarvest: null,
          workDefect: null,
          workMeasures: null,
          workImplSituation: null,
          workTarget: null,
          workImplMeasures: null,
          nextStudyPlan: null,
          workPlan: null,
          companyProposal: null,
          workAdvantage: null,
          workShortcoming: null,
          evaluateTime: null,
          quarter: null,
          evaluateReply: null,
        }
      },
      startCreate() {
        this.dialogFormVisible = true
        this.modifyType = 'create'
        this.role = {}
      },
      startModify() {
        this.role = {...this.tableInstance.table.selection[0]}
        this.dialogFormVisible = true
        this.modifyType = 'modify'
      },
      startApproval() {
        this.role = {...this.tableInstance.table.selection[0]}
        this.dialogFormVisible = true
        this.modifyType = 'approval'
      },
      cancelModify() {
        this.initRole()
        this.dialogFormVisible = false
        this.modifyType = null
        // this.$message({
        //                 message: '取消保存',
        //                 type: 'warning'
        //               })
      },
      confirmModify() {
        if (this.modifyType === 'modify') {
          let role = {...this.role}
          delete role.permissions
          modifyQuaEvaluate(role).then(result => {
            this.tableInstance.table.clearSelection()
            this.afterModify(result)
          })
        } else if(this.modifyType === 'approval'){
          let role = {...this.role}
          delete role.permissions
          approvalQuaEvaluate(role).then(result => {
            this.tableInstance.table.clearSelection()
            this.afterModify(result)
          })
        }
        else {
          createQuaEvaluate(this.role).then(result => {
            this.afterModify(result)
          })
        }
      },
      afterModify(result) {
        this.tableInstance.fetchData()
        this.initRole()
        this.dialogFormVisible = false
        this.modifyType = null
        this.$message({
                        message:result.data.message,
                        type: result.data.level
                      })
      },
      //点击查看详情
      viewDetails(row) {
        this.role = row
        this.dialogFormVisible = true
        this.modifyType = 'details'
        this.modifyType = 'approval'
      },
      startRemove() {
        this.$confirm('此操作将删除信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(result => {
          removeQuaEvaluate(this.tableInstance.table.selection.map(item => item.evaluateId).join()).then(() => {
            this.tableInstance.fetchData()
            this.$message({
                            message:result.data.message,
                            type: result.data.level
                          })
          })
        }).catch(result => {
          this.$message({
                          message:result.data.message,
                          type: result.data.level
                        })
        })
      },
    }
  }
</script>

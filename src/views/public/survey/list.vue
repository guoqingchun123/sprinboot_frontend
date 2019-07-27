<template>
  <div class="app-container">
    <bv-table title="调查问卷一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchSurveys" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="add" authority="add" @click="startCreate()">新增</bv-button>
        <bv-button show="one" type="info" icon="el-icon-view" @click="startView()">预览</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button v-if="deleteShow()" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="标题" prop="title">
            <el-input v-model="filter.title" />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="摘要" prop="summary">
            <el-input v-model="filter.summary" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column :selectable="selectable" type="selection" width="55" />
      <el-table-column label="问卷标题" prop="title" align="center" sortable="custom" />
      <el-table-column label="问卷摘要" prop="summary" align="center" sortable="custom" />
      <el-table-column label="问卷状态" prop="surveyStatus" align="center" sortable="custom" :formatter="surveyStatusFormatter" />
      <el-table-column label="经办人" prop="agentPerson" align="center" sortable="custom" />
      <el-table-column label="开始日期" prop="startDate" align="center" sortable="custom" />
      <el-table-column label="结束日期" prop="stopDate" align="center" sortable="custom" />
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button view="details" type="text" @click="startSurveyItems(scope.row)">维护问卷明细</el-button>
        </template>
      </el-table-column>
    </bv-table>
    
    <bv-dialog title="调查问卷维护" :visible.sync="dialogFormVisible">
      <bv-form ref="dialogForm" :model="item" :rules="rules">
        <bv-row layout="dialog-1">
          <bv-col>
            <el-form-item label="标题" prop="title">
              <el-input v-model="item.title" style="width: 35.3vw;" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="摘要" prop="summary">
              <el-input v-model.trim="item.summary" type="textarea" :rows="1" style="width: 35.3vw;" />
            </el-form-item>
          </bv-col>
        </bv-row>
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker
                v-model="item.startDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="结束日期" prop="stopDate">
              <el-date-picker
                v-model="item.stopDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="经办人" prop="agentPerson">
              <el-input v-model="item.agentPerson" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="手机号码" prop="agentPhone">
              <el-input v-model.trim="item.agentPhone" />
            </el-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModify()">保存</bv-button>
        <bv-button view="cancel" @click="cancelModify()">取消</bv-button>
      </div>
    </bv-dialog>
    
    <bv-dialog :title="'调查问卷预览===>' + item.title" :visible.sync="dialogViewFormVisible">
      <el-card v-for="(surveyItem, i) in item.surveyItems" :key="surveyItem.sysId" class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ i + 1 }}、{{ surveyItem.summary }}</span>
        </div>
        <div>
          <el-radio-group v-if="surveyItem.questionType === '0001'" v-model="surveyItem.result">
            <el-radio v-for="(option, index) in surveyItem.options" :key="option.key" :label="index">{{ option.itemName }}</el-radio>
          </el-radio-group>
          <el-checkbox-group v-else-if="surveyItem.questionType === '0002'" v-model="surveyItem.result">
            <el-checkbox v-for="(option) in surveyItem.options" :key="option.key" v-model="option.key" :label="index">{{ option.itemName }}</el-checkbox>
          </el-checkbox-group>
          <el-input v-else v-model="surveyItem.result" type="textarea" :rows="1" style="width: 35.3vw;" />
        </div>
      </el-card>
      <div slot="footer">
        <bv-button view="cancel" @click="cancelView()">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  
  import {fetchSurveys, createSurvey, modifySurvey, removeSurvey, selectSurvey} from '@/api/public'
  
  export default {
    name: 'ListSurvey',
    data() {
      return {
        filter: {},
        tableInstance: {},
        item: {},
        fetchSurveys,
        rules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          summary: [
            {required: true, message: '请输入摘要', trigger: 'blur'}
          ],
          startDate: [
            {required: true, message: '请选择开始日期', trigger: 'blur'}
          ],
          stopDate: [
            {required: true, message: '请选择结束日期', trigger: 'blur'}
          ],
          agentPerson: [
            {required: true, message: '请填写经办人姓名', trigger: 'blur'}
          ],
          agentPhone: [
            {required: true, message: '请填写经办人手机号', trigger: 'blur'}
          ]
        },
        dialogFormVisible: false,
        dialogViewFormVisible: false,
        modifyType: null,
        surveyStatuses: []
      }
    },
    created() {
      this.$store.dispatch('app/fetchDicts', 'surveyStatus').then(data => {
        this.surveyStatuses = data
      })
    },
    methods: {
      // 弹窗用
      initData() {
        this.item = {}
      },
      surveyStatusFormatter(row, column, cellValue) {
        for (let i in this.surveyStatuses) {
          if (cellValue == this.surveyStatuses[i].code) {
            return this.surveyStatuses[i].name
          }
        }
      },
      deleteShow() {
        if (!this.tableInstance || !this.tableInstance.selection || this.tableInstance.selection.length === 0) {
          return false;
        }
        return true;
      },
      selectable(row) {
        if (row.surveyStatus === '0000' || row.surveyStatus === '0001') { // 执行中和完成状态不允许修改和删除
          return false;
        }
        return true;
      },
      startCreate() {
        this.dialogFormVisible = true;
        this.modifyType = 'create';
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      startModify() {
        this.item = {...this.tableInstance.table.selection[0]};
        this.dialogFormVisible = true;
        this.modifyType = 'modify';
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      cancelModify() {
        this.initData();
        this.dialogFormVisible = false;
        this.modifyType = null;
      },
      confirmModify() {
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          this.item.cityCode = "150400";
          if (this.modifyType === 'modify') {
            modifySurvey(this.item).then(() => {
              this.tableInstance.table.clearSelection()
              this.afterModify()
            })
          } else {
            createSurvey(this.item).then(() => {
              this.afterModify()
            })
          }
        })
      },
      afterModify() {
        this.tableInstance.fetchData();
        this.initData();
        this.dialogFormVisible = false;
        this.modifyType = null;
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      },
      startRemove() {
        this.$confirm('此操作将删除该调查问卷, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeSurvey(this.tableInstance.table.selection.map(item => item.surveyId).join()).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.tableInstance.fetchData()
          })
        }).catch(() => {
          /*this.$message({
            message: '取消删除',
            type: 'warning'
          })*/
        })
      },
      startSurveyItems(row) {
        this.$emit('on-start-survey-items', row.surveyId, row.title)
      },
      startView() {
        this.item = {...this.tableInstance.table.selection[0]};
        selectSurvey(this.item.surveyId).then((res) => {
          this.item = res.data;
        });
        this.dialogViewFormVisible = true;
      },
      cancelView() {
        this.initData();
        this.dialogViewFormVisible = false;
      }
    }
  }
</script>

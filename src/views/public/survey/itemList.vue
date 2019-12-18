<template>
  <div class="app-container">
    <bv-table :title="title" :pagination="true" :filter.sync="filter" :fetch-api="fetchSurveyItems_" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="create" authority="create" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button v-if="deleteShow()" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
        <bv-button type="primary" icon="el-icon-back" @click="returnPrePage">返回</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="问题类型" prop="questionType">
            <el-radio-group v-model="filter.questionType" placeholder="请选择问题类型">
              <el-radio-button v-for="questionType in questionTypes" :key="questionType.code" :label="questionType.code">{{ questionType.name }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="摘要" prop="summary">
            <el-input v-model="filter.summary" />
          </el-form-item>
        </bv-col>
      </div>
      <bv-table-column type="selection" />
      <el-table-column label="问题类型" prop="questionType" align="center" sortable="custom" :formatter="questionTypeFormatter" />
      <el-table-column label="题目" prop="summary" align="center" sortable="custom" />
    </bv-table>

    <bv-dialog title="问题维护" :visible.sync="dialogFormVisible" @close="dialogClose">
      <bv-form ref="dialogForm" :model="item" :rules="rules">
        <bv-row :layout="1">
          <bv-col>
            <el-form-item label="问题类型" prop="questionType">
              <el-radio-group v-model="item.questionType" placeholder="请选择问题类型" @change="questionTypeChange">
                <el-radio-button v-for="questionType in questionTypes" :key="questionType.code" :label="questionType.code">{{ questionType.name }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="题目" prop="summary">
              <el-input v-model.trim="item.summary" type="textarea" :rows="1" style="width: 35.3vw;" />
            </el-form-item>
          </bv-col>
        </bv-row>
        <bv-row v-show="showOptions">
          <bv-col>
            <el-form-item label="选项个数" prop="optionsNum">
              <el-input-number v-model="optionsNum" :min="1" :max="10" label="请输入选项个数" @change="handleChange" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item v-for="(option, index) in item.options"
                          :key="'options' + index"
                          label="选项内容"
                          :prop="'options.' + index + '.itemName'"
                          :rules="{
                            required: true, message: '选项内容不能为空', trigger: 'blur'
                          }"
            >
              <el-input v-model.trim="option.itemName">
                <template slot="prepend">{{ index + 1 }}</template>
              </el-input>
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

  import {fetchSurveyItems, createSurveyItem, modifySurveyItem, removeSurveyItem} from '@/api/public'

  export default {
    name: 'ListSurveyItem',
    props: {
      surveyId: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        filter: {},
        tableInstance: {},
        item: {
          options: [],
        },
        rules: {
          questionType: [
            {required: true, message: '请选择问题类型', trigger: 'blur'}
          ],
          summary: [
            {required: true, message: '请输入题目', trigger: 'blur'}
          ]
        },
        dialogFormVisible: false,
        modifyType: null,
        questionTypes: [],
        showOptions: false,
        optionsNum: 1
      }
    },
    created() {
      this.$store.dispatch('app/fetchDicts', 'questionType').then(data => {
        this.questionTypes = data
      })
    },
    methods: {
      fetchSurveyItems_(data) {
        data.surveyId = this.surveyId;
        return fetchSurveyItems(data);
      },
      // 弹窗用
      initData() {
        this.item = {
          options: []
        }
      },
      questionTypeFormatter(row, column, cellValue) {
        for (let i in this.questionTypes) {
          if (cellValue == this.questionTypes[i].code) {
            return this.questionTypes[i].name
          }
        }
      },
      deleteShow() {
        if (!this.tableInstance || !this.tableInstance.selection || this.tableInstance.selection.length === 0) {
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
        if (this.item.questionType != '0003') {
          this.showOptions = true;
          this.optionsNum = this.item.options.length;
        }
        this.dialogFormVisible = true;
        this.modifyType = 'modify';
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      cancelModify() {
        this.dialogFormVisible = false;
      },
      dialogClose() {
        this.initData();
        this.modifyType = null;
      },
      confirmModify() {
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          this.item.surveyId = this.surveyId;
          if (this.modifyType === 'modify') {
            modifySurveyItem(this.item).then(() => {
              this.tableInstance.table.clearSelection()
              this.afterModify()
            })
          } else {
            createSurveyItem(this.item).then(() => {
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
        this.$confirm('此操作将删除该问题, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeSurveyItem(this.tableInstance.table.selection.map(item => item.sysId).join()).then(() => {
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
      //返回
      returnPrePage() {
        this.$emit("on-survey-list-return")
      },
      questionTypeChange(value) {
        if (value === "0003") { // 填空题
          this.showOptions = false;
        } else {
          this.showOptions = true;
          this.optionsNum = 1;
          this.handleChange(this.optionsNum);
        }
      },
      handleChange(value) {
        this.item.options = [];
        for (var i = 1; i <= value; i++) {
          this.item.options.push({
            itemValue: i,
            itemName: ''
          });
        }
      }
    }
  }
</script>

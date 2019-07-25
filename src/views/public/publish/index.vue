<template>
  <div class="app-container">
    <bv-table title="信息公开一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchPublishes" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="add" authority="add" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button v-if="deleteShow() && testShow" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="信息类别" prop="publishType">
            <el-input v-model="filter.publishType" />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="信息摘要" prop="summary">
            <el-input v-model="filter.summary" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column label="信息类别" prop="publishTypeName" align="center" />
      <el-table-column label="信息摘要" prop="summary" align="center" sortable="custom" />
      <el-table-column label="发布日期" prop="publishDate" align="center" sortable="custom" />
      <el-table-column label="发布用户" prop="publishUser" align="center" sortable="custom" />
    </bv-table>
    
    <bv-dialog title="信息公开维护" :visible.sync="dialogFormVisible">
      <bv-form ref="dialogForm" :model="item" :rules="rules">
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item label="信息类别" prop="dataType">
              <el-select v-model="item.dataType" placeholder="请选择信息类别">
                <el-option
                  v-for="item in publishTypes"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="发布日期" prop="publishDate">
              <el-date-picker
                v-model="item.publishDate"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="标题" prop="title">
              <el-input v-model="item.title" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="摘要" prop="summary">
              <el-input v-model.trim="item.summary" />
            </el-form-item>
          </bv-col>
        </bv-row>
        <bv-row>
          <bv-col>
            <bv-editor v-model="item.content" upload-action="/api/file/uploads" />
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
  
  import {showRemoveBtn, removeDivisions, modifyDivision, createDivision} from '@/api/basic'
  import {fetchPublishes} from '@/api/public'
  import {BvEditor} from '@bestvike/components'
  
  export default {
    name: 'ListPublish',
    components: {
      BvEditor
    },
    data() {
      return {
        filter: {},
        tableInstance: {},
        item: {},
        fetchPublishes,
        publishTypes: [],
        rules: {
          dataType: [
            {required: true, message: '请选择信息类别', trigger: 'blur'}
          ],
          publishDate: [
            {required: true, message: '请选择发布日期', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          summary: [
            {required: true, message: '请输入摘要', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入内容', trigger: 'blur'}
          ]
        },
        dialogFormVisible: false,
        modifyType: null,
        testShow: false
      }
    },
    created() {
      this.$store.dispatch('app/fetchDicts', 'publishType').then(data => {
        this.publishTypes = data
      })
    },
    methods: {
      // 弹窗用
      initData() {
        this.item = {}
      },
      deleteShow() {
        if (!this.tableInstance || !this.tableInstance.selection || this.tableInstance.selection.length === 0) {
          return false
        }
        const selection = this.tableInstance.selection
        showRemoveBtn(selection.map(item => item.divisionCode).join()).then((response) => {
          if (response.data == -1) {
            this.testShow = false
          } else {
            this.testShow = true
          }
        })
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
          if (this.modifyType === 'modify') {
            modifyDivision(this.item).then(() => {
              this.tableInstance.table.clearSelection()
              this.afterModify()
            })
          } else {
            createDivision(this.item).then(() => {
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
        this.$confirm('此操作将删除该行政区, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeDivisions(this.tableInstance.table.selection.map(item => item.divisionCode).join()).then(() => {
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
      }
    }
  }
</script>

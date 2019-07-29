<template>
  <div class="app-container">
    <bv-table title="公开信息一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchPublishes" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="add" authority="add" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button v-if="deleteShow()" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="信息类别" prop="publishType">
            <el-select v-model="filter.dataType" placeholder="请选择信息类别">
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
          <el-form-item label="标题" prop="title">
            <el-input v-model="filter.title" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column label="信息类别" prop="dataType" align="center" :formatter="dataTypeFormatter" />
      <el-table-column label="标题" prop="title" align="center" sortable="custom" />
      <el-table-column label="发布日期" prop="publishDate" align="center" sortable="custom" />
      <el-table-column label="发布用户" prop="createUser" align="center" sortable="custom" />
    </bv-table>
    
    <bv-dialog title="公开信息维护" :visible.sync="dialogFormVisible">
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
                value-format="yyyy-MM-dd"
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
            <el-form-item label="内容" prop="content">
              <bv-editor v-model.trim="item.content" upload-action="/api/file/uploads" />
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
  
  import {fetchPublishes, createPublish, modifyPublish, removePublish} from '@/api/public'
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
        modifyType: null
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
      dataTypeFormatter(row, column, cellValue) {
        for (let i in this.publishTypes) {
          if (cellValue == this.publishTypes[i].code) {
            return this.publishTypes[i].name
          }
        }
      },
      deleteShow() {
        if (!this.tableInstance || !this.tableInstance.selection || this.tableInstance.selection.length === 0) {
          return false
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
          if (this.modifyType === 'modify') {
            modifyPublish(this.item).then(() => {
              this.tableInstance.table.clearSelection()
              this.afterModify()
            })
          } else {
            createPublish(this.item).then(() => {
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
        this.$confirm('此操作将删除该公开信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removePublish(this.tableInstance.table.selection.map(item => item.publishId).join()).then(() => {
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

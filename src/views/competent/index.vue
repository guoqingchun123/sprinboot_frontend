<template>
  <div class="app-container">
    <bv-table title="主管单位维护"
              :pagination="true"
              :filter.sync="filter"
              :fetch-api="fetchRoles"
              @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="add" authority="add" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button show="oneOrMore" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="id" prop="competentGuid">
            <el-input v-model="filter.competentGuid" clearable />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="主管单位名称" prop="competentName">
            <el-input v-model="filter.competentName" clearable />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="主管单位地址" prop="competentAddress">
            <el-input v-model="filter.competentAddress" clearable />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="false" prop="competentGuid" label="competentGuid" />
      <el-table-column prop="competentName" label="主管单位名称"  />
      <el-table-column prop="competentAddress" label="主管单位地址" />
      <el-table-column prop="competentPhone" label="主管单位电话"  />
    </bv-table>
    <bv-dialog title="主管单位维护" :visible.sync="dialogFormVisible">
      <bv-form ref="dialogForm" :model="item" :rules="rules">
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item label="系统名称" prop="systemName">
              <el-input v-model="item.systemName" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="主管单位名称" prop="competentName">
              <el-input v-model="item.competentName" />
            </el-form-item>
          </bv-col>
          <bv-col>
          <el-form-item label="主管单位地址" prop="competentAddress">
            <el-input v-model="item.competentAddress" />
          </el-form-item>
        </bv-col>
          <bv-col>
            <el-form-item label="主管单位电话" prop="competentPhone">
              <el-input  v-model="item.competentPhone" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="主管单位logo" prop="competentLogo">
              <el-input v-model="item.competentLogo" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="主管单位简介" prop="summary">
              <el-input v-model="item.summary" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="item.remark" />
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
  import { fetchRoles, createRole, modifyRole, removeRoles } from '@/api/competent/competent'

  export default {
    name: 'editCompetent',
    data() {
      return {
        filter:{
          competentGuid: '',
          competentName: '',
          competentAddress: ''
        },
        dialogFormVisible: false,
        dialogGrantVisible: false,
        modifyType: null,
        item: {
          systemName: '',
          competentName: '',
          competentAddress: '',
          competentPhone: '',
          competentLogo: '',
          summary: '',
          remark: ''},
        // 授权用
        routes: [],
        // 字典
        roleStatusOptions: null,
        authorityRoutes: [],
        tableInstance: {},
        fetchRoles,
        rules: {
          competentName: [
            {required: true, message: '请输入主管单位名称', trigger: 'blur'}
          ],
          competentAddress: [
            {required: true, message: '请输入主管单位地址', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
    },
    methods: {
      // 弹窗用
      initRole() {
        this.item = {}
      },
      startCreate() {
        debugger
        this.item = {}
        this.dialogFormVisible = true
        this.modifyType = 'create'
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      startModify() {
        this.item = {...this.tableInstance.table.selection[0]}
        this.dialogFormVisible = true
        this.modifyType = 'modify'
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      cancelModify() {
        this.initRole()
        this.dialogFormVisible = false
        this.modifyType = null
        /*this.$message({
          message: '取消保存',
          type: 'warning'
        })*/
      },
      confirmModify() {

        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false
          }
          if (this.modifyType === 'modify') {
            let item = {...this.item}
            delete item.permissions
            modifyRole(item).then(() => {
              this.tableInstance.table.clearSelection()
              this.afterModify()
            })
          } else {
            debugger
            createRole(this.item).then(() => {
              this.afterModify()
            })
          }
        })
      },
      afterModify() {
        this.tableInstance.fetchData()
        this.dialogFormVisible = false
        this.modifyType = null
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      },
      startRemove() {
        this.$confirm('此操作将删除该主管单位, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( () => {
          let competentGuids = this.tableInstance.table.selection.map(item => item.competentGuid)
          removeRoles(competentGuids).then(() => {
              // 刷新table
              this.tableInstance.fetchData()
              this.$message({
                message: '删除主管单位成功',
                type: 'success'
              })
          })
        })
      },


      changeSelectAll(value, meta) {
        if (value) {
          meta.authorityOperates__ = []
          meta.operates.forEach(operate => {
            meta.authorityOperates__.push(operate.name)
          })
        } else {
          meta.authorityOperates__ = []
        }
      },
      changeSelect(values, meta) {
        if (values && values.length === meta.operates.length) {
          meta.isAllOperatesSelected__ = true
        } else {
          meta.isAllOperatesSelected__ = false
        }
      },
      showLabel(data) {
        return this.$filters.transTitle(data.meta)
      },

      // 辅助函数
      isIndeterminate(meta) {
        // data.meta
        return meta.authorityOperates__.length > 0 && meta.authorityOperates__.length < meta.operates.length
      }
    }
  }
</script>

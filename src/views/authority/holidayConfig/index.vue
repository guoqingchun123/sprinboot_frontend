<template>
  <div class="app-container">
    <bv-table ref="table" title="日期配置一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchHolidayConfig" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="add" authority="add" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button show="oneOrMore" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
        <bv-button show="none" view="remove" @click="upload()">导入</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="日期" prop="holidayDate">
            <el-date-picker
              v-model="filter.holidayDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="年度" prop="holidayYear">
            <el-date-picker
              v-model="filter.holidayYear"
              align="right"
              type="year"
              placeholder="选择年"
              value-format="yyyy"
            />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="日期类别" prop="holidayType">
            <el-select v-model="filter.holidayType" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column label="日期" prop="holidayDate" align="center" />
      <el-table-column label="年度" prop="holidayYear" align="center" sortable="custom" />
      <el-table-column label="日期类别" prop="holidayType" align="center" sortable="custom" :formatter="holidayTypeFormat" />
      <el-table-column label="日期名称" prop="holidayName" align="center" sortable="custom" />
    </bv-table>

    <bv-dialog title="日期维护" :visible.sync="dialogFormVisible">
      <bv-form>
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item label="日期" prop="holidayDate">
              <el-date-picker
                v-if="modifyType === 'create'"
                v-model="holidayConfig.holidayDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              />
              <span v-else v-text="holidayConfig.holidayDate" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="年度" prop="holidayYear">
              <el-date-picker
                v-model="holidayConfig.holidayYear"
                align="right"
                type="year"
                placeholder="选择年"
                value-format="yyyy"
              />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="日期类别" prop="holidayType">
              <el-select v-model="holidayConfig.holidayType" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="日期名称" prop="holidayName">
              <el-input v-model="holidayConfig.holidayName" />
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
  import { fetchHolidayConfig, modifyHolidayConfig, createHolidayConfig } from '@/api/employee/empAttend'

  export default {
    name: 'HolidayConfig',
    data() {
      return {
        // 过滤条件
        filter: {},

        modifyType: null,
        dialogFormVisible: false,
        holidayConfig: {
          holidayDate: null,
          holidayYear: null,
          holidayType: null,
          holidayName: null
        },
        options: [{
          value: '1',
          label: '工作日'
        },{
          value: '2',
          label: '休息日'
        },{
          value: '3',
          label: '节假日'
        }],
        tableInstance: {},
        fetchHolidayConfig
      }
    },
    methods: {
      holidayTypeFormat(row, column, cellValue) {
        if (cellValue == '1') {
          return '工作日'
        }else if (cellValue == '2'){
          return '休息日'
        } else {
          return '节假日'
        }
      },
      // 弹窗用
      initHolidayConfig() {
        this.holidayConfig = {
          holidayDate: null,
          holidayYear: null,
          holidayType: null,
          holidayName: null
        }
      },
      startCreate() {
        this.dialogFormVisible = true
        this.modifyType = 'create'
      },
      startModify() {
        this.holidayConfig = {...this.tableInstance.table.selection[0]}
        this.dialogFormVisible = true
        this.modifyType = 'modify'
      },
      cancelModify() {
        this.initHolidayConfig()
        this.dialogFormVisible = false
        this.modifyType = null
        this.$message({
          message: '取消保存',
          type: 'warning'
        })
      },
      confirmModify() {
        if (this.modifyType === 'modify') {
          let holidayConfig = {...this.holidayConfig}
          modifyHolidayConfig(holidayConfig).then(() => {
            this.tableInstance.table.clearSelection()
            this.afterModify()
          })
        } else {
          createHolidayConfig(this.holidayConfig).then(() => {
            this.afterModify()
          })
        }
      },
      afterModify() {
        this.tableInstance.fetchData()
        this.initHolidayConfig()
        this.dialogFormVisible = false
        this.modifyType = null
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      },
      upload() {
        console.log(this.tableInstance)
      }
    }
  }
</script>


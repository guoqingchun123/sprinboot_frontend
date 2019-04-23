<template>
  <div class="app-container">
    <bv-table ref="table" title="撤销审核行事历" :pagination="true" :filter.sync="filter" :filter-switch="false" :is-fuzzy="false" :fetch-api="fetchCancelDatas" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <el-button show="oneOrMore" type="warning" icon="el-icon-delete" @click="cancelApproval">撤销审核</el-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="行事历日期:" prop="scheduleDate">
            <el-date-picker v-model="filter.scheduleDate" type="date" placeholder="请输入查询日期" value-format="yyyy-MM-dd" clearable />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="false" prop="scheduleId" label="系统编号" />
      <el-table-column prop="scheduleDate" label="行事历日期" sortable />
      <el-table-column prop="empName" label="员工姓名" sortable />
      <el-table-column prop="briefing" label="简报" />
      <el-table-column prop="workHours" label="实际投入工时(/h)" />
    </bv-table>
  </div>
</template>

<script>
  import { fetchCancelDatas, cancelApproval } from '@/api/employee/schedule'

  export default {
    name: 'CancelSchedule',
    data() {
      return {
        // 过滤条件
        filter: {
          scheduleDate: ''
        },
        //隐藏查询开关
        filterMoreShow: false,
        tableInstance: {},
        fetchCancelDatas
      }
    },
    methods: {
      //撤销审核
      cancelApproval() {
        let selection = this.tableInstance.table.selection
        cancelApproval(selection).then((response) => {
          this.tableInstance.fetchData()
          if (response.data == 1) {
            this.$message({
              type: 'success',
              message: '撤销成功'
            })
          }else {
            this.$message({
              type: 'error',
              message: '撤销失败'
            })
          }
        })
      }
    }
  }
</script>

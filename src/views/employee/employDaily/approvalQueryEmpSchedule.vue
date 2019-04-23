<template>
  <div class="app-container">
    <bv-table ref="table" title="行事历审核" :pagination="true" :filter.sync="filter" :filter-switch="false" :is-fuzzy="false" :fetch-api="fetchAuditAll" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <el-button type="primary" icon="el-icon-view" @click="returnBtn">返回</el-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="行事历日期:" prop="scheduleDate">
            <el-date-picker v-model="filter.scheduleDate" type="date" placeholder="请输入查询日期" value-format="yyyy-MM-dd" clearable />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column v-if="false" prop="scheduleId" label="系统编号" />
      <el-table-column prop="scheduleDate" label="行事历日期" sortable />
      <el-table-column prop="empName" label="员工姓名" sortable />
      <el-table-column prop="briefing" label="简报" />
      <el-table-column prop="workHours" label="实际投入工时(/h)" />
      <el-table-column prop="state" label="审核状态" sortable :formatter="stateFormat" />
    </bv-table>
  </div>
</template>

<script>
  import { fetchAuditAll } from '@/api/employee/schedule'

  export default {
    name: 'ApprovalQueryEmpSchedule',
    data() {
      return {
        // 过滤条件
        filter: {
          scheduleDate: ''
        },
        //隐藏查询开关
        filterMoreShow: false,
        tableInstance: {},
        fetchAuditAll
      }
    },
    computed: {
      //获取所有展开页路由信息
      visitedViews() {
        return this.$store.state.tagsView.visitedViews
      }
    },
    methods: {
      stateFormat(row, column, cellValue) {
        if (cellValue == '0001') {
          return '未审核'
        }else {
          return '已审核'
        }
      },
      //返回
      returnBtn() {
        for (let i in this.visitedViews) {
          if (this.visitedViews[i].name == 'ApprovalQueryEmpSchedule') {
            this.$store.dispatch('tagsView/delView', this.visitedViews[i])
            break
          }
        }
        this.$router.push({
          // name: sessionStorage.getItem('scheduleRouter')
          name: 'AuditEmpSchedule'
        })
      }
    }
  }
</script>

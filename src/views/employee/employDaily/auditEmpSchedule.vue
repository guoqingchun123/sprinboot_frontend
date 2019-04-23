<template>
  <div class="app-container">
    <bv-table ref="table" title="行事历审核" :pagination="true" :filter.sync="filter" :filter-switch="false" :is-fuzzy="false" :fetch-api="fetchAuditDatas" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <el-button show="oneOrMore" type="warning" icon="el-icon-edit" @click="approval">审核</el-button>
        <el-button type="primary" icon="el-icon-view" @click="queryAll">查询所有</el-button>
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
  import { fetchAuditDatas, approvalSchedule } from '@/api/employee/schedule'

  export default {
    name: 'AuditEmpSchedule',
    data() {
      return {
        // 过滤条件
        filter: {
          scheduleDate: ''
        },
        //隐藏查询开关
        filterMoreShow: false,
        tableInstance: {},
        fetchAuditDatas
      }
    },
    computed: {
      //获取所有展开页路由信息
      visitedViews() {
        return this.$store.state.tagsView.visitedViews
      }
    },
    methods: {
      //查询所有
      queryAll() {
        for (let i in this.visitedViews) {
          if (this.visitedViews[i].name == 'AuditEmpSchedule') {
            this.$store.dispatch('tagsView/delView', this.visitedViews[i])
            break
          }
        }
        // sessionStorage.setItem('scheduleRouter','AuditEmpSchedule')
        this.$router.push({
          name: 'ApprovalQueryEmpSchedule'
        })
      },
      //审核
      approval() {
        let selection = this.tableInstance.table.selection
        approvalSchedule(selection).then((response) => {
          this.tableInstance.fetchData()
          if (response.data == 1) {
            this.$message({
              type: 'success',
              message: '审核成功'
            })
          }else {
            this.$message({
              type: 'error',
              message: '审核失败'
            })
          }
        })
      }
    }
  }
</script>

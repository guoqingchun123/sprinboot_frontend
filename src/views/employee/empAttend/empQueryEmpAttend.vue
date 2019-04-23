<template>
  <div class="app-container">
    <bv-table-header title="我的考勤记录" />
    <bv-table-search
      :is-fuzzy.sync="isFuzzy"
      :fuzzy.sync="fuzzy"
      :filter.sync="filter"
      @on-fuzzy-start="fetchData"
      @on-filter-start="fetchData"
      @on-filter-reset="fetchData"
    >
      <bv-col layout="between">
        <el-form-item label="考勤日期" prop="attendDate">
          <el-date-picker
            v-model="filter.attendDate"
            type="daterange"
            range-separator="至"
            unlink-panels
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            clearable
          />
        </el-form-item>
      </bv-col>
    </bv-table-search>
    <el-table
      ref="table"
      v-loading="loading"
      :data="items"
      @sort-change="onSort"
    >
      <el-table-column prop="attendDate" label="考勤日期" sortable />
      <el-table-column prop="empName" label="员工姓名" />
      <el-table-column prop="checkInTime" label="签到时间" sortable />
      <el-table-column prop="checkOutTime" label="签退时间" sortable />
      <el-table-column prop="lateMinute" label="迟到分钟数" sortable />
      <el-table-column prop="earlyMinute" label="早退分钟数" sortable />
      <el-table-column prop="overtimeMinute" label="加班分钟数" sortable />
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <bv-pagination
      :total="total" :current-page.sync="currentPage" :page-size="limit"
      @current-change="handlePageChange"
    />
    <bv-dialog title="查看详情" :visible.sync="dialogTableVisible">
      <bv-table-search
        :is-fuzzy.sync="isDialogFuzzy"
        :fuzzy.sync="dialogFuzzy"
        :filter-more-show="filterMoreShow"
        @on-fuzzy-start="fetchDialogData"
      />
      <el-table
        ref="table"
        v-loading="dialogLoading"
        :data="dialogItems"
        @sort-change="onDialogSort"
      >
        <el-table-column prop="empName" label="员工姓名" />
        <el-table-column prop="attendDate" label="考勤日期" />
        <el-table-column prop="attendDateTime" label="考勤时间" sortable>
          <template slot-scope="scope">
            {{ scope.row.attendDateTime | formatDateByAttendDialog }}
          </template>
        </el-table-column>
        <el-table-column prop="attendDevice" label="打卡方式" :formatter="formatAttendDevice" sortable />
      </el-table>
      <bv-pagination
        :total="totalDialog" :current-page.sync="currentDialogPage" :page-size="dialogLimit"
        @current-change="handleDialogPageChange"
      />
    </bv-dialog>
  </div>
</template>

<script>
  import { fetchEmpAttend, fetchAttendLog } from '@/api/employee/empAttend'
  import {getDictByDictCode} from '@/api/authority'
  import { defaults as utils } from '@bestvike/utils'

  export default {
    name: 'ListEmpAttend',
    data() {
      return {
        //是否加载中
        loading: false,
        items: null,
        isFuzzy: true,
        // 模糊查询条件
        fuzzy: null,
        // 过滤条件
        filter: {},
        // 当前排序
        sort: null,
        total: 0,
        limit: 10,
        currentPage: 1,
        //Dialog
        dialogLoading: false,
        dialogTableVisible: false,
        isDialogFuzzy: true,
        dialogFuzzy: null,
        totalDialog: 0,
        currentDialogPage: 1,
        dialogLimit: 5,
        dialogRow: 0,
        dialogFilter: {},
        dialogItems: null,
        dialogSort: null,
        //查看当前行数据
        row: {},
        filterMoreShow: false,
        dict: []
      }
    },
    created() {
      this.fetchData()
      this.OnDict('attendType')
    },
    methods: {
      formatAttendDevice(row, column, cellValue) {
        for (let i in this.dict) {
          if (cellValue == this.dict[i].dictCode) {
            return this.dict[i].dictName
          }
        }
      },
      //查询字典信息
      OnDict(dictCode) {
        let dict = {
          dictCode: dictCode
        }
        getDictByDictCode(dict).then(response => {
          this.dict =  response.data
        })
      },
      onSort(sort) {
        this.sort = utils.transTableSort(sort)
        this.fetchData()
      },
      onDialogSort(sort) {
        this.dialogSort = utils.transTableSort(sort)
        this.fetchDialogData()
      },
      fetchData() {
        this.loading = true
        let data = {}
        if (this.isFuzzy) {
          if (this.fuzzy) {
            data.fuzzy = this.fuzzy
          }
        } else {
          for (let item in this.filter) {
            if (this.filter[item] instanceof Array) {
              data[item] = this.filter[item].join(',')
              continue
            }
            data[item] = this.filter[item]
          }
        }
        if (this.sort) {
          data.sort = this.sort
        }
        // 分页信息
        data.page = this.currentPage
        data.limit = this.limit
        data.isAll = false
        fetchEmpAttend(data).then(response => {
          this.total = response.data.total
          this.items = response.data.list
          setTimeout(() => {
            this.loading = false
          }, 500);
        }).catch(() => {
          setTimeout(() => {
            this.loading = false
          }, 500);
        })
      },
      fetchDialogData() {
        this.dialogLoading = true
        let data = {}
        data.empId = this.row.empId
        data.attendDate = this.row.attendDate
        if (this.isDialogFuzzy) {
          if (this.dialogFuzzy) {
            data.fuzzy = this.dialogFuzzy
          }
        }
        if (this.dialogSort) {
          data.sort = this.dialogSort
        }
        // 分页信息
        data.page = this.currentDialogPage
        data.limit = this.dialogLimit
        fetchAttendLog(data).then(response => {
          this.totalDialog = response.data.total
          this.dialogItems = response.data.list
          setTimeout(() => {
            this.dialogLoading = false
          }, 500);
        }).catch(() => {
          setTimeout(() => {
            this.dialogLoading = false
          }, 500);
        })
      },
      //分页点击
      handlePageChange(value) {
        this.currentPage = value;
        this.fetchData()
      },
      handleClick(row) {
        this.currentDialogPage = 1
        this.row = row
        this.dialogTableVisible = true
        this.fetchDialogData()
      },
      //弹窗分页点击
      handleDialogPageChange(value) {
        this.currentDialogPage = value
        this.handleClick()
      }
    }
  }
</script>


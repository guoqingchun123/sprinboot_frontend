<template>
  <div class="app-container">
    <bv-table ref="table" title="我的差旅明细" :pagination="true" :filter.sync="filter" :fetch-api="fetchTravels">
      <div slot="search">
        <bv-col>
          <el-form-item label="出差月份">
            <el-date-picker v-model="filter.travelMonth" type="month" format="yyyy-MM" value-format="yyyy-MM" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column label="序号" type="index" />
      <el-table-column label="出差月份" prop="travelMonth" align="center" />
      <el-table-column label="起始日期" prop="startDate" align="center" />
      <el-table-column label="结束日期" prop="endDate" align="center" />
      <el-table-column label="出差地点" prop="travelPlace" align="center" />
      <el-table-column label="项目名称" prop="projIdName" align="center" />
      <el-table-column label="费用类别" prop="feeType" align="center" />
      <el-table-column label="总天数" prop="days" align="center" />
      <el-table-column label="补助金额" prop="travelAmount" align="center" />
      <el-table-column label="补助金额合计" prop="totalAmount" align="center" />
      <el-table-column label="实际报销期间" prop="payProid" align="center" />
      <el-table-column label="相关费用单据归属期" prop="vstingPriod" align="center" />
    </bv-table>
  </div>
</template>

<script>
  import { fetchTravels } from '@/api/employee/travels'

  export default {
    name: 'ListMyTravel',
    data() {
      return {
        //总数据
        tableDatas: [],
        //选中的数据
        selection: [],
        loading:null,
        isFuzzy: true,
        // 模糊查询条件
        fuzzy: null,
        //精确查询内容
        filter:{
          travelMonth: ''
        },
        //新增弹窗是否显示
        dialogVisible: false,
        //导入数据弹窗是否显示
        exportModal: false,
        //每页的大小
        pageSize: 10,
        //当前页码
        currPage: 1,
        //符合条件的数据总数
        total:0,
        fetchTravels
      }
    }
  }
</script>

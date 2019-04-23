<template>
  <div>
    <bv-table-header title="会议室预约">
      <bv-button v-show="$refs.table && $refs.table.selection.length === 0" view="add" @click="yyCreate()">预约</bv-button>
    </bv-table-header>
    <bv-table-search
      :is-fuzzy.sync="isFuzzy"
      :fuzzy.sync="fuzzy"
      :filter.sync="filter"
      @on-fuzzy-start="fetchData"
      @on-filter-start="fetchData"
      @on-filter-reset="fetchData"
    >
      <bv-col>
        <el-form-item label="会议室名称" prop="meetingPlace">
          <el-select v-model="filter.meetingPlace" placeholder="请选择" clearable>
            <el-option label="大会议室" value="1" />
            <el-option label="中会议室" value="2" />
            <el-option label="小会议室" value="3" />
          </el-select>
        </el-form-item>
      </bv-col>
      <bv-col>
        <el-form-item label="开始时间">
          <el-col :span="11">
            <el-form-item prop="startTime">
              <el-date-picker v-model="filter.startTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" />
            </el-form-item>
          </el-col>
        </el-form-item>
      </bv-col>
      <bv-col>
        <el-form-item label="结束时间">
          <el-col :span="11">
            <el-form-item prop="endTime">
              <el-date-picker v-model="filter.endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" />
            </el-form-item>
          </el-col>
        </el-form-item>
      </bv-col>
    </bv-table-search>

    <el-table ref="table" v-loading="loading" :data="items" :cell-style="cellStyle" border @sort-change="onSort">
      <el-table-column
        fixed
        prop="meeRmId"
        label="会议室编号"
        width="100"
        align="center"
      />
      <el-table-column
        fixed
        prop="meetingPlace"
        label="会议室名称"
        width="100"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.meetingPlace === '1' ">大会议室</span>
          <span v-else-if="scope.row.meetingPlace === '2' ">中会议室</span>
          <span v-else-if="scope.row.meetingPlace === '3' ">小会议室</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed
        prop="meeRmMax"
        label="容纳人数"
        width="90"
        align="center"
      />
      <el-table-column
        prop="time1"
        label="8:30"
        width="70"
      />
      <el-table-column
        prop="time2"
        label="9:00"
        width="70"
      />
      <el-table-column
        prop="time3"
        label="9:30"
        width="70"
      />
      <el-table-column
        prop="time4"
        label="10:00"
        width="70"
      />
      <el-table-column
        prop="time5"
        label="10:30"
        width="70"
      />
      <el-table-column
        prop="time6"
        label="11:00"
        width="70"
      />
      <el-table-column
        prop="time7"
        label="11:30"
        width="70"
      />
      <el-table-column
        prop="time8"
        label="12:00"
        width="70"
      />
      <el-table-column
        prop="time9"
        label="12:30"
        width="70"
      />
      <el-table-column
        prop="time10"
        label="13:00"
        width="70"
      />
      <el-table-column
        prop="time11"
        label="13:30"
        width="70"
      />
      <el-table-column
        prop="time12"
        label="14:00"
        width="70"
      />
      <el-table-column
        prop="time13"
        label="14:30"
        width="70"
      />
      <el-table-column
        prop="time14"
        label="15:00"
        width="70"
      />
      <el-table-column
        prop="time15"
        label="15:30"
        width="70"
      />
      <el-table-column
        prop="time16"
        label="16:00"
        width="70"
      />
      <el-table-column
        prop="time17"
        label="16:30"
        width="70"
      />
      <el-table-column
        prop="time18"
        label="17:00"
        width="70"
      />
      <el-table-column
        prop="time19"
        label="17:30"
        width="70"
      />
      <el-table-column
        prop="time20"
        label="18:00"
        width="70"
      />
    </el-table>
    <bv-pagination :total="total" :current-page.sync="currentPage" :page-size="limit" @current-change="handlePageChange" />
  </div>
</template>

<script>
  import { fetchMeetingRoom , fetchRoomStyle} from '@/api/meetingManage'
  import { defaults as utils } from '@bestvike/utils'

  export default {
    name: 'MeetingRoom',
    data() {
      return {
        //表格标题
        tableTitle: '会议室列表',

        //是否加载中
        loading: false,
        isFilter: false,
        dialogFormVisible: false,
        modifyType: null,
        items: null,
        timeList: null,
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

        dateVal: '',
        resultInfo: {}
      }
    },
    computed: {
      //获取所有展开页路由信息
      visitedViews() {
        return this.$store.state.tagsView.visitedViews
      }
    },
    created() {
      this.fetchData();
    },
    methods: {
      cellStyle({row,columnIndex}){
        for (let i=0;i< this.resultInfo.length;i++) {
          if (row.meetingPlace == this.resultInfo[i].meetPalce){
            let date = this.resultInfo[i].list
            for (let colIndex in date) {
              if (columnIndex == date[colIndex]) {
                return 'background-color: #FFA500'
              }
            } 
          }
        }
      },
      onSort(sort) {
        this.sort = utils.transTableSort(sort)
        this.fetchData()
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
            data[item] = this.filter[item]
          }
        }
        if (this.sort) {
          data.sort = this.sort
        }
        // 分页信息
        data.page = this.currentPage
        data.limit = this.limit
        fetchMeetingRoom(data).then(response => {
          this.total = response.data.total
          this.items = response.data.list
          setTimeout(() => {
            this.loading = false
          }, 500);
        }).catch(() => {
          setTimeout(() => {
            this.loading = false
          }, 500);
        }),
          fetchRoomStyle(data).then(response => {
            this.resultInfo = response.data.glList
            this.timeList = response.data.items
            setTimeout(() => {
              this.loading = false
            }, 500);
          }).catch(() => {
            setTimeout(() => {
              this.loading = false
            }, 500);
          })
      },
      handlePageChange(value) {
        this.currentPage = value;
        this.fetchData()
      },
      yyCreate() {
        for (let i in this.visitedViews) {debugger
          if (this.visitedViews[i].name == 'meetingSummary') {
            this.$store.dispatch('delView', this.visitedViews[i])
            break
          }
        }
        this.$router.push({
                            name: 'buildMeeting',
                          })
        // setTimeout("startCreate()", 100);
        // setTimeout(() => {debugger
        //   // window.onclick().click(startCreate())
        // }, 100);
      },
    }
  }
</script>

<template>
  <div class="app-container">
    <bv-row layout="table-header">
      <bv-col layout="title">
        <h3>我的行事历</h3>
      </bv-col>
      <bv-col layout="operate">
        <el-button v-show="$refs.table && $refs.table.selection.length === 0" type="primary" icon="el-icon-plus" @click="startCreate">新增</el-button>
        <el-button v-show="$refs.table && $refs.table.selection.length > 0" type="success" icon="el-icon-news" @click="saveBtn('tableForm')">保存</el-button>
        <el-button v-show="$refs.table && $refs.table.selection.length > 0" type="warning" icon="el-icon-delete" @click="deleteBtn">删除</el-button>
        <el-button type="primary" icon="el-icon-view" @click="queryBefore">查询以往</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="refreshTable">刷新</el-button>
      </bv-col>
    </bv-row>
    <bv-row layout="table-search">
      <bv-col>
        <bv-row layout="table-filter">
          <bv-form ref="filter" :model="filter">
            <bv-col>
              <el-form-item label="查询日期:" prop="scheduleDate">
                <el-date-picker v-model="filter.scheduleDate" type="date" placeholder="请输入查询日期" value-format="yyyy-MM-dd" clearable />
              </el-form-item>
            </bv-col>
            <bv-col layout="operate">
              <bv-button layout="filter" @click="fetchData()">查询</bv-button>
              <bv-button layout="reset" @click="filterReset()">重置</bv-button>
            </bv-col>
          </bv-form>
        </bv-row>
      </bv-col>
    </bv-row>
    <el-form ref="tableForm" :model="tableForm">
      <el-table
        ref="table"
        v-loading="loading"
        :data="tableForm.items"
        @sort-change="onSort"
        @selection-change="selectChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="false" prop="scheduleId" label="系统编号" />
        <el-table-column prop="projId" label="项目名称">
          <template slot-scope="scope">
            <template v-if="scope.row.__edit__ && scope.row.__id__">
              <el-form-item :prop="`items.${scope.$index}.projId`" :rules="tableRules.projId">
                <el-select v-model="scope.row.projId" filterable placeholder="请选择" clearable @change="projIdChange(scope.row.projId,scope.row.__id__)">
                  <el-option
                    v-for="item in projInfos"
                    :key="item.projId"
                    :label="item.projName"
                    :value="item.projId"
                  />
                </el-select>
              </el-form-item>
            </template>
            <span v-else>{{ scope.row.projName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskId" label="任务名称">
          <template slot-scope="scope">
            <template v-if="scope.row.__edit__ && scope.row.__id__">
              <el-form-item :prop="`items.${scope.$index}.taskId`" :rules="tableRules.taskId">
                <el-select v-model="scope.row.taskId" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in taskInfos[scope.row.__id__]"
                    :key="item.taskId"
                    :label="item.taskName"
                    :value="item.taskId"
                  />
                </el-select>
              </el-form-item>
            </template>
            <span v-else>{{ scope.row.taskName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="briefing" label="简报">
          <template slot-scope="scope">
            <template v-if="scope.row.__edit__ && scope.row.__id__">
              <el-form-item :prop="`items.${scope.$index}.briefing`" :rules="tableRules.briefing">
                <el-input v-model="scope.row.briefing" type="textarea" class="edit-input" size="small" />
              </el-form-item>
            </template>
            <span v-else>{{ scope.row.briefing }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="workHours" label="实际投入工时(/h)">
          <template slot-scope="scope">
            <template v-if="scope.row.__edit__ && scope.row.__id__">
              <el-form-item :prop="`items.${scope.$index}.workHours`" :rules="tableRules.workHours">
                <el-input v-model="scope.row.workHours" class="edit-input" type="number" size="small" />
              </el-form-item>
            </template>
            <span v-else>{{ scope.row.workHours }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
  import { fetchSchedules, fetchProjInfos, fetchTaskInfos, insertSchedule, deleteSchedule } from '@/api/employee/schedule'
  import { defaults as utils } from '@bestvike/utils'

  export default {
    name: 'EditEmpSchedule',
    data() {
      return {
        tableForm:{
          items:[],
        },
        tableRules:{
          projId: [
            { required: true, message: '请选择项目', trigger: 'change' }
          ],
          taskId: [
            { required: true, message: '请选择任务', trigger: 'change' }
          ],
          briefing: [
            { required: true, message: '请输入简报', trigger: 'blur' },
          ],
          workHours:[
            { required: true, message: '请输入实际投入工时'}
          ]
        },
        //是否加载中
        loading: false,
        row: {},
        // 过滤条件
        filter: {
          scheduleDate: new Date()
        },
        // 当前排序
        sort: null,
        projInfos: [],
        //后台请求的任务数据
        taskInfos: [],
        //选中的行index
        selectIndex: []
      }
    },
    computed: {
      //获取所有展开页路由信息
      visitedViews() {
        return this.$store.state.tagsView.visitedViews
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      //保存选中行的行索引，方便保存按钮对相应form校验
      selectChange(selection) {
        this.selectIndex = []
        selection.forEach((val) => {
          if (val.__edit__) {
            this.tableForm.items.forEach((v, i) => {
              // id 是每一行的数据id
              if(val.__id__ == v.__id__){
                this.selectIndex.push(i)
              }
            })
          }
        })
      },
      fetchData() {
        this.loading = true
        setTimeout(() => {
          let data = {
            scheduleDate: this.filter.scheduleDate
          }
          fetchSchedules(data).then(response => {
            if (response.data != '') {
              this.tableForm.items = response.data
            }else {
              this.tableForm.items = []
            }
          })
          fetchProjInfos().then(response => {
            this.projInfos = response.data
          })
          this.loading = false
        }, 500);
      },
      filterReset() {
        this.filter.scheduleDate = new Date()
        this.fetchData()
      },
      onSort(sort) {
        this.sort = utils.transTableSort(sort)
        this.fetchData()
      },
      startCreate() {
        if(this.filter.scheduleDate) {
          this.row = {
            projId: null,
            taskId: null,
            taskIds: [],
            briefing: null,
            workHours: null,
            scheduleDate: this.filter.scheduleDate,
            state: 0,
            __id__: Math.random(),
            __edit__: true
          }
          this.tableForm.items.push(this.row)
        }else {
          this.$message({
            type: 'warning',
            message: '请选择查询日期'
          })
        }
      },
      //项目名称下拉菜单 on-change,级联查询
      projIdChange(projId,id) {
        let data = {
          projId: projId
        }
        fetchTaskInfos(data).then(response => {
          this.taskInfos[id] = response.data
        })
      },
      //删除按钮
      deleteBtn() {
        this.$confirm('此操作将删除该行事历, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let selection = this.$refs.table.selection
          deleteSchedule(selection.map(item => item.scheduleId).join()).then(() => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        })
      },
      //保存按钮
      saveBtn(formName) {
        // this.$refs[formName].resetFields();
        //合并需要校验的form prop
        let fieldList = [];
        this.selectIndex.forEach((val) => {
          fieldList.push('items.'+val+'.projId')
          fieldList.push('items.'+val+'.taskId')
          fieldList.push('items.'+val+'.briefing')
          fieldList.push('items.'+val+'.workHours')
        })
        let form = this.$refs[formName];
        Promise.all(fieldList.map(item => {
          let p = new Promise(function (resolve) {
            form.validateField(item, (error) => {
              resolve(error)
            })
          });
          return p;
        })).then((data) => {
          // data 里是各个字段的验证错误信息, 如果为空串则认为验证通过, 如果数组里全为空串则所有验证通过
          // 判断data 里是否全是空串
          let flag = false
          for (let i in data) {
            if (data[i] != "") {
              flag = true
              break
            }
          }
          if (!flag) {
            let selection = this.$refs.table.selection
            insertSchedule(selection).then(() => {
              this.fetchData()
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            }).catch(() => {
              setTimeout(() => {
                this.loading = false
              }, 500);
            })
          } else {
            console.log('校验失败')
          }
        })
      },
      //查询以往
      queryBefore() {
        /*this.$router.replace({
          path: '/employManage/employDaily/empQueryEmpSchedule'
        })*/
        for (let i in this.visitedViews) {
          if (this.visitedViews[i].name == 'EditEmpSchedule') {
            this.$store.dispatch('tagsView/delView', this.visitedViews[i])
            break
          }
        }
        // sessionStorage.setItem('scheduleRouter','EditEmpSchedule')
        this.$router.push({
          name: 'EmpQueryEmpSchedule'
        })
      },
      //刷新
      refreshTable() {
        this.fetchData()
      }
    }
  }
</script>

<style>
  /*------------------------修改type=number的样式------------------------------------------------*/
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }
</style>

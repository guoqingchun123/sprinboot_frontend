<template>
  <div class="app-container">
    <bv-table-header title="服务器信息列表">
      <bv-button v-show="$refs.table && $refs.table.selection.length === 0" view="add" @click="addServerDetail">增加</bv-button>
      <bv-button v-show="$refs.table && $refs.table.selection.length === 1" view="modify" @click="editServerDetail('1')">编辑</bv-button>
      <bv-button v-show="$refs.table && $refs.table.selection.length > 0" view="remove" @click="deleteMoreServerDetail">删除</bv-button>
      <el-button type="primary" icon="el-icon-upload">数据导出</el-button>
    </bv-table-header>
    <bv-table-search
      :is-fuzzy.sync="isFuzzy"
      :fuzzy.sync="fuzzy"
      :filter.sync="filter"
      @on-fuzzy-start="initTable"
      @on-filter-start="initTable"
      @on-filter-reset="initTable"
    >
      <bv-col>
        <el-form-item label="服务器名称:">
          <el-input v-model="filter.serverName" />
        </el-form-item>
      </bv-col>
    </bv-table-search>
    <el-table
      ref="table"
      v-loading="loading"
      :data="tableData"
      @select="checkboxSelect"
      @sort-change="onSort"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="服务器名称" prop="serverName" align="center" />
      <el-table-column label="IP配置" prop="ipAllocation" align="center" />
      <el-table-column label="操作系统类型" prop="operateSystem" align="center" />
      <el-table-column label="系统用户名和密码" prop="usernameAndPsd" align="center" />
      <el-table-column label="配置信息" prop="allocationInfo" align="center" />
      <el-table-column label="识别标识" prop="serverTag" align="center" />
      <el-table-column label="序列号" prop="serialNumber" align="center" />
      <el-table-column label="保修期" prop="warrantyDate" align="center" :formatter="warrantyDateFormatter" />
      <el-table-column label="公司采购" prop="isCompanyBuy" align="center" />
      <el-table-column label="可以远程" prop="isRemote" align="center" />
      <el-table-column label="远程描述" prop="remoteDesc" align="center" />
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template scope="scope">
          <el-button type="text" size="small" @click="editServerDetail(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteServerDetail(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <bv-pagination :total="total" :current-page.sync="currPage" :page-size="pageSize" @current-change="handleCurrentChange" />
    <el-dialog title="维护服务器信息" :visible.sync="dialogServerVisible" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="serverForm" :model="serverForm" label-width="120px" label-position="right" :rules="rules" style="width: 95%;">
        <el-row :gutter="$CONST.row.gutter">
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="服务器名称:" prop="serverName">
              <el-input v-model="serverForm.serverName" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="操作系统类型:" prop="operateSystem" style="white-space: nowrap">
              <el-select v-model="serverForm.operateSystem" placeholder="请选择">
                <el-option
                  v-for="item in addoperateSystem"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout3">
            <el-form-item label="IP配置:" prop="ipAllocation">
              <el-input v-model="serverForm.ipAllocation" type="textarea" :rows="1" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout3">
            <el-form-item label="系统用户名和密码:" style="white-space: nowrap;" prop="usernameAndPsd">
              <el-input v-model="serverForm.usernameAndPsd" type="textarea" :rows="1" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout3">
            <el-form-item label="配置信息:" prop="allocationInfo">
              <el-input v-model="serverForm.allocationInfo" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout3">
            <el-form-item label="识别标识:" prop="serverTag">
              <el-input v-model="serverForm.serverTag" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout3">
            <el-form-item label="序列号:" prop="serialNumber">
              <el-input v-model="serverForm.serialNumber" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="保修期:" prop="warrantyDate">
              <el-date-picker v-model="serverForm.warrantyDate" type="date" placeholder="选择日期" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="是否公司采购:" prop="isCompanyBuy">
              <el-select v-model="serverForm.isCompanyBuy" placeholder="请选择">
                <el-option
                  v-for="item in addIsRemote"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="是否可以远程:" prop="isRemote">
              <el-select v-model="serverForm.isRemote" placeholder="请选择">
                <el-option
                  v-for="item in addIsRemote"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout3">
            <el-form-item label="远程描述:" prop="remoteDesc">
              <el-input v-model="serverForm.remoteDesc" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addServerConfirm()">保存</el-button>
        <el-button @click="cancelEdit()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { queryCustomServerInfo,editCustServerInfo,addCustServerInfo,deleteCustServerInfo } from '@/api/custom/contractMessage'
  import { defaults as utils } from '@bestvike/utils'
  import moment from 'moment'


  export default {
    props:{
      corpId:{
        type: String,
        default: ''
      }
    },
    data(){
      return{
        isFuzzy: true,
        // 模糊查询条件
        fuzzy: null,
        // 过滤条件
        filter: {
          serverName: ''
        },
        pageSize: 10,
        //当前页码
        currPage: 1,
        //符合条件的数据总数
        total: 0,
        loading:false,
        tableData:[],
        row:{},
        //存储选中的数据
        selection:[],
        // 当前排序
        sort: null,
        //接收上面传过来的参数
        corpId1:'',
        //弹窗
        dialogServerVisible: false,
        //弹窗数据Form
        serverForm:{
          custServerId:'',
          corpId:'',
          serverName:'',
          ipAllocation:'',
          operateSystem:'',
          usernameAndPsd:'',
          allocationInfo:'',
          serverTag:'',
          serialNumber:'',
          warrantyDate:'',
          isCompanyBuy:'',
          isRemote:'',
          remoteDesc:'',
          remark:''
        },
        //规则控制
        rules:{
          ipAllocation: [
            {required: true,message:"请输入IP配置",trigger:'blur'}
          ],
          operateSystem: [
            {required: true,message:"请选择操作系统",trigger:'change'}
          ],
          serverTag: [
            {required: true,message:"请输入识别标识",trigger:'blur'}
          ],
          serialNumber: [
            {required: true,message:"请输入序列号",trigger:'blur'}
          ],
          isCompanyBuy: [
            {required: true,message:"请选择是否公司采购",trigger:'change'}
          ],
          isRemote: [
            {required: true,message:"请选择是否可以远程",trigger:'change'}
          ]
        },
        addoperateSystem:[
          {
            value: '01',
            label: 'Win7'
          }, {
            value: '02',
            label: 'Linux'
          }
        ],
        addIsRemote:[
          {
            value: '01',
            label: '是'
          }, {
            value: '02',
            label: '否'
          }
        ]
      }
    },
    watch:{
      corpId(){
        this.initTable()
      }
    },
    methods:{
      initTable(){
        let _that = this
        this.corpId1 = _that.corpId
        _that.loading = true
        let data = {}
        if (_that.isFuzzy) {
          if (_that.fuzzy) {
            data.fuzzy = _that.fuzzy
          }
        } else {
          for (let item in _that.filter) {
            data[item] = _that.filter[item]
          }
        }
        if (_that.sort) {
          data.sort = _that.sort
        }
        data.corpId = _that.corpId1
        // 分页信息
        data.page = _that.currPage
        data.limit = _that.pageSize
        queryCustomServerInfo(data).then(response => {
          _that.total = response.data.total
          _that.tableData = response.data.list
          setTimeout(() => {
            _that.loading = false
          }, 500);
        }).catch(() => {
          setTimeout(() => {
            _that.loading = false
          }, 500);
        })
      },
      onSort(sort){
        this.sort = utils.transTableSort(sort)
        this.initTable()
      },
      checkboxSelect(selected,row){
        this.selection = selected
        // 将row数据存储在row中，供后面修改时使用
        this.row = row
      },
      //添加服务器
      addServerDetail(){
        this.serverForm = {}
        this.row = {}
        this.dialogServerVisible = true
        //去掉校验
        this.$refs.serverForm.clearValidate()
      },
      editServerDetail(row){
        if(row && row != '1'){
          this.serverForm= {...row}
        }else {
          this.serverForm= {...this.row}
        }
        this.dialogServerVisible = true
      },
      deleteServerDetail(row){
        this.$confirm('此操作将删除该服务器信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let custServerId = row.custServerId;
          deleteCustServerInfo(custServerId).then(() => {
            this.initTable();
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        })
      },
      deleteMoreServerDetail(){
        this.$confirm('此操作将删除该服务器信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCustServerInfo(this.$refs.table.selection.map).then(() => {
            this.initTable();
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        })
      },
      //分页点击事件
      handleCurrentChange(val){
        this.currPage = val
        this.initTable()
      },
      addServerConfirm(){
        let _that = this;
        _that.serverForm.corpId=_that.corpId1;
        _that.$refs.serverForm.validate((valid) => {
          if (valid) {
            if(_that.serverForm.custServerId){
              editCustServerInfo(_that.serverForm).then(() => {
                _that.initTable()
                this.dialogServerVisible = false
              })
            }else{
              addCustServerInfo(_that.serverForm).then(() => {
                _that.initTable()
                this.dialogServerVisible = false
              });
            }
          } else {
            return false;
          }
        });
      },
      cancelEdit(){
        this.dialogServerVisible = false
        this.$nextTick(function () {
          this.$refs.serverForm.clearValidate()
        })
        this.serverForm = {}
        this.row = {}
        this.initTable()
      },
      warrantyDateFormatter(row) {
        return moment(row.warrantyDate).format('YYYY-MM-DD')
      },
    }
  }
</script>

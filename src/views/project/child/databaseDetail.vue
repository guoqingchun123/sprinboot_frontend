<template>
  <div class="app-container">
    <bv-table-header title="数据库信息列表">
      <bv-button v-show="$refs.table && $refs.table.selection.length === 0" view="add" @click="addDatabaseDetail">增加</bv-button>
      <bv-button v-show="$refs.table && $refs.table.selection.length === 1" view="modify" @click="editDatabaseDetail('1')">编辑</bv-button>
      <bv-button v-show="$refs.table && $refs.table.selection.length > 0" view="remove" @click="deleteDatabaseDetail('1')">删除</bv-button>
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
        <el-form-item label="数据库名称:">
          <el-input v-model="filter.databaseName" />
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
      <el-table-column label="数据库名称" prop="databaseName" align="center" />
      <el-table-column label="数据库版本" prop="databaseVersion" align="center" :formatter="databaseVersionFormatter" />
      <el-table-column label="实例名" prop="instanceName" align="center" />
      <el-table-column label="端口" prop="port" align="center" />
      <el-table-column label="用户名/密码" prop="usernameAndPsd" align="center" />
      <el-table-column label="备份路径" prop="backupPath" align="center" />
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template scope="scope">
          <el-button type="text" size="small" @click="editDatabaseDetail(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteDatabaseDetail(scope.row.custDatabaseId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <bv-pagination
      :total="total" :current-page.sync="currPage" :page-size="pageSize"
      @current-change="handleCurrentChange"
    />
    <el-dialog title="维护数据库信息" :visible.sync="dialogDatabaseVisible" :close-on-click-modal="false"
               :close-on-press-escape="false"
    >
      <el-form ref="databaseForm" :model="databaseForm" :inline="true" label-width="90px" label-position="right"
               :rules="databaseRules"
      >
        <el-row>
          <el-col>
            <el-form-item label="数据库名称:" required prop="databaseName" style="white-space: nowrap">
              <el-input v-model="databaseForm.databaseName" />
            </el-form-item>
            <el-form-item label="数据库版本:" prop="databaseVersion" style="white-space: nowrap">
              <el-select v-model="databaseForm.databaseVersion" placeholder="请选择">
                <el-option
                  v-for="item in databaseVersionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="实例名:" prop="instanceName">
              <el-input v-model="databaseForm.instanceName" />
            </el-form-item>
            <el-form-item label="端口:" prop="port">
              <el-input v-model="databaseForm.port" />
            </el-form-item>
            <el-form-item label="用户名/密码:" prop="usernameAndPsd" style="white-space: nowrap">
              <el-input v-model="databaseForm.usernameAndPsd" type="textarea" :rows="5" style="width: 526px" />
            </el-form-item>
            <el-form-item label="备份路径:" prop="backupPath">
              <el-input v-model="databaseForm.backupPath" style="width: 524px" />
            </el-form-item>
            <el-form-item label="备注:" prop="remark">
              <el-input v-model="databaseForm.remark" type="textarea" :rows="5" style="width: 526px" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDatabaseConfirm()">保存</el-button>
        <el-button @click="cancelEdit()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { queryCustomDatabaseInfo,editCustDatabaseInfo,addCustDatabaseInfo,deleteCustDatabaseInfo } from '@/api/custom/contractMessage'
  import { defaults as utils } from '@bestvike/utils'

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
          databaseName: ''
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
        dialogDatabaseVisible: false,
        //弹窗数据Form
        databaseForm:{
          corpId:'',
          custDatabaseId:'',
          databaseName:'',
          databaseVersion:'',
          instanceName:'',
          port:'',
          usernameAndPsd:'',
          backupPath:'',
          remark:''
        },
        //规则控制
        databaseRules:{
          databaseName: [
            {required: true,message:"请输入数据库名称",trigger:'blur'}
          ],
          databaseVersion: [
            {required: true,message:"请选择数据库版本",trigger:'change'}
          ],
          instanceName: [
            {required: true,message:"请输入实例名",trigger:'blur'}
          ],
          port: [
            {required: true,message:"请输入端口",trigger:'blur'}
          ],
          usernameAndPsd: [
            {required: true,message:"请输入用户名、密码",trigger:'blur'}
          ],
          backupPath: [
            {required: true,message:"请输入备份路径",trigger:'blur'}
          ],
        },
        databaseVersionOptions:[
          {
            value: '01',
            label: 'oracle10'
          }, {
            value: '02',
            label: 'oracle11'
          }, {
            value: '03',
            label: 'SqlServer'
          }
        ],
      }
    },
    watch:{
      corpId(){
        this.initTable()
      }
    },
    methods:{
      initTable(){
        let _that = this;
        this.corpId1 = _that.corpId;
        _that.loading = true;
        let data = {};
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
        data.corpId = _that.corpId1;
        // 分页信息
        data.page = _that.currPage;
        data.limit = _that.pageSize;
        queryCustomDatabaseInfo(data).then(response => {
          _that.total = response.data.total;
          _that.tableData = response.data.list;
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
        this.sort = utils.transTableSort(sort);
        this.initTable()
      },
      checkboxSelect(selected,row){
        this.selection = selected;
        // 将row数据存储在row中，供后面修改时使用
        this.row = row
      },
      //添加服务器
      addDatabaseDetail(){
        this.databaseForm = {};
        this.row = {};
        this.dialogDatabaseVisible = true
      },
      editDatabaseDetail(row){
        if(row && row != '1'){
          this.databaseForm= {...row}
        }else {
          this.databaseForm= {...this.row}
        }
        this.dialogDatabaseVisible = true
      },
      deleteDatabaseDetail(row){
        this.$confirm('此操作将删除该数据库信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let custDatabaseId = "";
          if(row && row != '1'){
            custDatabaseId = row;
          }else{
            custDatabaseId = this.row.custDatabaseId;
          }
          deleteCustDatabaseInfo(custDatabaseId).then(() => {
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
        this.currPage = val;
        this.initTable()
      },
      addDatabaseConfirm(){
        let _that = this;
        _that.databaseForm.corpId=_that.corpId1;
        _that.$refs.databaseForm.validate((valid) => {
          if (valid) {
            if(_that.databaseForm.custDatabaseId){
              editCustDatabaseInfo(_that.databaseForm).then(() => {
                _that.initTable();
                this.dialogDatabaseVisible = false;
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              })
            }else{
              addCustDatabaseInfo(_that.databaseForm).then(() => {
                _that.initTable();
                this.dialogDatabaseVisible = false;
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
              });
            }
          } else {
            return false;
          }
        });
      },
      cancelEdit(){
        this.dialogDatabaseVisible = false;
        this.$nextTick(function () {
          this.$refs.databaseForm.clearValidate()
        });
        this.databaseForm = {};
        this.row = {};
        this.initTable()
      },
      databaseVersionFormatter(row) {
        switch (row.databaseVersion) {
          case '01':return "oracle10";
          case '02':return "oracle11";
          case '03':return "SqlServer";
        }
      },
    }
  }
</script>

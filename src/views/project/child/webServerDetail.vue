<template>
  <div class="app-container">
    <bv-table-header title="web服务器信息列表">
      <bv-button v-show="$refs.table && $refs.table.selection.length === 0" view="add" @click="addWebServerDetail">增加</bv-button>
      <bv-button v-show="$refs.table && $refs.table.selection.length === 1" view="modify" @click="editWebServerDetail('1')">编辑</bv-button>
      <bv-button v-show="$refs.table && $refs.table.selection.length > 0" view="remove" @click="deleteWebServerDetail('1')">删除</bv-button>
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
        <el-form-item label="web服务器名称:">
          <el-input v-model="filter.webServerName" />
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
      <el-table-column label="应用服务器名称" prop="webServerName" align="center" />
      <el-table-column label="应用服务器类型" prop="webServerType" align="center" :formatter="webServerTypeFormatter" />
      <el-table-column label="安装路径" prop="installPath" align="center" />
      <el-table-column label="管理地址" prop="manageAddress" align="center" />
      <el-table-column label="用户名/密码" prop="usernameAndPsd" align="center" />
      <el-table-column label="配置信息" prop="allocationInfo" align="center" />
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template scope="scope">
          <el-button type="text" size="small" @click="editWebServerDetail(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteWebServerDetail(scope.row.custWebServerId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <bv-pagination
      :total="total" :current-page.sync="currPage" :page-size="pageSize"
      @current-change="handleCurrentChange"
    />
    <el-dialog title="维护web服务器信息" :visible.sync="dialogWebServerVisible" :close-on-click-modal="false"
               :close-on-press-escape="false"
    >
      <el-form ref="webServerForm" :model="webServerForm" :inline="true" label-width="90px" label-position="right"
               :rules="webServerRules"
      >
        <el-row>
          <el-col>
            <el-form-item label="应用服务器名称:" prop="webServerName" style="white-space: nowrap">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-input v-model="webServerForm.webServerName" style="width: 526px" />
            </el-form-item>
            <el-form-item label="应用服务器类型:" prop="webServerType" style="white-space: nowrap">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-select v-model="webServerForm.webServerType" placeholder="请选择">
                <el-option
                  v-for="item in webServeTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="安装路径:" prop="installPath">
              <el-input v-model="webServerForm.installPath" style="width: 526px" />
            </el-form-item>
            <el-form-item label="管理地址:" prop="manageAddress">
              <el-input v-model="webServerForm.manageAddress" style="width: 526px" />
            </el-form-item>
            <el-form-item label="用户名/密码:" prop="usernameAndPsd" style="white-space: nowrap">
              <el-input v-model="webServerForm.usernameAndPsd" style="width: 526px" />
            </el-form-item>
            <el-form-item label="配置信息:" prop="allocationInfo">
              <el-input v-model="webServerForm.allocationInfo" style="width: 526px" />
            </el-form-item>
            <el-form-item label="备注:" prop="remark">
              <el-input v-model="webServerForm.remark" type="textarea" style="width: 526px" :rows="5" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addWebServerConfirm()">保存</el-button>
        <el-button @click="cancelEdit()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { queryCustomWebServerInfo,editCustWebServerInfo,addCustWebServerInfo,deleteCustWebServerInfo } from '@/api/custom/contractMessage'
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
          webServerName: ''
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
        dialogWebServerVisible: false,
        //弹窗数据Form
        webServerForm:{
          custWebServerId:'',
          corpId:'',
          webServerName:'',
          webServerType:'',
          installPath:'',
          manageAddress:'',
          usernameAndPsd:'',
          allocationInfo:'',
          remark:''
        },
        //规则控制
        webServerRules:{
          webServerName: [
            {required: true,message:"请输入应用服务器名称",trigger:'blur'}
          ],
          webServerType: [
            {required: true,message:"请选择应用服务器类型",trigger:'change'}
          ],
          installPath: [
            {required: true,message:"请输入安装路径",trigger:'blur'}
          ],
          manageAddress: [
            {required: true,message:"请输入管理地址",trigger:'blur'}
          ],
          usernameAndPsd: [
            {required: true,message:"请输入用户名、密码",trigger:'blur'}
          ],
          allocationInfo: [
            {required: true,message:"请输入配置信息",trigger:'blur'}
          ],
        },
        webServeTypeOptions:[
          {
            value: '01',
            label: 'tomcat5'
          }, {
            value: '02',
            label: 'tomcat6'
          }, {
            value: '03',
            label: 'tomcat7'
          }
          , {
            value: '04',
            label: 'tomcat8'
          }, {
            value: '05',
            label: 'jar'
          }, {
            value: '06',
            label: 'Java1.8'
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
        queryCustomWebServerInfo(data).then(response => {
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
      addWebServerDetail(){
        this.webServerForm = {};
        this.row = {};
        this.dialogWebServerVisible = true
      },
      editWebServerDetail(row){
        if(row && row != '1'){
          this.webServerForm= {...row}
        }else {
          this.webServerForm= {...this.row}
        }
        this.dialogWebServerVisible = true
      },
      deleteWebServerDetail(row){
        this.$confirm('此操作将删除该web服务器信息, 是否继续?', '提示', {
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
          deleteCustWebServerInfo(custDatabaseId).then(() => {
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
      addWebServerConfirm(){
        let _that = this;
        _that.webServerForm.corpId=_that.corpId1;
        _that.$refs.webServerForm.validate((valid) => {
          if (valid) {
            if(_that.webServerForm.custWebServerId){
              editCustWebServerInfo(_that.webServerForm).then(() => {
                _that.initTable();
                this.dialogWebServerVisible = false;
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              })
            }else{
              addCustWebServerInfo(_that.webServerForm).then(() => {
                _that.initTable();
                this.dialogWebServerVisible = false;
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
        this.dialogWebServerVisible = false;
        this.$nextTick(function () {
          this.$refs.webServerForm.clearValidate()
        });
        this.webServerForm = {};
        this.row = {};
        this.initTable()
      },
      webServerTypeFormatter(row) {
        switch (row.webServerType) {
          case '01':return "tomcat5";
          case '02':return "tomcat6";
          case '03':return "tomcat7";
          case '04':return "tomcat8";
          case '05':return "jar";
          case '06':return "Java1.8";
        }
      },
    }
  }
</script>

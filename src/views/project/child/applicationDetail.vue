<template>
  <div class="app-container">
    <bv-table-header title="应用程序信息列表">
      <bv-button v-show="$refs.table && $refs.table.selection.length === 0" view="add" @click="addApplicationDetail">增加</bv-button>
      <bv-button v-show="$refs.table && $refs.table.selection.length === 1" view="modify" @click="editApplicationDetail('1')">编辑</bv-button>
      <bv-button v-show="$refs.table && $refs.table.selection.length > 0" view="remove" @click="deleteApplicationDetail('1')">删除</bv-button>
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
        <el-form-item label="应用名称:">
          <el-input v-model="filter.applicationName" />
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
      <el-table-column label="应用名称" prop="applicationName" align="center" />
      <el-table-column label="部署类型" prop="deploymentType" align="center" :formatter="deploymentTypeFormatter" />
      <el-table-column label="系统类型" prop="systemType" align="center" :formatter="systemTypeFormatter" />
      <el-table-column label="部署路径" prop="deploymentPath" align="center" />
      <el-table-column label="系统版本" prop="systemVersion" align="center" :formatter="systemVersionFormatter" />
      <el-table-column label="配置信息" prop="allocationInfo" align="center" />
      <el-table-column label="访问地址" prop="visitAddress" align="center" />
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template scope="scope">
          <el-button type="text" size="small" @click="editApplicationDetail(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteApplicationDetail(scope.row.custApplicationId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <bv-pagination
      :total="total" :current-page.sync="currPage" :page-size="pageSize"
      @current-change="handleCurrentChange"
    />
    <el-dialog title="维护应用程序信息" :visible.sync="dialogApplicationVisible" :close-on-click-modal="false"
               :close-on-press-escape="false"
    >
      <el-form ref="applicationForm" :model="applicationForm" :inline="true" label-width="90px" label-position="right"
               :rules="applicationRules"
      >
        <el-row>
          <el-col>
            <el-form-item label="应用名称:" prop="applicationName">
              <el-input v-model="applicationForm.applicationName" style="width: 526px" />
            </el-form-item>
            <el-form-item label="部署类型:" prop="deploymentType">
              <el-select v-model="applicationForm.deploymentType" placeholder="请选择">
                <el-option
                  v-for="item in deploymentTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="系统类型:" prop="systemType">
              <el-select v-model="applicationForm.systemType" placeholder="请选择">
                <el-option
                  v-for="item in systemTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="部署路径:" prop="deploymentPath">
              <el-input v-model="applicationForm.deploymentPath" style="width: 526px" />
            </el-form-item>
            <el-form-item label="系统版本:" prop="systemVersion">
              <el-select v-model="applicationForm.systemVersion" placeholder="请选择">
                <el-option
                  v-for="item in systemVersionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="配置信息:" prop="allocationInfo">
              <el-input v-model="applicationForm.allocationInfo" style="width: 526px" />
            </el-form-item>
            <el-form-item label="访问地址:" prop="visitAddress">
              <el-input v-model="applicationForm.visitAddress" style="width: 526px" />
            </el-form-item>
            <el-form-item label="备注:" prop="remark">
              <el-input v-model="applicationForm.remark" type="textarea" style="width: 526px" :rows="4" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addApplicationConfirm()">保存</el-button>
        <el-button @click="cancelEdit()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { queryCustomApplicationInfo,editCustApplicationInfo,addCustApplicationInfo,deleteCustApplicationInfo } from '@/api/custom/contractMessage'
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
        dialogApplicationVisible: false,
        //弹窗数据Form
        applicationForm:{
          custApplicationId:'',
          corpId:'',
          applicationName:'',
          deploymentType:'',
          systemType:'',
          deploymentPath:'',
          systemVersion:'',
          allocationInfo:'',
          visitAddress:'',
          remark:''
        },
        //规则控制
        applicationRules:{
          applicationName: [
            {required: true,message:"请输入应用名称",trigger:'blur'}
          ],
          deploymentType: [
            {required: true,message:"请选择部署类型",trigger:'change'}
          ],
          systemType: [
            {required: true,message:"请输入系统类型",trigger:'change'}
          ],
          deploymentPath: [
            {required: true,message:"请输入部署路径",trigger:'blur'}
          ],
          systemVersion: [
            {required: true,message:"请选择系统版本",trigger:'change'}
          ],
          allocationInfo: [
            {required: true,message:"请输入配置信息",trigger:'blur'}
          ],
          visitAddress: [
            {required: true,message:"请输入访问地址",trigger:'blur'}
          ]
        },
        systemTypeOptions:[
          {
            value: '01',
            label: '硬件及环境'
          }, {
            value: '02',
            label: '保修金'
          },
          {
            value: '03',
            label: '维修资金'
          }, {
            value: '04',
            label: '预售网签'
          },
          {
            value: '05',
            label: '监管'
          }, {
            value: '06',
            label: '物业平台'
          },
          {
            value: '07',
            label: '公房'
          }, {
            value: '08',
            label: '用友财务'
          },
          {
            value: '09',
            label: 'BVOA'
          }, {
            value: '10',
            label: '其他'
          },
          {
            value: '11',
            label: '产权产籍'
          }, {
            value: '12',
            label: '存量房'
          }, {
            value: '13',
            label: '数据中心'
          }
        ],
        deploymentTypeOptions: [{
          value: '01',
          label: '集中版'
        }, {
          value: '02',
          label: '非集中版'
        }],
        systemVersionOptions: [{
          value: '01',
          label: 'bvrfis1.0'
        }, {
          value: '02',
          label: 'bvrfis1.6'
        }, {
          value: '03',
          label: 'bvrfis1.7'
        }, {
          value: '04',
          label: '共享库新版本'
        }, {
          value: '05',
          label: '维修资金新版本_赣州'
        }, {
          value: '06',
          label: 'pmis老版本'
        }, {
          value: '07',
          label: 'pmis新版本'
        }, {
          value: '08',
          label: '预售老版本'
        }, {
          value: '09',
          label: '预售新版本'
        }, {
          value: '10',
          label: '监管老版本'
        }, {
          value: '11',
          label: '监管新版本'
        }, {
          value: '12',
          label: '公房老版本'
        }, {
          value: '13',
          label: '公房新版本'
        }, {
          value: '14',
          label: '保修金老版本'
        }, {
          value: '15',
          label: '保修金新版本'
        }, {
          value: '16',
          label: 'bvrfis1.8'
        }, {
          value: '17',
          label: '产权产籍'
        }, {
          value: '18',
          label: 'bvrfis1.81'
        }, {
          value: '19',
          label: '存量房新版本'
        }, {
          value: '20',
          label: '数据中心'
        }, {
          value: '21',
          label: '维修资金老版本'
        }, {
          value: '22',
          label: 'bvrfisweb'
        }],
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
        queryCustomApplicationInfo(data).then(response => {
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
      addApplicationDetail(){
        this.applicationForm = {};
        this.row = {};
        this.dialogApplicationVisible = true
      },
      editApplicationDetail(row){
        if(row && row != '1'){
          this.applicationForm= {...row}
        }else {
          this.applicationForm= {...this.row}
        }
        this.dialogApplicationVisible = true
      },
      deleteApplicationDetail(row){
        this.$confirm('此操作将删除该web服务器信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let custApplicationId = "";
          if(row && row != '1'){
            custApplicationId = row;
          }else{
            custApplicationId = this.row.custApplicationId;
          }
          deleteCustApplicationInfo(custApplicationId).then(() => {
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
      addApplicationConfirm(){
        let _that = this;
        _that.applicationForm.corpId=_that.corpId1;
        _that.$refs.applicationForm.validate((valid) => {
          if (valid) {
            if(_that.applicationForm.custApplicationId){
              editCustApplicationInfo(_that.applicationForm).then(() => {
                _that.initTable();
                this.dialogApplicationVisible = false;
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              })
            }else{
              addCustApplicationInfo(_that.applicationForm).then(() => {
                _that.initTable();
                this.dialogApplicationVisible = false;
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
        this.dialogApplicationVisible = false;
        this.$nextTick(function () {
          this.$refs.applicationForm.clearValidate()
        });
        this.applicationForm = {};
        this.row = {};
        this.initTable()
      },
      deploymentTypeFormatter(row) {
        switch (row.deploymentType) {
          case '01':return "集中版";
          case '02':return "非集中版";
        }
      },
      systemTypeFormatter(row) {
        switch (row.systemType) {
          case '01':return "硬件及环境";
          case '02':return "保修金";
          case '03':return "维修资金";
          case '04':return "预售网签";
          case '05':return "监管";
          case '06':return "物业平台";
          case '07':return "公房";
          case '08':return "用友财务";
          case '09':return "BVOA";
          case '10':return "产权产籍";
          case '11':return "存量房";
          case '12':return "数据中心";
          case '13':return "其他";
        }
      },
      systemVersionFormatter(row) {
        switch (row.systemVersion) {
          case '01':return "bvrfis1.0";
          case '02':return "bvrfis1.6";
          case '03':return "bvrfis1.7";
          case '04':return "共享库新版本";
          case '05':return "维修资金新版本_赣州";
          case '06':return "pmis老版本";
          case '07':return "pmis新版本";
          case '08':return "预售老版本";
          case '09':return "预售新版本";
          case '10':return "监管老版本";
          case '11':return "监管新版本";
          case '12':return "公房老版本";
          case '13':return "公房新版本";
          case '14':return "保修金老版本";
          case '15':return "保修金新版本";
          case '16':return "bvrfis1.8";
          case '17':return "产权产籍";
          case '18':return "brfis1.81";
          case '19':return "存量房新版本";
          case '20':return "数据中心";
          case '21':return "维修资金老版本";
          case '22':return "bvrfisweb";

        }
      },
    }
  }
</script>

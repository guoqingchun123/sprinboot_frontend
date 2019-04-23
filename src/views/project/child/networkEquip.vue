<template>
  <div class="app-container">
    <bv-table-header title="网络设备信息列表">
      <bv-button v-show="$refs.table && $refs.table.selection.length === 0" view="add" @click="addNetworkEquipment">增加</bv-button>
      <bv-button v-show="$refs.table && $refs.table.selection.length === 1" view="modify" @click="editNetworkEquipment('1')">编辑</bv-button>
      <bv-button v-show="$refs.table && $refs.table.selection.length > 0" view="remove" @click="deleteMoreNetworkEquipment">删除</bv-button>
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
        <el-form-item label="设备名称:">
          <el-input v-model="filter.equipmentName" />
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
      <el-table-column type="selection" width="55px" />
      <el-table-column label="设备名称" prop="equipmentName" align="center" />
      <el-table-column label="设备型号" prop="equipmentModel" align="center" />
      <el-table-column label="序列号" prop="serialNumber" align="center" />
      <el-table-column label="识别标识" prop="equipmentTag" align="center" />
      <el-table-column label="用户名密码" prop="usernameAndPsd" align="center" />
      <el-table-column label="是否公司采购" prop="isCompanyBuy" align="center" />
      <el-table-column label="配置信息" prop="allocationInfo" align="center" />
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template scope="scope">
          <el-button type="text" size="small" @click="editNetworkEquipment(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteNetworkEquipment(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <bv-pagination
      :total="total" :current-page.sync="currPage" :page-size="pageSize"
      @current-change="handleCurrentChange"
    />
    <el-dialog title="维护网络设备信息" :visible.sync="dialogNetworkVisible" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="networkEquipForm" :model="networkEquipForm" :rules="rules" label-width="100px" label-position="right" style="width: 95%;">
        <el-row :gutter="$CONST.row.gutter">
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="设备名称:" prop="equipmentName">
              <el-input v-model="networkEquipForm.equipmentName" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="设备型号:" prop="equipmentModel">
              <el-select v-model="networkEquipForm.equipmentModel" placeholder="请选择">
                <el-option
                  v-for="item in addNetworkEquipmentOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout3">
            <el-form-item label="序列号:" prop="serialNumber">
              <el-input v-model="networkEquipForm.serialNumber" type="textarea" :rows="4" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout3">
            <el-form-item label="识别标识:" prop="equipmentTag">
              <el-input v-model="networkEquipForm.equipmentTag" type="textarea" :rows="4" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout3">
            <el-form-item label="用户名/密码:" prop="usernameAndPsd">
              <el-input v-model="networkEquipForm.usernameAndPsd" type="textarea" :rows="4" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="是否公司采购:" prop="isCompanyBuy" style="white-space: nowrap">
              <el-select v-model="networkEquipForm.isCompanyBuy">
                <el-option
                  v-for="item in isCompanyBuyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout3">
            <el-form-item label="配置信息:">
              <el-input v-model="networkEquipForm.allocationInfo" type="textarea" :rows="4" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveNetworkEquip()">保存</el-button>
        <el-button @click="canselNetwork()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchEquipmentInfo,deleteCustEquipmentInfo,addCustEquipmentInfo,editCustEquipmentInfo } from '@/api/custom/contractMessage'
  import { defaults as utils } from '@bestvike/utils'

  export default {
    props:{
      corpId:{
        type: String,
        default: ''
      }
    },
    data(){
      return {
        isFuzzy: true,
        // 模糊查询条件
        fuzzy: null,
        // 过滤条件
        filter: {
          equipmentName: ''
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
        //弹窗显示隐藏
        dialogNetworkVisible: false,
        //数据
        networkEquipForm:{
          custEquipmentId:'',
          corpId:'',
          equipmentName:'',
          equipmentModel:'',
          equipmentTag:'',
          serialNumber:'',
          usernameAndPsd:'',
          isCompanyBuy:'',
          allocationInfo:'',
          remark:''
        },
        rules:{
          equipmentName: [
            {required: true,message:"请输入设备名称",trigger:'blur'}
          ],
          equipmentModel: [
            {required: true,message:"请选择设备型号",trigger:'change'}
          ],
          equipmentTag: [
            {required: true,message:"请输入识别标识",trigger:'blur'}
          ],
          usernameAndPsd: [
            {required: true,message:"请输入用户名、密码",trigger:'blur'}
          ],
          isCompanyBuy: [
            {required: true,message:"请选择是否公司采购",trigger:'change'}
          ]
        },
        addNetworkEquipmentOptions: [
          {
            value: '01',
            label: 'F100-A'
          }, {
            value: '02',
            label: 'F100-B'
          }
        ],
        isCompanyBuyOptions: [
          {
            value: '01',
            label: '是'
          }, {
            value: '02',
            label: '否'
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
      onSort(sort){
        this.sort = utils.transTableSort(sort)
        this.initTable()
      },
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
        fetchEquipmentInfo(data).then(response => {
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
      addNetworkEquipment(){
        this.networkEquipForm = {}
        this.row = {}
        this.dialogNetworkVisible = true
      },
      editNetworkEquipment(row){
        if(row && row != '1'){
          this.networkEquipForm = {...row}
        }else {
          this.networkEquipForm= {...this.row}
        }
        this.dialogNetworkVisible = true
      },
      deleteNetworkEquipment(row){
        this.$confirm('此操作将删除该客户网络设备信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let custEquipmentId = row.custEquipmentId;
          deleteCustEquipmentInfo(custEquipmentId).then(() => {
            this.initTable();
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        })
      },
      deleteMoreNetworkEquipment(){
        this.$confirm('此操作将删除该客户网络设备信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCustEquipmentInfo(this.$refs.table.selection.map).then(() => {
            this.initTable();
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        })
      },
      //点击选择框时将所有选中的数据(selection)和最后一次选中的行(row)传过来
      checkboxSelect(selection,row) {
        this.selection=selection
        // 将row数据存储在row中，供后面修改时使用
        this.row = row

      },
      handleCurrentChange(val){
        this.currPage = val
        this.initTable()
      },
      saveNetworkEquip(){
        let _that = this;
        _that.networkEquipForm.corpId=_that.corpId1;
        _that.$refs.networkEquipForm.validate((valid) => {
          if (valid) {
            if(_that.networkEquipForm.custEquipmentId){
              editCustEquipmentInfo(_that.networkEquipForm).then(() => {
                _that.initTable()
                this.dialogNetworkVisible = false
              })
            }else{
              addCustEquipmentInfo(_that.networkEquipForm).then(() => {
                _that.initTable()
                this.dialogNetworkVisible = false
              });
            }
          } else {
            return false;
          }
        });
      },
      canselNetwork(){
        this.dialogNetworkVisible = false
        this.$nextTick(function () {
          this.$refs.networkEquipForm.clearValidate()
        })
        this.initTable()
        this.networkEquipForm = {}
        this.row = {}
      }
    }
  }
</script>

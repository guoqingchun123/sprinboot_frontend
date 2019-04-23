<template>
  <div class="app-container">
    <bv-table ref="table" title="联系人信息" :pagination="true" :filter.sync="filter" :fetch-api="fetchCustomCardDetail1_" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="add" @click="addCustomCard">增加</bv-button>
        <bv-button show="one" view="modify" @click="editCustomCard('1')">编辑</bv-button>
        <bv-button show="oneOrMore" view="remove" @click="deleteMoreCustomCard">删除</bv-button>
        <el-button type="primary" icon="el-icon-upload">数据导出</el-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="姓名:">
            <el-input v-model="filter.customName" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column label="姓名" prop="custName" align="center" />
      <el-table-column label="性别" prop="custSex" align="center" />
      <el-table-column label="职位" prop="custPosition" align="center" />
      <el-table-column label="电话" prop="custPhone" align="center" />
      <el-table-column label="手机" prop="custMobilePhone" align="center" />
      <el-table-column label="QQ" prop="custQq" align="center" />
      <el-table-column label="Email" prop="custEmail" align="center" />
      <el-table-column label="备注" prop="remark" align="center" />
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template scope="scope">
          <el-button type="text" size="small" @click="editCustomCard(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteCustomCard(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </bv-table>

    <el-dialog title="维护联系人信息" :visible.sync="dialogCustVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="customCardForm" :model="customCardForm" :rules="rules" label-width="100px" label-position="right" style="width: 95%;">
        <el-row :gutter="$CONST.row.gutter">
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="姓名:" prop="custName">
              <el-input v-model="customCardForm.custName" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="性别:" prop="custSex">
              <el-select v-model="customCardForm.custSex" placeholder="请选择">
                <el-option
                  v-for="item in addCustomCardOptions1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="职位:" prop="custPosition">
              <el-input v-model="customCardForm.custPosition" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="电话:" prop="custPhone">
              <el-input v-model="customCardForm.custPhone" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="手机:" prop="custMobilePhone">
              <el-input v-model="customCardForm.custMobilePhone" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="QQ:" prop="custQq">
              <el-input v-model="customCardForm.custQq" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="Email:" prop="custEmail">
              <el-input v-model="customCardForm.custEmail" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="备注:" prop="remark">
              <el-input v-model="customCardForm.remark" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCustomCardConfirm()">保存</el-button>
        <el-button @click="cancelEdit()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { fetchCustomCardDetail,addCustCardInfo,editCustCardInfo,deleteCustCardInfo } from '@/api/custom/contractMessage'

  export default {
    // name: 'ListCustomDetail',
    provide() {
      return {
        // table实例
        custCardInstance: this
      }
    },
    props:{
      corpId:{
        type: String,
        default: ''
      }
    },
    data() {
      return {
        // 过滤条件
        filter: {
          customName: ''
        },
        //弹窗
        dialogCustVisible: false,
        customCardForm:{
          custCardId:'',
          corpId:'',
          custName:'',
          custSex:'',
          custPosition:'',
          custPhone:'',
          custMobilePhone:'',
          custQq:'',
          custEmail:'',
          remark:''
        },
        rules: {
          custName: [
            {required: true, message:"请输入联系人姓名", trigger: 'blur'}
          ],
          custSex: [
            {required: true, message:"请选择联系人性别", trigger: 'change'}
          ],
        },
        addCustomCardOptions1: [{
          value: '01',
          label: '男'
        }, {
          value: '02',
          label: '女'
        }],
        tableInstance: {},
        fetchCustomCardDetail
      }
    },
    watch:{
      corpId(){
        if(this.corpId!=''){
          this.filter.corpId = this.corpId
          this.tableInstance.fetchData()
        }
      }
    },
    methods:{
      fetchCustomCardDetail1_(data){
        data.corpId = this.corpId
        return this.fetchCustomCardDetail(data)
      },
      addCustomCard(){
        this.customCardForm = {}
        this.dialogCustVisible = true
      },
      addCustomCardConfirm(){
        let _that = this;
        _that.customCardForm.corpId= _that.corpId;
        _that.$refs.customCardForm.validate((valid) => {
          if (valid) {
            if(_that.customCardForm.custCardId){
              editCustCardInfo(_that.customCardForm).then(() => {
                this.tableInstance.fetchData()
                this.dialogCustVisible = false
              })
            }else{
              addCustCardInfo(_that.customCardForm).then(() => {
                this.tableInstance.fetchData()
                this.dialogCustVisible = false
              });
            }
          } else {
            return false;
          }
        });
      },
      cancelEdit(){
        this.dialogCustVisible = false
        this.$nextTick(function () {
          this.$refs.customCardForm.clearValidate()
        })
        this.customCardForm = {}
      },
      editCustomCard(row){
        if(row && row != '1'){
          this.customCardForm= {...row}
        }else {
          this.customCardForm= {...this.tableInstance.table.selection[0]}
        }
        this.dialogCustVisible = true
      },
      deleteCustomCard(row){
        this.$confirm('此操作将删除该客户联系人信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let custCardId = row.custCardId;
          deleteCustCardInfo(custCardId).then(() => {
            this.initTable();
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        })
      },
      deleteMoreCustomCard(){
        this.$confirm('此操作将删除该客户联系人信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCustCardInfo(this.tableInstance.table.selection.map).then(() => {
            this.initTable();
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        })
      }
    }
  }

</script>

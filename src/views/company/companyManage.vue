<template>
  <div class="app-container">
    <bv-table ref="table" title="从业机构管理" :pagination="true" :filter.sync="filter" :fetch-api="queryCompanys"  @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="add" authority="add" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button show="oneOrMore" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="机构名称:" prop="compName">
            <el-input v-model="filter.compName" clearable />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="机构简称:" prop="compShortName">
            <el-input v-model="filter.compShortName"  clearable />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="机构编号:" prop="companyId">
            <el-input v-model="filter.companyId"  clearable />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="法定代表人:" prop="legalName">
            <el-select v-model="filter.legalName"  clearable />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="机构类别：" prop="compType">
            <el-select  v-model="filter.compType" placeholder="请选择"    width="80%" >
              <el-option
                v-for="item in compTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="状态：" prop="compState">
            <el-select  v-model="filter.compState" placeholder="请选择"    width="80%" >
              <el-option
                v-for="item in compStateS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column  prop="companyId" label="企业编号" sortable/>
      <el-table-column prop="compName" label="机构名称" sortable />
      <el-table-column prop="compShortName" label="机构简称" sortable />
      <el-table-column prop="compType" label="机构类别"   :formatter="compTypesFormat"/>
      <el-table-column prop="legalName" label="法定代表人"  />
      <el-table-column prop="compState" label="状态"  :formatter="compStateFormat" />
      <el-table-column prop="reqTime" label="申请日期" />
    </bv-table>
    <edit-company  :visible="dialogFormVisible" :company="company" @on-edit="companyEdit"  :modifyType="modifyType"></edit-company>
  </div>
</template>

<script>
  import { queryCompanys  ,deleteCompany  } from '@/api/custom/company'
  import editCompany from './companyEdit'
  export default {
    name: 'companyManage',
    components:{editCompany},
    data(){
      return {
        company: {
        },
        filter: {
          compName:'',
          compShortName:'',
          companyId:'',
          legalName:'',
          compState:'',
          compType:'',
          reqTime:''
        },

        tableInstance: {},
        queryCompanys,
        dialogFormVisible: false,
        modifyType: null,
        compStateS:this.$store.getters.dicts.compState ,
        compTypes:this.$store.getters.dicts.compTypes ,
      }
    },
    created() {
    },
    methods: {
      compTypesFormat(row){
        for (let i = 0; i < this.compTypes.length; i++) {
          if (this.compTypes[i].value === row.compType) {
            return this.compTypes[i].label;
          }
        }
      },
      compStateFormat(row){

        for (let i = 0; i < this.compStateS.length; i++) {
          if (this.compStateS[i].value === row.compState) {
            return this.compStateS[i].label;
          }
        }
      },
      startCreate() {
        this.$store.dispatch('app/fetchDicts', 'yesOrNo').then(data => {
          this.devisionCodeS = data
        });

        this.dialogFormVisible = true
        this.modifyType = 'create'
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      startModify() {
        this.company = {...this.tableInstance.table.selection[0]}
        this.modifyType = 'update'
        this.dialogFormVisible = true
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },

      startRemove() {
        this.$confirm('此操作将删除该从业机构信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCompany(this.tableInstance.table.selection.map(item => item.companyId).join()).then(() => {
            this.tableInstance.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        })
      },
      companyEdit(visible, res){
        this.dialogFormVisible = visible
        this.modifyType = null
        if(res){
          if(res.data.level=="success"){
            this.tableInstance.fetchData()
          }
          this.$message({
            message:res.data.retMsg,type: res.data.level
          })
        }
        this.company = {}
      }
    }
  }
</script>

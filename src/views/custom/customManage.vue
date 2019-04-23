<template>
  <div class="app-container">
    <div>
      <bv-table
        ref="table"
        title="客户信息列表"
        :pagination="true"
        :filter.sync="filter"
        tooltip-effect="dark" stripe
        :fetch-api="fetchTableDatas"
        @on-mounted="(table) => tableInstance = table"
      >
        <div slot="operates">
          <bv-button show="none" view="add" authority="add" @click="clickInsert()">新增</bv-button>
          <bv-button show="one" view="modify" authority="modify" @click="clickEdit()">修改</bv-button>
          <bv-button show="oneOrMore" view="remove" authority="remove" @click="handleDelete()">删除</bv-button>
        </div>
        <div slot="search">
          <bv-col>
            <el-form-item label="客户名称" prop="corpName">
              <el-input v-model="filter.corpName" />
            </el-form-item>
          </bv-col>
        </div>
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" />
        <!--<el-table-column label="客户编号" prop="corpId" sortable="projId" />-->
        <el-table-column label="客户名称" prop="corpName" />
        <el-table-column label="客户代码" prop="corpCode" />
        <el-table-column label="城市级别" prop="cityLevelName" />
        <el-table-column label="客户级别" prop="corpLevelName" />
        <el-table-column label="客户地址" prop="corpAddress" />
        <el-table-column label="客户电话" prop="corpPhone" />
        <el-table-column label="录入人员" prop="manageUser" />
        <el-table-column label="录入日期" prop="manageTime" :formatter="manageTimeFormatter" />
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="clickShowDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </bv-table>
    </div>
    <!-- 添加/修改/查看客户弹窗 -->
    <bv-dialog title="维护客户信息" :visible.sync="dialogVisible" top="5vh" @close="cancelInsertOrUpdate">
      <bv-scrollbar>
        <el-form ref="insertForm" :model="projInfo" status-icon :rules="rules" label-width="100px" label-position="right" style="width: 90%;">
          <el-form-item label="客户名称" prop="corpName">
            <el-input v-model="projInfo.corpName" />
          </el-form-item>
          <el-row>
            <el-col v-bind="$CONST.col.layout2">
              <el-form-item label="客户代码" prop="corpCode">
                <el-input v-model="projInfo.corpCode" style="width: 154px" />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout2">
              <el-form-item label="城市级别" prop="cityLevel">
                <el-select v-model="projInfo.cityLevel" placeholder="请选择">
                  <el-option
                    v-for="item in cityLevelOptions"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="客户级别" prop="corpLevel">
            <el-select v-model="projInfo.corpLevel" placeholder="请选择">
              <el-option
                v-for="item in corpLevelOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="客户电话" prop="corpPhone">
            <el-input v-model="projInfo.corpPhone" />
          </el-form-item>
          <el-form-item label="客户地址" prop="corpAddress">
            <el-input v-model="projInfo.corpAddress" />
          </el-form-item>
        </el-form>
      </bv-scrollbar>
      <div slot="footer">
        <bv-button view="save" type="primary" @click="handleInsertOrEdit('insertForm')">保存</bv-button>
        <bv-button view="cancel" @click="cancelInsertOrUpdate">取 消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  import {fetchTableDatas,addCustCorpInfo,editCustCorpInfo,deleteCustCorpInfo} from '../../api/custom/contractMessage'
  import moment from 'moment'




  export default {
    name:'CustomManage',
    data() {
      return {
        tableInstance: {},
        routeCorpName:'',
        routeCorpId:'',
        //查看页面显示
        showDetail: false,
        //table加载
        loading: false,
        //总数据
        items: null,
        //选中的数据
        selection: [],
        //复选框最后选中的值
        row: {},
        //判断是否是新增，false是修改
        isAdd: false,
        // 上传文件列表
        fileList: [],
        //新增/修改/查看详情时存储数据的容器
        projInfo: {},
        //查询类型切换（默认初始显示模糊查询）
        isFuzzy: true,
        // 模糊查询条件
        fuzzy: null,
        // 过滤条件
        filter: {},
        // 当前排序
        sort: null,
        //新增弹窗是否显示
        dialogVisible: false,
        //点击查看详情显示详情页弹窗
        showDetailInfoVisible:false,
        //点击查看详情按钮后控制表单数据只读
        isShowDetail:false,
        fetchTableDatas,
        //弹框表单校验规则
        rules: {
          corpName: [
            {required: true, message: '客户名称不能为空', trigger: 'blur'},
          ],
          cityLevel: [
            {required: true, message: '城市级别不能为空', trigger: 'change'},
          ],
          corpLevel: [
            {required: true, message: '客户级别不能为空', trigger: 'change'},
          ],
          corpCode: [
            {required: true, message: '客户代码不能为空', trigger: 'blur'},
          ],
        },
        cityLevelOptions: [],
        corpLevelOptions: [],
        activeName: 'basicDetail',
        projInfo1:{},
        stepItems:[],
        dialogStepVisible:false,
        active: 0,
        //增加项目计划按钮显示隐藏
        stepOneShow: true
      }
    },
    computed:{

    },
    created() {
      this.$store.dispatch('app/fetchDicts', 'cityLevel').then(data => {
        this.cityLevelOptions = data
      });
      this.$store.dispatch('app/fetchDicts', 'corpLevel').then(data => {
        this.corpLevelOptions = data
      })
    },
    methods: {
      clickInsert() {
        //弹窗显示标志置为true
        this.dialogVisible=true;
        //新增标志置为true
        this.isAdd=true;
        //显示详情标志置为false
        this.isShowDetail=false;
        //清空this.projInfo
        this.projInfo={};
        this.$nextTick(function () {
          this.$refs.insertForm.clearValidate()
        });
      },
      clickEdit() {
        //弹窗显示标志置为true
        this.dialogVisible=true;
        //新增标志置为false
        this.isAdd=false;
        //显示详情标志置为false
        this.isShowDetail=false;
        //将选中的数据赋值给this.projInfo
        this.projInfo={...this.tableInstance.table.selection[0]};
        this.$nextTick(function () {
          this.$refs.insertForm.clearValidate()
        });
      },

      //新增或修改页面中保存按钮的操作
      handleInsertOrEdit(formName) {
        //表单校验
        let _that=this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (_that.isAdd) {
              //将数据存入数据库
              addCustCorpInfo(_that.projInfo).then(res =>{
                if(res.data.level=="success"){
                  //刷新页面
                  _that.tableInstance.fetchData();
                  //关闭弹窗
                  _that.dialogVisible = false;
                }

                this.$message({
                  message:res.data.retMsg,type: res.data.level
                })
              })

            } else {
              //将修改的数据更新到数据库
              editCustCorpInfo(_that.projInfo).then(res =>{
                  // 修改成功后执行
                  if(res.data.level=="success"){
                    //刷新页面
                    _that.tableInstance.fetchData();
                    //关闭弹窗
                    _that.dialogVisible = false;
                    //清空选中
                    _that.selection.pop();
                  }
                  this.$message({
                    message:res.data.retMsg,type: res.data.level
                  })
                }
              )
            }
          }else {
            //校验没有通过时的处理
            return false
          }
        })
      },
      handleDelete () {
        let _that = this;
        _that.$confirm('确定要删除此信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //根据this.selection[0] 中的对象的id进行删除
          deleteCustCorpInfo(_that.tableInstance.table.selection.map(item => item.corpId).join()).then(res =>{
            if(res.data.level=="success"){
              //刷新页面
              _that.tableInstance.fetchData();
              //清空选中
              _that.selection.pop()
            }
            _that.$message({
              message:res.data.retMsg,type: res.data.level
            })
          })

        }).catch(() => {
        });

      },
      //表格操作列查看详情点击事件
      clickShowDetail(row) {
        //置弹窗显示标志位true
        // this.dialogVisible = true
        //置显示详情标志为true
        this.isShowDetail = true;
        //置新增标志为false
        this.isAdd = false;
        //给ProjInfo赋值为当前点击行的数据
        this.projInfo1=row;
        this.routeCorpId=row.corpId;
        this.routeCorpName=row.corpName;
        this.$router.push({
          path: '/custom/customManageDetail',
          name: 'CustomManageDetail',
          params: {
            corpInfo:row
          }
          /*query: {
              key: 'key',
              msgKey: this.msg
          }*/
        })
      },
      //新增弹窗关闭事件
      cancelInsertOrUpdate() {
        //清除表单校验
        this.$nextTick(function () {
          this.$refs.insertForm.clearValidate()
        });
        //关闭弹窗
        this.dialogVisible = false
      },
      //点击选择框时将所有选中的数据(selection)
      checkboxSelect(selection) {
        this.selection=selection
      },
      manageTimeFormatter(row) {
        return moment(row.manageTime).format('YYYY-MM-DD')
      },
    }
  }
</script>

<style>
  .step{
    width: 80%;
  }
  .step-row{
    min-width:500px;
    margin-bottom:30px;
    margin-top:12px;
  }
</style>

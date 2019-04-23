<template>
  <div class="app-container">
    <bv-table ref="table" title="售前项目信息" :pagination="true" :filter.sync="filter" :fetch-api="fetchPresaleProjInfo" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="add" @click="clickInsert">增加</bv-button>
        <bv-button show="one" view="modify" @click="clickEdit">修改</bv-button>
        <bv-button show="one" view="remove" @click="handleDelete">删除</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="项目名称" prop="projName">
            <el-input v-model="filter.projName" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" fixed />
      <el-table-column label="项目编号" sortable prop="presaleProjId" />
      <el-table-column label="项目名称" sortable prop="projName" />
      <el-table-column label="项目领域" sortable prop="projField" :formatter="fieldFormatter" />
      <el-table-column label="售前经理" sortable prop="saleManager" />
      <el-table-column label="销售人员" sortable prop="presalePersonName" />
      <el-table-column label="文档数量" sortable prop="fileNo" />
      <el-table-column label="创建日期" sortable :formatter="manageTimeFormatter" prop="manageTime" />
      <el-table-column label="更新日期" sortable :formatter="modifyTimeFormatter" prop="modifyTime" />
      <el-table-column label="相关部门" sortable prop="projDeptName" />
      <el-table-column label="关联销售项目" sortable prop="saleProjName" />
      <el-table-column label="关联技术项目" sortable prop="technoProjName" />
    </bv-table>
    <!-- 添加项目弹窗 -->
    <div class="dialog">
      <el-dialog :title="isAdd?'添加项目信息':'修改项目信息'" width="60%" top="5vh" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" @close="cancelInsertOrUpdate">
        <bv-scrollbar>
          <el-form ref="insertForm" :model="presalePojInfo" status-icon :rules="rules" label-width="100px" label-position="right" style="width: 95%;">
            <el-row :gutter="$CONST.row.gutter">
              <el-col v-bind="$CONST.col.layout1" hidden>
                <el-form-item label="项目ID" prop="presaleProjId">
                  <el-input v-model="presalePojInfo.presaleProjId" />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="项目名称" prop="projName">
                  <el-input v-model="presalePojInfo.projName" clearable />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout2">
                <el-form-item label="项目领域" prop="projField">
                  <el-select v-model="presalePojInfo.projField" placeholder="请选择">
                    <el-option
                      v-for="item in fieldOptions"
                      :key="item.value"
                      :label="item.label"
                      :disabled="isShowDetail?true:false"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout2">
                <el-form-item label="销售经理" prop="saleManager">
                  <el-input v-model="presalePojInfo.saleManager" clearable />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout3">
                <el-form-item label="售前人员" prop="presalePerson">
                  <el-input v-model="presalePojInfo.presalePerson" clearable />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout3">
                <el-form-item label="相关部门" prop="projDept">
                  <el-input v-model="presalePojInfo.projDept" clearable />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout3">
                <el-form-item label="相关销售项目" prop="saleProj">
                  <el-input v-model="presalePojInfo.saleProj" clearable />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout3">
                <el-form-item label="相关技术项目" prop="technoProj">
                  <el-input v-model="presalePojInfo.technoProj" clearable />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </bv-scrollbar>
        <div slot="footer">
          <bv-button v-if="!isShowDetail" view="save" type="primary" @click="handleInsertOrEdit('insertForm')">保存</bv-button>
          <bv-button v-if="!isShowDetail" view="cancel" @click="cancelInsertOrUpdate">取 消</bv-button>
          <bv-button v-if="isShowDetail" view="cancel" @click="dialogVisible=false">关闭</bv-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {fetchPresaleProjInfo, savePresaleProjInfo} from '../../api/proj/proj'

  export default {
    data() {
      return {
        // 过滤条件
        filter: {},
        //判断是否是新增，false是修改
        isAdd: false,
        //新增/修改/查看详情时存储数据的容器
        presalePojInfo: {},
        //新增弹窗是否显示
        dialogVisible: false,
        //点击查看详情显示详情页弹窗
        showDetailInfoVisible:false,
        //点击查看详情按钮后控制表单数据只读
        isShowDetail:false,
        //弹框表单校验规则
        rules: {
          projName: [
            {required: true, message: '请输入项目名', trigger: 'blur'},
            { min: 1, max: 100, message: '长度必须小于100个字', trigger: 'blur' }
          ],
          saleManager: [
            {required: true, message: '销售经理不能为空', trigger: 'blur'}
          ],
          projField: [
            {required: true, message: '项目领域不能为空', trigger: 'blur'}
          ],
          presalePerson: [
            {required: true, message: '售前人员不能为空', trigger: 'blur'},
            { min: 1, max: 300, message: '长度必须小于300个字符', trigger: 'blur' }
          ],
          projDept: [
            {required: true, message: '相关部门不能为空', trigger: 'blur'},
            { min: 1, max: 100, message: '长度必须小于100个字', trigger: 'blur' }
          ],
          saleProj: [
            { min: 1, max: 100, message: '长度必须小于100个字符', trigger: 'blur' }
          ],
          technoProj: [
            { min: 1, max: 100, message: '长度必须小于100个字符', trigger: 'blur' }
          ]
        },
        //项目领域字典
        fieldOptions: [
          {
            value:'0001',
            label:'消费金融'
          },{
            value:'0002',
            label:'商业银行'
          },{
            value:'0003',
            label:'住建房管'
          },{
            value:'0004',
            label:'其他'
          }
        ],
        tableInstance: {},
        fetchPresaleProjInfo
      }
    },

    methods: {
      clickInsert() {
        //弹窗显示标志置为true
        this.dialogVisible=true
        //新增标志置为true
        this.isAdd=true
        //显示详情标志置为false
        this.isShowDetail=false
        //清空this.presalePojInfo
        this.presalePojInfo={}
      },
      clickEdit() {
        //弹窗显示标志置为true
        this.dialogVisible=true
        //新增标志置为false
        this.isAdd=false
        //显示详情标志置为false
        this.isShowDetail=false
        //将选中的数据赋值给this.presalePojInfo
        this.presalePojInfo={...this.tableInstance.table.selection[0]}
      },
      handleDelete () {
        let _that = this
        this.$confirm('确定要删除此信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //刪除,改变该数据的状态为删除
          this.tableInstance.table.selection[0].state='0001'
          savePresaleProjInfo( this.tableInstance.table.selection[0]).then(res =>{
            if('success'==res.data.level){
              for(let i=0; i<_that.tableData.length; i++) {
                if(_that.tableData[i] ==  _that.tableInstance.table.selection[0]) {
                  _that.tableData.splice(i, 1);
                  break;
                }
              }
              //数据总数减1
              _that.total--
              //清空保存的选中数据
              _that.selection.pop()
            }
            _that.$message({
              message:res.data.retMsg,
              type: res.data.level
            })
          })
        }).catch(() => {

        });
      },
      //新增或修改页面中保存按钮的操作
      handleInsertOrEdit() {
        //表单校验
        let _that=this
        this.$refs.insertForm.validate((valid) => {
          if (valid) {
            //将数据存入数据库
            savePresaleProjInfo(_that.presalePojInfo).then(res =>{
              if('success'==res.data.level){
                this.afterModify()
                //清空选中
                _that.selection.pop()
              }
              _that.$message({
                message: res.data.retMsg,
                type: res.data.level
              })
            })
          }else {
            //校验没有通过时的处理
            _that.$message({
              message:'请检查数据的合法性！',type: 'warning'
            })
          }
        })
      },
      //新增或删除成功操作
      afterModify() {
        this.tableInstance.fetchData()
        this.dialogVisible = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      },
      //新增弹窗关闭事件
      cancelInsertOrUpdate() {
        //清除表单校验
        this.$nextTick(function () {
          this.tableInstance.insertForm.clearValidate()
        })
        //关闭弹窗
        this.dialogVisible = false
      },
      /**************************************时间格式化处理************************************/
      dateFtt:function(fmt,date)
      {
      let o = {
      "M+" : date.getMonth()+1,                 //月份
      "d+" : date.getDate(),                    //日
      "h+" : date.getHours(),                   //小时
      "m+" : date.getMinutes(),                 //分
      "s+" : date.getSeconds(),                 //秒
      "q+" : Math.floor((date.getMonth()+3)/3), //季度
      "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
      fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
      if(new RegExp("("+ k +")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
  },
  //过滤器用法
      modifyTimeFormatter(row) {
        let date = new Date(row.modifyTime)
        return this.dateFtt("yyyy-MM-dd hh:mm:ss",date)

      },
      manageTimeFormatter(row) {
        let date = new Date(row.manageTime)
        return this.dateFtt("yyyy-MM-dd hh:mm:ss",date)

      },
      // salePersonFormatter(row){
      //   if(row.presalePersonName && row.presalePersonName.includes('</br>')){
      //     return row.presalePersonName.replace(/<\/br>/g, ",")
      //   }else {
      //     return row.presalePersonName
      //   }
      //
      // },
      fieldFormatter(row) {
        switch (row.projField) {
          case '0001':return "消费金融"
          case '0002':return "商业银行"
          case '0003':return "住建房管"
          case '0004':return "其他"
        }
      }
    }
  }
</script>

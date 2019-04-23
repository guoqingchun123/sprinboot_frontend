<template>
  <div class="app-container">
    <div v-show="!showServiceDetail">
      <bv-table-header title="服务记录浏览">
        <bv-button v-show="$refs.table && $refs.table.selection.length === 0" view="add" @click="startCreate()">新增</bv-button>
        <bv-button v-show="$refs.table && $refs.table.selection.length === 1" view="modify" @click="startModify()">修改</bv-button>
        <bv-button v-show="$refs.table && $refs.table.selection.length > 0" view="remove" @click="startRemove()">删除</bv-button>
      </bv-table-header>
      <bv-table-search
        :is-fuzzy.sync="isFuzzy"
        :fuzzy.sync="fuzzy"
        :filter.sync="filter"
        @on-fuzzy-start="fetchData"
        @on-filter-start="fetchData"
        @on-filter-reset="fetchData"
      >
        <bv-col>
          <el-form-item label="客户单位名称" prop="corpName">
            <el-input v-model="filter.corpName" />
          </el-form-item>
        </bv-col>
      </bv-table-search>

      <el-table ref="table" v-loading="loading" :data="items" @sort-change="onSort">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed label="序号" type="index" />
        <el-table-column fixed label="记录编号" prop="recordId" align="center" />
        <el-table-column v-if="false" label="客户编号" prop="corpId" />
        <el-table-column label="客户单位" prop="corpName" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="clickShowDetail(scope.row)">{{ scope.row.corpName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="联系人" prop="custName" align="center" />
        <el-table-column label="联系电话" prop="custMobilePhone" align="center" />
        <el-table-column label="反馈方式" prop="feedbackMode" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.feedbackMode === '01' ">电话</span>
            <span v-else-if="scope.row.feedbackMode === '02' ">QQ</span>
            <span v-else-if="scope.row.feedbackMode === '03' ">Email</span>
          </template>
        </el-table-column>
        <el-table-column v-if="false" label="系统类型" prop="systemType" align="center" />
        <el-table-column label="状态" prop="state" align="center" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.state === '01' ">未处理</span>
            <span v-else-if="scope.row.state === '02' " style="color: #3a8ee6; font-weight: bold">处理中</span>
            <span v-else-if="scope.row.state === '03' ">已处理</span>
          </template>
        </el-table-column>
        <el-table-column v-if="false" label="问题分类" prop="problemType" align="center" />
        <el-table-column v-if="false" label="问题描述" prop="proDescribe" align="center" />
        <el-table-column v-if="false" label="处理建议" prop="proHandle" align="center" />
        <el-table-column label="录入人员" prop="enterEmp" align="center" />
        <el-table-column label="录入日期" prop="enterDate" align="center" sortable />
        <el-table-column label="处理人员" prop="handleUser" align="center" />
        <el-table-column label="处理日期" prop="handleTime" align="center" sortable />
        <el-table-column fixed="right" label="操作" align="center" label-width="100px" label-position="right">
          <template slot-scope="scope">
            <el-button type="text" @click="viewDetails(scope.row)">查看</el-button>
            <el-button type="text" @click="importEmpInfo()">导入</el-button>
          </template>
        </el-table-column>
      </el-table>

      <bv-pagination
        :total="total" :current-page.sync="currentPage" :page-size="limit"
        @current-change="handlePageChange"
      />
    </div>
    <div v-show="showServiceDetail">
      <div style="margin-left: 38%;font-size: 20px">【{{ routeCorpId+'  '+routeCorpName }}】</div>
      <bv-button @click="goBackBasic()">返回</bv-button>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="项目信息" name="basicDetail">
          <contract-detail :corp-id="projInfo1.corpId" />
        </el-tab-pane>
        <el-tab-pane label="联系人信息" name="customDetail">
          <custom-detail :corp-id="projInfo1.corpId" />
        </el-tab-pane>
        <el-tab-pane label="网络设备信息" name="networkEquip">
          <network-equip :corp-id="projInfo1.corpId" />
        </el-tab-pane>
        <el-tab-pane label="服务器信息" name="serverDetail">
          <server-detail :corp-id="projInfo1.corpId" />
        </el-tab-pane>
        <el-tab-pane label="数据库信息" name="databaseDetail">
          <database-detail :corp-id="projInfo1.corpId" />
        </el-tab-pane>
        <el-tab-pane label="web服务器信息" name="webServerDetail">
          <web-server-detail :corp-id="projInfo1.corpId" />
        </el-tab-pane>
        <el-tab-pane label="应用信息" name="applicationDetail">
          <application-detail :corp-id="projInfo1.corpId" />
        </el-tab-pane>
        <el-tab-pane label="图档信息" name="fileDetail">
          <file-detail :corp-id="projInfo1.corpId" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <bv-dialog title="服务记录维护" :visible.sync="dialogFormVisible">
      <el-form ref="role" :rules="rules" :model="role" label-width="100px" label-position="right">
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item v-if="false" label="记录编号" prop="recordId">
              <el-input v-if="modifyType === 'create'" v-model="role.recordId" />
              <span v-else v-text="role.recordId" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="客户单位" prop="corpName">
              <el-input v-model="role.corpName" placeholder="请输入客户单位" suffix-icon="el-icon-edit el-input__icon" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="联系人" prop="custName">
              <el-input v-model="role.custName" placeholder="请输入联系人姓名" suffix-icon="el-icon-edit el-input__icon" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="联系电话" prop="custMobilePhone">
              <el-input v-model="role.custMobilePhone" placeholder="请输入联系电话" suffix-icon="el-icon-edit el-input__icon" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="反馈方式" prop="feedbackMode">
              <el-select v-model="role.feedbackMode" placeholder="请选择反馈方式">
                <el-option
                  v-for="item in feedbackOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="系统类型" prop="systemType">
              <el-select v-model="role.systemType" placeholder="请选择系统类型">
                <el-option
                  v-for="item in systemTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="问题分类" prop="problemType">
              <el-select v-model="role.problemType" placeholder="请选择问题分类">
                <el-option
                  v-for="item in problemTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="紧急程度" prop="problemLevel">
              <el-select v-model="role.problemLevel" placeholder="请选择紧急程度">
                <el-option
                  v-for="item in problemLevelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
        </bv-row>
        <bv-row layout="dialog-1">
          <bv-col>
            <el-form-item label="问题描述" prop="proDescribe">
              <el-input v-model="role.proDescribe" type="textarea" placeholder="请输入问题描述" suffix-icon="el-icon-edit el-input__icon" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item v-if="modifyType != 'modify'" v-show="modifyType != 'create' " label="处理建议" prop="proHandle">
              <el-input v-model="role.proHandle" type="textarea" placeholder="请输入处理建议" suffix-icon="el-icon-edit el-input__icon" />
            </el-form-item>
          </bv-col>
        </bv-row>
      </el-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModify('role')">保存</bv-button>
        <el-button view="cancel" @click="cancelModify()">取消</el-button>
      </div>
    </bv-dialog>

    <el-dialog title="数据导入" :visible.sync="exportEmpModal" :close-on-click-modal="false" :close-on-press-escape="false" width="30%">
      <el-upload
        ref="uploadFile"
        class="upload-demo"
        drag
        :action="upload_url"
        :auto-upload="false"
        :on-change="fileChange"
        :file-list="fileList"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <bv-button size="small" type="success" @click="submitEmpUpload">上传并导入</bv-button>
        <bv-button @click="exportEmpModal = false">取 消</bv-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchServiceManage ,createServiceManage,modifyServiceManage, removeServiceManage,importEmpInfoExcel,importEmpInfoFunction } from '@/api/serviceManage'
  import { defaults as utils } from '@bestvike/utils'
  import customDetail from '@/views/project/child/customDetail'
  import networkEquip from '@/views/project/child/networkEquip'
  import serverDetail from '@/views/project/child/serverDetail'
  import databaseDetail from '@/views/project/child/databaseDetail'
  import webServerDetail from '@/views/project/child/webServerDetail'
  import applicationDetail from '@/views/project/child/applicationDetail'
  import contractDetail from '@/views/project/child/contractDetail'
  import fileDetail from '@/views/project/child/fileDetail'
  const maxFileSize = 20;
	export default {
    recordManagement: 'recordManagement',
    components:{
      customDetail,networkEquip,serverDetail,databaseDetail,
      webServerDetail,applicationDetail,contractDetail,fileDetail
    },
		data() {
			return {
        tableTitle: '服务记录管理',
        //是否加载中
        loading: false,
        isFilter: false,
        dialogFormVisible: false,
        //授权
        dialogGrantVisible: false,
        modifyType: null,
        items: null,
        isFuzzy: true,
        // 模糊查询条件
        fuzzy: null,
        // 过滤条件
        filter: {},
        // 当前排序
        sort: null,
        activeName: 'basicDetail',
        //新增弹窗表单内容
        role: {
          recordId: '',
          corpName: '',
          custName: '',
          proDescribe: '',
          feedbackMode: '',
          systemType: '',
          problemType: '',
          problemLevel: '',
          proHandle: '',
          custMobilePhone: '',
        },
        total: 0,
        limit: 10,
        currentPage: 1,
        //数据导入
        exportEmpModal: false,
        //上传的文件列表
        fileList: [],
        upload_url: 'url',
        //弹框表单校验规则
        rules: {
          recordId: [
            { required: true, message: '请填写记录编号', trigger: 'blur' }
          ],
          corpName: [
            { required: true, message: '请填写客户单位', trigger: 'blur' },
            { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
          ],
          custName: [
            { required: true, message: '请输入联系人姓名', trigger: 'blur' },
            { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
          ],
          custMobilePhone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
          ],
          feedbackMode: [
            { required: true, message: '请选择反馈方式', trigger: 'change' }
          ],
          systemType: [
            { required: true, message: '请选择系统类型', trigger: 'change' }
          ],
          problemType: [
            { required: true, message: '请选择问题分类', trigger: 'change' }
          ],
          problemLevel: [
            { required: true, message: '请选择紧急程度', trigger: 'change' }
          ],
          proHandle: [
            { required: true, message: '请填写处理建议', trigger: 'blur' }
          ],
          proDescribe: [
            { required: true, message: '请填写问题描述', trigger: 'blur' }
          ],
        },
        feedbackOptions: [
          {
            label:'电话',
            value:'01'
          },
          {
            label:'QQ',
            value:'02'
          },
          {
            label:'Email',
            value:'03'
          }
        ],
        systemTypeOptions: [
          {
            label:'硬件及环境',
            value:'01'
          },
          {
            label:'保修金',
            value:'02'
          },
          {
            label:'维修资金',
            value:'03'
          },
          {
            label:'预售网签',
            value:'04'
          },
          {
            label:'监管',
            value:'05'
          },
          {
            label:'物业平台',
            value:'06'
          },
          {
            label:'公房',
            value:'07'
          },
          {
            label:'用友财务',
            value:'08'
          },
          {
            label:'BVOA',
            value:'09'
          },
          {
            label:'产权产籍',
            value:'10'
          },
          {
            label:'存量房',
            value:'11'
          },
          {
            label:'数据中心',
            value:'12'
          },
          {
            label:'其他',
            value:'13'
          }
        ],
        showServiceDetail:false,
        routeCorpName:'',
        routeCorpId:'',
        projInfo1:[],
        problemTypeOptions: [
          {
            label:'数据问题',
            value:'01'
          },
          {
            label:'系统缺陷',
            value:'02'
          },
          {
            label:'功能需求',
            value:'03'
          },
          {
            label:'操作问题',
            value:'04'
          },
          {
            label:'环境问题',
            value:'05'
          },
          {
            label:'业务咨询',
            value:'06'
          },
          {
            label:'其他',
            value:'07'
          }
        ],
        problemLevelOptions: [
          {
            label:'非常低',
            value:'01'
          },
          {
            label:'低',
            value:'02'
          },
          {
            label:'中',
            value:'03'
          },
          {
            label:'高',
            value:'04'
          },
          {
            label:'非常高',
            value:'05'
          }
        ],
			}
		},
    created() {
      this.fetchData()
    },
		methods: {
      onSort(sort) {
        this.sort = utils.transTableSort(sort)
        this.fetchData()
      },
      fetchData() {
        this.loading = true
        let data = {}
        if (this.isFuzzy) {
          if (this.fuzzy) {
            data.fuzzy = this.fuzzy
          }
        } else {
          for (let item in this.filter) {
            data[item] = this.filter[item]
          }
        }
        if (this.sort) {
          data.sort = this.sort
        }
        // 分页信息
        data.page = this.currentPage
        data.limit = this.limit
        fetchServiceManage(data).then(response => {
          this.total = response.data.total
          this.items = response.data.list
          setTimeout(() => {
            this.loading = false
          }, 500);
        }).catch(() => {
          setTimeout(() => {
            this.loading = false
          }, 500);
        })
      },
      handlePageChange(value) {
        this.currentPage = value;
        this.fetchData()
      },
      startCreate() {
        this.dialogFormVisible = true
        this.modifyType = 'create';
        this.role={};
      },
      startModify() {
        this.role = {...this.$refs.table.selection[0]}
        this.dialogFormVisible = true
        this.modifyType = 'modify'
      },
      //点击查看详情
      viewDetails(row) {
        this.role = row
        this.dialogFormVisible = true
        this.modifyType = 'details'
      },
      clickShowDetail(row) {
        this.showServiceDetail=true;
        this.projInfo1=row;
        this.routeCorpId=row.corpId;
        this.routeCorpName=row.corpName;

      },
      goBackBasic(){
        this.projInfo1 = {};
        this.showServiceDetail = false
      },
      cancelModify() {
        this.$nextTick(function () {
          this.$refs.role.clearValidate()
        });
        // this.initRole()
        this.dialogFormVisible = false
        this.modifyType = null
        this.$message({
                        message: '取消保存',
                        type: 'warning'
                      })

      },
      afterModify() {
        this.fetchData()
        this.initRole()
        this.dialogFormVisible = false
        this.modifyType = null
        this.$message({
                        message: '保存成功',
                        type: 'success'
                      })
      },
      confirmModify(formName) {
        //表单校验
        let _that=this;
        this.$refs[formName].validate((valid) => {
          if (this.modifyType === 'create' && valid == false ) {debugger
            //this.insertForm.manageUser = '管理员'
              //将数据存入数据库
            createServiceManage(_that.role).then(result =>{debugger
                //刷新页面
                _that.fetchData();
                _that.initRole();
                //关闭弹窗
                _that.dialogFormVisible = false;
                _that.modifyType = null;
                this.$message({
                                message:result.data.message,
                                type: result.data.level
                              })
              })
          }else if (this.modifyType === 'modify' && valid ) {
            //将数据存入数据库
            modifyServiceManage(_that.role).then(result =>{debugger
              //刷新页面
              _that.fetchData();
              _that.initRole();
              //关闭弹窗
              _that.dialogFormVisible = false;
              _that.modifyType = null;
              this.$message({
                              message:result.data.message,
                              type: result.data.level
                            })
            })
          } else {
            //校验没有通过时的处理
            return false
          }
        })
      },
      startRemove() {
        this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeServiceManage(this.$refs.table.selection.map(item => item.recordId).join()).then(result => {
            this.fetchData()
            this.$message({
                            message:result.data.message,
                            type: result.data.level
                          })
          })
        })
      },
      // 弹窗用
      initRole() {
        this.role = {
          recordId: '',
          corpName: '',
          custName: '',
          proDescribe: '',
          feedbackMode: '',
          systemType: '',
          problemType: '',
          proHandle: '',
          problemLevel: '',
          custMobilePhone: '',
        }
      },
      //导入数据
      importEmpInfo(){
        this.exportEmpModal = true
      },
      fileChange(file, fileList) {
        let isLt = file.size / 1024 / 1024 < 20;
        if (!isLt) {
          this.$message.error('上传文件大小不能超过' + maxFileSize + 'MB!');
          this.fileList = fileList.slice(1, 1);
          return;
        }
        this.fileList = fileList.slice(-1);
      },
      submitEmpUpload(){
        let path = '\\服务管理';
        let isHaveFiles = false;
        let file = [];
        let fileSource = [];
        if (this.$refs.uploadFile.uploadFiles.length > 0) {debugger
          isHaveFiles = true;
          file.push(this.$refs.uploadFile.uploadFiles[0].raw);
          fileSource.push("服务管理文件");
        }

        // 没有上传文件时
        if (!isHaveFiles) {
          this.$message({
                          type: 'warning',
                          message: '请至少上传1个文件!'
                        });
          return;
        }
        //传递当前用户id  ==  manageUser
        let data = {
          fileSource: fileSource,
          manageUser: 'admin',
          path: path
        };
        importEmpInfoExcel(file, data).then(ret => {
          //上传文件成功  返回文件id  插入数据
          if (ret.data.retCode === '0000') {
            //获取文件id  上传文件中的数据
            let data = {}
            data.fileId = ret.data.fileId
            importEmpInfoFunction(data).then(res => {
              // 隐藏版本弹窗
              this.exportEmpModal = false;
              this.$message({
                              type: res.data.level,
                              message: res.data.retMsg
                            });
              //清除上传的文件
              this.$refs.uploadFile.clearFiles()
            })
          }
        }).catch(() => {
          console.log('上传失败')
          this.$refs.uploadFile.clearFiles()
        });
      },
    }
	}
</script>

<style scoped>

</style>

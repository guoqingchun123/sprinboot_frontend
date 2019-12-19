<template>
  <div class="app-container">
    <bv-table ref="table" title="用户一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchUsers" @on-mounted="(table) => tableInstance = table">
      <div slot="search">
        <bv-col>
          <bv-form-item label="用户编号" prop="id">
            <el-input v-model="filter.id" />
          </bv-form-item>
        </bv-col>
        <bv-col>
          <bv-form-item label="用户姓名" prop="name">
            <el-input v-model="filter.name" />
          </bv-form-item>
        </bv-col>
        <bv-col>
          <bv-form-item label="员工编号" prop="empId">
            <el-input v-model="filter.empId" />
          </bv-form-item>
        </bv-col>
      </div>
      <bv-table-column label="用户编号" prop="id" align="center" sortable="custom" />
      <bv-table-column label="用户姓名" prop="name" align="center" sortable="custom" />
      <bv-table-column label="员工编号" prop="empId" align="center" sortable="custom" />
      <bv-table-column label="用户状态" prop="status" align="center" :formatter="userStateFormatter" />
      <bv-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button view="details" type="text" @click="tokenManagement(scope.row)">管理令牌</el-button>
        </template>
      </bv-table-column>
    </bv-table>

    <bv-dialog title="令牌管理" :visible.sync="dialogFormVisible">
      <bv-table ref="table" :filter-switch="false" :pagination="true" :filter.sync="filter" :fetch-api="fetchPersonToken1" @on-mounted="(table) => tableInstanceDialog = table">
        <div slot="operates">
          <bv-button show="none" view="create" @click="add()">增加</bv-button>
          <bv-button v-if="unlockShow()" view="modify" @click="unlock()">解锁</bv-button>
          <bv-button v-if="startLostShow()" view="modify" @click="startLost()">挂失</bv-button>
          <bv-button v-if="cancleLostShow()" view="modify" @click="cancleLost()">解挂</bv-button>
          <bv-button v-if="deadShow()" view="modify" @click="dead()">停用</bv-button>
          <bv-button v-if="tokenStartShow()" view="modify" @click="tokenStart()">启用</bv-button>
          <bv-button v-if="startBackShow()" view="modify" @click="startBack()">收回</bv-button>
        </div>
        <bv-table-column type="selection"/>
        <bv-table-column label="序列号" prop="deviceSn" align="center" sortable="custom" />
        <bv-table-column label="状态" prop="state" align="center" sortable="custom" :formatter="perTokenStateFormatter" />
        <bv-table-column label="最后修改日期" prop="lastModifyDate" align="center" :formatter="dateFormatter" />
      </bv-table>
    </bv-dialog>

    <bv-dialog title="验证密码" :visible.sync="dialogFormVisibleToken" :close-on-press-escape="true">
      <bv-form ref="verifyPassForm" :model="item" :rules="rules">
        <bv-row :layout="2">
          <bv-col>
            <bv-form-item label="动态令牌密码：" prop="devicePwd" style="white-space: nowrap">
              <el-input v-model="item.devicePwd" placeholder="请输入动态令牌密码" />
            </bv-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="unlost()">保存</bv-button>
        <bv-button view="cancel" @click="dialogFormVisibleToken=false">取消</bv-button>
      </div>
    </bv-dialog>

    <bv-dialog title="令牌发放" :visible.sync="dialogFormVisibleAdd" :close-on-press-escape="true">
      <bv-form ref="tokenGrantForm" :model="unallotToken" :rules="rules">
        <bv-row :layout="2">
          <bv-col>
            <bv-form-item label="令牌序列号" prop="deviceSn" style="white-space: nowrap">
              <el-select v-model="unallotToken.deviceSn" placeholder="请输入令牌序列号" filterable>
                <el-option
                  v-for="itemToken in unallotTokenList"
                  :key="itemToken.deviceSn"
                  :label="itemToken.deviceSn"
                  :value="itemToken.deviceSn"
                />
              </el-select>
            </bv-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="addToken()">保存</bv-button>
        <bv-button view="cancel" @click="dialogFormVisibleAdd=false">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  import { fetchUsers,
    fetchPersonToken,
    lostPersonToken,
    deadPersonToken,
    unlostPersonToken,
    backPersonToken,
    allotPersonToken,
    fetchPersonUnlock,
    startPersonToken,
    fetchUnallotToken} from '@/api/authority'
  import moment from 'moment'
  export default {
    name: 'ListRole',
    /*components: {
      BvScrollbar
    },*/
    data() {
      return {
        filter: {},
        item: {},
        unallotToken: {},
        unallotTokenList: [],
        dialogFormVisible: false,
        dialogFormVisibleToken: false,
        dialogFormVisibleAdd: false,
        modifyType: null,
        role: {
          id: null,
          name: null,
          empId:null,
          status: null,
          deviceSn: null,
          state: null,
          lastModifyDate: null
        },
        //表单校验规则
        rules: {
          devicePwd: [
            {required: true, message:'动态令牌密码不能为空', trigger: 'blur'},
          ],
          deviceSn: [
            {required: true, message:'新增令牌序列号不能为空', trigger: 'change'},
          ]
        },
        userState: [
          {
            label:'正常',
            value:'0000'
          }
        ],
        tableInstance: {},
        tableInstanceDialog: {},
        fetchUsers,
        fetchPersonToken
      }
    },
    methods: {
      getUnallotToken() {
        //查询未分配令牌
        fetchUnallotToken().then(response=>{
          this.unallotTokenList=response.data;
        })
      },
      unlockShow(){
        if (!this.tableInstanceDialog||!this.tableInstanceDialog.selection||this.tableInstanceDialog.selection.length != 1){
          return false
        }
        return this.tableInstanceDialog.selection[0].state === '0001'
      },
      startLostShow(){
        if (!this.tableInstanceDialog||!this.tableInstanceDialog.selection||this.tableInstanceDialog.selection.length != 1){
          return false
        }
        if(this.tableInstanceDialog.selection[0].state === '0000'|| this.tableInstanceDialog.selection[0].state === '0001'){
          return true
        }
        return false
      },
      cancleLostShow(){
        if (!this.tableInstanceDialog||!this.tableInstanceDialog.selection||this.tableInstanceDialog.selection.length != 1){
          return false
        }
        return this.tableInstanceDialog.selection[0].state === '0002'
      },
      deadShow(){
        if (!this.tableInstanceDialog||!this.tableInstanceDialog.selection||this.tableInstanceDialog.selection.length != 1){
          return false
        }
        if(this.tableInstanceDialog.selection[0].state === '0000'|| this.tableInstanceDialog.selection[0].state === '0001'
           || this.tableInstanceDialog.selection[0].state === '0002'){
          return true
        }
        return false
      },
      tokenStartShow(){
        if (!this.tableInstanceDialog||!this.tableInstanceDialog.selection||this.tableInstanceDialog.selection.length != 1){
          return false
        }
        return this.tableInstanceDialog.selection[0].state === '9999'
      },
      startBackShow(){
        if (!this.tableInstanceDialog||!this.tableInstanceDialog.selection||this.tableInstanceDialog.selection.length != 1){
          return false
        }
        if(this.tableInstanceDialog.selection[0].state === '0000'|| this.tableInstanceDialog.selection[0].state === '0001'|| this.tableInstanceDialog.selection[0].state === '0002'){
          return true
        }
        return false
      },
      //令牌状态
      perTokenStateFormatter(row){
        switch (row.state) {
          case '9999':return "未激活";
          case '0000':return "已激活";
          case '0001':return "已锁定";
          case '0002':return "已挂失";
        }
      },
      dateFormatter(row) {
        return moment(row.lastModifyDate).format('YYYY-MM-DD')
      },
      //刷新
      refreshTokenTable() {
       console.log(this.tableInstanceDialog)
       this.tableInstanceDialog.fetchData()
        },
      //令牌管理
      tokenManagement(row) {
        this.role = row
        this.dialogFormVisible = true
        this.refreshTokenTable()
      },
      //令牌解挂输入动态密码弹框
      cancleLost() {
        this.dialogFormVisibleToken = true
      },
      //令牌新增输入序列号弹框
      add() {
        this.dialogFormVisibleAdd = true
        this.getUnallotToken()
      },
      //令牌新增
      addToken(){
        this.$refs.tokenGrantForm.validate((valid) => {
         if (!valid) {
           return false
         }
        let data = {}
        data.deviceSn = this.unallotToken.deviceSn
        data.userId = this.role.id
        allotPersonToken(data).then(ret => {
          //新增成功  返回文件id  插入数据
          this.$message({
            type: ret.data.level,
            message: ret.data.retMsg
          });
          if (ret.data.retCode === '00000') {
            // 隐藏版本弹窗
            this.dialogFormVisibleAdd = false
            this.refreshTokenTable()
          }
        }).catch(() => {
          console.log('新增失败')
        });
        })
      },
      //令牌解锁
      unlock(){
        this.role = {...this.tableInstanceDialog.table.selection[0]}
        let data = {}
        data.deviceSn = this.role.deviceSn;
        fetchPersonUnlock(data).then(ret => {
          //解锁成功  返回文件id  插入数据
          this.$message({
            type: ret.data.level,
            message: ret.data.retMsg
          });
          if (ret.data.retCode === '00000') {
            // 隐藏版本弹窗
            this.dialogFormVisible = false
          }
        }).catch(() => {
          console.log('解锁失败')
        });
      },
      //令牌解挂
      unlost(){
        this.$refs.verifyPassForm.validate((valid) => {
         if (!valid) {
           return false
         }
        this.role = {...this.tableInstanceDialog.table.selection[0]}
        let data = {}
        data.deviceSn = this.role.deviceSn;
        data.devicePwd = this.item.devicePwd;
        unlostPersonToken(data).then(ret => {
          //解挂成功  返回文件id  插入数据
          this.$message({
            type: ret.data.level,
            message: ret.data.retMsg
          });
          if (ret.data.retCode === '00000') {
            // 隐藏版本弹窗
            this.dialogFormVisibleToken = false
            this.dialogFormVisible=false
            this.refreshTokenTable()
          }
        }).catch(() => {
          console.log('解挂失败')
        });
        })
      },
      //令牌挂失
      startLost(){
        this.role = {...this.tableInstanceDialog.table.selection[0]}
        let data = {}
        data.deviceSn = this.role.deviceSn;
        lostPersonToken(data).then(ret => {
          //挂失成功  返回文件id  插入数据
          this.$message({
            type: ret.data.level,
            message: ret.data.retMsg
          });
          if (ret.data.retCode === '00000') {
            // 隐藏版本弹窗
            this.dialogFormVisible = false
          }
        }).catch(() => {
          console.log('挂失失败')
        });
      },
      //令牌停用
      dead(){
        this.role = {...this.tableInstanceDialog.table.selection[0]}
        let data = {}
        data.deviceSn = this.role.deviceSn;
        deadPersonToken(data).then(ret => {
          //停用成功  返回文件id  插入数据
          this.$message({
            type: ret.data.level,
            message: ret.data.retMsg
          });
          if (ret.data.retCode === '00000') {
            // 隐藏版本弹窗
            this.dialogFormVisible = false
          }
        }).catch(() => {
          console.log('停用失败')
        });
      },
      //令牌启用
      tokenStart(){
        this.role = {...this.tableInstanceDialog.table.selection[0]}
        let data = {}
        data.deviceSn = this.role.deviceSn;
        data.userId = this.role.userId
        startPersonToken(data).then(ret => {
          //启用成功  返回文件id  插入数据
          this.$message({
            type: ret.data.level,
            message: ret.data.retMsg
          });
          if (ret.data.retCode === '00000') {
            // 隐藏版本弹窗
            this.dialogFormVisible = false
          }
        }).catch(() => {
          console.log('启用失败')
        });
      },
      //令牌收回
      startBack(){
        this.role = {...this.tableInstanceDialog.table.selection[0]}
        let data = {}
        data.deviceSn = this.role.deviceSn;
        backPersonToken(data).then(ret => {
          //回收成功  返回文件id  插入数据
          this.$message({
            type: ret.data.level,
            message: ret.data.retMsg
          });
          if (ret.data.retCode === '00000') {
            // 隐藏版本弹窗
            this.dialogFormVisible = false
          }
        }).catch(() => {
          console.log('回收失败')
        });
      },
      showLabel(data) {
        return this.$filters.transTitle(data.meta)
      },
      //用户状态
      userStateFormatter(row){
        switch (row.status) {
          case '0000':return "正常";
        }
      },
      fetchPersonToken1(data) {
        data.id = this.role.id;
        return fetchPersonToken(data);
      }
    }
  }
</script>



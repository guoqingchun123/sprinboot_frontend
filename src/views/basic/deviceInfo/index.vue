<template>
  <div class="app-container">
    <bv-table title="设备号管理" :pagination="true" :filter.sync="filter" :fetch-api="fetchDeviceInfo" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="create" authority="create" @click="startCreate()">新增</bv-button>
        <bv-button v-if="modifyShow()"  view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button v-if="deleteShow()" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <bv-form-item label="设备编号" prop="bldNO">
            <el-input v-model="filter.deviceNumber" />
          </bv-form-item>
        </bv-col>
        <bv-col>
          <bv-form-item label="小区名称" prop="regionName">
            <el-input v-model="filter.regionName" />
          </bv-form-item>
        </bv-col>
        <bv-col>
          <bv-form-item label="状态" prop="state">
            <el-select v-model="filter.state" placeholder="请选择信息类别">
              <el-option
                v-for="item in deviceTypes"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </bv-form-item>
        </bv-col>
        <bv-col>
          <bv-form-item label="分配用户" prop="allotUser">
            <el-input v-model="filter.allotUser" />
          </bv-form-item>
        </bv-col>
      </div>
      <bv-table-column type="selection" width="55"/>
      <bv-table-column label="设备编号" prop="deviceNumber" align="center" sortable="custom" />
      <!--<bv-table-column v-if="false" label="小区Id" prop="regionId" show="false" align="center" sortable="custom" />-->
      <bv-table-column label="小区名称" prop="regionName" align="center" sortable="custom" />
      <bv-table-column label="分配用户" prop="allotUser" align="center" sortable="custom" />
      <bv-table-column label="分配时间" prop="allotTime" align="center" sortable="custom" />
      <bv-table-column label="创建人员" prop="creatUser" align="center" sortable="custom" />
      <bv-table-column label="状态" prop="state" :formatter="stateFormat" align="center" sortable="custom" />
      <bv-table-column align="center" label="操作">
        <template slot-scope="scope">
          <bv-button v-show="maintainShow(scope.row)" icon="el-icon-paperclip" type="text" @click="allotDevice(scope.row)">分配</bv-button>
        </template>
      </bv-table-column>
    </bv-table>

    <bv-dialog v-if="dialogFormVisibleReg" title="选择小区" :visible.sync="dialogFormVisibleReg">
      <bv-form ref="dialogFormReg" :model="item" :rules="rulesReg">
        <bv-row :layout="1">
          <bv-col>
            <bv-form-item label="分配小区" prop="regionId">
              <el-select v-model="item.regionId" filterable placeholder="请选择">
                <el-option
                  v-for="region in regions"
                  :key="region.regionId"
                  :label="region.regionName"
                  :value="region.regionId"
                />
              </el-select>
            </bv-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModifyReg()">保存</bv-button>
        <bv-button view="cancel" @click="cancelModifyReg()">取消</bv-button>
      </div>
    </bv-dialog>

    <bv-dialog v-if="dialogFormVisible" title="设备号新增" :visible.sync="dialogFormVisible">
      <bv-form ref="dialogForm" :model="item" :rules="rules">
        <bv-row :layout="2">
          <bv-col>
            <bv-form-item label="起始设备号" prop="deviceStartNum">
              <el-input-number v-model="item.deviceStartNum" :min="1" :max=item.deviceEndNum-1 label="起始设备号不能为空" />
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="终止设备号" prop="deviceEndNum">
              <el-input-number v-model="item.deviceEndNum" :min=item.deviceStartNum+1 :max="999" label="终止设备号不能为空" />
            </bv-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModify()">保存</bv-button>
        <bv-button view="cancel" @click="cancelModify()">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  
  import {fetchDeviceInfo,creatDeviceInfo,allotDeviceInfo,deleteDeviceInfo} from '@/api/basic'
  import {fetchRegionsNoDevice,fetchRegionsNoDeviceCur} from '@/api/basic'
  export default {
    name: 'DeviceInfo',
    data() {
      return {
        filter: {},
        tableInstance: {},
        item: {},
        dataRegionId: {},
        row:{
          deviceNumber:null,
        },
        rulesReg: {
          regionId: [
            {required: true, message: '请选择分配小区', trigger: 'blur'}
          ]
        },
        rules: {
          deviceStartNum: [
            {required: true, message: '请输入起始设备号', trigger: 'blur'}
          ],
          deviceEndNum: [
            {required: true, message: '请输入终止设备号', trigger: 'blur'}
          ]
        },
        deviceTypes: [],
        dialogFormVisible: false,
        dialogFormVisibleReg: false,
        regions: [],
        fetchDeviceInfo,
        creatDeviceInfo,
        allotDeviceInfo,
        fetchRegionsNoDevice,
        fetchRegionsNoDeviceCur,
        deleteDeviceInfo,
      }
    },
    created() {
      this.$store.dispatch('app/fetchDicts', 'deviceStatus').then(data => {
        this.deviceTypes = data
      })
    },
    mounted() {
      fetchRegionsNoDevice().then((res) => {
        this.regions = res.data;
      })
    },
    methods: {
      // 弹窗用
      initData() {
        this.item = {}
      },
      stateFormat(row, column, cellValue) {
        for (let i in this.deviceTypes) {
          if (cellValue == this.deviceTypes[i].code) {
            return this.deviceTypes[i].name
          }
        }
      },
      divisionFormat(row, column, cellValue) {
        for (let i in this.divisions) {
          if (cellValue && cellValue == this.divisions[i].divisionCode) {
            return this.divisions[i].divisionName
          }
        }
      },
      deleteShow() {
        if (!this.tableInstance || !this.tableInstance.selection || this.tableInstance.selection.length === 0) {
          return false
        }
        const selection = this.tableInstance.selection
        for (let item in selection) {
          if (selection[item].state == '0') {
            return false
          }
        }
        return true
      },
      modifyShow() {
        if (!this.tableInstance || !this.tableInstance.selection || this.tableInstance.selection.length == 1) {
          const selection = this.tableInstance.selection
          for (let item in selection) {
            if (selection[item].state == '1') {
              return false
            }
          }
          return true
        }
        return false
      },
      //操作列显示逻辑
      maintainShow(row) {
        if (row.state == '0') {
          //TODO 已分配设备号不显示
          return false
        } else {
          return true
        }
      },
      startCreate() {
        this.initData();
        this.dialogFormVisible = true;
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate();
      },
      allotDevice(row) {
        this.item = row,
        this.dialogFormVisibleReg = true;
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate();
      },
      startModify() {
        this.item = this.tableInstance.table.selection[0],
          // this.item.regionId = null;
          fetchRegionsNoDeviceCur(this.tableInstance.table.selection[0].regionId).then((res) => {
            this.regions = res.data;
            this.dialogFormVisibleReg = true;
          })
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate();
      },
      cancelModify() {
        this.initData();
        this.dialogFormVisible = false;
      },
      cancelModifyReg() {
        this.initData();
        this.dialogFormVisibleReg = false;
      },
      afterModify() {
        this.tableInstance.fetchData();
        this.initData();
        this.dialogFormVisible = false;
        this.$message({
                        message: '保存成功',
                        type: 'success'
                      })
      },
      afterAllot() {
        this.tableInstance.fetchData();
        this.initData();
        this.dialogFormVisibleReg = false;
        fetchRegionsNoDevice().then((res) => {
          this.regions = res.data;
        })
        this.$message({
                        message: '分配成功',
                        type: 'success'
                      })
      },
      afterDelete(){
        this.tableInstance.fetchData();
        this.initData();
        this.$message({
                        message: '删除成功',
                        type: 'success'
                      })
      },
      confirmModify() {
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          creatDeviceInfo(this.item).then(() => {
              this.afterModify()
            })
        });
      },
      confirmModifyReg() {
        this.$refs.dialogFormReg.validate((valid) => {
          if (!valid) {
            return false;
          }
          allotDeviceInfo(this.item).then(() => {
            this.afterAllot()
          })
        });
      },
      //删除设备号
      startRemove() {
        this.$confirm('此操作将删除该小区, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDeviceInfo(this.tableInstance.table.selection.map(item => item.deviceNumber).join()).then(() => {
            this.afterDelete()
          })
        })
      },
    }
  }
</script>

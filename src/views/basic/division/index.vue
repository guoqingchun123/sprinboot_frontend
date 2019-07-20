<template>
  <div class="app-container">
    <bv-table title="行政区划" :pagination="true" :filter.sync="filter" :fetch-api="fetchDivisions" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="add" authority="add" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify">修改</bv-button>
        <bv-button v-if="deleteShow()" view="remove" authority="remove">删除</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="行政区代码" prop="divisionCode">
            <el-input v-model="filter.divisionCode" />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="行政区名称" prop="divisionName">
            <el-input v-model="filter.divisionName" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column label="行政区代码" prop="divisionCode" align="center" />roleId
      <el-table-column label="行政区名称" prop="divisionName" align="center" sortable="custom" />
    </bv-table>
  
    <bv-dialog title="行政区维护" :visible.sync="dialogFormVisible">
      <bv-form ref="dialogForm" :model="item" :rules="rules">
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item label="行政区代码" prop="divisionCode">
              <el-input v-if="modifyType === 'create'" v-model.trim="item.divisionCode" />
              <span v-else v-text="item.divisionCode" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="行政区名称" prop="divisionName">
              <el-input v-model.trim="item.divisionName" />
            </el-form-item>
          </bv-col>
        </bv-row>
        <bv-row layout="dialog-1">
          <bv-col>
            <div class="app">
              <div id="map" ref="map" style="height: 450px" />
            </div>
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
  
  import {fetchDivisions} from '@/api/basic'
  import AMapJS from "amap-js"
  
  export default {
    name: 'ListDivision',
    data() {
      return {
        filter: {},
        tableInstance: {},
        item: {},
        fetchDivisions,
        rules: {
          divisionCode: [
            {required: true, message: '请输入行政区代码', trigger: 'blur'},
            {min: 1, max: 36, message: '长度必须小于36个字', trigger: 'blur'}
          ],
          divisionName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 1, max: 10, message: '长度必须小于10个字', trigger: 'blur'}
          ]
        },
        dialogFormVisible: false,
        modifyType: null
      }
    },
    created() {
    },
    methods: {
      // 弹窗用
      initDivision() {
        this.item = {}
      },
      deleteShow() {
        if (!this.tableInstance || !this.tableInstance.selection || this.tableInstance.selection.length === 0) {
          return false
        }
        return true;
      },
      startCreate() {
        this.dialogFormVisible = true
        this.modifyType = 'create'
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
        const aMapJSAPILoader = new AMapJS.AMapJSAPILoader({
          key: "8493be8a99d103cbed76edb91479bf7f",
          v: "1.4.14", // 版本号
          params: {}, // 请求参数
          protocol: "https:" // 请求协议
        });
  
        const aMapUILoader = new AMapJS.AMapUILoader({
          v: "1.0" // UI组件库版本号
        });
  
        aMapJSAPILoader.load().then(AMap => {
          aMapUILoader.load().then(initAMapUI => {
            const AMapUI = initAMapUI(); // 这里调用initAMapUI初始化并返回AMapUI
            // 其他逻辑
            console.log(AMap);
            console.log(AMapUI);
            new AMap.Map(this.$refs.map);
          });
        })
      },
      startModify() {
        this.item = {...this.tableInstance.table.selection[0]};
        this.dialogFormVisible = true;
        this.modifyType = 'modify';
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      cancelModify() {
        this.initDivision()
        this.dialogFormVisible = false;
        this.modifyType = null;
      },
      confirmModify() {
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false
          }
      
          if (this.modifyType === 'modify') {
            let item = {...this.item};
            delete item.permissions;
            // modifyRole(item).then(() => {
            //   this.tableInstance.table.clearSelection()
            //   this.afterModify()
            // })
          } else {
            // createRole(this.item).then(() => {
            //   this.afterModify()
            // })
          }
        })
      },
      afterModify() {
        this.tableInstance.fetchData();
        this.initDivision();
        this.dialogFormVisible = false;
        this.modifyType = null;
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      },
      startRemove() {
        this.$confirm('此操作将删除该行政区, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // removeRoles(this.tableInstance.table.selection.map(item => item.roleId).join()).then(() => {
          //   this.$message({
          //     message: '删除成功',
          //     type: 'success'
          //   })
          //   this.tableInstance.fetchData()
          // })
        }).catch(() => {
          /*this.$message({
            message: '取消删除',
            type: 'warning'
          })*/
        })
      }
    }
  }
</script>

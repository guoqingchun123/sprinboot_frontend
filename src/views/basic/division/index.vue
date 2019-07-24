<template>
  <div class="app-container">
    <bv-table title="行政区划" :pagination="true" :filter.sync="filter" :fetch-api="fetchDivisions" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="add" authority="add" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button v-if="deleteShow() && testShow" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
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
      <el-table-column label="行政区代码" prop="divisionCode" align="center" />
      roleId
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
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item label="经度" prop="x">
              <el-input v-model.trim="item.x" :disabled="true" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="纬度" prop="y">
              <el-input v-model.trim="item.y" :disabled="true" />
            </el-form-item>
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
  
  import {fetchDivisions, showRemoveBtn, removeDivisions, modifyDivision, createDivision} from '@/api/basic'
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
            {required: true, message: '请输入行政区名称', trigger: 'blur'},
            {min: 1, max: 10, message: '长度必须小于10个字', trigger: 'blur'}
          ]
        },
        dialogFormVisible: false,
        modifyType: null,
        testShow: false
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
        const selection = this.tableInstance.selection
        showRemoveBtn(selection.map(item => item.divisionCode).join()).then((response) => {
          if (response.data == -1) {
            this.testShow = false
          } else {
            this.testShow = true
          }
        })
        return true;
      },
      initMap() {
        var vm = this;
        const aMapJSAPILoader = new AMapJS.AMapJSAPILoader({
          key: "8493be8a99d103cbed76edb91479bf7f",
          v: "1.4.14", // 版本号
          params: {}, // 请求参数
          protocol: "https:" // 请求协议
        });
  
        aMapJSAPILoader.load().then(AMap => {
          const map = new AMap.Map(vm.$refs.map, {
              center: [118.916202, 42.271235], //初始地图中心点
              resizeEnable: true, //是否监控地图容器尺寸变化
              zoom: 12,
              zooms: [10, 18]
            }
          );
          map.on('click', function (e) {
            // vue 多层属性值发生变化，不能直接修改属性值，可以使用以下两种方法赋值
            // 方法1：
            // vm.$set(vm.item, 'x', e.lnglat.lng)
            // vm.$set(vm.item, 'y', e.lnglat.lat)
            // 方法2：
            vm.item = Object.assign({}, vm.item, {
              x: e.lnglat.lng,
              y: e.lnglat.lat
            })
          })
        })
      },
      startCreate() {
        this.dialogFormVisible = true;
        this.modifyType = 'create';
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
        this.initMap();
      },
      startModify() {
        this.item = {...this.tableInstance.table.selection[0]};
        this.dialogFormVisible = true;
        this.modifyType = 'modify';
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
        this.initMap(this);
      },
      cancelModify() {
        this.initDivision();
        this.dialogFormVisible = false;
        this.modifyType = null;
      },
      confirmModify() {
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          if (this.modifyType === 'modify') {
            modifyDivision(this.item).then(() => {
              this.tableInstance.table.clearSelection()
              this.afterModify()
            })
          } else {
            createDivision(this.item).then(() => {
              this.afterModify()
            })
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
          removeDivisions(this.tableInstance.table.selection.map(item => item.divisionCode).join()).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.tableInstance.fetchData()
          })
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

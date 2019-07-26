<template>
  <div class="app-container">
    <bv-table title="小区一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchRegions"
              @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="add" authority="add" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button v-if="deleteShow() && testShow" view="remove" authority="remove" @click="startRemove()">删除
        </bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="小区名称" prop="regionName">
            <el-input v-model="filter.regionName"/>
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55"/>
      <el-table-column label="小区名称" prop="regionName" align="center" sortable="custom"/>
      <el-table-column label="小区地址" prop="address" align="center" sortable="custom"/>
      <el-table-column label="所属行政区" prop="divisionName" align="center" sortable="custom"/>
      <el-table-column label="预售许可日期" prop="preSaleDate" align="center" sortable="custom"/>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <bv-button icon="el-icon-paperclip" type="text" @click="queryProjInfo(scope.row)">查看项目详情</bv-button>
          <bv-button icon="el-icon-edit-outline" type="text" @click="handleRegionInfo(scope.row)">维护小区档案</bv-button>
        </template>
      </el-table-column>
    </bv-table>

    <bv-dialog title="小区信息维护" :visible.sync="dialogFormVisible" top="5vh">
      <bv-form ref="dialogForm" :model="item" :rules="rules" class="dialog-form" label-width="120px"
               label-position="right">
        <el-row :gutter="$CONST.row.gutter">
          <el-col v-bind="$CONST.col.layout3">
            <el-form-item label="小区名称" prop="regionName">
              <el-input v-model.trim="item.regionName" style="width: 73vh"/>
            </el-form-item>
          </el-col>
        </el-row>
        <bv-row :gutter="$CONST.row.gutter">
          <bv-col v-if="modifyType != 'create'" v-bind="$CONST.col.layout2">
            <el-form-item label="小区编号" prop="regionId">
              <span v-text="item.regionId"/>
            </el-form-item>
          </bv-col>
          <bv-col v-bind="$CONST.col.layout2">
            <el-form-item label="所属行政区" prop="divisionCode">
              <el-select v-model="filter.divisionCode" placeholder="请选择所属行政区">
                <el-option
                  v-for="division in divisions"
                  :key="division.divisionCode"
                  :label="division.divisionName"
                  :value="division.divisionCode"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col v-bind="$CONST.col.layout2">
            <el-form-item label="预售许可日期" prop="preSaleDate">
              <el-date-picker
                v-model="item.preSaleDate"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </bv-col>
        </bv-row>
        <el-form-item label="小区地址" prop="address">
          <el-input v-model.trim="item.address" type="textarea" :rows="1" style="width: 73vh"/>
        </el-form-item>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModify()">保存</bv-button>
        <bv-button view="cancel" @click="cancelModify()">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>

  import {fetchRegions, fetchAllDivisions} from '@/api/basic'

  export default {
    name: 'ListDivision',
    data() {
      return {
        filter: {},
        tableInstance: {},
        item: {},
        fetchRegions,
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
        divisions: [],
        testShow: false
      }
    },
    created() {
    },
    computed: {
      //获取所有展开页路由信息
      visitedViews() {
        return this.$store.state.tagsView.visitedViews
      }
    },
    methods: {
      // 弹窗用
      initRegion() {
        this.item = {}
      },
      initDivisions() {
        fetchAllDivisions().then((res) => {
          this.divisions = res.data;
        })
      },
      deleteShow() {
        if (!this.tableInstance || !this.tableInstance.selection || this.tableInstance.selection.length === 0) {
          return false
        }
        const selection = this.tableInstance.selection
        // showRemoveBtn(selection.map(item => item.divisionCode).join()).then((response) => {
        //   if (response.data == -1) {
        //     this.testShow = false
        //   } else {
        //     this.testShow = true
        //   }
        // })
        return true;
      },
      startCreate() {
        this.dialogFormVisible = true;
        this.modifyType = 'create';
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
        this.initDivisions();
      },
      startModify() {
        this.item = {...this.tableInstance.table.selection[0]};
        this.dialogFormVisible = true;
        this.modifyType = 'modify';
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
        this.initDivisions(this);
      },
      cancelModify() {
        this.initRegion();
        this.dialogFormVisible = false;
        this.modifyType = null;
      },
      confirmModify() {
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          if (this.modifyType === 'modify') {
            // modifyDivision(this.item).then(() => {
            //   this.tableInstance.table.clearSelection()
            //   this.afterModify()
            // })
          } else {
            // createDivision(this.item).then(() => {
            //   this.afterModify()
            // })
          }
        })
      },
      afterModify() {
        this.tableInstance.fetchData();
        this.initRegion();
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
          // removeDivisions(this.tableInstance.table.selection.map(item => item.divisionCode).join()).then(() => {
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
      },
      //查看项目详情
      queryProjInfo(row) {
        for (let i in this.visitedViews) {
          if (this.visitedViews[i].name == 'ListRegion') {
            this.$store.dispatch('tagsView/delView', this.visitedViews[i])
            this.$router.push({
              path: 'listProjectByRegion/'+row.regionId
            })
            break
          }
        }
      },
      //维护小区档案
      handleRegionInfo(row) {
        for (let i in this.visitedViews) {
          if (this.visitedViews[i].name == 'ListRegion') {
            this.$store.dispatch('tagsView/delView', this.visitedViews[i])
            this.$router.push({
              path: 'regionMaintain',
              query: {
                region: row
              }
            })
            break
          }
        }
      }
    }
  }
</script>

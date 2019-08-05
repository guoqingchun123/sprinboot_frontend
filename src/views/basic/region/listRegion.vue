<template>
  <div class="app-container">
    <bv-table title="小区一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchRegions"
              @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="add" authority="add" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button v-if="deleteShow()" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
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
      <el-table-column label="所属行政区" prop="divisionCode" :formatter="divisionFormat" align="center" sortable="custom"/>
      <el-table-column label="预售许可日期" prop="preSaleDate" align="center" sortable="custom"/>
      <el-table-column label="状态" prop="state" :formatter="stateFormat" align="center" sortable="custom"/>
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
        <bv-row>
          <bv-col>
            <el-form-item label="小区名称" prop="regionName">
              <el-input v-model.trim="item.regionName" style="width: 36vw"/>
            </el-form-item>
          </bv-col>
        </bv-row>
        <bv-row :gutter="$CONST.row.gutter">
          <bv-col v-bind="$CONST.col.layout2">
            <el-form-item label="所属行政区" prop="divisionCode">
              <el-select v-model="item.divisionCode" placeholder="请选择所属行政区">
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
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </bv-col>
        </bv-row>
        <bv-row>
          <bv-col>
            <el-form-item label="监控点编号数量" prop="optionsNum">
              <el-input-number v-model="optionsNum" :min="0" :max="99" label="监控点编号不能为空" @change="handleChange"/>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item v-for="(option, index) in item.options"
                          :key="'options' + index"
                          label="监控点编号"
                          :prop="'options.' + index + '.itemName'"
                          :rules="{
                            required: true, message: '监控点编号不能为空', trigger: 'blur'
                          }"
            >
              <el-input v-model.trim="option.itemName">
                <template slot="prepend">{{ index + 1 }}</template>
              </el-input>
            </el-form-item>
          </bv-col>
        </bv-row>
        <bv-row>
          <bv-col>
            <el-form-item label="小区地址" prop="address">
              <el-input v-model.trim="item.address" type="textarea" :rows="1" style="width: 36vw"/>
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
  import {fetchRegions, fetchAllDivisions, createRegion, modifyRegion, removeRegion} from '@/api/basic'

  export default {
    name: 'ListRegion',
    data() {
      return {
        filter: {},
        tableInstance: {},
        item: {
          options: []
        },
        fetchRegions,
        rules: {
          regionName: [
            {required: true, message: '请输入小区名称', trigger: 'blur'},
            {max: 150, message: '限制为150位以下', trigger: 'blur'}
          ],
          divisionCode: [
            {required: true, message: '行政区代码不能为空', trigger: 'change'}
          ],
          divisionName: [
            {required: true, message: '请输入行政区名称', trigger: 'blur'},
            {min: 1, max: 10, message: '长度必须小于10个字', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请输入小区地址', trigger: 'blur'},
            {max: 150, message: '限制为150位以下', trigger: 'blur'}
          ]
        },
        dialogFormVisible: false,
        modifyType: null,
        divisions: [],
        optionsNum: 0
      }
    },
    mounted() {
      fetchAllDivisions().then((res) => {
        this.divisions = res.data;
      })
    },
    methods: {
      // 弹窗用
      initRegion() {
        this.item = {
          options: []
        }
        this.optionsNum = 0
      },
      divisionFormat(row, column, cellValue) {
        for (let i in this.divisions) {
          if (cellValue && cellValue == this.divisions[i].divisionCode) {
            return this.divisions[i].divisionName
          }
        }
      },
      stateFormat(row, column, cellValue) {
        if (cellValue) {
          if (cellValue == '9999') {
            return '暂存'
          } else if (cellValue == '1000') {
            return '申报中'
          } else if (cellValue == '2000') {
            return '申报未通过'
          } else if (cellValue == '0000') {
            return '发布'
          } else {
            return ''
          }
        }
      },
      handleChange(value) {
        let flag = this.item.options.length;
        if (flag < value) {
          //增加视频点
          for (let i = flag; i < value; i++) {
            this.item.options.push({
              itemValue: value,
              itemName: ''
            })
          }
        } else {
          //删除视频点
          for (let i = value; i < flag; i++) {
            this.item.options.pop()
          }
        }
      },
      deleteShow() {
        if (!this.tableInstance || !this.tableInstance.selection || this.tableInstance.selection.length === 0) {
          return false
        }
        const selection = this.tableInstance.selection
        for (let item in selection) {
          if (selection[item].state != '9999') {
            return false
          }
        }
        return true
      },
      startCreate() {
        this.dialogFormVisible = true;
        this.modifyType = 'create';
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      startModify() {
        this.item = {...this.tableInstance.table.selection[0]};
        let videoList = [];
        if(this.item.videoNo) {
          videoList = this.item.videoNo.split(',');
        }
        let options = [];
        for (let i in videoList) {
          options.push({
            itemValue: Number(i)+1,
            itemName: videoList[i]
          })
        }
        this.item = Object.assign({}, this.item, {
          options: options
        })
        this.optionsNum = this.item.options.length;
        this.dialogFormVisible = true;
        this.modifyType = 'modify';
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
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
          let videoNo = this.item.options.map(item => item.itemName).join(',');
          this.item.videoNo = videoNo;
          if (this.modifyType === 'modify') {
            modifyRegion(this.item).then(() => {
              this.tableInstance.table.clearSelection()
              this.afterModify()
            })
          } else {
            createRegion(this.item).then(() => {
              this.afterModify()
            })
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
      //删除小区
      startRemove() {
        this.$confirm('此操作将删除该小区, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeRegion(this.tableInstance.table.selection.map(item => item.regionId).join()).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.tableInstance.fetchData()
          })
        }).catch(() => {
          this.$message({
            message: '删除失败',
            type: 'error'
          })
        })
      },
      //查看项目详情
      queryProjInfo(row) {
        this.$emit('on-query-project', row.regionId)
      },
      //维护小区档案
      handleRegionInfo(row) {
        this.$emit('on-query-region', row)
      }
    }
  }
</script>

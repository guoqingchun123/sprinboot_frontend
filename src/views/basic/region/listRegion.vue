<template>
  <div class="app-container">
    <bv-table title="小区一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchRegions"
              @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button v-show="publishShow()" type="success" icon="el-icon-position" @click="startPublise">发布</bv-button>
        <bv-button v-show="publishShow()" type="warning" svg-icon="cancel" @click="checkCancel">审核不通过</bv-button>
        <bv-button v-show="cancelShow()" type="warning" svg-icon="cancel" @click="publishCancel">撤销发布</bv-button>
        <bv-button show="none" type="success" view="create" authority="create" @click="startCreate()">新增</bv-button>
        <bv-button v-show="modifyShow()" type="success" view="modify" authority="modify" @click="startModify()">修改
        </bv-button>
        <bv-button v-if="deleteShow()" type="warning" view="remove" authority="remove" @click="startRemove()">删除
        </bv-button>
        <bv-button show="none" type="primary" view="create" authority="bldInfo" @click="queryBldInfo()">已预售未发布楼栋
        </bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <bv-form-item label="小区名称" prop="regionName">
            <el-input v-model="filter.regionName"/>
          </bv-form-item>
        </bv-col>
      </div>
      <bv-table-column type="selection" width="55"/>
      <bv-table-column label="小区名称" prop="regionName" align="center" sortable="custom"/>
      <bv-table-column label="小区地址" prop="address" align="center" sortable="custom"/>
      <bv-table-column label="所属行政区" prop="divisionCode" :formatter="divisionFormat" align="center" sortable="custom"/>
      <bv-table-column label="预售许可日期" prop="preSaleDate" align="center" sortable="custom"/>
      <bv-table-column label="发布日期" prop="publishDate" align="center" sortable="custom"/>
      <bv-table-column label="状态" prop="state" :formatter="stateFormat" align="center" sortable="custom"/>
      <bv-table-column align="center" label="操作">
        <template slot-scope="scope">
          <bv-button v-show="!maintainShow(scope.row)" icon="el-icon-picture" type="text"
                     @click="startPreview(scope.row)">小区预览
          </bv-button>
          <bv-button v-show="maintainShow(scope.row)" icon="el-icon-paperclip" type="text"
                     @click="queryProjInfo(scope.row)">维护项目列表
          </bv-button>
          <bv-button v-show="maintainShow(scope.row)" icon="el-icon-edit-outline" type="text"
                     @click="handleRegionInfo(scope.row)">维护小区档案
          </bv-button>
        </template>
      </bv-table-column>
    </bv-table>

    <bv-dialog title="小区信息维护" :visible.sync="dialogFormVisible" top="5vh" @close="dialogClose">
      <bv-form ref="dialogForm" :model="item" :rules="rules" class="dialog-form" label-width="120px"
               label-position="right">
        <bv-row :layout="1">
          <bv-col>
            <bv-form-item label="小区名称" prop="regionName" class="form-item-fill">
              <el-input v-model.trim="item.regionName"/>
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="小区地址" prop="address" class="form-item-fill">
              <el-input v-model.trim="item.address" type="textarea" :rows="1"/>
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="所属行政区" prop="divisionCode" class="form-item-fill">
              <el-cascader v-model="item.divisionCode"
                           :options="divisions"
                           :show-all-levels="false"
                           clearable filterable/>
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="开发企业" prop="developNo" class="form-item-fill">
              <el-select v-model="item.developNo" placeholder="请选择开发企业">
                <el-option
                  v-for="corp in corps"
                  :key="corp.corpId"
                  :label="corp.compName"
                  :value="corp.corpId"
                />
              </el-select>
            </bv-form-item>
          </bv-col>
        </bv-row>
        <bv-row :layout="2">
          <bv-col>
            <bv-form-item label="预售许可日期" prop="preSaleDate">
              <el-date-picker
                v-model="item.preSaleDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              />
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="监控点编号数量" prop="optionsNum">
              <el-input-number v-model="optionsNum" :min="0" :max="99" label="监控点编号不能为空" @change="handleChange"/>
            </bv-form-item>
          </bv-col>
          <bv-col :key="'options' + index" v-for="(option, index) in item.options">
            <bv-form-item label="监控点编号"
                          :prop="'options.' + index + '.itemName'"
                          :rules="{
                            required: true, message: '监控点编号不能为空', trigger: 'blur'
                          }"
            >
              <el-input v-model.trim="option.itemName">
                <template slot="prepend">{{ index + 1 }}</template>
              </el-input>
            </bv-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModify()">保存</bv-button>
        <bv-button view="cancel" @click="cancelModify()">取消</bv-button>
      </div>
    </bv-dialog>

    <bv-dialog title="小区发布" :visible.sync="dialogVisible" width="40vw">
      <bv-form ref="publishForm" :model="publishItem" :rules="publishRules">
        <bv-form-item label="发布时间" required>
          <bv-row>
            <bv-col>
              <bv-form-item prop="publishDate">
                <el-date-picker
                  v-model="publishItem.publishDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                />
              </bv-form-item>
            </bv-col>
          </bv-row>
        </bv-form-item>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmPublise()">保存</bv-button>
        <bv-button view="cancel" @click="cancelPublise()">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  import {
    fetchRegions,
    fetchAllDivisions,
    fetchAllCorps,
    createRegion,
    modifyRegion,
    removeRegion,
    updateRegionState,
    updateRegionCheck,
    checkRegionName
  } from '@/api/basic'

  var regionName__;
  export default {
    name: 'ListRegion',
    data() {
      const validateRegionName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入小区名称'));
        } else {
          if (value.length <= 150) {
            if (regionName__) {
              //修改时
              if (regionName__ == value) {
                callback();
              } else {
                checkRegionName(value).then(response => {
                  if (response.data != 0) {
                    callback(new Error('该小区名称已存在'));
                  } else {
                    callback();
                  }
                })
              }
            } else {
              //新增时
              checkRegionName(value).then(response => {
                if (response.data != 0) {
                  callback(new Error('该小区名称已存在'));
                } else {
                  callback();
                }
              })
            }
          } else {
            callback(new Error('限制为150位以下'));
          }
        }
      };
      return {
        filter: {},
        tableInstance: {},
        item: {
          options: []
        },
        publishItem: {},
        fetchRegions,
        rules: {
          regionName: [
            {
              required: true,
              validator: validateRegionName,
              trigger: 'blur'
            }
          ],
          divisionCode: [
            {required: true, message: '行政区代码不能为空', trigger: 'change'}
          ],
          divisionName: [
            {required: true, message: '请输入行政区名称', trigger: 'blur'},
            {min: 1, max: 10, message: '长度必须小于10个字', trigger: 'blur'}
          ],
          preSaleDate: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
          address: [
            {required: true, message: '请输入小区地址', trigger: 'blur'},
            {max: 150, message: '限制为150位以下', trigger: 'blur'}
          ]
        },
        publishRules: {
          publishDate: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
          publishTime: [
            {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
          ]
        },
        dialogFormVisible: false,
        dialogVisible: false,
        modifyType: null,
        divisions: [],
        corps: [],
        optionsNum: 0
      }
    },
    mounted() {
      fetchAllDivisions().then((res) => {
        this.divisions = res.data;
      })
      fetchAllCorps().then((res) => {
        this.corps = res.data;
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
      // 发布弹窗用
      initPublish() {
        this.publishItem = {}
        this.$refs.publishForm && this.$refs.publishForm.clearValidate()
      },
      startPublise() {
        this.initPublish()
        this.dialogVisible = true
      },
      //确认发布
      confirmPublise() {
        this.$refs.publishForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          const region = this.tableInstance.selection[0]
          let data = {
            regionId: region.regionId,
            // publishDate: this.publishItem.publishDate+" "+this.publishItem.publishTime
            publishDate: this.publishItem.publishDate
          }
          updateRegionState(data).then(() => {
            this.$message.success('发布成功');
            this.tableInstance.fetchData();
          }).catch(() => {
            this.$message.error('发布失败')
          })
          this.dialogVisible = false
        })
      },
      //取消发布
      cancelPublise() {
        this.dialogVisible = false
      },
      //审核不通过
      checkCancel() {
        this.$confirm('是否确定进行此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const region = this.tableInstance.selection[0]
          let data = {
            regionId: region.regionId,
            updateParam: '2000'
          }
          updateRegionCheck(data).then(() => {
            this.$message.success('操作成功');
            this.tableInstance.fetchData();
          })
        }).catch(() => {
          console.log('取消操作')
        })
      },
      //撤销发布
      publishCancel() {
        this.$confirm('是否确定进行此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const region = this.tableInstance.selection[0]
          let data = {
            regionId: region.regionId,
            updateParam: '9999'
          }
          updateRegionCheck(data).then(() => {
            this.$message.success('操作成功');
            this.tableInstance.fetchData();
          })
        }).catch(() => {
          console.log('取消操作')
        })
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
      //修改按钮显示逻辑
      modifyShow() {
        if (!this.tableInstance || !this.tableInstance.selection || this.tableInstance.selection.length != 1) {
          return false
        }
        //根据状态区分
        const region = this.tableInstance.selection[0]
        if (region.state && (region.state == '9999' || region.state == '2000')) {
          return true
        }
        return false
      },
      //操作列显示逻辑
      maintainShow(row) {
        if (row.state == '0000' || row.state == '1000') {
          //TODO 发布、待审核状态下不可以修改
          return false
        } else {
          //暂存、审核未通过可以维护小区档案重新申报
          return true
        }
      },
      //小区预览
      startPreview(row) {
        // window.open('http://172.10.10.196:81/houses/sales/'+this.region.regionId)
        window.open(process.env.VUE_APP_ADDR + '/sales/' + row.regionId)
      },
      //删除按钮显示逻辑
      deleteShow() {
        if (!this.tableInstance || !this.tableInstance.selection || this.tableInstance.selection.length === 0) {
          return false
        }
        const selection = this.tableInstance.selection
        for (let item in selection) {
          if (selection[item].state == '0000') {
            return false
          }
        }
        return true
      },
      //发布、审核不通过按钮显示逻辑
      publishShow() {
        //判断当前小区状态
        if (!this.tableInstance || !this.tableInstance.selection || this.tableInstance.selection.length != 1) {
          return false
        }
        const selection = this.tableInstance.selection
        if (selection[0].state == '1000') {
          //待审核状态
          return true
        } else {
          return false
        }
      },
      //撤销发布按钮显示逻辑
      cancelShow() {
        //判断当前小区状态
        if (!this.tableInstance || !this.tableInstance.selection || this.tableInstance.selection.length != 1) {
          return false
        }
        const selection = this.tableInstance.selection
        if (selection[0].state == '0000') {
          //发布状态
          return true
        } else {
          return false
        }
      },
      startCreate() {
        this.dialogFormVisible = true;
        this.modifyType = 'create';
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      startModify() {
        this.item = {...this.tableInstance.table.selection[0]};
        regionName__ = this.item.regionName;
        let videoList = [];
        if (this.item.videoNo) {
          videoList = this.item.videoNo.split(',');
        }
        let options = [];
        for (let i in videoList) {
          options.push({
            itemValue: Number(i) + 1,
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
        this.dialogFormVisible = false;
        regionName__ = '';
      },
      dialogClose() {
        this.initRegion();
        this.modifyType = null;
        regionName__ = '';
      },
      confirmModify() {
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          let videoNo = this.item.options.map(item => item.itemName).join(',');
          this.item.videoNo = videoNo;
          this.dialogFormVisible = false;
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
          regionName__ = '';
        })
      },
      afterModify() {
        this.tableInstance.fetchData();
        this.initRegion();
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
          removeRegion(this.tableInstance.table.selection.map(item => item.regionId).join()).then((response) => {
            const flag = response.data;
            if (flag == 1) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.tableInstance.fetchData()
            } else if (flag == 0) {
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            } else if (flag == 2) {
              this.$message({
                message: '该小区下存在关联项目，不能删除',
                type: 'warning'
              })
            }
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
      },
      //查看未处理的楼栋
      queryBldInfo() {
        this.$emit('on-query-bld')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .time-case {
    padding-left: 12px;
  }
</style>

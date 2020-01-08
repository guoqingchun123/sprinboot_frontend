<template>
  <div class="app-container">
    <bv-table title="表决标准一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchVoteStandards" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="create" authority="create" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button v-if="deleteShow()" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <bv-form-item label="表决事项" prop="itemGuid">
            <el-select v-model="filter.itemGuid" placeholder="请选择表决事项">
              <el-option
                v-for="item in voteItems"
                :key="item.sysGuid"
                :label="item.itemName"
                :value="item.sysGuid"
              />
            </el-select>
          </bv-form-item>
        </bv-col>
        <bv-col>
          <bv-form-item  label="表决名称" prop="stdName">
            <el-input v-model="filter.stdName" />
          </bv-form-item >
        </bv-col>
        <bv-col>
          <bv-form-item  label="执行标准" prop="stdDesc">
            <el-input v-model="filter.stdDesc" />
          </bv-form-item >
        </bv-col>
      </div>
      <bv-table-column type="selection" />
      <bv-table-column label="表决事项" prop="itemGuid" align="center" :formatter="voteItemFormatter" />
      <bv-table-column label="表决名称" prop="stdName" align="center" sortable="custom" />
      <bv-table-column label="执行标准" prop="stdDesc" align="center" sortable="custom" />
      <bv-table-column label="维护时间" prop="manageTime" align="center" sortable="custom"/>
      <bv-table-column label="维护用户" prop="manageUser" align="center" sortable="custom" />
    </bv-table>

    <bv-dialog v-if="dialogFormVisible" title="表决标准维护" :visible.sync="dialogFormVisible">
      <bv-form ref="dialogForm" :model="item" :rules="rules">
        <bv-row :layout="1">
          <bv-col>
            <bv-form-item label="表决模式" prop="voteMode" class="form-item-fill">
              <el-radio-group v-model="item.voteMode" placeholder="请选择表决事项" @change="initDescribe">
                <el-radio-button v-for="item in voteModes" :key="item.code" :label="item.code">{{ item.name }}</el-radio-button>
              </el-radio-group>
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="执行标准" prop="stdDesc" class="form-item-fill">
              <el-input v-model="item.stdDesc" :disabled="true" placeholder="根据事项模式及其他页面输入项自动生成" />
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="表决事项" prop="itemGuid" class="form-item-fill">
              <el-select v-model="item.itemGuid" placeholder="请选择表决事项">
                <el-option
                  v-for="item in voteItems"
                  :key="item.sysGuid"
                  :label="item.itemName"
                  :value="item.sysGuid"
                />
              </el-select>
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="表决名称" prop="stdName" class="form-item-fill">
              <el-input v-model="item.stdName" />
            </bv-form-item>
          </bv-col>
          <bv-col v-show="showCalculate">
            <bv-form-item label="表决方式" prop="calculateGist" class="form-item-fill">
              <el-radio-group v-model="item.calculateGist" placeholder="请选择表决方式" @change="initDescribe">
                <el-radio-button v-for="item in calculateGists" :key="item.code" :label="item.code">{{ item.name }}</el-radio-button>
              </el-radio-group>
            </bv-form-item>
          </bv-col>
          <bv-col v-show="showCalculate">
            <bv-form-item label="表决类型" prop="voteType" class="form-item-fill">
              <el-radio-group v-model="item.voteType" placeholder="请选择表决类型" @change="initDescribe">
                <el-radio-button v-for="item in voteTypes" :key="item.code" :label="item.code">{{ item.name }}</el-radio-button>
              </el-radio-group>
            </bv-form-item>
          </bv-col>
          <bv-col v-show="showCalculate">
            <bv-form-item label="计算方式" prop="calculateType" class="form-item-fill">
              <el-radio-group v-model="item.calculateType" placeholder="请选择计算方式" @change="initDescribe">
                <el-radio-button v-for="item in calculateTypes" :key="item.code" :label="item.code">{{ item.name }}</el-radio-button>
              </el-radio-group>
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="计算基数" prop="denominator" class="form-item-fill">
              <el-input v-model="item.denominator" placeholder="表决类请填写表决通过比例，例如：2/3表示比例达到2/3视为表决通过;选举类请填写入围数，例如：2表示候选人或物比例最高的前2名视为入围"
                        @input="initDescribe"
              />
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

  import {fetchVoteStandards, createVoteStandard, modifyVoteStandard, removeVoteStandard, fetchAllVoteItems} from '@/api/vote'
  import {isEmpty} from 'element-ui/src/utils/util';

  export default {
    name: 'ListVoteStandard',
    components: {},
    data() {
      return {
        filter: {},
        tableInstance: {},
        item: {},
        fetchVoteStandards,
        voteItems: [],
        voteModes: [],
        voteTypes: [],
        calculateGists: [],
        calculateTypes: [],
        showCalculate: false,
        rules: {
          itemGuid: [
            {required: true, message: '请选择表决事项', trigger: 'blur'}
          ],
          stdName: [
            {required: true, message: '请输入表决名称', trigger: 'blur'}
          ],
          voteMode: [
            {required: true, message: '请选择表决模式', trigger: 'blur'}
          ],
          voteType: [
            {required: true, message: '请选择表决类型', trigger: 'blur'}
          ],
          calculateType: [
            {required: true, message: '请选择计算方式', trigger: 'blur'}
          ],
          calculateGist: [
            {required: true, message: '请选择表决方式', trigger: 'blur'}
          ],
          denominator: [
            {required: true, message: '请输入计算基数', trigger: 'blur'}
          ]
        },
        dialogFormVisible: false,
        modifyType: null
      }
    },
    created() {
      fetchAllVoteItems().then((res) => {
        this.voteItems = res.data
      })
      this.$store.dispatch('app/fetchDicts', 'voteMode').then(data => {
        this.voteModes = data
      });
      this.$store.dispatch('app/fetchDicts', 'voteType').then(data => {
        this.voteTypes = data
      });
      this.$store.dispatch('app/fetchDicts', 'calculateGist').then(data => {
        this.calculateGists = data
      });
      this.$store.dispatch('app/fetchDicts', 'calculateType').then(data => {
        this.calculateTypes = data
      });
    },
    methods: {
      // 弹窗用
      initData() {
        this.item = {}
      },
      initDescribe() {
        let vm = this;
        let describe = "";
        if (vm.item.voteMode === '2') { // 选举类
          vm.showCalculate = false;
          describe = "以获得选票数由高到低排序，前#{计算基数}名候选项，视为入选";
          if (!isEmpty(vm.item.denominator)) {
            describe = "以获得选票数由高到低排序，前" + vm.item.denominator + "名候选项，视为入选";
          }
        } else if (vm.item.voteMode === '1') { // 表决类
          vm.showCalculate = true;
          describe = "";
          let calculateGist = "";
          let voteTypeMsg = "";
          let denominator = isEmpty(vm.item.denominator) ? "#{计算基数}" : vm.item.denominator;
          let calculateType = "使#{计算标准}";
          if (vm.item.calculateType === ">") {
            calculateType = denominator + "以上";
          } else if (vm.item.calculateType === ">=") {
            calculateType = calculateGist + denominator + "(含" + denominator + ")以上";
          } else if (vm.item.calculateType === "<") {
            calculateType = calculateGist + denominator + "以下";
          } else if (vm.item.calculateType === "<=") {
            calculateType = calculateGist + denominator + "(含" + denominator + ")以下";
          } else if (vm.item.calculateType === "==") {
            calculateType = calculateGist + "等于" + denominator;
          } else {
            calculateType += "符合" + denominator;
          }
          if (vm.item.calculateGist === 'Y') {
            calculateGist += "持同意意见的业主";
          } else if (vm.item.calculateGist === 'N') {
            calculateGist += "持不同意意见的业主";
          } else {
            calculateGist += "持#{表决方式}的业主";
          }
          if (vm.item.voteType === '1') {
            voteTypeMsg += "占总人数" + calculateType;
          } else if (vm.item.voteType === '2') {
            voteTypeMsg += "专有部分占建筑物总面积" + calculateType;
          } else if (vm.item.voteType === '3') {
            voteTypeMsg += "专有部分占建筑物总面积" + calculateType + "且占总人数" + calculateType;
          } else {
            voteTypeMsg += "按#{表决类型}计算" + calculateType;
          }
          describe = calculateGist + voteTypeMsg + "的，视为表决通过";
        }
        if (isEmpty(describe)) {
          describe = "根据事项模式及其他页面输入项自动生成";
        }
        vm.item = Object.assign({}, vm.item, {
          stdDesc: describe
        })
      },
      voteItemFormatter(row, column, cellValue) {
        for (let i in this.voteItems) {
          if (cellValue == this.voteItems[i].sysGuid) {
            return this.voteItems[i].itemName
          }
        }
      },
      deleteShow() {
        if (!this.tableInstance || !this.tableInstance.selection || this.tableInstance.selection.length === 0) {
          return false
        }
        return true;
      },
      startCreate() {
        this.initData();
        this.dialogFormVisible = true;
        this.modifyType = 'create';
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate();
      },
      startModify() {
        this.item = {...this.tableInstance.table.selection[0]};
        if (this.item.voteMode === '1') {
          this.showCalculate = true;
        } else {
          this.showCalculate = false;
        }
        this.dialogFormVisible = true;
        this.modifyType = 'modify';
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate();
      },
      cancelModify() {
        this.initData();
        this.dialogFormVisible = false;
        this.modifyType = null;
      },
      confirmModify() {
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          if (this.modifyType === 'modify') {
            modifyVoteStandard(this.item).then(() => {
              this.tableInstance.table.clearSelection()
              this.afterModify()
            })
          } else {
            createVoteStandard(this.item).then(() => {
              this.afterModify()
            })
          }
        });
      },
      afterModify() {
        this.tableInstance.fetchData();
        this.initData();
        this.dialogFormVisible = false;
        this.modifyType = null;
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      },
      startRemove() {
        this.$confirm('此操作将删除该表决标准, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeVoteStandard(this.tableInstance.table.selection.map(item => item.sysId).join()).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
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

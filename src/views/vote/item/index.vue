<template>
  <div class="app-container">
    <bv-table title="表决事项一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchVoteItems"
              @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="create" authority="create" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button v-if="deleteShow()" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <bv-form-item label="事项名称" prop="itemName">
            <el-input v-model="filter.itemName"/>
          </bv-form-item>
        </bv-col>
      </div>
      <bv-table-column type="selection"/>
      <bv-table-column label="表决事项" prop="itemName" align="center"/>
      <bv-table-column label="是否需要审核" prop="needApproval" align="center" sortable="custom"
                       :formatter="needApprovalFormatter"/>
      <bv-table-column label="维护时间" prop="manageTime" align="center" sortable="custom"/>
      <bv-table-column label="维护用户" prop="manageUser" align="center" sortable="custom"/>
    </bv-table>

    <bv-dialog v-if="dialogFormVisible" title="表决事项维护" :visible.sync="dialogFormVisible">
      <bv-form ref="dialogForm" :model="item" :rules="rules">
        <bv-row :layout="1">
          <bv-col>
            <bv-form-item label="表决事项" prop="itemName" class="form-item-fill">
              <el-input v-model="item.itemName"/>
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="是否审核" prop="needApproval" class="form-item-fill">
              <el-switch v-model="item.needApproval" active-value="Y" inactive-value="N"/>
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

  import {createVoteItem, fetchVoteItems, modifyVoteItem, removeVoteItem} from '@/api/vote'

  export default {
    name: 'ListVoteItem',
    components: {},
    data() {
      return {
        filter: {},
        tableInstance: {},
        item: {},
        fetchVoteItems,
        rules: {
          itemName: [
            {required: true, message: '请输入表决事项', trigger: 'blur'}
          ],
          needApproval: [
            {required: true, message: '请选择是否需要审批', trigger: 'blur'}
          ]
        },
        dialogFormVisible: false,
        modifyType: null
      }
    },
    created() {
    },
    methods: {
      needApprovalFormatter(row, column, cellValue) {
        switch (cellValue) {
          case 'Y':
            return "是";
          case 'N':
            return "否";
        }
      },
      // 弹窗用
      initData() {
        this.item = {}
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
            modifyVoteItem(this.item).then(() => {
              this.tableInstance.table.clearSelection()
              this.afterModify()
            })
          } else {
            createVoteItem(this.item).then(() => {
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
          removeVoteItem(this.tableInstance.table.selection.map(item => item.sysGuid).join()).then(() => {
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

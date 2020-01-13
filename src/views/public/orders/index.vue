<template>
  <div class="app-container">
    <bv-table
      title="工单任务一览"
      :pagination="true"
      :filter.sync="filter"
      :fetch-api="fetchOrders"
      @on-mounted="table => (tableInstance = table)"
    >
      <div slot="operates">
        <bv-button show="none" view="create" authority="create" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button v-if="deleteShow()" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <bv-form-item label="工单类别" prop="ordersType">
            <el-select v-model="filter.ordersType" placeholder="请选择工单类别">
              <el-option
                v-for="item in ordersType"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </bv-form-item>
        </bv-col>
        <bv-col>
          <bv-form-item label="工单内容" prop="summary">
            <el-input v-model="filter.summary" />
          </bv-form-item>
        </bv-col>
      </div>
      <bv-table-column type="selection" />
      <bv-table-column
        label="工单类别"
        prop="ordersType"
        align="center"
        :formatter="ordersTypeFormatter"
      />
      <bv-table-column label="工单内容" prop="summary" align="center" sortable="custom" />
      <bv-table-column
        label="工单状态"
        prop="ordersStatus"
        align="center"
        sortable="custom"
        :formatter="ordersStatusFormatter"
      />
      <bv-table-column
        label="工单来源"
        prop="ordersSource"
        align="center"
        sortable="custom"
        :formatter="ordersSourceFormatter"
      />
      <bv-table-column label="反映人" prop="requesterName" align="center" sortable="custom" />
      <bv-table-column label="反映人电话" prop="requesterPhone" align="center" sortable="custom" />
      <bv-table-column label="反映时间" prop="requestTime" align="center" sortable="custom" />
    </bv-table>

    <bv-dialog v-if="dialogFormVisible" title="工单信息维护" :visible.sync="dialogFormVisible">
      <bv-form ref="dialogForm" :model="item" :rules="rules">
        <bv-row :layout="1">
          <bv-col>
            <bv-form-item label="工单类别" prop="ordersType">
              <el-select v-model="item.ordersType" placeholder="请选择工单类别">
                <el-option
                  v-for="item in ordersTypes"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="摘要" prop="summary" class="form-item-fill">
              <el-input v-model.trim="item.summary" type="textarea" :rows="3" />
            </bv-form-item>
          </bv-col>
        </bv-row>
        <bv-row :layout="2">
          <bv-col>
            <bv-form-item label="反映来源" prop="ordersSource">
              <el-select v-model="item.ordersSource" placeholder="请选择工单类别">
                <el-option
                  v-for="item in ordersSources"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="反映人" prop="requesterName">
              <el-input v-model.trim="item.requesterName" />
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="反映人手机号" prop="requesterPhone">
              <el-input v-model.trim="item.requesterPhone" />
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="反映时间" prop="requestTime">
              <el-date-picker
                v-model="item.requestTime"
                type="datetime"
                placeholder="选择日期时间"
                :default-value="new Date()"
                value-format="yyyy-MM-dd HH:mm:ss"
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
import {
  fetchOrders,
  createOrders,
  modifyOrders,
  removeOrders
} from "@/api/public";

export default {
  name: "ListPublish",
  components: {},
  data() {
    return {
      filter: {},
      tableInstance: {},
      item: {},
      fetchOrders,
      ordersTypes: [],
      ordersSources: [],
      ordersStatuses: [],
      rules: {
        ordersType: [
          { required: true, message: "请选择工单类别", trigger: "blur" }
        ],
        ordersSource: [
          { required: true, message: "请选择反映来源", trigger: "blur" }
        ],
        summary: [{ required: true, message: "请输入摘要", trigger: "blur" }],
        requesterName: [
          { required: true, message: "请输入反映人姓名", trigger: "blur" }
        ],
        requesterPhone: [
          { required: true, message: "请输入反映人电话", trigger: "blur" }
        ]
      },
      dialogFormVisible: false,
      modifyType: null,
      uploadUrl: ""
    };
  },
  created() {
    this.$store.dispatch("app/fetchDicts", "ordersType").then(data => {
      this.ordersTypes = data;
    });
    this.$store.dispatch("app/fetchDicts", "ordersSource").then(data => {
      this.ordersSources = data;
    });
    this.$store.dispatch("app/fetchDicts", "ordersStatus").then(data => {
      this.ordersStatuses = data;
    });
  },
  methods: {
    // 弹窗用
    initData() {
      this.item = {};
    },
    ordersTypeFormatter(row, column, cellValue) {
      for (let i in this.ordersTypes) {
        if (cellValue == this.ordersTypes[i].code) {
          return this.ordersTypes[i].name;
        }
      }
    },
    ordersSourceFormatter(row, column, cellValue) {
      for (let i in this.ordersSources) {
        if (cellValue == this.ordersSources[i].code) {
          return this.ordersSources[i].name;
        }
      }
    },
    ordersStatusFormatter(row, column, cellValue) {
      for (let i in this.ordersStatuses) {
        if (cellValue == this.ordersStatuses[i].code) {
          return this.ordersStatuses[i].name;
        }
      }
    },
    deleteShow() {
      if (
        !this.tableInstance ||
        !this.tableInstance.selection ||
        this.tableInstance.selection.length === 0
      ) {
        return false;
      }
      return true;
    },
    startCreate() {
      this.initData();
      this.dialogFormVisible = true;
      this.modifyType = "create";
      this.$refs.dialogForm && this.$refs.dialogForm.clearValidate();
    },
    startModify() {
      this.item = { ...this.tableInstance.table.selection[0] };
      this.dialogFormVisible = true;
      this.modifyType = "modify";
      this.$refs.dialogForm && this.$refs.dialogForm.clearValidate();
    },
    cancelModify() {
      this.initData();
      this.dialogFormVisible = false;
      this.modifyType = null;
    },
    confirmModify() {
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {
          return false;
        }
        if (this.modifyType === "modify") {
          modifyOrders(this.item).then(() => {
            this.tableInstance.table.clearSelection();
            this.afterModify();
          });
        } else {
          createOrders(this.item).then(() => {
            this.afterModify();
          });
        }
      });
    },
    afterModify() {
      this.tableInstance.fetchData();
      this.initData();
      this.dialogFormVisible = false;
      this.modifyType = null;
      this.$message({
        message: "保存成功",
        type: "success"
      });
    },
    startRemove() {
      this.$confirm("此操作将删除该工单信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          removeOrders(
            this.tableInstance.table.selection.map(item => item.sysGuid).join()
          ).then(() => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.tableInstance.fetchData();
          });
        })
        .catch(() => {
          /*this.$message({
            message: '取消删除',
            type: 'warning'
          })*/
        });
    }
  }
};
</script>

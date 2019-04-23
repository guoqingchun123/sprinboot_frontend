<template>
  <div class="simple-table">
    <div class="simple-table-container">
      <div class="simple-table-toolbar">
        <div class="simple-table-title">
          <span>
            <i class="el-icon-menu" />
            <span>{{ tpTitle }}</span>
          </span>
        </div>
        <div class="simple-table-operate">
          <bv-button view="add" @click="create">新增</bv-button>
          <bv-button v-if="modFlag" view="modify" @click="modify">修改</bv-button>
          <bv-button v-if="!modFlag || !addFlag" view="save" @click="save">保存</bv-button>
        </div>
      </div>
      <div class="table-responsive">
        <div class="simple-table-body">
          <el-table
            v-loading="loading"
            :data="tableData"
            class="el-tbody"
          >
            <el-table-column type="index" label="序号" />
            <el-table-column prop="pjState" label="项目状态">
              <template slot-scope="scope">
                <template>
                  <el-select v-model="scope.row.pjState"
                             :disabled="modFlag && scope.row.__modify__"
                             placeholder="请选择"
                             @change="stateChange(scope.$index, scope.row.pjState)"
                  >
                    <el-option
                      v-for="item in pjStates"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="roleId" label="角色名称">
              <template slot-scope="scope">
                <template>
                  <el-select v-model="scope.row.roleId"
                             :disabled="modFlag && scope.row.__modify__"
                             placeholder="请选择"
                             :multiple="scope.row.__multiple__"
                             :multiple-limit="scope.row.__limit__"
                  >
                    <el-option
                      v-for="item in roleIds"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="120"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="!modFlag || !scope.row.__modify__"
                  type="text"
                  size="small"
                  @click.native.prevent="deleteRow(scope.$index, tableData)"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {fetchFlowList, saveFlow} from '@/api/flow/flow'
  import {fetchAll2} from '@/api/authority'

  const endState = '0002';
  const limit_0 = 0;
  const limit_2 = 2;

  export default {
    name: 'FlowPane',
    props: {
      type: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        // 表格标题
        tpTitle: '',
        loading: null,
        tableData: [],
        // 项目状态一览
        pjStates: [],
        // 角色一览
        roleIds: [],
        //后台请求的任务数据
        fetchTaskIds: [],
        modFlag: true,
        addFlag: true
      }
    },
    created() {
      this.getList()
    },
    methods: {
      // 初期数据取得
      getList() {
        this.loading = true;
        let type = this.type;
        this.tpTitle = this.title;
        // 获取角色一览
        fetchAll2().then(response => {
          this.roleIds = response.data;
        });
        // 获取项目状态一览
        this.$store.dispatch('app/fetchDicts', 'projState').then(data => {
          this.pjStates = data
        });

        let flow = {
          flowType: type
        };
        // 获取流程配置一览
        fetchFlowList(flow).then(response => {
          this.tableData = response.data;
          for (let i in this.tableData) {
            this.tableData[i].__modify__ = true;
            if (endState === this.tableData[i].pjState) {
              this.tableData[i].__multiple__ = true;
              this.tableData[i].__limit__ = limit_2;
              this.tableData[i].roleId = this.tableData[i].roleId.split(',');
            } else {
              this.tableData[i].__multiple__ = false;
              this.tableData[i].__limit__ = limit_0;
            }
          }
        });
        this.loading = false
      },
      stateChange(index, pjState) {
        if (endState === pjState) {
          this.tableData[index].__multiple__ = true;
          this.tableData[index].__limit__ = limit_2;
          if (this.tableData[index].roleId != null) {
            this.tableData[index].roleId = this.tableData[index].roleId.split(',');
          } else {
            this.tableData[index].roleId = [];
          }
        } else {
          this.tableData[index].__multiple__ = false;
          this.tableData[index].__limit__ = limit_0;
          if (this.tableData[index].roleId != null) {
            this.tableData[index].roleId = this.tableData[index].roleId[0];
          }
        }
      },
      // 新增按钮
      create() {
        this.addFlag = false;
        if (this.tableData) {
          this.row = {
            pjState: null,
            roleId: null,
            __multiple__: false,
            __modify__: false,
            __limit__: limit_0
          }
          this.tableData.push(this.row)
        }
      },
      // 修改按钮
      modify() {
        this.modFlag = false;
      },
      //保存按钮
      save() {
        // 删除空白行
        for (var j = 0; j < this.tableData.length; j++) {
          if (this.tableData[j].pjState == null && this.tableData[j].roleId == null) {
            {
              this.tableData.splice(j, 1);
              j--;
            }
          }
        }

        let td = [...this.tableData];

        // check
        let states = [];
        for (let i in td) {
          // 项目状态重复
          let repeatPS = states.find((element) => (element === td[i].pjState));
          if (repeatPS) {
            this.$message({
              type: 'warning',
              message: '第' + (parseInt(i) + 1) + '行项目状态重复,请重新选择'
            });
            return;
          } else {
            states.push(td[i].pjState);
          }

          // 项目状态非空
          if (td[i].pjState == null) {
            this.$message({
              type: 'warning',
              message: '请填入第' + (parseInt(i) + 1) + '行项目状态'
            });
            return;
          }

          // 角色名称非空
          if (endState == td[i].pjState) {
            if (td[i].roleId[0] == null) {
              this.$message({
                type: 'warning',
                message: '请填入第' + (parseInt(i) + 1) + '行角色名称'
              });
              return;
            }
          } else {
            if (td[i].roleId == null) {
              this.$message({
                type: 'warning',
                message: '请填入第' + (parseInt(i) + 1) + '行角色名称'
              });
              return;
            }
          }
        }

        this.addFlag = true;
        this.modFlag = true;
        let td1 = [];
        for (let i in td) {
          if (endState == td[i].pjState) {
            td[i].roleId = td[i].roleId.toString();
          }

          let detail = {
            roleId: td[i].roleId,
            pjState: td[i].pjState
          }
          td1.push(detail);
        }
        let data = {
          flowType: this.type,
          td: [...td1]
        }
        // 保存处理
        saveFlow(data);

        for (let i in td) {
          td[i].__modify__ = true;
          if (endState == td[i].pjState) {
            if (td[i].roleId != null) {
              td[i].roleId = td[i].roleId.split(',');
            } else {
              td[i].roleId = [];
            }
          }
        }
        this.tableData = td;
      },
      deleteRow(index, tableData) {
        tableData.splice(index, 1);

        let isModify = false;
        for (var i in this.tableData) {
          if (!this.tableData[i].__modify__) {
            isModify = true;
          }
        }

        if (!isModify) {
          this.addFlag = true;
        }
      }
    }
  }
</script>

<style>
  .simple-table {
    padding-bottom: 5px;
  }

  .simple-table-container {
    margin: 0 10px;
  }

  .simple-table-container .simple-table-toolbar {
    width: 100%;
    border-bottom: 1px solid #D3D7DA;
    margin-bottom: 20px;
    margin-top: 16px;
    color: #333333;
    height: 37px;
    line-height: 37px;
    font-weight: 700;
    position: relative;
  }

  .simple-table-toolbar .simple-table-title {
    position: absolute;
    min-width: 100px;
    left: 0;
    bottom: -1px;
    border-bottom: 4px solid #3377BE;
    font-size: 14px;
  }

  .simple-table-toolbar .simple-table-title i {
    padding: 0 8px 0 4px;
    color: #3377BE;
  }

  .simple-table-toolbar .simple-table-operate {
    position: absolute;
    right: 5px;
    bottom: 1px;
  }

  .simple-table-operate {
    font-size: 0;
  }

  .simple-table-operate .el-button {
    margin: 0 5px;
  }

  .simple-table .simple-table-filter-more {
    width: 100%;
    height: 36px;
  }

  .simple-table .table-responsive {
    width: 100%;
    margin-top: 20px;
    min-height: 40px;
    overflow: hidden;
    border: 1px solid #ddd;
    border-radius: 6px;
    position: relative;
  }

  .simple-table-body {
    overflow: auto;
    max-width: 100%;
  }

  /*修改table行样式*/
  .el-tbody th {
    padding: 10px 0 !important;
  }

  .el-tbody td {
    padding: 6px 0 !important;
  }
</style>

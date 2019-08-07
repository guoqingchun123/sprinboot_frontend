<template>
  <div class="app-container">
    <bv-table title="角色一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchRoles" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="one" view="grant" authority="grant" @click="startGrant()">授权</bv-button>
        <bv-button show="none" view="add" authority="add" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button v-if="deleteShow() && testShow" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="角色代码" prop="roleId">
            <el-input v-model="filter.roleId" />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="filter.roleName" />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column label="角色代码" prop="roleId" align="center" />roleId
      <el-table-column label="角色名称" prop="roleName" align="center" sortable="custom" />
    </bv-table>

    <bv-dialog title="角色维护" :visible.sync="dialogFormVisible" @close="dialogClose">
      <bv-form ref="dialogForm" :model="item" :rules="rules">
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item label="角色代码" prop="roleId">
              <el-input v-if="modifyType === 'create'" v-model.trim="item.roleId" />
              <span v-else v-text="item.roleId" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model.trim="item.roleName" />
            </el-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModify()">保存</bv-button>
        <bv-button view="cancel" @click="cancelModify()">取消</bv-button>
      </div>
    </bv-dialog>

    <bv-dialog title="角色授权" :visible.sync="dialogGrantVisible" top="5vh" width="1200px">
      <bv-scrollbar>
        <el-tree ref="tree" :data="routes" node-key="id" :props="{label: showLabel}" show-checkbox :default-expand-all="true" style="margin-bottom: 20px">
          <span slot-scope="{ node, data }" class="tree-node-operates">
            <span>{{ node.label }}</span>
            <span v-if="data.meta && data.meta.operates && data.meta.operates.length > 0" v-show="node.checked" class="operates-container">
              <el-checkbox
                v-model="data.meta.isAllOperatesSelected__"
                :indeterminate="isIndeterminate(data.meta)"
                @change="(value) => changeSelectAll(value, data.meta)"
              >
                全选
              </el-checkbox>
              <el-checkbox-group v-model="data.meta.authorityOperates__" @change="(value) => changeSelect(value, data.meta)">
                <el-checkbox v-for="el in data.meta.operates" :key="el.name" :label="el.name"> {{ el.label }} </el-checkbox>
              </el-checkbox-group>
            </span>
          </span>
        </el-tree>
      </bv-scrollbar>
      <div slot="footer">
        <bv-button view="save" @click="saveGrant">保存</bv-button>
        <bv-button view="cancel" @click="cancelGrant">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  import {asyncRoutes, constantRoutes} from '@/router'
  import {fetchRoles, createRole, modifyRole, removeRoles, fetchRoutes, saveRoutes, showRemove} from '@/api/authority'
  import {route as routeUtils, element as elementUtils} from '@bestvike/utils'

  export default {
    name: 'ListRole',
    data() {
      return {
        filter: {},
        dialogFormVisible: false,
        dialogGrantVisible: false,
        modifyType: null,
        item: {},
        // 授权用
        routes: [],
        // 字典
        roleStatusOptions: null,
        authorityRoutes: [],

        tableInstance: {},

        fetchRoles,

        rules: {
          roleId: [
            {required: true, message: '请输入角色代码', trigger: 'blur'},
            {min: 1, max: 36, message: '长度必须小于36个字', trigger: 'blur'}
          ],
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 1, max: 10, message: '长度必须小于10个字', trigger: 'blur'}
          ]
        },
        testShow: false
      }
    },
    created() {
      this.__initRoutes = routeUtils.initRoutesId([...constantRoutes, ...asyncRoutes].filter((route) => {
        return !route.hidden && route.meta
      }));
      this.routes = [...this.__initRoutes];
      this.$store.dispatch('app/fetchDicts', 'roleStatus').then(data => {
        this.roleStatusOptions = data
      })
    },
    methods: {
      // 弹窗用
      initRole() {
        this.item = {}
      },
      startCreate() {
        this.dialogFormVisible = true
        this.modifyType = 'create'
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      startModify() {
        this.item = {...this.tableInstance.table.selection[0]};
        this.dialogFormVisible = true;
        this.modifyType = 'modify';
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      cancelModify() {
        this.dialogFormVisible = false;
      },
      dialogClose() {
        this.initRole();
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
            modifyRole(item).then(() => {
              this.tableInstance.table.clearSelection()
              this.afterModify()
            })
          } else {
            createRole(this.item).then(() => {
              this.afterModify()
            })
          }
        })
      },
      afterModify() {
        this.tableInstance.fetchData();
        this.initRole();
        this.dialogFormVisible = false;
        this.modifyType = null;
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      },
      startRemove() {
        this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeRoles(this.tableInstance.table.selection.map(item => item.roleId).join()).then(() => {
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
      },
      startGrant() {
        // 授权
        this.dialogGrantVisible = true
        this.routes = routeUtils.initRoutes(this.routes)
        fetchRoutes(this.tableInstance.table.selection[0].roleId).then((res) => {
          // this.$refs.tree.setCheckedKeys([])
          this.authorityRoutes = res.data
          if (this.authorityRoutes && this.authorityRoutes.length > 0) {
            let routes = []
            this.authorityRoutes.forEach(item => {
              routes.push(item.route)
              if (item.operates && item.operates.length > 0) {
                const treeNode = this.$refs.tree.getNode(item.route)
                // 按钮权限
                if (treeNode && treeNode.data && treeNode.data.meta && treeNode.data.meta.operates && treeNode.data.meta.operates.length > 0) {
                  treeNode.data.meta.authorityOperates__ = item.operates
                  if (treeNode.data.meta.operates.length === item.operates.length) {
                    treeNode.data.meta.isAllOperatesSelected__ = true
                  }
                }
              }
            })
            this.$refs.tree.setCheckedKeys(routes)
          }
        })
      },
      // 保存授权
      saveGrant() {
        // 格式 [{route: 'xxx', operates: ['xxx', 'yyy', ...], urls: ['GET:xxx', 'POST:xxx', ...]}]
        let routes = []
        this.$refs.tree.getCheckedNodes().forEach(node => {
          let item = {}
          item.route = node.id
          if (node.meta && node.meta.authorityOperates__ && node.meta.authorityOperates__.length > 0) {
            item.operates = [...node.meta.authorityOperates__]
            let urls = []
            node.meta.authorityOperates__.forEach(authorityOperate => {
              node.meta.operates.forEach(operate => {
                if (operate.name === authorityOperate) {
                  urls = Array.from(new Set([...urls, ...operate.routes]))
                }
              })
            })
            item.urls = urls
          }
          routes.push(item)
        })
        saveRoutes(this.tableInstance.table.selection[0].roleId, routes).then(() => {
          this.dialogGrantVisible = false
          elementUtils.collapseTree(this.$refs.tree)
          this.$message({
            message: '授权成功',
            type: 'success'
          })
        })
      },
      cancelGrant() {
        this.dialogGrantVisible = false
        elementUtils.collapseTree(this.$refs.tree)
      },
      changeSelectAll(value, meta) {
        if (value) {
          meta.authorityOperates__ = []
          meta.operates.forEach(operate => {
            meta.authorityOperates__.push(operate.name)
          })
        } else {
          meta.authorityOperates__ = []
        }
      },
      changeSelect(values, meta) {
        if (values && values.length === meta.operates.length) {
          meta.isAllOperatesSelected__ = true
        } else {
          meta.isAllOperatesSelected__ = false
        }
      },
      showLabel(data) {
        return this.$filters.transTitle(data.meta)
      },

      // 辅助函数
      isIndeterminate(meta) {
        // data.meta
        return meta.authorityOperates__.length > 0 && meta.authorityOperates__.length < meta.operates.length
      },
      //删除按钮显示逻辑
      deleteShow() {
        if (!this.tableInstance || !this.tableInstance.selection || this.tableInstance.selection.length === 0) {
          return false
        }
        const selection = this.tableInstance.selection
        showRemove(selection.map(item => item.roleId).join()).then((response) => {
          if (response.data == -1) {
            //直接return存在作用域问题
            //存在用户授予该角色，不显示删除按钮
            this.testShow = false
          } else {
            this.testShow = true
          }
        })
        return true
      }
    }
  }
</script>

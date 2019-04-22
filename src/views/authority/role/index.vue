<template>
  <div class="app-container">
    <el-row type="flex" justify="space-between" class="table-header">
      <el-col class="operater">
        <el-button type="primary" icon="el-icon-edit" @click="startCreate">新增</el-button>
      </el-col>
    </el-row>

    <el-table
      :data="items"
    >
      <el-table-column label="角色代码" prop="code" align="center" width="80">
        <template slot-scope="scope">
          <template v-if="scope.row.__edit__ && scope.row.__id__">
            <el-input v-model="scope.row.code" class="edit-input" size="small" />
          </template>
          <span v-else>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" prop="name" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.__edit__">
            <el-input v-model="scope.row.name" class="edit-input" size="small" />
          </template>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <template v-if="scope.row.__edit__">
            <el-button type="success" size="small" icon="el-icon-circle-check-outline" @click="confirmEdit(scope.row)">保存</el-button>
            <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">取消</el-button>
          </template>
          <template v-else>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="startEdit(scope.row)">修改</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="startDelete(scope.row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="space-between" class="table-header">
      <el-col class="operater">
        <el-button v-show="$refs.table2 && $refs.table2.selection.length === 0" type="primary" icon="el-icon-edit" @click="startCreate('dialog')">新增</el-button>
        <el-button v-show="$refs.table2 && $refs.table2.selection.length === 1" type="primary" icon="el-icon-edit" @click="startEdit('dialog')">修改</el-button>
        <el-button v-show="$refs.table2 && $refs.table2.selection.length > 0" type="danger" icon="el-icon-refresh" @click="startDelete('dialog')">删除</el-button>
        <el-button v-show="$refs.table2 && $refs.table2.selection.length === 1" type="primary" icon="el-icon-edit" @click="startGrant('dialog')">授权</el-button>
      </el-col>
    </el-row>
    <el-table
      ref="table2"
      :data="items"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="角色代码" prop="code" align="center" width="80" />
      <el-table-column label="角色名称" prop="name" align="center" />
    </el-table>

    <el-dialog title="角色维护" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="role" :inline="true" label-width="100px" label-position="right">
        <el-form-item label="角色代码">
          <el-input v-model="role.code" />
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="role.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmEdit('dialog')">保存</el-button>
        <el-button @click="cancelEdit('dialog')">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="角色授权" :visible.sync="dialogGrantVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <bv-scrollbar>
        <el-tree :data="routers" node-key="path" :props="{label: showLabel}" accordion show-checkbox />
      </bv-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogGrantVisible = false">保存</el-button>
        <el-button @click="dialogGrantVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import i18n from '@/lang'
  import BvScrollbar from '@/components/Scrollbar'
  import { asyncRouterMap, constantRouterMap } from '@/router'
  import { fetchRoles } from '@/api/authority'

  export default {
    name: 'ListRole',
    components: {
      BvScrollbar
    },
    data() {
      return {
        items: null,
        dialogFormVisible: false,
        dialogGrantVisible: false,
        role: {},
        routers: [...constantRouterMap, ...asyncRouterMap]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        fetchRoles().then(response => {
          this.items = response.data
        })
      },
      startCreate(dialog) {
        if (dialog === 'dialog') {
          this.dialogFormVisible = true
        }
        if (this.items) {
          this.role = {
            code: null,
            name: null,
            __id__: Math.random(),
            __edit__: true
          }
          this.items.push(this.role)
        }
      },
      startEdit(dialog) {
        let row
        if (dialog === 'dialog') {
          this.dialogFormVisible = true
          row = this.$refs.table2.selection[0]
          this.role = row
        } else {
          row = dialog
          this.$set(row, '__edit__', true)
        }
        row.__origin__ = {...row}
      },
      cancelEdit(dialog) {
        let row
        if (dialog === 'dialog') {
          this.dialogFormVisible = false
          row = this.role
        } else {
          row = dialog
        }
        if (row.__origin__) {
          row.name = row.__origin__.name
          delete row.__origin__
        } else if (row.__id__) {
          this.items.splice(this.items.findIndex(item => item.__id__ === row.__id__), 1)
        }

        this.$delete(row, '__edit__')
        this.$message({
          message: '取消保存',
          type: 'warning'
        })
      },
      confirmEdit(dialog) {
        let row
        if (dialog === 'dialog') {
          this.dialogFormVisible = false
          row = this.role
        } else {
          row = dialog
        }
        if (row.__origin__) {
          delete row.__origin__
        }
        if (row.__id__) {
          this.$delete(row, '__id__')
        }
        this.$delete(row, '__edit__')
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      },
      startDelete(dialog) {
        let rows = []
        if (dialog === 'dialog') {
          rows = this.$refs.table2.selection
        } else {
          rows = [dialog]
        }
        rows.forEach(row => {
          this.items.splice(this.items.findIndex(item => item.code === row.code), 1)
        })
      },
      startGrant(dialog) {
        // 授权
        this.dialogGrantVisible = true
      },
      showLabel(data) {
        if (!data.meta) {
          return data.path || '首页'
        }
        if (data.meta.title.indexOf('${') === 0 && data.meta.title.indexOf('}') === data.meta.title.length - 1 ) {
          const titleName = data.meta.title.substring(2, data.meta.title.length - 1)
          return i18n.t(`route.${titleName}`)
        }
        return data.meta.title
      }
    }
  }
</script>

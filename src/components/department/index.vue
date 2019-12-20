<template>
  <div :is="scrollable ? 'bv-scrollbar' : 'div'">
    <bv-tree
      ref="tree"
      :ready="isTreeReady"
      :data="items"
      node-key="id"
      :props="{label: 'name'}"
      :default-expand-all="true"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <span class="tree-node-operates" :class="node.level === 1 && 'root-node'" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span v-if="editable" class="operates-container show-on-hover">
          <bv-button v-if="node.level <= 3" type="text" @click.stop="createData(node, data)">新增</bv-button>
          <bv-button v-if="node.level > 1" type="text" @click.stop="modifyData(node, data)">修改</bv-button>
          <bv-button v-if="node.level > 1 && (data.children === null || data.children.length === 0)" type="text" @click.stop="startRemove(node, data)">删除</bv-button>
        </span>
      </span>
    </bv-tree>
    <bv-dialog title="维护部门" :visible.sync="dialogFormVisible">
      <bv-form ref="dialogForm" :model="item" :rules="rules">
        <bv-row :layout="2">
          <bv-col>
            <bv-form-item  label="部门名称" prop="name">
              <el-input v-model="item.name" />
            </bv-form-item >
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModify">保存</bv-button>
        <bv-button view="cancel" @click="resetModify">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>
<script>
  import { fetchDepartments, createDepartment, modifyDepartment, removeDepartments } from '@/api/manage/department'

  export default {
    name: 'Department',
    props: {
      scrollable: Boolean,
      editable: Boolean
    },
    data() {
      return {
        items: [],
        isTreeReady: false,
        dialogFormVisible: false,
        modifyType: null,
        item: {},
        rules: {
          name:[
            { required: true, message: '请输入部门名称' }
          ]
        },

        currentNode__: null,
        currentData: null
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        fetchDepartments().then(res => {
          this.$emit('departments-ready', res.data)
          this.items = [
            {
              id: null,
              name: '部门一览',
              children: res.data
            }
          ]
          this.isTreeReady = true
        }).catch(() => { this.isTreeReady = true })
      },
      createData(node, data) {
        this.modifyType = 'create'
        this.item = {
          grade: node.level + 1,
          parent: data.id
        }
        this.dialogFormVisible = true

        this.currentNode__ = node
        this.currentData = data
      },
      modifyData(node, data) {
        this.modifyType = 'modify'
        this.item = {...data}
        this.dialogFormVisible = true

        this.currentNode__ = node
        this.currentData = data
      },
      confirmModify(event) {
        this.$refs.dialogForm.validate(valid => {
          if (!valid) {
            return false
          }

          const loading = this.$loading(event)
          if (this.modifyType === 'modify') {
            modifyDepartment(this.item).then(() => {
              this.afterModify()
              loading.hide()
            }).catch(() => loading.close())
          } else {
            createDepartment(this.item).then(res => {
              if (!this.currentData.children) {
                this.currentData.children = []
              }
              // 后台返回id
              this.currentData.children.push(res.data)
              this.afterModify()
              loading.hide()
            }).catch(() => loading.close())
          }
        })
      },
      afterModify() {
        this.resetModify()
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      },
      resetModify() {
        this.dialogFormVisible = false
        this.currentNode__ = null
        this.currentData = null
        this.$nextTick(() => {
          this.item = {}
          this.$refs.dialogForm && this.$refs.dialogForm.resetFields()
        })
      },
      startRemove(node, data) {
        this.$confirm('此操作将删除该部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading()
          removeDepartments(data.id).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            loading.close()
            node.parent.data.children.splice(node.parent.data.children.findIndex(item => item.id === data.id), 1)
          }).catch(() => loading.close())
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

<template>
  <el-row type="flex" class="fit-scroll" style="margin-bottom: -20px">
    <el-col :sm="6">
      <bv-scrollbar id="bs1">
        <bv-tree ref="tree" :data="items" node-key="code" :default-expanded-keys="['root']" @current-change="changeSelect">
          <span slot-scope="{ node, data }" class="tree-node-operates">
            <span>{{ data.code === 'root' ? node.label : data.code + ' - ' + node.label }}</span>
          </span>
        </bv-tree>
      </bv-scrollbar>
    </el-col>
    <el-col :sm="18">
      <bv-scrollbar id="bs2">
        <bv-table v-show="tableVisible" :title="tableTitle" :auto-fetch="false" :search="false" :fetch-api="fetchTableData" @on-mounted="(table) => tableInstance = table">
          <div slot="operates">
            <bv-button show="none" view="add" authority="add" @click="startCreate()">新增</bv-button>
            <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
            <bv-button show="oneOrMore" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
          </div>
          <el-table-column type="selection" width="55" />
          <el-table-column label="字典代码" prop="code" align="center" />
          <el-table-column label="字典名称" prop="name" align="center" />
        </bv-table>

        <bv-form v-show="formVisible" ref="form" title="字典维护" :model="item" :rules="rules">
          <bv-row>
            <bv-col>
              <el-form-item label="字典代码" prop="code">
                <span v-text="item.code" />
              </el-form-item>
            </bv-col>
            <bv-col>
              <el-form-item label="字典名称" prop="name">
                <el-input v-model="item.name" />
              </el-form-item>
            </bv-col>
          </bv-row>
          <bv-row>
            <bv-col>
              <bv-button view="save" authority="modify" @click="startSave()">保存</bv-button>
            </bv-col>
          </bv-row>
        </bv-form>
      </bv-scrollbar>
    </el-col>

    <bv-dialog title="字典维护" :visible.sync="dialogFormVisible">
      <bv-form ref="dialogForm" :model="item" :rules="rules">
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item label="字典代码" prop="code">
              <el-input v-if="modifyType === 'create'" v-model="item.code" />
              <span v-else v-text="item.code" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="字典名称" prop="name">
              <el-input v-model="item.name" />
            </el-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModify()">保存</bv-button>
        <bv-button view="cancel" @click="cancelModify()">取消</bv-button>
      </div>
    </bv-dialog>
  </el-row>
</template>

<script>
  import { fetchDicts, createDict, modifyDict, removeDicts } from '@/api/authority'
  import { element as elementUtils } from '@bestvike/utils'

  export default {
    name: 'Dict',
    data() {
      const checkCode = ((rule, value, callback) => {
        if (this.modifyType === 'create' && value && this.__currentItem && this.__currentItem.children) {
          // 判断value是否重复
          this.__currentItem.children.forEach(item => {
            if (item.code === value) {
              callback(new Error('字典代码不能重复'))
              return
            }
          })
          callback()
        } else {
          callback()
        }
      })
      return {
        items: [],
        tableInstance: null,
        tableTitle: '字典一览',

        modifyType: null,
        dialogFormVisible: false,
        tableVisible: true,
        formVisible: false,
        item: {},

        fetchDicts,

        rules: {
          code: [
            {required: true, message: '请输入字典代码', trigger: 'blur'},
            {validator: checkCode, trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入字典名称', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.__currentNode = null
      this.__currentItem = null
      this.fetchTreeData()
    },
    methods: {
      isRoot(item) {
        return item && item.code === 'root'
      },
      fetchTreeData() {
        fetchDicts().then((res) => {
          this.items = [
            {
              code: 'root',
              name: '字典',
              children: res.data
            }
          ]
          this.$nextTick(() => {
            this.__currentNode = this.$refs.tree.getNode('root')
            this.__currentItem = this.items[0]

            this.tableInstance.fetchData()
          })
        })
      },
      fetchData(refreshTree) {
        this.tableInstance.fetchData()
        if (refreshTree) {
          this.fetchTreeData()
        }
      },
      fetchTableData() {
        return new Promise(resolve => {
          if (this.isRoot(this.__currentItem.code)) {
            // return fetchCurrentDicts(this.__currentItem.code, data)
            // 根节点
            resolve({data: elementUtils.removeChildren(this.items.children)})
          } else {
            resolve({data: elementUtils.removeChildren(this.__currentItem.children)})
          }
        })
      },
      changeSelect(data, node) {
        this.__currentNode = node
        this.__currentItem = data
        if (node.level > 2) {
          this.item = {...data}
          this.tableVisible = false
          this.formVisible = true
          this.$refs.form && this.$refs.form.clearValidate()
          return
        } else {
          this.formVisible = false
          this.tableVisible = true
        }
        this.tableTitle = this.isRoot(data) ? '字典一览' : data.code + ' - ' + data.name
        this.tableInstance.fetchData()
        /*console.log(data)
        console.log(node)*/
      },

      initItem() {
        this.item = {}
      },
      startCreate() {
        this.initItem()
        this.dialogFormVisible = true
        this.modifyType = 'create'
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      startModify() {
        this.item = {...this.tableInstance.table.selection[0]}
        this.dialogFormVisible = true
        this.modifyType = 'modify'
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      cancelModify() {
        this.initItem()
        this.dialogFormVisible = false
        this.modifyType = null
        /*this.$message({
          message: '取消保存',
          type: 'warning'
        })*/
      },
      confirmModify() {
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false
          }
          if (this.modifyType === 'modify') {
            // 校验重复
            modifyDict(this.item, this.isRoot(this.__currentItem) ? null : this.__currentItem.code).then(() => {
              this.__currentItem.children.forEach((item => {
                if (item.code === this.item.code) {
                  item.name = this.item.name
                }
              }))
              this.tableInstance.table.clearSelection()
              this.afterModify()
            })
          } else {
            createDict(this.item, this.isRoot(this.__currentItem) ? null : this.__currentItem.code).then(() => {
              // 树增加子节点
              this.$refs.tree.append({...this.item}, this.__currentNode)
              // 展开节点
              this.__currentNode.expanded = true
              this.afterModify()
            })
          }
        })
      },
      afterModify() {
        // this.fetchData(true)
        this.tableInstance.fetchData()
        this.initItem()
        this.dialogFormVisible = false
        this.modifyType = null
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      },
      startRemove() {
        this.$confirm('此操作将删除该字典, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeDicts(this.tableInstance.table.selection.map(item => item.code).join(), this.isRoot(this.__currentItem) ? null : this.__currentItem.code).then(() => {
            this.tableInstance.table.selection.forEach(item => {
              this.$refs.tree.remove({...item})
            })
            this.tableInstance.fetchData()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        }).catch(() => {
          /*this.$message({
            message: '取消删除',
            type: 'warning'
          })*/
        })
      },
      startSave() {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return false
          }
          modifyDict(this.item, this.__currentNode.parent.data.code).then(() => {
            this.__currentNode.data.name = this.item.name
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          })
        })
      }
    }
  }
</script>
<style>
  #bs1 .el-scrollbar__wrap {
    margin-bottom: -6px !important;
  }
  #bs2 .el-scrollbar__wrap {
    margin-bottom: -6px !important;
  }
</style>

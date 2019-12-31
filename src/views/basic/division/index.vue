<template>
  <el-row>
    <el-col :sm="12">
      <bv-tree ref="tree" node-key="divisionCode" :ready="isDivisionReady" :default-expand-all="true" :accordion="false"
               :data="divisions">
        <span class="tree-node-operates" :class="node.level === 1 && 'root-node'" slot-scope="{ node, data }">
          <span>{{ data.divisionCode | comboShow(data.divisionName) }}</span>
          <span class="operates-container show-on-hover">
            <bv-button v-if="node.level === 2" type="text" @click.stop="createDivision(node, data)">增加区县</bv-button>
            <bv-button v-if="node.level === 3" type="text" @click.stop="modifyDivision(node, data)">修改区县</bv-button>
            <bv-button v-if="node.level === 3 && node.isLeaf" type="text"
                       @click.stop="removeDivision(node, data)">删除区县</bv-button>
            <bv-button v-if="node.level === 3" type="text" @click.stop="createDivision(node, data)">增加乡镇</bv-button>
            <bv-button v-if="node.level === 4" type="text" @click.stop="modifyDivision(node, data)">修改乡镇</bv-button>
            <bv-button v-if="node.level === 4 && node.isLeaf" type="text"
                       @click.stop="removeDivision(node, data)">删除乡镇</bv-button>
          </span>
        </span>
      </bv-tree>
    </el-col>
    <bv-dialog title="行政区域维护" :visible.sync="dialogFormVisible" v-if="dialogFormVisible">
      <bv-form ref="dialogForm" :model="item" :rules="rules">
        <bv-row layout="dialog-2">
          <bv-col>
            <bv-form-item v-if="modifyType === 'create'" label="行政区编号" prop="divisionCode">
              <bv-input v-model.trim="item.divisionCode"/>
            </bv-form-item>
            <bv-form-item v-else label="行政区编号">
              <span v-text="item.divisionCode"/>
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="行政区名称" prop="divisionName">
              <bv-input v-model.trim="item.divisionName"/>
            </bv-form-item>
          </bv-col>
          <bv-col v-if="(modifyType === 'create' && currentLevel > 1) || (modifyType === 'modify' && currentLevel > 2)">
            <bv-form-item label="所属地市" prop="cityCode">
              <span>{{ item.cityCode | comboShow(item.cityName) }}</span>
            </bv-form-item>
          </bv-col>
          <bv-col v-if="(modifyType === 'create' && currentLevel > 2) || (modifyType === 'modify' && currentLevel > 3)">
            <bv-form-item label="所属区县" prop="countyCode">
              <span>{{ item.countyCode | comboShow(item.countyName) }}</span>
            </bv-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModify">保存</bv-button>
        <bv-button view="cancel" @click="cancelModify()">取消</bv-button>
      </div>
    </bv-dialog>
  </el-row>
</template>
<script>
  import {fetchDivisionsTree, createDivisionTree, modifyDivisionTree, removeDivisionTree} from '@/api/basic'

  export default {
    name: 'ListDivision',
    components: {},
    data() {
      const checkCode = ((rule, value, callback) => {
        // 判断value是否重复
        if (this.currentData.children && this.currentData.children.length > 0) {
          let exists = this.currentData.children.some(item => item.divisionCode === value)
          if (exists) {
            callback(new Error('编号不能重复'))
            return
          }
        }
        callback()
      })

      return {
        isDivisionReady: false,
        divisions: [],
        dialogFormVisible: false,
        modifyType: null,
        item: {},
        rules: {
          divisionCode: [
            {required: true, message: '请输入编号', trigger: 'blur'},
            {validator: checkCode, trigger: 'blur'}
          ]
        },
        currentLevel: 0,
        currentData: {}
      }
    },
    created() {
      fetchDivisionsTree().then(res => {
        this.divisions = [
          {
            divisionCode: null,
            divisionName: '行政区管理',
            children: res.data
          }
        ]
        this.isDivisionReady = true
      }).catch()
    },
    methods: {
      createDivision(node, data) {
        this.currentLevel = node.level
        this.currentData = data
        this.modifyType = 'create'
        this.item = {
          parentDivision: data.divisionCode,
          divisionLevel: node.level + 1
        }
        if (node.level === 2) {
          this.item.cityCode = data.divisionCode
          this.item.cityName = data.divisionName
        } else if (node.level === 3) {
          this.item.cityCode = node.parent.data.divisionCode
          this.item.cityName = node.parent.data.divisionName
          this.item.countyCode = data.divisionCode
          this.item.countyName = data.divisionName
        }
        this.dialogFormVisible = true
      },
      modifyDivision(node, data) {
        this.currentLevel = node.level
        this.currentData = data
        this.modifyType = 'modify'
        this.item = {
          divisionCode: data.divisionCode,
          divisionName: data.divisionName,
          parentDivision: data.parentDivision,
          divisionLevel: data.divisionLevel
        }
        if (node.level === 3) {
          this.item.cityName = node.parent.data.divisionName
        } else if (node.level === 4) {
          this.item.cityName = node.parent.parent.data.divisionName
          this.item.countyName = node.parent.data.divisionName
        }
        this.dialogFormVisible = true
      },
      async removeDivision(node, data) {
        this.$confirm('此操作将删除该行政区, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            await removeDivisionTree(data.divisionCode)
            node.parent.data.children.splice(node.parent.data.children.findIndex(item => item.divisionCode === data.divisionCode), 1)
            // eslint-disable-next-line
          } catch (e) {
          }
        }).catch(() => {
        })
      },
      async confirmModify() {
        this.$refs.dialogForm.validate(async valid => {
          if (!valid) {
            return false
          }

          if (this.modifyType === 'create') {
            try {
              const {data} = await createDivisionTree(this.item)
              if (!this.currentData.children) {
                this.$set(this.currentData, 'children', [])
              }
              this.$set(this.item, 'divisionCode', data)
              this.currentData.children.push(this.item)
              // eslint-disable-next-line
            } catch (e) {
            }
          } else if (this.modifyType === 'modify') {
            try {
              await modifyDivisionTree(this.item)
              Object.assign(this.currentData, this.item)
              // eslint-disable-next-line
            } catch (e) {
            }
          }
          this.dialogFormVisible = false
          this.modifyType = null
          this.item = {}
        })
      },
      cancelModify() {
        this.dialogFormVisible = false
        this.modifyType = null
        this.item = {}
      }
    }
  }
</script>

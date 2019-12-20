<template>
  <el-row type="flex" class="fit-scroll">
    <el-col :sm="6">
      <bv-scrollbar>
        <bv-tree ref="tree" :data="items" node-key="code" :default-expanded-keys="['root']" style="margin-bottom: 20px" @current-change="changeSelect">
          <span slot-scope="{ node, data }" class="tree-node-operates">
            <span>{{ data.code === 'root' ? node.label : data.code + ' - ' + node.label }}</span>
          </span>
        </bv-tree>
      </bv-scrollbar>
    </el-col>
    <el-col :sm="18">
      <bv-scrollbar v-show="!dictItemVisible">
        <dict-list ref="dictList" v-show="dictListVisible" :items="dictItems" @on-dict-created="onDictCreated" @on-dict-modified="onDictModified" @on-dict-removed="onDictRemoved" />
        <dict-detail ref="dictDetail" v-show="dictDetailVisible" :title="dictDetailTitle" :show-save="true" :item="currentItem" @on-dict-modified="onDictModified" />
      </bv-scrollbar>
      <bv-form ref="itemForm" class="form-static" :title="formTitle" v-show="dictItemVisible">
        <bv-row>
            <bv-col>
              <bv-form-item  label="字典代码" prop="code">
                <bv-input v-text="item.code" />
              </bv-form-item >
            </bv-col>
            <bv-col>
              <bv-form-item  label="字典名称" prop="name">
                <bv-input v-text="item.name" />
              </bv-form-item >
            </bv-col>
          </bv-row>
      </bv-form>
    </el-col>
  </el-row>
</template>

<script>
  import { fetchDicts } from '@/api/manage/dictionary'
  import DictList from './components/dict-list'
  import DictDetail from './components/dict-detail'

  export default {
    name: 'ListDict',
    components: {
      DictList,
      DictDetail
    },
    data() {
      return {
        currentLevel: 0,
        currentItem: null,

        items: [],
        // details: [],
        dictDetailTitle: '',

        modifyType: null,
        dialogFormVisible: false,
        dictListVisible: true,
        dictDetailVisible: false,
        dictItemVisible: false,
        formTitle: null,
        item: {},

        fetchDicts
      }
    },
    computed: {
      dictItems() {
        return (this.items && this.items.length > 0 && this.items[0].children) || []
      }
    },
    created() {
      this.__currentNode = null
      // this.currentItem = null
      this.fetchTreeData()
    },
    methods: {
      onDictCreated(item) {
        this.$refs.tree.append(item, this.__currentNode)
        this.__currentNode.expanded = true
      },
      onDictModified(item) {
        if (this.currentLevel == 0 || this.currentLevel === 1) {
          this.currentItem.children.forEach((child => {
            if (child.code === item.code) {
              child.name = item.name
              child.children = item.children
            }
          }))
        } else if (this.currentLevel === 2) {
          this.currentItem.children = item.children
        }
      },
      onDictRemoved(items) {
        items.forEach(item => {
          this.$refs.tree.remove({...item})
        })
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
            this.currentItem = this.items[0]

            this.$refs.dictList.fetchData()
          })
        })
      },
      changeSelect(data, node) {
        this.__currentNode = node
        this.currentLevel = node.level
        this.currentItem = data
        // this.details = []
        if (node.level === 1) {
          this.dictDetailVisible = false
          this.dictItemVisible = false
          this.dictListVisible = true
          this.formTitle = null
          this.$refs.dictList.fetchData()
        } else if (node.level === 2) {
          this.dictListVisible = false
          this.dictItemVisible = false
          this.dictDetailVisible = true
          this.dictDetailTitle = data.code + ' - ' + data.name
          // this.details = [...data.children || []]
          // this.dictDetails = [...data.children || []]
          if (!data.children) {
            this.$set(data, 'children', [])
          }
          this.formTitle = null
          this.$refs.dictDetail.fetchData([...data.children])
          // this.$refs.dictDetail.fetchData([...data.children || []])
        } else if (node.level === 3) {
          this.item = data
          this.dictListVisible = false
          this.dictDetailVisible = false
          this.formTitle = node.parent.data.code + ' - ' + node.parent.data.name
          this.dictItemVisible = true
        }
      }
    }
  }
</script>

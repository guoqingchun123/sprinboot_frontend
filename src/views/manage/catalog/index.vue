<template>
  <el-row>
    <el-col :sm="12">
      <bv-tree ref="tree" node-key="code" :ready="isCatalogReady" :default-expand-all="true" :accordion="false" :data="catalogs">
        <span class="tree-node-operates" :class="node.level === 1 && 'root-node'" slot-scope="{ node, data }">
          <span>{{ data.code | comboShow(data.name) }}</span>
          <span class="operates-container show-on-hover">
            <bv-button v-if="node.level === 1" type="text" @click.stop="createCatalog(node, data)">增加大类</bv-button>
            <bv-button v-if="node.level === 2" type="text" @click.stop="modifyCatalog(node, data)">修改大类</bv-button>
            <bv-button v-if="node.level === 2 && node.isLeaf" type="text" @click.stop="removeCatalog(node, data)">删除大类</bv-button>
            <bv-button v-if="node.level === 2" type="text" @click.stop="createCatalog(node, data)">增加小类</bv-button>
            <bv-button v-if="node.level === 3" type="text" @click.stop="modifyCatalog(node, data)">修改小类</bv-button>
            <bv-button v-if="node.level === 3 && node.isLeaf" type="text" @click.stop="removeCatalog(node, data)">删除小类</bv-button>
            <bv-button v-if="node.level === 3" type="text" @click.stop="createCatalog(node, data)">增加分类</bv-button>
            <bv-button v-if="node.level === 4" type="text" @click.stop="modifyCatalog(node, data)">修改分类</bv-button>
            <bv-button v-if="node.level === 4" type="text" @click.stop="removeCatalog(node, data)">删除分类</bv-button>
          </span>
        </span>
      </bv-tree>
    </el-col>
    <bv-dialog title="图档类型维护" :visible.sync="dialogFormVisible" v-if="dialogFormVisible">
      <bv-form ref="dialogForm" :model="item" :rules="rules">
        <bv-row layout="dialog-2">
          <bv-col>
            <bv-form-item v-if="modifyType === 'create'" label="编号" prop="code">
              <bv-input v-model.trim="item.code" />
            </bv-form-item>
            <bv-form-item v-else label="编号">
              <span v-text="item.code" />
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="名称" prop="name">
              <bv-input v-model.trim="item.name" />
            </bv-form-item>
          </bv-col>
          <bv-col v-if="(modifyType === 'create' && currentLevel > 1) || (modifyType === 'modify' && currentLevel > 2)">
            <bv-form-item label="大类" prop="keyType">
              <span>{{ item.keyType | comboShow(item.keyTypeName) }}</span>
            </bv-form-item>
          </bv-col>
          <bv-col v-if="(modifyType === 'create' && currentLevel > 2) || (modifyType === 'modify' && currentLevel > 3)">
            <bv-form-item label="小类" prop="subType">
              <span>{{ item.subType | comboShow(item.subTypeName) }}</span>
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="是否添加水印">
              <el-switch v-model="item.needWatermark" @change="onNeedWatermarkChange" />
            </bv-form-item>
          </bv-col>
          <bv-col v-if="item.needWatermark" layout="100%">
            <bv-row :layout="3">
              <bv-col v-for="el in watermarks" :key="el.id">
                <bv-form-item :label="el.name">
                  <a class="choose-watermark" :class="el.id === item.watermarkId && 'active'" @click="selectWatermark(el)">
                    <el-image :src="el.url" />
                  </a>
                </bv-form-item>
              </bv-col>
            </bv-row>
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
  import { Image } from 'element-ui'
  import { getCacheBlob, createCache, removeCache } from '@bestvike/utils/lib'
  import { fetchAllCatalogs, createCatalog, modifyCatalog, removeCatalog } from '@/api/file'
  import { fetchWatermarks } from '@/api/manage/watermark'

  export default {
    name: 'ListCatalog',
    components: {
      ElImage: Image
    },
    data() {
      const checkCode = ((rule, value, callback) => {
        // 判断value是否重复
        if (this.currentData.children && this.currentData.children.length > 0) {
          let exists = this.currentData.children.some(item => item.code === value)
          if (exists) {
            callback(new Error('编号不能重复'))
            return
          }
        }
        callback()
      })

      return {
        isCatalogReady: false,
        catalogs: [],
        watermarks: [],
        dialogFormVisible: false,
        modifyType: null,
        item: {},
        rules: {
          code: [
            { required: true, message: '请输入编号', trigger: 'blur' },
            { validator: checkCode, trigger: 'blur' }
          ]
        },
        currentLevel: 0,
        currentData: {}
      }
    },
    created() {
      fetchAllCatalogs().then(res => {
        this.catalogs = [
          {
            code: null,
            name: '图档分类',
            children: res.data
          }
        ]
        this.isCatalogReady = true
      }).catch()
    },
    beforeDestroy() {
      if (this.watermarks && this.watermarks.length > 0) {
        for (let item of this.watermarks) {
          if (item.url) {
            removeCache(item.url)
          }
        }
      }
    },
    methods: {
      createCatalog(node, data) {
        this.currentLevel = node.level
        this.currentData = data
        this.modifyType = 'create'
        this.item = {}
        if (node.level === 2) {
          this.item.keyType = data.code
          this.item.keyTypeName = data.name
        } else if (node.level === 3) {
          this.item.keyType = node.parent.data.code
          this.item.keyTypeName = node.parent.data.name
          this.item.subType = data.code
          this.item.subTypeName = data.name
        }
        this.dialogFormVisible = true
      },
      modifyCatalog(node, data) {
        this.currentLevel = node.level
        this.currentData = data
        this.modifyType = 'modify'
        this.item = {
          id: data.id,
          code: data.code,
          name: data.name,
          watermarkId: data.watermarkId,
          keyType: data.keyType,
          subType: data.subType
        }
        if (node.level === 3) {
          this.item.keyTypeName = node.parent.data.name
        } else if (node.level === 4) {
          this.item.keyTypeName = node.parent.parent.data.name
          this.item.subTypeName = node.parent.data.name
        }
        if (this.item.watermarkId) {
          this.$set(this.item, 'needWatermark', true)
          this.onNeedWatermarkChange(true)
        }
        this.dialogFormVisible = true
      },
      async removeCatalog(node, data) {
         this.$confirm('此操作将删除该字典, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          try {
            await removeCatalog(data.id)
            node.parent.data.children.splice(node.parent.data.children.findIndex(item => item.id === data.id), 1)
            // eslint-disable-next-line
          } catch(e) {
          }
        }).catch(() => {})
      },
      async confirmModify() {
        this.$refs.dialogForm.validate(async valid => {
          if (!valid) {
            return false
          }

          if (this.modifyType === 'create') {
            try {
              const { data } = await createCatalog(this.item)
              if (!this.currentData.children) {
                this.$set(this.currentData, 'children', [])
              }
              this.$set(this.item, 'id', data)
              this.currentData.children.push(this.item)
              // eslint-disable-next-line
            } catch (e) {
            }
          } else if (this.modifyType === 'modify') {
            try {
              await modifyCatalog(this.item)
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
      },

      onNeedWatermarkChange(value) {
        if (value && (!this.watermarks || this.watermarks.length === 0)) {
          fetchWatermarks().then(async res => {
            try {
              let watermarks = []
              if (res.data && res.data.length > 0) {
                for (let item of res.data) {
                  if (item.content) {
                    let blob = await getCacheBlob('data:image/jpg;base64,' + item.content)
                    item.url = createCache(blob)
                  }
                  watermarks.push(item)
                }
              }
              this.watermarks = watermarks
            } catch (e) {
              console.log(e)
            }
          })
        }
      },
      selectWatermark(watermark) {
        this.$set(this.item, 'watermarkId', watermark.id)
        // this.item.watermarkId = watermark.id
      }
    }
  }
</script>
<style lang="scss" scoped>
  .choose-watermark {
    display: inline-block;
    padding: 3px;
    &:hover, &.active {
      border: 1px solid #3693f3;
    }
  }
</style>
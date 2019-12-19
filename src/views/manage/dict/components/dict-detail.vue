<template>
  <div>
    <bv-form ref="form" :skip-blur="false" :model="form" :rules="form.rules">
      <bv-table ref="table" :title="title || '字典项配置'" :search="false" :data="form.details">
        <bv-table-column type="selection" />
        <bv-table-column label="字典代码" prop="code" align="center">
          <template slot-scope="scope">
            <bv-form-item  :prop="'details.' + scope.$index + '.code'" :rules="form.rules.code">
              <bv-input v-model="scope.row.code" />
            </bv-form-item >
          </template>
        </bv-table-column>
        <bv-table-column label="字典名称" prop="name" align="center">
          <template slot-scope="scope">
            <bv-form-item  :prop="'details.' + scope.$index + '.name'" :rules="form.rules.name">
              <bv-input prop="name" v-model.trim="scope.row.name" />
            </bv-form-item >
          </template>
        </bv-table-column>

        <div slot="operates">
          <bv-button show="none" view="create" @click="addDetail()">新增字典项</bv-button>
          <bv-button v-if="showSave" show="none" view="save" @click="saveDetail">保存字典项</bv-button>
          <bv-button show="oneOrMore" view="remove" @click="removeDetail()">删除字典项</bv-button>
        </div>
      </bv-table>
    </bv-form>
  </div>
</template>
<script>
  import { modifyDict } from '@/api/manage/dictionary'

  export default {
    name: 'DictDetail',
    props: {
      title: String,
      items: Array,
      showSave: Boolean,
      item: Object
    },
    data() {
      /*const checkCode = ((rule, value, callback) => {
        if (this.modifyType === 'create' && value && this.currentItem && this.currentItem.children) {
          // 判断value是否重复
          this.currentItem.children.forEach(item => {
            if (item.code === value) {
              callback(new Error('字典代码不能重复'))
              return
            }
          })
          callback()
        } else {
          callback()
        }
      })*/
      const checkCode = ((rule, value, callback) => {
        // 判断value是否重复
        let cnt = 0
        this.form.details.forEach(item => {
          if (item.code === value) {
            cnt++
            if (cnt > 1) {
              return false
            }
          }
        })
        if (cnt > 1) {
          callback(new Error('字典代码不能重复'))
          return
        }
        callback()
      })
      return {
        id__: 0,
        form: {
          details: this.items,
          rules: {
            code: [
              { required: true, message: '请输入字典代码', trigger: 'blur' },
              { validator: checkCode, trigger: 'blur' }
            ],
            name: [
              { required: true, message: '请输入字典名称', trigger: 'blur' }
            ]
          }
        }
      }
    },
    methods: {
      /*fetchTableData() {
        return new Promise(resolve => {
          resolve({
            data: this.items
          })
        })
      },*/
      fetchData(items) {
        this.$refs.form.clearValidate()
        if (items) {
          this.form.details = [...items]
        }
        // this.$refs.table.fetchData()
        this.$nextTick(() => {
          this.$refs.table.fetchData()
        })
      },
      addDetail() {
        this.form.details.push({
          id__: ++this.id__,
          code: '',
          name: ''
        })
      },
      saveDetail(event) {
        let item = {...this.item}
        item.children = this.form.details
        this.$refs.form.validate(valid => {
          if (!valid) {
            return false
          }
          const loading = this.$loading(event)
          modifyDict(item).then(() => {
            this.$emit('on-dict-modified', item)
            loading.close()
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          }).catch(() => loading.close())
        })
      },
      removeDetail() {
        let selections = this.$refs.table.selection
        if (selections && selections.length > 0) {
          selections.forEach(selection => {
            this.form.details.splice(this.form.details.findIndex(item => item.id__ ? item.id__ === selection.id__ : item.code === selection.code), 1)
          })
          this.$refs.table.clearSelection()
        }
      },
      // 对外提供接口
      validate(callback) {
        return this.$refs.form.validate(callback)
      }
    }
  }
</script>


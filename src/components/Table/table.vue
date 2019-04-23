<template>
  <div class="bv-table">
    <bv-row layout="table-header">
      <bv-col v-if="title" layout="title">
        <h3 v-text="title" />
      </bv-col>
      <bv-col v-if="$slots.operates" layout="operate">
        <slot name="operates" />
      </bv-col>
    </bv-row>
    <bv-row v-if="search" layout="table-search">
      <bv-col>
        <bv-row v-show="isFuzzy__" layout="table-fuzzy">
          <bv-form ref="fuzzy">
            <bv-col>
              <el-form-item prop="fuzzy">
                <el-input v-model="fuzzy" placeholder="请输入查询条件" class="input-with-select" clearable>
                  <bv-button slot="append" view="search" @click="fetchData" />
                </el-input>
              </el-form-item>
            </bv-col>
          </bv-form>
        </bv-row>
        <bv-row v-show="!isFuzzy__" layout="table-filter">
          <bv-form ref="filter" :model="filter">
            <slot name="search" />
            <bv-col layout="operate">
              <bv-button layout="filter" @click="fetchData">查询</bv-button>
              <bv-button layout="reset" @click="resetFilter">重置</bv-button>
            </bv-col>
          </bv-form>
        </bv-row>
      </bv-col>
      <bv-col v-if="filterSwitch" class="search-switch">
        <el-tooltip :content="isFuzzy__ ? '点击切换精确查询' : '点击切换模糊查询'">
          <el-switch v-model="isFuzzy__" />
        </el-tooltip>
      </bv-col>
    </bv-row>
    <el-table
      ref="table"
      v-loading="loading"
      stripe
      :data="items"
      v-bind="$attrs"
      @selection-change="((value) => selection = value)"
      @sort-change="onSort"
    >
      <slot />
    </el-table>
    <bv-pagination
      v-if="pagination"
      :total="total" :current-page.sync="currentPage" :page-size="limit"
      @current-change="handlePageChange"
    >
      <el-tooltip content="点击刷新数据">
        <el-button type="text" icon="el-icon-refresh" @click="fetchData" />
      </el-tooltip>
    </bv-pagination>
  </div>
</template>

<script>
  import { defaults as utils } from '@bestvike/utils'

  export default {
    name: 'BvTable',
    provide() {
      return {
        // table实例
        tableInstance: this
      }
    },
    props: {
      // table标题
      title: {
        type: String,
        default: null
      },
      // 是否分页
      pagination: {
        type: Boolean,
        default: false
      },
      // 是否自动查询数据
      autoFetch: {
        type: Boolean,
        default: true
      },
      // 是否显示查询条件
      search: {
        type: Boolean,
        default: true
      },
      // 是否为模糊查询
      isFuzzy: {
        type: Boolean,
        default: true
      },
      // 是否允许切换查询条件
      filterSwitch:{
        type: Boolean,
        default: true
      },
      // 查询条件
      filter: {
        type: Object,
        default: null
      },
      // 查询数据接口 Promise
      fetchApi: {
        type: Function,
        default: null
      }
    },
    data() {
      return {
        items: [],
        loading: false,
        selection: [],
        isFuzzy__: this.isFuzzy,
        // 模糊查询条件
        fuzzy: null,
        // 过滤条件
        // filter: {},
        // 当前排序
        sort: null,
        total: 0,
        limit: 10,
        currentPage: 1,

        table: null
      }
    },
    created() {
      if (this.autoFetch) {
        this.fetchData()
      }
    },
    mounted() {
      this.table = this.$refs.table
      this.$emit('on-mounted', this)
    },
    methods: {
      resetFilter() {
        this.$emit('update:filter', utils.initObject(this.filter))
        this.fetchData()
      },
      onSort(sort) {
        this.sort = utils.transTableSort(sort)
        this.fetchData()
      },
      handlePageChange(value) {
        this.currentPage = value;
        this.fetchData()
      },
      fetchData() {
        if (!this.fetchApi) {
          return
        }
        this.loading = true
        let data = {}
        if (this.isFuzzy__) {
          if (this.fuzzy) {
            data.fuzzy = this.fuzzy
          }
        } else {
          for (let item in this.filter) {
            data[item] = this.filter[item]
          }
        }
        if (this.sort) {
          data.sort = this.sort
        }
        // 分页信息
        if (this.pagination) {
          data.page = this.currentPage
          data.limit = this.limit
        }

        this.fetchApi(data).then(response => {
          if (this.pagination) {
            this.total = response.data.total
            this.items = response.data.list || []
          } else {
            this.items = response.data || []
          }
          setTimeout(() => {
            this.loading = false
          }, 500);
        }).catch(() => {
          // console.log(error)
          setTimeout(() => {
            this.loading = false
          }, 500);
        })
      }
    }
  }
</script>

<style lang="scss">
  .table-header {
    height: 40px;

    h3 {
      line-height: 40px;
    }
  }
</style>

<template>
  <bv-row type="flex" class="fit-scroll" style="margin-bottom: -20px">
    <bv-col :sm="5">
      <bv-scrollbar id="bs1">
        <el-input
          v-model="filterText"
          placeholder="输入关键字进行过滤"
        />
        <br>
        <el-tree
          ref="tree"
          class="expand-tree"
          :data="treeDatas"
          node-key="productId"
          highlight-current
          :props="defaultProps"
          :expand-on-click-node="false"
          :default-expand-all="true"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        />
      </bv-scrollbar>
    </bv-col>
    <bv-col :sm="19">
      <bv-scrollbar id="bs2">
        <div class="app-container">
          <bv-table v-if="showForm" ref="table" :title="formTitle + '产品一览'" :pagination="true" :filter.sync="filter"
                    :fetch-api="getPjInfos" :is-fuzzy="false" :search="false"
                    @on-mounted="(table) => tableInstance = table"
          >
            <el-table-column type="index" label="序号" />
            <el-table-column prop="projId" label="项目编号" sortable />
            <el-table-column prop="projName" label="项目名称" sortable />
            <el-table-column prop="projYear" label="年度" sortable />
            <el-table-column prop="projField" label="领域" sortable :formatter="projFieldFormatter" />
            <el-table-column prop="deptName" label="业务部门" sortable />
            <el-table-column prop="projState" label="项目状态" sortable :formatter="projStateFormatter" />
          </bv-table>
          <div v-if="!showForm">
            <h3 v-text="viewText" />
          </div>
        </div>
      </bv-scrollbar>
    </bv-col>
  </bv-row>
</template>

<script>
  import {getProducts, getPjInfos} from '@/api/authority'

  export default {
    name: 'ProductList',
    data() {
      return {
        defaultProps: {
          label: 'productName',
          children: 'list'
        },
        filterText: '',
        showForm: false,
        formTitle: '',
        viewText:'',
        treeDatas: null,
        filter: {
          productId: ''
        },
        pjStates:[],
        projFields:[],
        getPjInfos
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      //监听切换标签状态
      'filter.productId': function (val) {
        if (this.tableInstance && val !== '') {
          this.tableInstance.fetchData()
        }
      }
    },
    created() {
      this.tree();
    },
    methods: {
      tree() {
        this.$store.dispatch('app/fetchDicts', 'projState').then(data => {
          this.pjStates = data;
        });
        this.$store.dispatch('app/fetchDicts', 'projField').then(data => {
          this.projFields = data;
        });
        getProducts({}).then(res => {
          let data = res.data;
          let tree = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].parentId === 'ROOT') {
              let obj = data[i];
              obj.list = [];
              tree.push(obj);
              data.splice(i, 1);
              i--
            }
          }
          menuList(tree);
          this.treeDatas = [{
            productName: '产品一览',
            productId: 'ROOT',
            list: tree
          }];

          function menuList(arr) {
            if (data.length !== 0) {
              for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < data.length; j++) {
                  if (data[j].parentId === arr[i].productId) {
                    let obj = data[j];
                    obj.list = [];
                    arr[i].list.push(obj);
                    data.splice(j, 1);
                    j--
                  }
                }
                menuList(arr[i].list)
              }
            }
          }
        });
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.productName.indexOf(value) !== -1;
      },
      handleNodeClick(data, node) {
        let productId;
        if (data.basicModule === 'Y') {
          this.showForm = true;
          productId = data.productId;
        } else {
          this.showForm = false;
          productId = '';
        }
        this.filter.productId = productId;
        this.formTitle = '【' + data.productName + '】';


        if (node.level ===2) {
          this.viewText = '业务方向'+ this.formTitle;
        } else if (node.level ===3) {
          this.viewText = '产品'+ this.formTitle;
        } else {
          this.viewText = '';
        }
      },
      projStateFormatter(row) {
        for (let i = 0; i < this.pjStates.length; i++) {
          if (this.pjStates[i].code === row.projState) {
            return this.pjStates[i].name;
          }
        }
        return row.projState;
      },
      projFieldFormatter(row) {
        for (let i = 0; i < this.projFields.length; i++) {
          if (this.projFields[i].code === row.projField) {
            return this.projFields[i].name;
          }
        }
        return row.projField;
      }
    }
  }

</script>
<style>
  #bs1 .el-scrollbar__wrap {
    margin-bottom: -6px !important;
  }
  #bs2 .el-scrollbar__wrap {
    margin-bottom: -2px !important;
  }
</style>

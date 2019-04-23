<template>
  <el-row type="flex" class="fit-scroll" style="margin-bottom: -20px">
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
    <bv-col :sm="19" :offset="3">
      <bv-scrollbar>
        <div align="left">
          <bv-col :span="18" :offset="5">
            <div>
              <bv-button v-if="addChildProductButton" view="modify" @click="addProduct">
                增加下级{{ buttonTitle }}信息
              </bv-button>
            </div>
          </bv-col>
          <bv-form v-if="showForm" ref="treeDatas1" :model="treeDatas1" :rules="rules" label-suffix=":"
                   label-width="140px"
          >
            <bv-row :gutter="$CONST.row.gutter">
              <bv-col>
                <h2>{{ formTitle }}</h2>
              </bv-col>
              <bv-col>
                <el-form-item :label="levelTitle+'代码'" prop="productCode">
                  <el-input v-model="treeDatas1.productCode" style="width: 217px" />
                </el-form-item>
              </bv-col>
              <bv-col>
                <el-form-item :label="levelTitle+'名称'" prop="productName">
                  <el-input v-model="treeDatas1.productName" style="width: 217px" />
                </el-form-item>
              </bv-col>
              <bv-col>
                <el-form-item v-if="showBasic" label="基础模块" prop="basicModule">
                  <el-select v-model="treeDatas1.basicModule"
                             placeholder="请选择"
                  >
                    <el-option
                      v-for="item in isBasic"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </bv-col>
              <bv-col>
                <el-form-item :label="levelTitle+'描述'" prop="productDesc">
                  <el-input v-model="treeDatas1.productDesc" rows="5" type="textarea" style="width: 217px" />
                </el-form-item>
              </bv-col>
              <bv-col>
                <el-form-item label="显示顺序" prop="showOrder">
                  <el-input v-model="treeDatas1.showOrder" style="width: 217px" />
                </el-form-item>
              </bv-col>
              <bv-col :span="18" :offset="2">
                <el-form-item>
                  <bv-button v-if="showSaveButton" view="add" @click="saveProduct('treeDatas1')">保存</bv-button>
                  <bv-button v-if="showDeleteButton" view="remove" @click="deleteProduct(currParentId,currName)">
                    删除
                  </bv-button>
                </el-form-item>
              </bv-col>
            </bv-row>
          </bv-form>
        </div>
      </bv-scrollbar>
    </bv-col>
  </el-row>
</template>

<script>
  import {getSysProduct, addProductInfo, deleteSysProductInfo} from '@/api/authority'

  export default {
    name: 'Product',
    data() {
      return {
        defaultProps: {
          label: 'productName',
          children: 'list'
        },
        filterText: '',
        treeDatas: null,
        treeDatas1: null,
        rules: {
          productCode: [
            {required: true, message: "请输入产品代码", trigger: 'blur'},
            {max: 20, message: '长度不超过20个字符', trigger: 'blur'}
          ],
          productName: [
            {required: true, message: "请输入产品名称", trigger: 'blur'},
            {max: 20, message: '长度不超过20个字符', trigger: 'blur'}
          ],
          productDesc: [
            {max: 200, message: '长度不超过20个字符', trigger: 'blur'}
          ],
          showOrder: [
            // {type: 'number', message: '必须是数字'},
            {required: true, message: "请输入显示顺序", trigger: 'blur'},
            {max: 4, message: '长度不超过4个字符', trigger: 'blur'}
          ],
          basicModule: [
            {required: true, message: "请选择基础模块", trigger: 'blur'}
          ]
        },
        currParentId: '',
        currName: '',
        showSaveButton: true,
        showDeleteButton: true,
        showForm: false,
        addChildProductButton: false,
        showBasic: false,
        // 基础模块
        isBasic: [],
        nodeSelf: '',
        buttonTitle: '业务方向',
        treeLevel: null,
        formTitle: '',
        levelTitle: '',
        isAdd:false
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    created() {
      this.tree();
    },
    methods: {
      tree() {
        // 获取是否字典
        this.$store.dispatch('app/fetchDicts', 'yesOrNo').then(data => {
          this.isBasic = data
        });
        getSysProduct({}).then(res => {
          this.datas = res.data;
          let data = this.datas;
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
            productName: '产品管理',
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
      handleNodeClick(data, node, _that) {
        this.isAdd = false;
        this.nodeSelf = _that;
        this.treeLevel = node.level;
        this.treeDatas1 = {...data};
        this.currParentId = data.productId;
        this.currName = data.productName;

        if (this.treeLevel === 1) {
          this.buttonTitle = '业务方向';
          this.showSaveButton = true;
          this.showDeleteButton = true;
          this.showForm = false;
          this.addChildProductButton = true;
          this.showBasic = false;
          return;
        } else if (this.treeLevel === 2 || this.treeLevel === 3) {
          this.showSaveButton = true;
          this.showDeleteButton = true;
          this.showForm = true;
          this.addChildProductButton = true;
          this.showBasic = false;
          if (this.treeLevel === 2) {
            this.levelTitle = '业务方向';
            this.buttonTitle = '产品';
          } else {
            this.levelTitle = '产品';
            this.buttonTitle = '产品模块';
          }
        } else {
          this.showForm = true;
          this.addChildProductButton = false;
          this.showBasic = true;
          this.levelTitle = '产品模块';
        }

        this.clearVail();
        this.formTitle = this.levelTitle + '【' + data.productName + '】信息维护';
      },
      clearVail() {
        if (this.$refs.treeDatas1) {
          this.$refs.treeDatas1.clearValidate()
        }
      },
      addProduct() {
        this.isAdd = true;
        this.addChildProductButton = false;
        if (this.treeLevel === 1) {
          this.levelTitle = '业务方向';
        } else if (this.treeLevel === 2) {
          this.levelTitle = '产品';
        } else if (this.treeLevel === 3) {
          this.levelTitle = '产品模块';
        }
        this.formTitle = this.levelTitle + '信息增加';
        this.treeDatas1 = {
          productId: '',
          productCode: '',
          parentId: this.currParentId,
          productName: '',
          showOrder: '0',
          basicModule: '',
          productState: '0000',
          productLevel: this.treeLevel
        };

        if (this.treeLevel === 3) {
          this.showBasic = true;
        } else {
          this.showBasic = false;
        }

        this.showSaveButton = true;
        this.showDeleteButton = false;
        this.showForm = true;
        this.clearVail();
      },
      saveProduct(formName) {
        let _that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addProductInfo(_that.treeDatas1).then(ret => {
              this.$message({
                type: ret.data.level,
                message: this.levelTitle + ret.data.retMsg
              });

              if (ret.data.retCode === '0000') {
                this.treeDatas1.productId = ret.data.productId;
                this.clearVail();
                this.tree();

                this.formTitle = this.levelTitle + '【' + this.treeDatas1.productName + '】信息维护';

                this.$refs['tree'].store.currentNodeKey = this.treeDatas1.productId;
                if (this.isAdd) {
                  this.isAdd = false;

                  // this.$refs['tree'].currentNode = this.$refs['tree'].store.currentNode
                  this.showDeleteButton = true;
                  this.treeLevel = this.treeLevel +1;

                  if (this.treeLevel === 2) {
                    this.buttonTitle = '产品';
                    this.addChildProductButton = true;
                  } else if (this.treeLevel === 3) {
                    this.buttonTitle = '产品模块';
                    this.addChildProductButton = true;
                  }
                  this.currParentId = this.treeDatas1.productId;
                  this.currName = this.treeDatas1.productName;
                }
              }
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '保存失败'
              });
            });
          } else {
            return false;
          }
        });
      },
      deleteProduct(productId, currName) {

        let msg;
        if (this.treeLevel === 2) {
          msg = '此操作将删除【' + currName + '】业务方向信息及其下的产品信息, 是否继续?';
        } else if (this.treeLevel === 3) {
          msg = '此操作将删除【' + currName + '】产品信息及其下的产品模块信息, 是否继续?';
        } else if (this.treeLevel === 4) {
          msg = '此操作将删除【' + currName + '】产品模块信息, 是否继续?';
        }

        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let delProductId = productId;
          deleteSysProductInfo(delProductId).then(() => {
            this.tree();
            this.clearVail();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.addChildProductButton = false;
            this.showSaveButton = false;
            this.showDeleteButton = false;
            this.showForm = false;
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
</style>

<template>
  <bv-row type="flex" class="fit-scroll" style="margin-bottom: -20px">
    <bv-col :sm="6">
      <bv-scrollbar id="bs1">
        <el-input
          v-model="filterText"
          placeholder="输入关键字进行过滤"
          style="min-width: 180px"
        />
        <el-tree
          ref="treeDatas"
          class="expand-tree"
          :data="treeDatas"
          highlight-current
          node-key="sysGuid"
          :props="defaultProps"
          :render-content="renderContent"
          :expand-on-click-node="false"
          :default-expand-all="true"
          :filter-node-method="filterNode"
          @node-click="nodeClick"
        />
      </bv-scrollbar>
    </bv-col>
    <bv-col :sm="18">
      <bv-scrollbar id="bs2">
        <div align="center">
          <bv-form v-if="addNodeShow" ref="fileForm"
                   :model="fileForm" class="area-edit-message" label-width="140px" label-suffix=":"
          >
            <h2>文件信息</h2>
            <bv-row>
              <el-form-item label="文件代码" prop="fileCode">
                <el-input v-model="fileForm.fileCode" :disabled="true" style="width:217px;" />
              </el-form-item>
            </bv-row>
            <bv-row>
              <el-form-item label="文件名称" prop="fileName">
                <el-input v-model="fileForm.fileName" :disabled="true" style="width:217px;" />
              </el-form-item>
            </bv-row>
            <bv-row>
              <el-form-item v-if="showDescription" label="文件功能" prop="description">
                <el-input v-model="fileForm.description" type="textarea" :rows="3" placeholder="请输入文件功能" :disabled="true" style="width: 217px" />
              </el-form-item>
            </bv-row>
          </bv-form>
          <bv-col v-bind="$CONST.col.layout3">
            <file-list v-if="tmplShow" :tmpl-guid="tmplGuid" :re-fresh-flag.sync="refreshFlag" />
          </bv-col>
        </div>
      </bv-scrollbar>
    </bv-col>
  </bv-row>
</template>

<script>
  import {tmplInfoListAll} from '@/api/sharedResource'
  import FileList from "./fileList";

  export default {
    name: 'FileDownload',
    components: {FileList},
    props: {
      treeName: {
        type: String,
        default: ''
      }
    },
    inject: {
      fileSource: {
        default: ''
      }
    },
    data() {
      return {
        filterText: '',
        datas: {},
        treeDatas: null,
        // 维护文件信息
        addNodeShow: false,
        // 文件功能显示
        showDescription: false,
        nodeSelf: '',
        tmplShow: false,
        defaultProps: {
          children: 'list',
          label: 'fileName'
        },
        fileForm: {
          // 系统编号
          sysGuid: '',
          // 文件代码
          fileCode: '',
          // 文件名称
          fileName: '',
          // 权限控制
          roleFlag: '',
          // 权限控制（部门）
          roleDept: '',
          // 权限控制（岗位）
          rolePost: '',
          // 文件功能
          description: '',
          // 父类id
          parentId: '',
          // 节点标志
          fileFlag: ''
        },
        roleFlags: [{
          value: 'N',
          label: '所有人可见',
        }, {
          value: 'Y',
          label: '部分人可见'
        }],
        tmplGuid: '',
        refreshFlag: 0
      }
    },
    watch: {
      filterText(val){
        this.$refs.treeDatas.filter(val);
      }
    },
    created() {
      this.getList()
    },
    methods: {
      // 初期数据取得
      getList() {
        let param={
          fileSource: this.fileSource,
          isAuthority: 'true'
        };
        // 目录信息取得
        tmplInfoListAll(param).then(response => {
          this.datas = response.data;
          let data = this.datas;
          let tree = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].parentId === 'ROOT') {
              let obj = data[i];
              obj.list = [];
              if (obj.roleDept != null) {
                obj.roleDept = obj.roleDept.split(',');
              } else {
                obj.roleDept = [];
              }
              if (obj.rolePost != null) {
                obj.rolePost = obj.rolePost.split(',');
              } else {
                obj.rolePost = [];
              }
              tree.push(obj);
              data.splice(i, 1);
              i--;
            }
          }
          treeList(tree);

          this.treeDatas = [{
            fileName: this.treeName,
            sysGuid: 'ROOT',
            list: tree
          }];

          function treeList(arr) {
            if (data.length !== 0) {
              for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < data.length; j++) {
                  if (data[j].parentId === arr[i].sysGuid) {
                    let obj = data[j];
                    obj.list = [];
                    if (obj.roleDept != null) {
                      obj.roleDept = obj.roleDept.split(',');
                    } else {
                      obj.roleDept = [];
                    }
                    if (obj.rolePost != null) {
                      obj.rolePost = obj.rolePost.split(',');
                    } else {
                      obj.rolePost = [];
                    }
                    arr[i].list.push(obj);
                    data.splice(j, 1);
                    j--
                  }
                }
                treeList(arr[i].list)
              }
            }
          }
        });
      },
      renderContent() {
        let createElement = arguments[0];
        let fileFlag = arguments[1].node.data.fileFlag;

        if (fileFlag === 'Y') {
          return createElement('span', [
            createElement('i', {attrs: {class: 'el-icon-document'}}),
            createElement('span', ""),
            createElement('span', arguments[1].node.label)
          ]);
        } else {
          return createElement('span', [
            createElement('i', {attrs: {class: 'el-icon-tickets'}}),
            createElement('span', ""),
            createElement('span', arguments[1].node.label)
          ]);
        }
      },
      // 树节点点击事件
      nodeClick(data, node, _that) {
        // 将树对象给nodeSelf
        this.nodeSelf = _that;

        // 根节点不显示维护文件信息
        if (node.level === 1) {
          // 维护文件信息
          this.addNodeShow = false;
          // 显示文件一览
          this.tmplShow = false;
          return;
        } else {
          this.addNodeShow = true;
        }

        // 节点为文件时，不显示增加按钮。
        if (data.fileFlag === 'Y') {
          // 显示文件功能
          this.showDescription = true;
          // 显示文件一览
          this.tmplShow = true;
        } else {
          // 不显示文件功能
          this.showDescription = false;
          // 显示文件一览
          this.tmplShow = false;
        }

        // 设置文件维护信息
        let param={
          sysGuid: data.sysGuid,
          fileSource: this.fileSource
        };
        tmplInfoListAll(param).then(ret=>{
          if (ret.data.length === 0) {
            this.$message({
              type: 'error',
              message: '当前目录或文件已被删除。'
            });
            // 维护文件信息
            this.addNodeShow = false;
            // 显示文件一览
            this.tmplShow = false;
            return;
          } else {
            this.fileForm = ret.data[0];
            if (this.fileForm.roleDept != null) {
              this.fileForm.roleDept = this.fileForm.roleDept.split(',');
            } else {
              this.fileForm.roleDept = [];
            }
            if (this.fileForm.rolePost != null) {
              this.fileForm.rolePost = this.fileForm.rolePost.split(',');
            } else {
              this.fileForm.rolePost = [];
            }
            this.tmplGuid = this.fileForm.sysGuid;
          }
        });
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.fileName.indexOf(value) !== -1;
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

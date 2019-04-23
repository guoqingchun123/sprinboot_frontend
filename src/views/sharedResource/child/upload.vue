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
          <bv-col :sm="18" :offset="6">
            <div>
              <bv-button v-if="addNLFile" view="modify" icon="el-icon-document" size="small" @click="addNLFileNode">
                增加下级文件
              </bv-button>
              <bv-button v-if="addSLFile" view="modify" icon="el-icon-document" size="small" @click="addSLFileNode">
                增加平级文件
              </bv-button>
              <bv-button v-if="addNLFolder" view="modify" icon="el-icon-tickets" size="small" @click="addNLFolderNode">
                增加下级文件夹
              </bv-button>
            </div>
          </bv-col>
          <bv-form v-if="addNodeShow" ref="fileForm"
                   v-loading="loading" :model="fileForm" class="area-edit-message" label-width="140px" :rules="rules"
                   label-suffix=":"
          >
            <bv-col>
              <h2>维护文件信息</h2>
            </bv-col>
            <bv-col>
              <el-form-item label="文件代码" prop="fileCode">
                <el-input v-model="fileForm.fileCode" clearable />
              </el-form-item>
            </bv-col>
            <bv-col>
              <el-form-item label="文件名称" prop="fileName">
                <el-input v-model="fileForm.fileName" clearable />
              </el-form-item>
            </bv-col>
            <bv-col>
              <el-form-item v-if="isAuth" label="权限控制" prop="roleFlag">
                <el-select v-model="fileForm.roleFlag" placeholder="请选择" @change="roleFlagChange">
                  <el-option v-for="item in roleFlags" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </bv-col>
            <bv-col>
              <el-form-item v-if="showRole&isAuth" label="权限控制（部门）" prop="roleDept">
                <el-select v-model="fileForm.roleDept" multiple placeholder="请选择">
                  <el-option v-for="item in roleDepts" :key="item.deptId" :label="item.deptName" :value="item.deptId" />
                </el-select>
              </el-form-item>
            </bv-col>
            <bv-col>
              <el-form-item v-if="showRolePost&isAuth" label="权限控制（岗位）" prop="rolePost">
                <el-select v-model="fileForm.rolePost" multiple placeholder="请选择">
                  <el-option v-for="item in rolePosts"
                             :key="item.code"
                             :label="item.code"
                             :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </bv-col>
            <bv-col>
              <el-form-item v-if="showDescription" label="文件功能" prop="description">
                <el-input v-model="fileForm.description" type="textarea" :rows="3" placeholder="请输入文件功能" clearable style="width:217px;" />
              </el-form-item>
            </bv-col>
            <bv-col>
              <bv-button v-if="saveNode" view="add" size="small" @click="saveFileNode">
                保存
              </bv-button>
              <bv-button v-if="deleteNode" view="remove" size="small" @click="deleteFileNode">
                删除
              </bv-button>
              <el-button v-if="addVersion" type="primary" icon="el-icon-upload" size="small" @click="addFileVersion">
                增加新版本
              </el-button>
            </bv-col>
          </bv-form>
          <bv-col v-bind="$CONST.col.layout3">
            <file-list v-if="tmplShow" :tmpl-guid="tmplGuid" :re-fresh-flag.sync="refreshFlag" />
          </bv-col>
        </div>
      </bv-scrollbar>
    </bv-col>

    <bv-dialog title="删除提醒" :visible.sync="deleteVisible" width="30%">
      <span>确定要删除<em class="em">{{ nodeType }}&nbsp;"{{ deleteNodeName }}"&nbsp;</em>吗？</span>
      <span slot="footer" class="dialog-footer">
        <bv-button view="modify" @click="deleteNodeConfirm">确 定</bv-button>
        <bv-button @click="deleteVisible = false">取 消</bv-button>
      </span>
    </bv-dialog>

    <!-- 上传弹框  -->
    <add-version
      :dialog-visible.sync="uploadVisible"
      :sys-guid="fileForm.sysGuid"
      :tree="nodeSelf.tree"
      :add-path="addPath"
      @refreshFlag="changeFlag"
      @dialogVisible="changeDialogVisible"
    />
  </bv-row>
</template>

<script>
  import {tmplInfoListAll, saveInfo, deleteInfo} from '@/api/sharedResource'
  import {fetchDepts} from '@/api/system/depts'
  import FileList from "./fileList";
  import AddVersion from "./addVersion";

  export default {
    name: 'FileUpload',
    components: {AddVersion, FileList},
    props: {
      treeName: {
        type: String,
        default: ''
      },
      isAuth: {
        type: Boolean,
        default: false
      },
      roleFlag: {
        type: String,
        default: ''
      },
      addPath: {
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
        // 增加下级文件
        addNLFile: false,
        // 增加平级文件
        addSLFile: false,
        // 增加下级文件夹
        addNLFolder: false,
        // 保存
        saveNode: false,
        // 删除
        deleteNode: false,
        // 增加新版本
        addVersion: false,
        // 文件功能显示
        showDescription: false,
        // 权限控制显示
        showRole: false,
        // 权限控制（岗位）显示
        showRolePost: false,
        nodeSelf: '',
        //保存是增加下一级还是平级
        saveChange: '',
        // 删除提醒弹窗
        deleteVisible: false,
        // 上传弹框
        uploadVisible: false,
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
        rules: {
          fileCode: [
            {required: true, message: '请输入文件代码', trigger: 'blur'},
            {max: 20, message: '限制为20位以下', trigger: 'blur'}
          ],
          fileName: [
            {required: true, message: '请输入文件名称', trigger: 'blur'},
            {max: 150, message: '限制为150位以下', trigger: 'blur'}
          ],
          roleFlag: [
            {required: true, message: '请选择权限控制', trigger: 'blur'}
          ],
          rolePost: [
            {required: true, message: '请选择权限控制（岗位）', trigger: 'blur'}
          ]
        },
        roleFlags: [{
          value: 'N',
          label: '所有人可见',
        }, {
          value: 'Y',
          label: '部分人可见'
        }],
        // 权限控制（部门）
        roleDepts: [],
        // 权限控制（岗位）
        rolePosts: [],
        tmplGuid: '',
        refreshFlag: 0,
        loading: false
      }
    },
    computed: {
      deleteNodeName() {
        if (this.nodeSelf) {
          return this.nodeSelf.tree.getCurrentNode().fileName;
        } else {
          return ''
        }
      },
      nodeType() {
        if (this.nodeSelf) {
          if (this.nodeSelf.tree.getCurrentNode().fileFlag === 'Y') {
            return '文件'
          } else {
            return '目录'
          }
        } else {
          return ''
        }
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
        let param = {
          fileSource: this.fileSource
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
        // 获取岗级一览
        this.$store.dispatch('app/fetchDicts', 'empPosition').then(data => {
          this.rolePosts = data
        });
        // 获取部门一览
        fetchDepts().then(response => {
          this.roleDepts = response.data;
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
          // 增加下级文件
          this.addNLFile = false;
          // 增加平级文件
          this.addSLFile = false;
          // 增加下级文件夹
          this.addNLFolder = true;
          return;
        } else {
          this.addNodeShow = true;
        }

        // 节点为文件时，不显示增加按钮。
        if (data.fileFlag === 'Y') {
          // 增加下级文件
          this.addNLFile = false;
          // 增加平级文件
          this.addSLFile = true;
          // 增加下级文件夹
          this.addNLFolder = false;
          // 显示文件功能
          this.showDescription = true;
          // 增加新版本
          this.addVersion = true;
          // 显示文件一览
          this.tmplShow = true;
        } else {
          // 节点为文件夹时，显示增加按钮。
          // 增加下级文件
          this.addNLFile = true;
          // 增加平级文件
          this.addSLFile = false;
          // 增加下级文件夹
          this.addNLFolder = true;
          // 不显示文件功能
          this.showDescription = false;
          // 增加新版本
          this.addVersion = false;
          // 显示文件一览
          this.tmplShow = false;
        }

        // 保存
        this.saveNode = true;
        // 删除
        this.deleteNode = true;

        // 去掉校验
        if (this.$refs.fileForm) {
          this.$refs.fileForm.clearValidate()
        }

        this.saveChange = '';

        // 设置文件维护信息
        let param = {
          sysGuid: data.sysGuid,
          fileSource: this.fileSource
        };
        tmplInfoListAll(param).then(ret => {
          if (ret.data.length === 0) {
            this.$message({
              type: 'error',
              message: '当前目录或文件已被删除。'
            });
            // 维护文件信息
            this.addNodeShow = false;
            // 显示文件一览
            this.tmplShow = false;
            // 增加下级文件
            this.addNLFile = false;
            // 增加平级文件
            this.addSLFile = false;
            // 增加下级文件夹
            this.addNLFolder = true;
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
            this.roleFlagChange(this.fileForm.roleFlag);
          }
        });
      },
      // 保存
      saveFileNode() {
        this.$refs.fileForm.validate(valid => {
          if (valid) {
            this.loading = true;
            if (this.fileForm.fileFlag === "N"
              && this.fileForm.roleFlag === "Y"
              && this.fileForm.roleDept[0] == null) {
              this.$message({
                type: 'error',
                message: '请选择权限控制（部门）！'
              });
              return false;
            }

            // 保存信息传值
            let data = {
              fileForm: {
                // 系统编号
                sysGuid: this.fileForm.sysGuid,
                // 文件代码
                fileCode: this.fileForm.fileCode,
                // 文件名称
                fileName: this.fileForm.fileName,
                // 权限控制
                roleFlag: this.fileForm.roleFlag,
                // 权限控制（部门）
                roleDept: this.fileForm.roleDept,
                // 权限控制（岗位）
                rolePost: this.fileForm.rolePost,
                // 文件功能
                description: this.fileForm.description,
                // 父类id
                parentId: this.fileForm.parentId,
                // 节点标志
                fileFlag: this.fileForm.fileFlag,
                // 文件来源
                fileSource: this.fileSource
              }
            };
            data.fileForm.roleDept = data.fileForm.roleDept.toString();
            data.fileForm.rolePost = data.fileForm.rolePost.toString();

            // 调用保存接口
            saveInfo(data).then(ret => {
              this.$message({
                type: ret.data.level,
                message: ret.data.retMsg
              });

              if (ret.data.retCode === '0000') {
                if (ret.data.sysGuid) {
                  this.fileForm.sysGuid = ret.data.sysGuid;
                }

                if (this.saveChange === 'next') {
                  this.nodeSelf.tree.append(this.fileForm, this.nodeSelf.tree.getCurrentNode());
                  if (this.nodeSelf.tree.currentNode) {
                    this.nodeSelf.tree.currentNode.expanded = true;
                  }
                } else if (this.saveChange === 'same') {
                  if (this.nodeSelf.tree.currentNode.$parent) {
                    this.nodeSelf.tree.append(this.fileForm, this.nodeSelf.tree.currentNode.$parent.node);
                  } else {
                    this.nodeSelf.tree.append(this.fileForm, this.nodeSelf.tree.currentNode.parent);
                  }
                }
                this.saveChange = '';
                // 刷新树位置
                this.nodeSelf.tree.setCurrentKey(this.fileForm.sysGuid);
                let node = this.nodeSelf.tree.store.getNode(this.fileForm.sysGuid);
                //this.nodeSelf.tree.store.currentNodeKey = this.fileForm.sysGuid;
                this.$refs.treeDatas.currentNode = node;
                node.data.fileName = this.fileForm.fileName;
                this.tmplGuid = this.fileForm.sysGuid;

                // 删除
                this.deleteNode = true;

                // 节点为文件时，不显示增加按钮。
                if (this.fileForm.fileFlag === 'Y') {
                  // 增加下级文件
                  this.addNLFile = false;
                  // 增加平级文件
                  this.addSLFile = true;
                  // 增加下级文件夹
                  this.addNLFolder = false;
                  // 显示文件一览
                  this.tmplShow = true;
                  this.addVersion = true;
                } else {
                  // 节点为文件夹时，显示增加按钮。
                  // 增加下级文件
                  this.addNLFile = true;
                  // 增加平级文件
                  this.addSLFile = false;
                  // 增加下级文件夹
                  this.addNLFolder = true;
                  // 不显示文件一览
                  this.tmplShow = false;
                  this.addVersion = false;
                }

                // 去掉校验
                if (this.$refs.fileForm) {
                  this.$refs.fileForm.clearValidate()
                }
              }
              setTimeout(() => {
                this.loading = false
              }, 250);
            }).catch(()=>{
              this.$message({
                type: 'error',
                message: '保存失败'
              });
              setTimeout(() => {
                this.loading = false
              }, 250);
            });
          } else {
            return false;
          }
        });
      },
      // 增加下级文件
      addNLFileNode() {
        this.com('Y', 'next', true, false);
        // 父类id
        this.fileForm.parentId = this.nodeSelf.tree.getCurrentNode().sysGuid;
      },
      // 增加平级文件
      addSLFileNode() {
        this.com('Y', 'same', true, false);
        // 父类id
        this.fileForm.parentId = this.nodeSelf.tree.getCurrentNode().parentId;
      },
      // 增加下级文件夹
      addNLFolderNode() {
        this.com('N', 'next', false, false);
        // 父类id
        this.fileForm.parentId = this.nodeSelf.tree.getCurrentNode().sysGuid;

        // 根节点时
        if (!this.addNodeShow) {
          // 显示维护文件信息
          this.addNodeShow = true;
          // 保存
          this.saveNode = true;
          // 父类id
          this.fileForm.parentId = 'ROOT';
        }
      },
      // 增加下级&平级内部共通
      com(fileFlag, saveChange, form, button) {
        this.fileForm = {
          // 系统编号
          sysGuid: '',
          // 文件代码
          fileCode: '',
          // 文件名称
          fileName: '',
          // 权限控制
          roleFlag: this.roleFlag,
          // 权限控制（部门）
          roleDept: '',
          // 权限控制（岗位）
          rolePost: '',
          // 文件功能
          description: '',
          // 父类id
          parentId: '',
          // 节点标志
          fileFlag: fileFlag
        };
        // 去掉校验
        if (this.$refs.fileForm) {
          this.$refs.fileForm.clearValidate()
        }
        this.saveChange = saveChange;
        // 显示文件功能
        this.showDescription = form;
        // 删除
        this.deleteNode = button;
        // 增加新版本
        this.addVersion = false;
        this.showRole = button;
        this.showRolePost = button;

        // 不显示文件一览
        this.tmplShow = false;
      },
      // 权限控制
      roleFlagChange() {
        // 部分人可见
        if (this.fileForm.roleFlag === 'Y') {
          this.showRole = true;

          if (this.fileForm.fileFlag === 'Y') {
            this.showRolePost = true;
          } else {
            this.showRolePost = false;
          }
        } else {
          // 所有人可见
          this.showRole = false;
          this.showRolePost = false;
          this.fileForm.roleDept = [];
          this.fileForm.rolePost = [];
        }
      },
      // 删除
      deleteFileNode() {
        // 显示删除确认弹窗
        this.deleteVisible = true
      },
      // 删除框:确认
      deleteNodeConfirm() {
        // 弹框关闭
        this.deleteVisible = false;
        // 不显示维护文件信息
        this.addNodeShow = false;

        // 不显示文件一览
        this.tmplShow = false;
        // 调用删除接口
        let data = {
          sysGuid: this.fileForm.sysGuid
        };
        deleteInfo(data).then(ret => {
          this.$message({
            type: ret.data.level,
            message: ret.data.retMsg
          });

          if (ret.data.retCode === '0000') {
            // 移除树节点
            this.nodeSelf.tree.remove(this.nodeSelf.tree.getCurrentNode());
            // 增加下级文件
            this.addNLFile = false;
            // 增加平级文件
            this.addSLFile = false;
            // 增加下级文件夹
            this.addNLFolder = false;
          }
        });
      },
      addFileVersion() {
        // 显示添加版本弹窗
        this.uploadVisible = true;
      },
      changeFlag(value) {
        this.refreshFlag = this.refreshFlag + value;
      },
      changeDialogVisible(value) {
        this.uploadVisible = value;
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.fileName.indexOf(value) !== -1;
      }
    }
  }
</script>
<style>
  .em {
    color: #409EFF;
    font-style: normal;
  }

  #bs1 .el-scrollbar__wrap {
    margin-bottom: -6px !important;
  }

  #bs2 .el-scrollbar__wrap {
    margin-bottom: -2px !important;
  }
</style>

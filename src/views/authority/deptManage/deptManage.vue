<template>
  <el-row type="flex" class="fit-scroll">
    <el-col v-bind="$CONST.col.layout1">
      <bv-scrollbar>
        <el-tree :data="items" check-strictly node-key="deptId" show-checkbox :props="defaultProps" :default-expand-all="true" :expand-on-click-node="false" accordion @node-click="handleNodeClick" />
      </bv-scrollbar>
    </el-col>
    <el-col>
      <div align="center">
        <el-form v-if="addNodeShow" ref="deptForm" :model="deptForm" class="dept-edit-message" label-width="100px" :rules="rules">
          维护部门信息
          <el-row :gutter="$CONST.row.gutter">
            <el-col v-bind="$CONST.col.layout3">
              <div style="float: right;margin-bottom:10px;">
                <el-button v-if="mergeDeptShow" type="primary" icon="el-icon-plus" size="small" @click="mergeDept">合并</el-button>
                <el-button v-if="splitDeptShow" type="success" icon="el-icon-goods" size="small" @click="splitDept">拆分</el-button>
                <el-button v-if="addNextDeptShow" type="primary" icon="el-icon-plus" size="small" @click="addNextLevelDept">增加下级区域</el-button>
                <el-button v-if="addLevelDeptShow" type="success" icon="el-icon-goods" size="small" @click="addSameLevelDept">增加平级区域</el-button>
              </div>
            </el-col>
            <el-col v-bind="$CONST.col.layout3">
              <el-form-item label="部门名称:" prop="deptName">
                <el-input v-model="deptForm.deptName" clearable />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout3">
              <el-form-item label="负责人:" prop="contactName">
                <el-select v-model="deptForm.contactName" placeholder="请选择" style="float: left;" @change="changeDeptFormContactPhone">
                  <el-option v-for="item in principalSelect" :key="item.empId" :label="item.empName" :value="item.empName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout3">
              <el-form-item label="手机号码:">
                <el-input v-model="deptForm.contactPhone" clearable />
              </el-form-item>
              <el-button v-if="saveDept" type="primary" icon="el-icon-goods" size="small" @click="saveDeptNode">保存</el-button>
              <el-button v-if="deleteDept" type="warning" icon="el-icon-goods" size="small" @click="deleteDeptNode">删除</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-col>
    <el-dialog
      title="删除提醒"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>确定要删除&nbsp;"{{ deleteNodeName }}"&nbsp;部门吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteDeptConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="拆分部门"
      :visible.sync="dialogSplitVisible"
      width="30%"
    >
      <bv-form ref="splitDeptForm.splitEntity" :model="splitDeptForm.splitEntity" class="dept-edit-message1" label-width="130px" :rules="mergeDeptRules">
        <el-row :gutter="$CONST.row.gutter">
          <el-col v-bind="$CONST.col.layout3">
            <el-form-item label="新部门名称:" prop="deptName">
              <el-input v-model="splitDeptForm.splitEntity.deptName" clearable />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="负责人:" prop="contactName">
              <el-select v-model="splitDeptForm.splitEntity.contactName" placeholder="请选择" @change="changeSplitDeptFormContactPhone">
                <el-option v-for="item in principalSelect" :key="item.empId" :label="item.empName" :value="item.empName" />
              </el-select>
            </el-form-item>
            <el-form-item label="手机号码:">
              <el-input v-model="splitDeptForm.splitEntity.contactPhone" clearable />
            </el-form-item>
            <el-form-item label="父级部门:" prop="parentDept">
              <el-select v-model="splitDeptForm.splitEntity.parentDept" placeholder="请选择">
                <el-option v-for="item in mergeDeptForm.parentDeptSelect" :key="item.deptId" :label="item.deptName" :value="item.deptId" />
              </el-select>
            </el-form-item>
            <el-form-item label="新部门员工:" prop="empIds">
              <el-select v-model="splitDeptForm.empIds" multiple placeholder="请选择">
                <el-option v-for="item in splitDeptForm.empList" :key="item.empId" :label="item.empName" :value="item.empId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </bv-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSplitVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSplitConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="合并部门"
      :visible.sync="dialogMergeVisible"
      width="30%"
    >
      <bv-form ref="mergeDeptForm.entity" :model="mergeDeptForm.entity" class="dept-edit-message1" label-width="130px" :rules="mergeDeptRules">
        <el-row :gutter="$CONST.row.gutter">
          <el-col v-bind="$CONST.col.layout3">
            <el-form-item label="合并后部门名称:" prop="deptName">
              <el-input v-model="mergeDeptForm.entity.deptName" clearable />
            </el-form-item>
            <el-form-item label="负责人:" prop="contactName">
              <el-select v-model="mergeDeptForm.entity.contactName" placeholder="请选择" @change="changeMergeDeptFormContactPhone">
                <el-option v-for="item in principalSelect" :key="item.empId" :label="item.empName" :value="item.empName" />
              </el-select>
            </el-form-item>
            <el-form-item label="手机号码:">
              <el-input v-model="mergeDeptForm.entity.contactPhone" clearable />
            </el-form-item>
            <el-form-item label="父级部门:" prop="parentDept">
              <el-select v-model="mergeDeptForm.entity.parentDept" placeholder="请选择">
                <el-option v-for="item in mergeDeptForm.parentDeptSelect" :key="item.deptId" :label="item.deptName" :value="item.deptId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </bv-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogMergeVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMergeConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
  import BvScrollbar from '@/components/Scrollbar'
  import {fetchDepts, modifyDept,fetchPrincipal, deleteDept, mergeDept, splitDept, fetchEmpByDeptId} from '@/api/system/depts'

  export default {
    name: 'ListDeptManage',
    components: {
      BvScrollbar
    },
    data() {
      return {
        items: null,
        addNodeShow: false,
        addNextDept: false,
        addLevelDept: false,
        saveDept: false,
        deleteDept: false,
        nodeSelf: '',
        //保存是增加下一级还是平级
        saveChange: '',
        //删除提醒弹窗
        dialogVisible: false,
        //合并弹窗
        dialogMergeVisible: false,
        //拆分弹窗
        dialogSplitVisible: false,
        defaultProps: {
          children: 'children',
          label: 'deptName'
        },
        deptForm: {
          deptId: '',
          deptName: '',
          contactName: '',
          contactPhone: '',
          parentDept: '',
          parentId: '',
          deptLevel: ''
        },
        rules: {
          deptName: [
            {required: true, message: '请输入部门名称', trigger: 'blur'}
          ],
          contactName: [
            {required: true, message: '请输入负责人', trigger: 'blur'}
          ]
        },
        principalSelect:[],
        //合并弹窗form
        mergeDeptForm: {
          mergeAllIds: '',
          entityStr: '',
          entity: {},
          mergeIds: [],
          parentDeptSelect: [],


        },
        entity: {
          deptName: '',
          contactName: '',
          contactPhone: '',
          parentDept: ''

        },
        mergeDeptRules: {
          deptName: [
            {required: true, message: '请输入部门名称', trigger: 'blur'},
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
          contactName: [
            {required: true, message: '请选择部门负责人', trigger: 'blur'}
          ],
          parentDept: [
            {required: true, message: '请选择父级部门', trigger: 'blur'}
          ]
        },
        splitDeptForm: {
          splitEntity: {},
          splitEntityStr: '',
          empIdsStr: '',
          empList: [],
          empIds: []
        },
        splitEntity: {
          deptName: '',
          deptId: '',
          contactName: '',
          contactPhone: '',
          parentDept: ''
        }
      }
    },
    computed: {
      deleteNodeName() {
        return this.deptForm.deptName;
      },
      mergeDeptShow() {
        return this.nodeSelf.tree.getCheckedNodes().length > 1
      },
      splitDeptShow() {
        return this.nodeSelf.tree.getCheckedNodes().length == 1
      },
      addNextDeptShow() {
        return this.nodeSelf.tree.getCheckedNodes().length <= 1
      },
      addLevelDeptShow() {
        return this.nodeSelf.tree.getCheckedNodes().length <= 1
      }
    },
    created() {
      this.getList();
      fetchPrincipal().then(response=>{
        this.principalSelect= response.data;
      });
    },
    methods: {
      changeDeptFormContactPhone(name){
        let principalList = this.principalSelect;
        for (let i = 0; i < principalList.length; i++){
          if (name==principalList[i].empName){
            console.log(principalList[i].phoneNo);
            this.deptForm.contactPhone=principalList[i].phoneNo;
          }
        }
      },
      changeSplitDeptFormContactPhone(name){
        let principalList = this.principalSelect;
        for (let i = 0; i < principalList.length; i++){
          if (name==principalList[i].empName){
            console.log(principalList[i].phoneNo);
            this.splitDeptForm.splitEntity.contactPhone=principalList[i].phoneNo;
          }
        }
      },
      changeMergeDeptFormContactPhone(name){
        let principalList = this.principalSelect;
        for (let i = 0; i < principalList.length; i++){
          if (name==principalList[i].empName){
            console.log(principalList[i].phoneNo);
            this.mergeDeptForm.entity.contactPhone=principalList[i].phoneNo;
          }
        }
      },
      getList() {
        this.mergeDeptForm.parentDeptSelect=[];
        fetchDepts().then(response => {
          // this.items = response.data
          let data = response.data;
          let tree = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].deptId == 'ROOT') {
              data[i].children = []
              tree.push(data[i])
              //将数据存入父级部门表
              this.mergeDeptForm.parentDeptSelect.push(data[i])
            }
          }
          for (let i = 0; i < data.length; i++) {
            if (data[i].parentDept == 'ROOT') {
              let obj = data[i];
              obj.children = [];
              tree[0].children.push(obj);

              this.mergeDeptForm.parentDeptSelect.push(obj);
              // data.splice(i,1);
              // i--
            }
          }
          menuList(tree[0].children);
          this.items = tree;

          function menuList(arr) {
            if (data.length != 0) {
              for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < data.length; j++) {
                  if (data[j].parentDept == arr[i].deptId) {
                    let obj = data[j];
                    obj.children = [];
                    arr[i].children.push(obj);
                    // data.splice(j,1);
                    // j--
                  }
                }
                menuList(arr[i].children)
              }
            }
          }
        })
        //在这里查出来所有的 负责人

      },
      handleNodeClick(data, n, _that) {
        this.addNodeShow = true
        if (data.$treeNodeId == 1) {
          this.addLevelDept = false
          this.deleteDept = false
          this.addNextDept = false
        } else {
          this.addLevelDept = true
          this.deleteDept = true
          this.addNextDept = true
        }
        this.addNextDept = true
        this.saveDept = true
        //去掉校验
        if (this.$refs.deptForm) {
          this.$refs.deptForm.clearValidate()
        }
        this.deptForm = data
        //将树对象给nodeSelf
        this.nodeSelf = _that
      },
      saveDeptNode() {
        this.$refs.deptForm.validate(valid => {
          if (valid) {
            this.deptForm.code = this.deptForm.areaId
            this.deptForm.name = this.deptForm.areaName
            if (this.saveChange === 'next') {

              this.nodeSelf.tree.append(this.deptForm, this.nodeSelf.tree.getCurrentNode())

              modifyDept(this.deptForm).then(response => {
                this.$message({
                  message: response.data.message,
                  type: response.data.flag
                });

                //刷新页面
                this.getList();
                //隐藏div
                this.addNodeShow = false;
              })


            } else if (this.saveChange === 'same') {

              this.nodeSelf.tree.insertAfter(this.deptForm, this.nodeSelf.tree.getCurrentNode())

              modifyDept(this.deptForm).then(response => {
                this.$message({
                  message: response.data.message,
                  type: response.data.flag
                })

                //刷新页面
                this.getList();
                //隐藏div
                this.addNodeShow = false;
              })

            } else {

              modifyDept(this.deptForm).then(response => {
                this.$message({
                  message: response.data.message,
                  type:  response.data.flag
                })

                //刷新页面
                this.getList();
                //隐藏div
                this.addNodeShow = false;
              })

              return false
            }
            this.saveChange = ''
          } else {
            return false
          }
        })

      },
      deleteDeptNode() {
        this.dialogVisible = true
      },
      //添加下一级菜单
      addNextLevelDept() {
        var ParentId = this.deptForm.deptId;

        var deptLevel = this.deptForm.deptLevel;
        console.log(deptLevel);
        if (deptLevel > 1) {
          this.$message({
            message: '不能再添加下级部门',
            type:  'warning'
          })
          return;
        }


        this.deptForm = {}
        this.deptForm.parentDept = ParentId;
        this.deptForm.deptLevel = deptLevel + 1;
        this.saveChange = 'next'
      },
      addSameLevelDept() {

        var ParentId = this.deptForm.parentDept;
        if (ParentId == null) {
          this.$message({
            message: '不能添加跟最高级部门平级',
            type:  'warning'
          })
          return;
        }
        console.log(ParentId)
        var branchLevel = this.deptForm.deptLevel;
        this.deptForm = {}
        this.deptForm.parentDept = ParentId;
        this.deptForm.deptLevel = branchLevel;
        this.saveChange = 'same'
      },
      deleteDeptConfirm() {
        this.nodeSelf.tree.remove(this.nodeSelf.tree.getCurrentNode())
        this.dialogVisible = false
        deleteDept(this.deptForm.deptId).then(response => {
          if (response.data) {
            this.$message({
              message: response.data ? '删除成功！' : '删除失败！',
              type: response.data ? 'success' : 'error'
            })
          }})
      },
      mergeDept() {
        this.dialogMergeVisible = true
        console.log("合并部门")
      },
      splitDept() {
        this.dialogSplitVisible = true
        console.log("拆分部门")
        //在这里就开始 查询
        let checkedId = this.nodeSelf.tree.getCheckedNodes();
        this.splitDeptForm.splitEntity.deptId = checkedId[0].deptId
        this.splitDeptForm.empList = [];
        fetchEmpByDeptId(this.splitDeptForm.splitEntity).then(response => {
          this.splitDeptForm.empList = response.data;
        });
      },
      saveMergeConfirm() {
        this.dialogMergeVisible = false
        console.log("确定合并部门")
        this.mergeDeptForm.parentDeptSelect = [];
        var deptLists = this.nodeSelf.tree.getCheckedNodes()
        if (deptLists != null) {
          for (var i = 0; i < deptLists.length; i++) {
            this.mergeDeptForm.mergeIds.push(deptLists[i].deptId)
          }
        }
        this.mergeDeptForm.mergeAllIds = JSON.stringify(this.mergeDeptForm.mergeIds)
        this.mergeDeptForm.entityStr = JSON.stringify(this.mergeDeptForm.entity);
        this.mergeDeptForm.mergeIds = [];
        mergeDept(this.mergeDeptForm).then(response => {
          this.$message({
            message: response.data.message,
            type: response.data.flag
          })
          this.getList();
        })
      },
      saveSplitConfirm() {
        this.dialogSplitVisible = false
        console.log("确定拆分部门")
        //删除t属性 要不后端json转出来数据
         delete this.splitDeptForm.splitEntity.t
        this.splitDeptForm.splitEntityStr = JSON.stringify(this.splitDeptForm.splitEntity);
        this.splitDeptForm.empIdsStr = JSON.stringify(this.splitDeptForm.empIds);
        this.splitDeptForm.splitEntity = {};
        this.splitDeptForm.empIds = [];
        this.splitDeptForm.empList = [];

        splitDept(this.splitDeptForm).then(response => {
          this.$message({
            message: response.data? "拆分成功！" : "拆分失败！",
            type: response.data? 'success' : 'error'
          });
          this.getList();
        })
      }
    }
  }
</script>

<style>
  .operator-header {
    position: absolute;
    /*margin-top: 10px;*/
    right: 2%;
  }

  .dept-edit-message {
    width: 70%;
    text-align: center;
  }

  .dept-edit-message1 {
    width: 80%;
    text-align: center;
  }
</style>

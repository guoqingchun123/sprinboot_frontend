<template>
  <bv-row type="flex" class="fit-scroll">
    <bv-col v-bind="$CONST.col.layout1">
      <bv-scrollbar>
        <el-tree :data="items" node-key="branchId" :props="defaultProps" class="expand-tree" :default-expand-all="true" :expand-on-click-node="false" accordion @node-click="handleNodeClick" />
      </bv-scrollbar>
    </bv-col>
    <bv-col>
      <div align="center">
        <el-form v-if="addNodeShow" ref="areaForm" :model="areaForm" class="area-edit-message" label-width="100px" :rules="rules">
          维护区域信息
          <el-row :gutter="$CONST.row.gutter">
            <el-col v-bind="$CONST.col.layout3">
              <div style="float: right;margin-bottom:10px;">
                <el-button v-if="addNextNode" type="primary" icon="el-icon-plus" size="small" @click="addNextLevelNode">增加下级区域</el-button>
                <el-button v-if="addLevelNode" type="success" icon="el-icon-goods" size="small" @click="addSameLevelNode">增加平级区域</el-button>
              </div>
            </el-col>
            <el-col v-bind="$CONST.col.layout3">
              <el-form-item label="区域编号:" prop="branchId">
                <el-input v-model="areaForm.branchId" clearable />
              </el-form-item>
              <el-form-item label="区域名称:" prop="branchName">
                <el-input v-model="areaForm.branchName" clearable />
              </el-form-item>
              <el-form-item label="作息时间:" prop="dailySchedule">
                <!--<el-input v-model="areaForm.dailySchedule" clearable />-->
                <el-time-picker
                  v-model="areaForm.dailySchedule"
                  is-range
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                />
              </el-form-item>
              <el-form-item label="显示顺序:" prop="showOrder">
                <el-input v-model="areaForm.showOrder" clearable />
              </el-form-item>
              <el-button v-if="saveNode" type="primary" icon="el-icon-goods" size="small" @click="saveAreaNode">保存</el-button>
              <el-button v-if="deleteNode" type="warning" icon="el-icon-goods" size="small" @click="deleteAreaNode">删除</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </bv-col>
    <el-dialog
      title="删除提醒"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>确定要删除&nbsp;"{{ deleteNodeName }}"&nbsp;节点吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteNodeConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </bv-row>
</template>

<script>
  import BvScrollbar from '@/components/Scrollbar'
  import { fetchListAreas,modifyAreaNode,deleteBranch } from '@/api/employee/areas'

  export default {
    name: 'ListAreaManage',
    components: {
      BvScrollbar
    },
    data() {
      return {
        items:null,
        addNodeShow: false,
        addNextNode: false,
        addLevelNode: false,
        saveNode: false,
        deleteNode: false,
        nodeSelf: '',
        //保存是增加下一级还是平级
        saveChange:'',
        //删除提醒弹窗
        dialogVisible:false,
        defaultProps: {
          children: 'children',
          label: 'branchName'
        },
        areaForm: {
          branchId: '',
          branchName: '',
          dailySchedule: '',
          showOrder: '',
          parentBranch:'',
          branchLevel:''
        },
        rules:{
          branchId: [
            {required: true,message: '请输入区域编号',trigger: 'blur'},
            { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' }
          ],
          branchName: [
            {required: true,message: '请输入区域名称',trigger: 'blur'},
            { min: 1, max: 90, message: '长度在 1 到 90 个字符', trigger: 'blur' }
          ],
          dailySchedule: [
            {required: true,message: '请输入作息时间',trigger: 'blur'}
          ],
          showOrder: [
            {required: true,message: '请输入显示顺序',trigger: 'blur'}
          ]
        }
      }
    },
    computed:{
      deleteNodeName(){

          return this.areaForm.branchName

      },

    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        fetchListAreas().then(response => {
          let data = response.data;
          let tree = [];
          for(let i=0;i<data.length;i++){
            if(data[i].parentBranch == 'ROOT'){

              let obj = data[i];

              let jsonStr = obj.dailySchedule;
              obj.dailySchedule= JSON.parse(jsonStr);

              obj.children = [];
              tree.push(obj);
              // data.splice(i,1);
              // i--
            }
          }
          menuList(tree);
          this.items = tree;
          function menuList(arr){
            if(data.length !=0){
              for(let i=0; i<arr.length;i++){
                for(let j=0;j<data.length;j++){
                  if(data[j].parentBranch == arr[i].branchId){
                    let obj = data[j];


                    let jsonStr = obj.dailySchedule;
                    obj.dailySchedule= JSON.parse(jsonStr);


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
      },
      handleNodeClick(data,n,_that) {
        this.addNodeShow = true
        if(data.$treeNodeId==1){
          this.addLevelNode = false
          this.deleteNode = false
        }else{
          this.addLevelNode = true
          this.deleteNode = true
        }
        this.addNextNode = true
        this.saveNode = true
        //去掉校验
        if(this.$refs.areaForm){
          this.$refs.areaForm.clearValidate()
        }
        this.areaForm = data
        //将树对象给nodeSelf
        this.nodeSelf = _that
      },
      saveAreaNode() {
        this.$refs.areaForm.validate(valid=>{
          if(valid){
            this.areaForm.code = this.areaForm.areaId
            this.areaForm.name = this.areaForm.areaName

            var schedule = this.areaForm.dailySchedule;
            var jsonStr =  JSON.stringify(schedule);
            this.areaForm.dailySchedule=jsonStr;

            if(this.saveChange === 'next'){

              this.nodeSelf.tree.append(this.areaForm, this.nodeSelf.tree.getCurrentNode());
              modifyAreaNode(this.areaForm).then(response =>{
                this.$message({
                  message: response.data.message,
                  type:  response.data.flag
                })

               //刷新页面
              this.getList();
              //隐藏div
               this.addNodeShow = false;
             });




            }else if(this.saveChange === 'same'){
              this.nodeSelf.tree.insertAfter(this.areaForm, this.nodeSelf.tree.getCurrentNode());
              //获取到上级部门id
              modifyAreaNode(this.areaForm).then(response =>{
                this.$message({
                  message: response.data.message,
                  type:  response.data.flag
                })
                //刷新页面
                this.getList();
                //隐藏div
                this.addNodeShow = false;
              });

            }else{
              modifyAreaNode(this.areaForm).then(response =>{
                this.$message({
                  message: response.data.message,
                  type:  response.data.flag
                })
                //刷新页面
                this.getList();
                //隐藏div
                this.addNodeShow = false;
              });
              return false

            }

            this.saveChange = ''
          }else{
            return false
          }
        })

      },
      deleteAreaNode() {
        this.dialogVisible = true;

      },
      //添加下一级菜单
      addNextLevelNode() {
        var ParentId = this.areaForm.branchId;
        var branchLevel = this.areaForm.branchLevel;

        this.areaForm = {}
        this.areaForm.parentBranch= ParentId;
        this.areaForm.branchLevel=branchLevel+1;
        this.saveChange = 'next'
      },
      addSameLevelNode() {
        var ParentId = this.areaForm.parentBranch;
        var branchLevel = this.areaForm.branchLevel;

        this.areaForm = {}
        console.log(ParentId);
        this.areaForm.parentBranch= ParentId;
        this.areaForm.branchLevel=branchLevel;
        this.saveChange = 'same'
      },
      deleteNodeConfirm(){
        this.nodeSelf.tree.remove(this.nodeSelf.tree.getCurrentNode())
        this.dialogVisible = false;
        deleteBranch(this.areaForm.branchId).then(response=>{

          this.$message({
            message: response.data?'删除成功':'删除失败',
            type: response.data?'success':'error'
          })

          this.addNodeShow = false;
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
  .area-edit-message {
    width: 70%;
    text-align: center;
  }
  .el-range-editor.el-input__inner{
    width: 100% !important;
  }
</style>

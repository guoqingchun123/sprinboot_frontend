<template>
  <div class="app-container">
  <el-input
    placeholder="输入关键字进行过滤"
    v-model="filterText"
    style="width:16%;float: left;position: fixed ">
  </el-input>
<el-tree
 class="filter-tree"
  :data="treeData"
  :props="defaultProps"
  node-key="id"
  default-expand-all
  :expand-on-click-node="false"
  :filter-node-method="filterNode"
  :render-content="renderContent"
  ref="tree2"
 @node-click="handleNodeClick"
  style="width:15%;float:left;margin-top: 50px">
</el-tree>

<el-form ref="form" :model="form" label-width="120px" :rules="rules"
         style="width:60% ;float:left;margin-top: 50px;margin-left: 100px;border:1px solid #dcdfe6;padding-top: 10px">
  <el-form-item label="行政区划代码"  prop="divisionCode">
    <el-input v-model="form.divisionCode"  :disabled="disabledCode"></el-input>
  </el-form-item>
  <el-form-item label="行政区划名称"  prop="divisionName">
    <el-input v-model="form.divisionName"></el-input>
  </el-form-item>

  <el-form-item label="行政区划级别" prop="divisionLevel">
    <el-select v-model="form.divisionLevel" placeholder="请选择活动区域">
      <el-option label="省" value="1"></el-option>
      <el-option label="市" value="2"></el-option>
      <el-option label="区" value="3"></el-option>
      <el-option label="县" value="4"></el-option>
      <el-option label="街道" value="5"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="备注">
    <el-input type="textarea" v-model="form.remark"></el-input>
  </el-form-item>

  <el-form-item>
    <el-button type="primary" @click="onSubmit('form')" :disabled="disabled" icon="el-icon-edit">保存</el-button>
    <el-button type="primary" @click="remove" icon="el-icon-delete">删除</el-button>

  </el-form-item>
</el-form>
</div>
</template>
<script>
  import { queryDepts,saveOrUpdateDept,deleteDept } from '@/api/dept/dept'

  export default {

    data() {
      return {
        visible2: false,
        filterText: '',
        disabled:false,
        disabledCode:true,
        form: {
          divisionCode: '',
          divisionName: '',
          divisionLevel: '',
          parentCode: '',
          remark: ''
                },
        rules: {
          divisionCode: [
            {required: true, message: '请输入行政区划代码', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          divisionName: [
            {required: true, message: '请输入行政区划名称', trigger: 'blur'}
            ],
          divisionLevel: [
            {required: true, message: '请选择行政区划级别', trigger: 'change'}
          ]
        },
        treeData:null,
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    created:function () {
        this.initdata();
    },
    methods: {
      append(data) {
        const newChild = {
          id: null,
          label: '新节点',
          divisionLevel:'',
          parentCode:data.id,
          remark:'',
          children: []
        };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let divisionCode = this.form.divisionCode;
          deleteDept({divisionCode:divisionCode}).then(response => {
            this.initdata();
          });
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.form.divisionCode = '';
          this.form.divisionName = '';
          this.form.divisionLevel = '';
          this.form.parentCode = '';
          this.form.remark = '';
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },

      renderContent(h, { node, data, store }) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px;">
            <span>
              <span>{node.label}</span>
            </span>
            <span>
              <el-button style="font-size: 12px;" type="text" on-click={ () => this.append(data) }>➕</el-button>
            </span>
          </span>);
      },

     filterNode(value, data) {
             if (!value) return true;
             return data.label.indexOf(value) !== -1;
            },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let divisionCode = this.form.divisionCode;
          let divisionName = this.form.divisionName;
          let divisionLevel = this.form.divisionLevel;
          let parentCode = this.form.parentCode;
          let remark = this.form.remark;
          saveOrUpdateDept({
            divisionCode:divisionCode,
            divisionName:divisionName,
            divisionLevel:divisionLevel,
            parentCode:parentCode,
            remark:remark
          }).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.disabled=true;
            this.initdata();
          });
        } else {
          return false;
        }
      });


    },
      initdata(){
        queryDepts().then(response => {
          this.$nextTick(function () {
            this.treeData = response.data;
          })
        })
      },
      handleNodeClick(data) {
        // this.clickId = data.id
        this.form.divisionCode = data.id;
        if(data.label != '新节点'){
          this.form.divisionName = data.label.substring(0,data.label.indexOf("["));
          this.disabledCode=true;
        }else{
          this.form.divisionName = '';
          this.disabledCode=false;
        }
        this.form.divisionLevel = data.divisionLevel;
        this.form.parentCode = data.parentCode;
        this.form.remark = data.remark;
        this.disabled = false;
      }
    },
  watch: {
          filterText(val) {
            this.$refs.tree2.filter(val);
          }
        },
  };
</script>

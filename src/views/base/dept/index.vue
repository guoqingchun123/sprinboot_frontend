<template>
  <div class="app-container">
  <el-input
    placeholder="输入关键字进行过滤"
    v-model="filterText"
    style="width:16%;float: left;position: fixed ">
  </el-input>
<el-tree
 class="filter-tree"
  :data="data4"
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

<el-form ref="form" :model="form" label-width="100px"
         style="width:70% ;float:left;margin-top: 50px;margin-left: 50px;border:1px solid #dcdfe6;padding-top: 10px">
  <el-form-item label="行政区划代码">
    <el-input v-model="form.divisionCode"></el-input>
  </el-form-item>
  <el-form-item label="行政区划名称">
    <el-input v-model="form.divisionName"></el-input>
  </el-form-item>

  <el-form-item label="行政区划级别">
    <el-select v-model="form.divisionLevel" placeholder="请选择活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="备注">
    <el-input type="textarea" v-model="form.remark"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">保存</el-button>
  </el-form-item>
</el-form>

</div>
</template>
<script>
  import axios from 'axios'
  let id = 1000;

  export default {

    data() {
      return {
        filterText: '',
        form: {
          divisionCode: '',
          divisionName: '',
          divisionLevel: '',
          parentCode: '',
          remark: ''
                },
        data4:[
          {
            id:'0000',
            label:'行政区划',
            divisionLevel:'',
            parentCode:'',
            remark:'',
            children:[{
              id: 1,
              label: '山东省',
              divisionLevel:'',
              parentCode:'',
              remark:'',
              children: [{
                id: 1,
                label: '济南市',
                divisionLevel:'',
                parentCode:'',
                remark:'',
                children: [{
                  id: 9,
                  label: '历下区',
                  divisionLevel:'',
                  parentCode:'',
                  remark:'',
                }, {
                  id: 10,
                  label: '历城区',
                  divisionLevel:'',
                  parentCode:'',
                  remark:'',
                }]
              }]
            }]
          }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    mounted:function () {
//      axios.post("http://localhost:8080/api/bvcenter/dept",{"id":123}).then(res=>{
//        console.log(res.data);
//      });
    },
    methods: {
      append(data) {console.log(data);
        const newChild = {
          id: null,
          label: '新节点',
          divisionLevel:'',
          parentCode:'',
          remark:'',
          children: []
        };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },

      renderContent(h, { node, data, store }) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span>{node.label}</span>
            </span>
            <span>
              <el-button style="font-size: 12px;" type="text" on-click={ () => this.append(data) }>➕</el-button>
              <el-button style="font-size: 12px;" type="text" on-click={ () => this.remove(node, data) }>➖</el-button>
            </span>
          </span>);
      },

     filterNode(value, data) {
             if (!value) return true;
             return data.label.indexOf(value) !== -1;
            },
    onSubmit() {
            console.log(this.form.divisionName );
          },
      handleNodeClick(data) {
        // this.clickId = data.id
        this.form.divisionCode = data.id;
        if(data.label != '新节点'){
          this.form.divisionName = data.label;
        }else{
          this.form.divisionName = '';
        }
        this.form.divisionLevel = data.divisionLevel;
        this.form.parentCode = data.parentCode;
        this.form.remark = data.remark;
      }
    },
  watch: {
          filterText(val) {
            this.$refs.tree2.filter(val);
          }
        },
  };
</script>

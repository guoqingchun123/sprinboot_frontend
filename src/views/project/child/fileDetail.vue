<template>
  <div class="app-container">
    <bv-table-header title="图档信息列表">
      <bv-button v-show="addFileButtonShow" view="add" @click="addFileDetail">增加</bv-button>
      <el-button type="primary" icon="el-icon-upload">数据导出</el-button>
    </bv-table-header>
    <div style="cursor:pointer;margin-top: 15px" @click="addFileTree()">(+点击添加分类)</div>
    <el-tree ref="tree" :data="filetreeDataApp" :props="defaultProps"
             style="width: 250px;float: left" node-key="fileTypeId"
             :default-expanded-keys="[0]" @node-click="handleNodeClick"
    />


    <bv-table-search
      :is-fuzzy.sync="isFuzzy"
      :fuzzy.sync="fuzzy"
      :filter.sync="filter"
      @on-fuzzy-start="initTable"
      @on-filter-start="initTable"
      @on-filter-reset="initTable"
    >
      <bv-col>
        <el-form-item label="文件名称:">
          <el-input v-model="filter.fileName" />
        </el-form-item>
      </bv-col>
    </bv-table-search>
    <div style="margin-left: 256px">
      <el-table
        ref="table"
        v-loading="loading"
        :data="fileDetails"
        @select="checkboxSelect"
        @sort-change="onSort"
      >
        <el-table-column label="要件类型" prop="parentName" align="center" />
        <el-table-column label="文件名" prop="fileName" align="center" />
        <el-table-column label="文件大小" prop="fileSize" align="center" />
        <el-table-column
          fixed="right"
          label="操作"
        >
          <template scope="scope">
            <el-button type="text" size="small" @click="editFileDetail(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="deleteFileDetail(scope.row.fileId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <bv-pagination
        v-show="false" :total="total" :current-page.sync="currPage" :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="新增要件类型" :visible.sync="fileTreeVisible" :close-on-click-modal="false"
               :close-on-press-escape="false"
    >
      <el-form ref="fileTreeRules" :inline="true" label-width="90px" label-position="right" :rules="addFileTreeRules" :model="fileTreeRules">
        <el-form-item label="要件类型" prop="fileTypeName">
          <el-input v-model="fileTreeRules.fileTypeName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addConfirm('fileTreeRules')">保存</el-button>
        <el-button @click="cancelEditTree()">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="维护图档信息" :visible.sync="dialogFileVisible" :close-on-click-modal="false"
               :close-on-press-escape="false"
    >
      <el-form ref="fileForm" :model="fileForm" :inline="true" label-width="90px" label-position="right"
               :rules="fileRules"
      >
        <el-row>
          <el-col>
            <el-form-item label="要件类型" prop="parentName">
              <el-input v-model="fileForm.parentName" disabled />
            </el-form-item>
            <el-form-item label="文件名" prop="fileName">
              <el-input v-model="fileForm.fileName" />
            </el-form-item>
            <el-form-item v-show="isEdit" label="浏览文件" prop="">
              <el-upload
                ref="uploadFile"
                class="upload-demo"
                drag
                :action="upload_url"
                :auto-upload="false"
                :on-change="fileChange"
                :file-list="fileList"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addFileConfirm()">保存</el-button>
        <el-button @click="cancelEdit()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { queryCustomFileInfo,editCustFileInfo,addCustFileInfo,deleteCustFileInfo,queryCustomFileTree,addCustomFileTree } from '@/api/custom/contractMessage'
  import { defaults as utils } from '@bestvike/utils'
  import { importEmpInfoExcel } from '@/api/employee/empInfo'

  export default {
    props:{
      corpId:{
        type: String,
        default: ''
      }
    },
    data(){
      return{
        upload_url:'url',
        isFuzzy: true,
        // 模糊查询条件
        fuzzy: null,
        // 过滤条件
        filter: {
          fileName: '',
        },
        pageSize: 10,
        //当前页码
        currPage: 1,
        //符合条件的数据总数
        total: 0,
        loading:false,
        tableData:[],
        row:{},
        //存储选中的数据
        selection:[],
        // 当前排序
        sort: null,
        //接收上面传过来的参数
        corpId1:'',
        //弹窗
        dialogFileVisible: false,
        //弹窗数据Form
        fileForm:{
          corpId:'',
          fileId:'',
          fileName:'',
          fileSize:'',
          fileDetailType:'',
          parentId:'',
          parentName:''
        },
        //规则控制
        fileRules:{
          fileName: [
            {required: true,message:"请输入文件名",trigger:'blur'}
          ]
        },
        fileTreeData:{},
        filetreeDataApp:{},
        defaultProps:{
          label:'fileTypeName',
          children:'list'
        },
        fileTreeVisible:false,
        fileTreeRules:{
          fileTypeName:'',
          fileTypeId:'',
          parentId:''
        },
        addFileTreeRules:{
          fileTypeName:[
            {required: true,message:"请输入要件类型",trigger:'blur'}
          ]
        },
        currNode:'',
        currNodeName:'',
        addFileButtonShow:false,
        isEdit:true,
        fileList: [],
      }
    },
    computed:{
      fileDetails() {
        let fileDetail= this.tableData;
        let fileDetail2 = [];
        if (this.currNode == 0) {
          return fileDetail.slice(0,fileDetail.length)
        } else {
          for (let i in fileDetail) {
            if (fileDetail[i].parentId == this.currNode) {
              fileDetail2.push(fileDetail[i])
            }
          }
          return fileDetail2.slice(0,fileDetail2.length)
        }
      }
    },
    watch:{
      corpId(){
        this.initTable();
        this.getFileTree();
      }
    },
    methods:{
      getFileTree:function(){
        queryCustomFileTree().then(response=>{
          this.fileTreeData= response.data;
          let data=this.fileTreeData;
          let tree = [];
          for(let i=0;i<data.length;i++){
            if(data[i].parentId == 'ROOT'){
              let obj = data[i];
              obj.list = [];
              tree.push(obj);
              data.splice(i,1);
              i--
            }
          }
          menuList(tree);
          this.filetreeDataApp=tree;
          function menuList(arr){
            if(data.length !=0){
              for(let i=0; i<arr.length;i++){
                for(let j=0;j<data.length;j++){
                  if(data[j].parentId == arr[i].fileTypeId){
                    let obj = data[j];
                    obj.list = [];
                    arr[i].list.push(obj);
                    data.splice(j,1);
                    j--
                  }
                }
                menuList(arr[i].list)
              }
            }
          }
        })
      },
      initTable(){
        let _that = this;
        this.corpId1 = _that.corpId;
        _that.loading = true;
        let data = {};
        if (_that.isFuzzy) {
          if (_that.fuzzy) {
            data.fuzzy = _that.fuzzy
          }
        } else {
          for (let item in _that.filter) {
            data[item] = _that.filter[item]
          }
        }
        if (_that.sort) {
          data.sort = _that.sort
        }
        data.corpId = _that.corpId1;
        // 分页信息
        data.page = _that.currPage;
        data.limit = _that.pageSize;
        queryCustomFileInfo(data).then(response => {
          _that.total = response.data.total;
          _that.tableData = response.data.list;
          setTimeout(() => {
            _that.loading = false
          }, 500);
        }).catch(() => {
          setTimeout(() => {
            _that.loading = false
          }, 500);
        })
      },
      onSort(sort){
        this.sort = utils.transTableSort(sort);
        this.initTable()
      },
      checkboxSelect(selected,row){
        this.selection = selected;
        // 将row数据存储在row中，供后面修改时使用
        this.row = row
      },
      addConfirm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addCustomFileTree(this.fileTreeRules).then(() => {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.fileTreeVisible=false;
              this.getFileTree();
            })
          } else {
            return false;
          }
        });
      },
      handleNodeClick(data, node) {
        this.currNode = data.fileTypeId;
        this.currNodeName=data.fileTypeName;
        if (node.level === 1) {
          this.addFileButtonShow=false;
        } else {
          this.addFileButtonShow=true;
        }
      },
      addFileDetail(){
        this.fileForm.parentName = this.currNodeName;
        this.dialogFileVisible = true
      },
      editFileDetail(row){
        this.isEdit=false;
        this.fileForm= {...row};
        this.dialogFileVisible = true
      },
      deleteFileDetail(row){
        this.$confirm('此操作将删除该图档信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let custfileId = "";
          if(row && row != '1'){
            custfileId = row;
          }else{
            custfileId = this.row.fileId;
          }
          deleteCustFileInfo(custfileId).then(() => {
            this.initTable();
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        })
      },
      //分页点击事件
      handleCurrentChange(val){
        this.currPage = val;
        this.initTable()
      },
      // addFileConfirm(){
      //   let _that = this;
      //   _that.fileForm.corpId=_that.corpId1;
      //   _that.fileForm.parentId=_that.currNode;
      //   _that.fileForm.parentName=_that.currNodeName;
      //   _that.$refs.fileForm.validate((valid) => {
      //     if (valid) {
      //       if(_that.fileForm.fileId){
      //         editCustFileInfo(_that.fileForm).then(() => {
      //           this.$message({
      //             message: '修改成功',
      //             type: 'success'
      //           });
      //           this.cancelEdit();
      //         })
      //       }else{
      //         addCustFileInfo(_that.fileForm).then(() => {
      //           this.$message({
      //             message: '新增成功',
      //             type: 'success'
      //           });
      //           this.cancelEdit();
      //         });
      //       }
      //     } else {
      //       return false;
      //     }
      //   });
      // },
      addFileConfirm(){
        let path = '\\客户图档';
        let isHaveFiles = false;
        let file = [];
        let fileSource = [];
        if (this.$refs.uploadFile.uploadFiles.length > 0) {
          isHaveFiles = true;
          file.push(this.$refs.uploadFile.uploadFiles[0].raw);
          fileSource.push("客户图档文件");
        }

        // 没有上传文件时
        if (!isHaveFiles) {
          this.$message({
            type: 'warning',
            message: '请至少上传1个文件!'
          });
          return;
        }
        //传递当前用户id  ==  manageUser
        let data = {
          fileSource: fileSource,
          manageUser: 'admin',
          path: path
        };
        importEmpInfoExcel(file, data).then(ret => {
          //上传文件成功  返回文件id  插入数据
          if (ret.data.retCode === '0000') {
            //获取文件id  上传文件中的数据
            let _that = this;
            _that.fileForm.fileId=ret.data.fileId;
            _that.fileForm.corpId=_that.corpId1;
            _that.fileForm.parentId=_that.currNode;
            _that.fileForm.parentName=_that.currNodeName;
            _that.$refs.fileForm.validate((valid) => {
              if (valid) {
                if(_that.isEdit){
                  editCustFileInfo(_that.fileForm).then(() => {
                    this.$message({
                      message: '修改成功',
                      type: 'success'
                    });
                    this.cancelEdit();
                  })
                }else{
                  addCustFileInfo(_that.fileForm).then(() => {
                    this.$message({
                      message: '新增成功',
                      type: 'success'
                    });
                    this.cancelEdit();
                  });
                }
              } else {
                return false;
              }
            });
          }
        }).catch(() => {
          console.log('上传失败');
          this.$refs.uploadFile.clearFiles()
        });
      },
      cancelEdit(){
        this.dialogFileVisible = false;
        this.$nextTick(function () {
          this.$refs.fileForm.clearValidate()
        });
        this.fileForm = {};
        this.row = {};
        this.initTable()
      },
      addFileTree:function(){
        this.fileTreeVisible = true;
        this.fileTreeRules={};
      },
      cancelEditTree:function () {
        this.fileTreeVisible= false;
        this.$nextTick(function () {
          this.$refs.fileForm.clearValidate()
        });
        this.fileRules = {};
      },

    }
  }
</script>

<template>
  <div class="app-container" style="margin-bottom: -20px">
    <bv-table ref="table" :pagination="true" :filter.sync="filter"
              :fetch-api="fetchTmplList" :is-fuzzy="false" :search="false"
              @on-mounted="(table) => tableInstance = table"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column v-if="false" prop="listGuid" label="系统编号" />
      <el-table-column v-if="false" prop="tmplGuid" label="父id" />
      <el-table-column prop="versionNo" label="版本号" />
      <el-table-column prop="versionDate" label="版本日期" :formatter="versionDateFormatter" />
      <el-table-column prop="publishUser" label="发布人" />
      <el-table-column prop="downNum" label="下载量" />
      <el-table-column v-if="false" prop="path1" label="path1" />
      <el-table-column v-if="false" prop="path2" label="path2" />
      <el-table-column v-if="false" prop="path3" label="path3" />
      <el-table-column v-if="false" prop="isMaxNo" label="isMaxNo" />
      <bv-col v-bind="$CONST.col.layout3">
        <el-table-column
          fixed="right"
          label="操作"
        >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.name1" placement="left-end">
              <bv-button
                v-if="scope.row.flag1"
                type="text"
                size="small"
                @click.native.prevent="tmpClick(1, scope.row)"
              >
                {{ scope.row.temp }}
              </bv-button>
            </el-tooltip>
            <el-tooltip :content="scope.row.name2" placement="left-end">
              <bv-button
                v-if="scope.row.flag2"
                type="text"
                size="small"
                @click.native.prevent="tmpClick(2, scope.row)"
              >
                {{ scope.row.demo1 }}
              </bv-button>
            </el-tooltip>
            <el-tooltip :content="scope.row.name3" placement="left-end">
              <bv-button
                v-if="scope.row.flag3"
                type="text"
                size="small"
                @click.native.prevent="tmpClick(3, scope.row)"
              >
                {{ scope.row.demo2 }}
              </bv-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </bv-col>
    </bv-table>
    <online-show :file-id="fileId" :dialog-visible.sync="dialogVisible" :re-fresh-flag="dialogFreshFlag" />
  </div>
</template>

<script>
  import {fetchTmplList, addDownNumAndLog, getPath, fileDownload} from '@/api/sharedResource'
  import moment from 'moment'
  import OnlineShow from './onlineShow'

  export default {
    name: 'FileList',
    components: {OnlineShow},
    props: {
      tmplGuid: {
        type: String,
        default: ''
      },
      reFreshFlag: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        dialogVisible: false,
        fileId: '',
        dialogFreshFlag: 0,
        filter: {
          tmplGuid: ''
        },
        fetchTmplList
      }
    },
    watch: {
      //监听切换标签状态
      'tmplGuid': function () {
        this.setFilter();
        this.tableInstance.fetchData()
      },
      'reFreshFlag': function () {
        this.setFilter();
        this.tableInstance.fetchData()
      }
    },
    created() {
      this.setFilter();
    },
    methods: {
      setFilter(){
        this.filter.tmplGuid = this.tmplGuid;
      },
      versionDateFormatter(row){
        return moment(row.versionDate).format('YYYY-MM-DD HH:mm:ss')
      },
      tmpClick(flag, row) {
        this.dialogVisible = false;
        let fileId = null;
        let isDownLoad = false;
        let fileName = null;

        if (flag === 1) {
          fileId = row.path1;
          fileName = row.name1;
        } else if (flag === 2) {
          fileId = row.path2;
          fileName = row.name2;
        } else if (flag === 3) {
          fileId = row.path3;
          fileName = row.name3;
        }

        if (row.isMaxNo === '1') {
          isDownLoad = true;
        } else {
          isDownLoad = false;
        }

        let addData = row;
        // 下载
        if(isDownLoad) {
          addData.remark = '0000';
          let getPathData = {
            fileId:fileId
          };
          getPath(getPathData).then(ret=>{
            if (ret.data.path !== '') {
              let downloadDate = {
                path:ret.data.path
              };
              // 下载处理
              fileDownload(downloadDate).then(data=>{
                if(!data) {
                  this.$message({
                    type: 'error',
                    message: '当前文件不存在,下载失败！'
                  });
                  return;
                }
                // 下载量加一；且计算下载量，预览量不统计
                addDownNumAndLog(addData).then(
                  row.downNum = row.downNum + 1
                );

                let blob = new Blob([data.data]);
                let url = this.getObjectURL(blob);
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                // 获取文件名
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL(link.href);
              }).catch(()=>{
                this.$message({
                  type: 'error',
                  message: '当前文件不存在,下载失败！'
                });
              });
            }
          });
        } else {
          // 预览
          addData.remark = '0001';
          // 预览量不统计
          addDownNumAndLog(addData);
          // 打开预览窗口
          this.dialogVisible = true;
          this.fileId = fileId;
          this.dialogFreshFlag = this.dialogFreshFlag + 1;
        }
      },
      getObjectURL(file) {
        let url = null;
        if (window.createObjectURL !== undefined) {
          url = window.createObjectURL(file);
        } else if (window.webkitURL !== undefined) {
          url = window.webkitURL.createObjectURL(file);
        } else if (window.URL !== undefined) {
          url = window.URL.createObjectURL(file);
        }
        return url;
      }
    }
  }
</script>

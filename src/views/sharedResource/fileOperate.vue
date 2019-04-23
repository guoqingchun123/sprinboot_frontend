<template>
  <div class="app-container">
    <bv-table ref="table" title="文件下载/预览记录信息" :pagination="true"
              :fetch-api="getFileOperate" :filter-switch="false"
              @on-mounted="(table) => tableInstance = table"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="fileName" label="模板名称" sortable />
      <el-table-column prop="versionNo" label="版本编号" sortable />
      <el-table-column prop="operateType" label="操作类型" :formatter="operateTypeFormatter" sortable />
      <el-table-column prop="manageUser" label="操作用户" sortable />
      <el-table-column prop="manageTime" label="操作日期" :formatter="manageTimeFormatter" sortable />
    </bv-table>
  </div>
</template>

<script>

  import {getFileOperate} from '../../api/sharedResource'
  import moment from 'moment'

  export default {
    name: 'FileOperate',
    data() {
      return {
        getFileOperate
      }
    },
    created() {
    },
    methods: {
      manageTimeFormatter(row) {
        return moment(row.manageTime).format('YYYY-MM-DD HH:mm:ss')
      },
      operateTypeFormatter(row) {
        return row.operateType === '0000'? '下载':'预览';
      }
    }
  }
</script>

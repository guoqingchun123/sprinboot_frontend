<template>
  <div class="app-container">
    <bv-table ref="table" title="信息列表" :pagination="true" :filter.sync="filter" :fetch-api="fetchTokens">
      <div slot="operates">
        <bv-button @click="startImport()">导入种子文件</bv-button>
        <bv-button @click="startSync()">同步时间戳</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <bv-form-item label="系列号" prop="deviceSn">
            <bv-input v-model="filter.deviceSn" />
          </bv-form-item>
        </bv-col>
        <bv-col>
          <bv-form-item label="令牌状态" prop="state">
            <bv-select v-model="filter.state" placeholder="请选择令牌状态" type="enum" dict-code="tokenStatus" />
          </bv-form-item>
        </bv-col>
      </div>
      <bv-table-column label="序列号" prop="deviceSn" align="center" sortable="custom" />
      <bv-table-column label="状态" prop="state" align="center" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.statusName }}
        </template>
      </bv-table-column>
      <bv-table-column label="分配人编号" prop="userId" align="center" sortable="custom" />
      <bv-table-column label="最后修改日期" prop="lastModifyDate" align="center" />
    </bv-table>
    <token-import :visible.sync="importVisible" />
    <token-sync :visible.sync="syncVisible" />
  </div>
</template>

<script>
  import { fetchTokens } from '@/api/authority/token'
  import TokenImport from './components/import'
  import TokenSync from './components/sync'

  export default {
    name: 'ListToken',
    components: {
      TokenImport,
      TokenSync
    },
    data() {
      return {
        filter: {},
        fetchTokens,

        importVisible: false,
        syncVisible: false
      }
    },
    methods: {
      startImport() {
        this.importVisible = true
      },
      startSync() {
        this.syncVisible = true
      }
    }
  }
</script>


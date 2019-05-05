<template>
  <div class="app-container">
    <bv-table title="角色一览" :pagination="true" :filter.sync="filter" :fetch-api="fetchRoles" @on-mounted="(table) => tableInstance = table">
      <!--操作按钮-->
      <div slot="operates" />
      <!--可查询项-->
      <div slot="search">
        <bv-col>
          <el-form-item label="角色代码" prop="roleId">
            <el-input v-model="filter.roleId" />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="filter.roleName" />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="角色状态" prop="roleState">
            <el-select v-model="filter.roleState" placeholder="请选择" clearable>
              <el-option v-for="item in roleStateOptions" :key="item.dictCode" :label="item.dictName" :value="item.dictCode" />
            </el-select>
          </el-form-item>
        </bv-col>
      </div>
      <!--列表展示字段-->
      <el-table-column type="selection" width="55" />
      <el-table-column label="角色代码" prop="roleId" />
      <el-table-column label="角色名称" prop="roleName" />
      <el-table-column label="角色状态" prop="roleState" />
    </bv-table>
  </div>
</template>
<script>
  import { fetchRoles } from '@/api/authority'
  export default {
    name: 'ListRole',
    data() {
      return {
        // 查询对象
        filter:{
          roleId: '',
          roleName: '',
          roleState: ''
        },
        // 角色状态字典
        roleStateOptions: [],
        // 列表查询数据
        fetchRoles
      }
    }
  }
</script>

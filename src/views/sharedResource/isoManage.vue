<template>
  <file-upload :tree-name="treeName" :is-auth="isAuth" :role-flag="roleFlag" :add-path="addPath" />
</template>

<script>
  import FileUpload from "./child/upload";

  export default {
    name: 'ISOFileManage',
    components: {FileUpload},
    data() {
      return {
        treeName: '文件库',
        isAuth: true,
        roleFlag: '',
        addPath: 'ISO'
      }
    },
    provide: {
      fileSource: "0000"
    }
  }
</script>

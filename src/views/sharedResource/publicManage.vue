<template>
  <file-upload :tree-name="treeName" :is-auth="isAuth" :role-flag="roleFlag" :add-path="addPath" />
</template>

<script>
  import FileUpload from "./child/upload";

  export default {
    name: 'PublicFileManage',
    components: {FileUpload},
    data() {
      return {
        treeName: '文件库',
        isAuth: false,
        roleFlag: 'N',
        addPath: 'Public'
      }
    },
    provide: {
      fileSource: "0001"
    }
  }
</script>

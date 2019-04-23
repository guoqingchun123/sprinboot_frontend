<template>
  <file-download :tree-name="treeName" />
</template>

<script>
  import FileDownload from "./child/download";

  export default {
    name: 'ISOFileDownload',
    components: {FileDownload},
    data() {
      return {
        treeName : '文件库'
      }
    },
    provide: {
      fileSource: "0000"
    }
  }
</script>

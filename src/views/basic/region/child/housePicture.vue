<template>
  <div>
    <bv-file
      catalog-types="house-Hold"
      :key-id="region.regionId"
      :titles="{dataTitle: '户型关系一览'}"
      @on-remove-success="onRemoveSuccess"
      @on-upload-success="onUploadSuccess"
    />
  </div>
</template>

<script>
  import {File} from '@bestvike/components'
  import {fileUploadSuccess, fileDeleteSuccess} from '@/api/basic'

  export default {
    name: 'HousePicture',
    components: {
      BvFile: File
    },
    props: {
      region: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
      }
    },
    methods: {
      onUploadSuccess(data) {
        // 发送图档上送成功请求到后台
        fileUploadSuccess(data).then(() => {
          this.$message.success('图片上传成功...');
        })
      },
      onRemoveSuccess(ids) {
        // 发送图档上送成功请求到后台
        fileDeleteSuccess(ids);
      }
    }
  }
</script>

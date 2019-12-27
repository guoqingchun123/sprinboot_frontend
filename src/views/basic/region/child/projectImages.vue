<template>
  <div>
    <bv-file
      catalog-types="project-image"
      :key-id="region.regionId"
      :titles="{dataTitle: '项目相册一览'}"
      :upload-action="uploadUrl"
      :remove-batch-api="removeBatchApi"
    />
  </div>
</template>

<script>
  import {File} from '@bestvike/components'
  import {configUrl} from '@/api/basic'
  
  export default {
    name: 'ProjectImages',
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
        uploadUrl: configUrl("/api/center/file/uploads")
      }
    },
    methods: {
      removeBatchApi(ids) {
        console.info(ids);
      }
    }
  }
</script>

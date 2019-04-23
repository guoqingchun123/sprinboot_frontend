<template>
  <div>
    用户中心
    <el-upload
      class="avatar-uploader"
      :action="fileServer + '/api/file/upload'"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar fit-cover">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <el-button @click="saveAvatar">保存头像</el-button>

    <div>
      <span>{{ $t('settings.tagsView') }}</span>
      <el-switch v-model="tagsView" class="drawer-switch" />
    </div>

    <div>
      <span>{{ $t('settings.fixedHeader') }}</span>
      <el-switch v-model="fixedHeader" class="drawer-switch" @change="changeFixedHeader" />
    </div>

    <div>
      <span>{{ $t('settings.sidebarLogo') }}</span>
      <el-switch v-model="sidebarLogo" class="drawer-switch" />
    </div>
  </div>
</template>
  
<script>
import Cookies from 'js-cookie'

export default {
  name: 'UserSetting',
  data() {
    return {
      fileServer: process.env.VUE_APP_FILE_SERVER,
      imageUrl: this.$store.getters.avatar || '',
      avatarUrl: null,
      fixedHeader: this.$store.state.settings.fixedHeader
    }
  },
  computed: {
    /*fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      // 目前会出现js错误
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },*/
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.avatarUrl = this.fileServer + '/' + res
    },
    beforeAvatarUpload(file) {
      const isPicture = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isPicture) {
        this.$message.error('上传头像图片只能是 图片 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isPicture && isLt2M
    },
    saveAvatar() {
      Cookies.set('avatar', this.avatarUrl)
      this.$store.dispatch('user/setAvatar', this.avatarUrl)
    },
    changeFixedHeader() {
      this.$nextTick(() => {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: this.fixedHeader
        })
      })
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  #app .avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
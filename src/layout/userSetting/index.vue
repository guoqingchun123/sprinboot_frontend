<template>
  <div>
    用户中心
    <el-upload
      class="avatar-uploader"
      action="http://172.10.11.111:22000/api/file/upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar fit-cover">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <el-button @click="saveAvatar">保存</el-button>
  </div>
</template>
  
<script>
import Cookies from 'js-cookie'

export default {
  name: 'UserSetting',
  data() {
    return {
      imageUrl: this.$store.getters.avatar || '',
      avatarUrl: null
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.avatarUrl = 'http://172.10.11.111/' + res
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
      this.$store.dispatch('SetAvatar', this.avatarUrl)
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
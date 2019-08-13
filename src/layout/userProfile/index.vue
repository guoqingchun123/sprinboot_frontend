<template>
  <div class="app-container">
    <bv-row layout="table-header">
      <el-col :span="12">
        <h3>用户中心</h3>
      </el-col>
    </bv-row>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="info" lazy>
        <bv-form ref="userForm" :model="user">
          <bv-row>
            <bv-col>
              <el-form-item label="用户姓名:" prop="userName">
                <span v-text="user.userName" />
              </el-form-item>
            </bv-col>
            <bv-col>
              <el-form-item label="用户别名:" prop="alias">
                <span v-text="user.alias" />
              </el-form-item>
            </bv-col>
            <bv-col>
              <el-form-item label="用户编号:" prop="userId">
                <span v-text="user.userId" />
              </el-form-item>
            </bv-col>
            <bv-col>
              <el-form-item label="证件号码:" prop="certNo">
                <span v-text="user.certNo" />
              </el-form-item>
            </bv-col>
            <bv-col>
              <el-form-item label="联系电话:" prop="phoneNo">
                <span v-text="user.phoneNo" />
              </el-form-item>
            </bv-col>
          </bv-row>
        </bv-form>
        <el-upload
          class="avatar-uploader"
          action="/file/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar fit-cover" @error="showDefaultAvatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <el-button @click="saveAvatar">保存头像</el-button>
      </el-tab-pane>
      <el-tab-pane label="参数设置" name="setting" lazy>
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
      </el-tab-pane>
      <el-tab-pane label="密码修改" name="password" lazy>
        <bv-form ref="form" :model="item" :rules="rules">
          <bv-row>
            <bv-col>
              <el-form-item label="当前密码" prop="currPass">
                <el-input type="password" v-model="item.currPass" />
              </el-form-item>
              <el-tooltip class="forget-pass-tooltip" effect="dark" content="忘记密码？可以联系管理员重置密码。" placement="right">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </bv-col>
            <bv-col>
              <el-form-item label="新密码" prop="newPass">
                <el-input type="password" v-model="item.newPass" />
              </el-form-item>
            </bv-col>
            <bv-col>
              <el-form-item label="确认密码" prop="confirmPass">
                <el-input type="password" v-model="item.confirmPass" />
              </el-form-item>
            </bv-col>
          </bv-row>
          <bv-row>
            <bv-col>
              <bv-button class="pass-save-btn" view="save" authority="modify" @click="startSave()">保存</bv-button>
            </bv-col>
          </bv-row>
        </bv-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {verifyPass, modifyPass} from '@/api/authority'
import Cookies from 'js-cookie'
import defaultAvatar from '@/assets/avatar.png'
import MD5 from 'crypto-js/md5'
import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'

export default {
  name: 'UserProfile',
  data() {
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入原密码'));
      } else {
        let password = Base64.stringify(Utf8.parse(MD5(value).toString()));
        verifyPass(password).then(response => {
          if (response.data == 0) {
            callback(new Error('密码不正确'));
          } else {
            callback();
          }
        });
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.item.newPass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    };
    return {
      activeName: 'info',
      imageUrl: '/file/view/' + (this.$store.getters.avatar || ''),
      avatarUrl: null,
      fixedHeader: this.$store.state.settings.fixedHeader,
      item: {},
      user: {},
      rules: {
        currPass: [
          {
            required: true,
            validator: validatePass,
            trigger: 'blur'
          }
        ],
        newPass: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }, {
            min: 6,
            max: 30,
            message: '长度在 6 到 30 个字符'
          }, {
            pattern: /^(\w){6,20}$/,
            message: '只能输入6-20个字母、数字、下划线'
          }
        ],
        confirmPass: [
          {
            required: true,
            validator: validatePass2,
            trigger: 'blur'
          }
        ]
      }
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
  mounted() {
    let _that = this;
    this.$store.dispatch('user/getInfo').then(data => {
      _that.user = data;
    })
  },
  methods: {
    showDefaultAvatar() {
      this.imageUrl = defaultAvatar
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.avatarUrl = res
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
    },
    //保存修改密码
    startSave() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.item && this.item.newPass) {
          modifyPass(this.item.newPass).then(response => {
            if (response.data == 1) {
              this.$message.success('修改密码成功')
            } else {
              this.$message.error('修改密码失败')
            }
          })
        }
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
  .pass-save-btn {
    margin-left: 7vw;
  }
  .forget-pass-tooltip {
    margin-top: 10px;
  }
</style>

<template>
  <div class="login-container">
    <div class="login-header">
      <div class="logo"><img :src="logoUrl"></div>
      <div class="mission">百思为客户价值&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;百思为科技创新</div>
    </div>
    <div class="login-banner">
      <el-carousel trigger="click" height="600px">
        <el-carousel-item v-for="item in banners" :key="item" style="text-align: center">
          <img :src="item">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="login-form">
      <bv-form ref="loginForm" :inline="false" label-width="0" :model="loginForm" :rules="loginRules" autocomplete="on">
        <el-form-item prop="userId" class="item-container">
          <span class="svg-container">
            <bv-icon icon-class="user" />
          </span>
          <el-input
            v-model="loginForm.userId"
            placeholder="账号"
            name="userId"
            type="text"
            autocomplete="on"
            tabindex="1"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="大小写锁定键已打开" placement="right" manual>
          <el-form-item prop="password" class="item-container">
            <span class="svg-container">
              <bv-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              :maxlength="passwordLength"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
            />
            <span class="show-pwd" @click="showPwd">
              <bv-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-form-item v-if="needValidateCode" prop="validateCode">
          <el-col :span="18" class="item-container">
            <span class="svg-container">
              <bv-icon icon-class="validateCode" />
            </span>
            <el-input
              v-model="loginForm.validateCode"
              placeholder="校验码"
              name="validateCode"
              type="text"
              tabindex="3"
            />
          </el-col>
          <el-tooltip content="点击刷新">
            <el-col :span="6" class="validate-code-container">
              <img :src="validateCodeUrl" @click="refreshValidateCode">
            </el-col>
          </el-tooltip>
        </el-form-item>

        <el-button :loading="loading" type="primary" tabindex="4" @click.native.prevent="handleLogin($event, 'click')">登录</el-button>
      </bv-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Carousel, CarouselItem } from 'element-ui'
import { validate } from '@bestvike/utils'
import logoUrl from '@/assets/login/login-logo.png'
import banner1 from '@/assets/login/login-bg01.png'
import banner2 from '@/assets/login/login-bg02.png'
import banner3 from '@/assets/login/login-bg03.png'

export default {
  name: 'Login',
  components: {
    ElCarousel: Carousel,
    ElCarouselItem: CarouselItem
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validate.validUsername(value)) {
        callback(new Error(this.$t('login.invalidUsername')))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (process.env.VUE_APP_LOGINTYPE === 'password') {
        if (value.length < 6) {
          callback(new Error(this.$t('login.invalidPassword')))
        } else {
          callback()
        }
      } else {
        if (value.length !== 7) {
          callback(new Error(this.$t('login.invalidPasstoken')))
        } else {
          callback()
        }
      }
    }
    return {
      banners: [
        banner1,
        banner2,
        banner3
      ],
      logoUrl,
      // needValidateCode: false,
      validateCodeUrl: this.$server+'/api/authority/code?t=' + new Date().getTime(),
      loginType: process.env.VUE_APP_LOGINTYPE,
      loginForm: {
        userId: '',
        password: '',
        validateCode: ''
      },
      loginRules: {
        userId: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      // 最大密码长度
      passwordLength: process.env.VUE_APP_LOGINTYPE === 'password' ? 20 : 7,
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  computed: {
    ...mapGetters([
      'needValidateCode',
      'needRefreshValidateCode'
    ])
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  methods: {
    refreshValidateCode() {
      this.validateCodeUrl =this.$server+ '/api/authority/code?t=' + new Date().getTime()
      this.loginForm.validateCode = ''
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin(event, from) {
      if (!from && this.needValidateCode) {
        return
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
              if (this.needRefreshValidateCode) {
                this.refreshValidateCode()
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#999999;
  $cursor: #999999;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .item-container {
      border: 1px solid #cccccc;
      border-radius: 5px;
      color: #999999;
    }
    .validate-code-container {
      text-align: center;

      > img {
        padding-top: 6px;
      }
    }
  }
</style>

<style lang="scss" scoped>
$bg:#ffffff;
$dark_gray:#889aa4;
$light_gray:#eee;

$layout_width: 1200px;

.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  // background: $bg url('~@/assets/login/bg.png') no-repeat bottom center;
  overflow: hidden;

  > .login-header {
    width: $layout_width;
    height: 50px;
    display: flex;
    justify-content: space-between;

    > img {
      height: 38px;
    }
    > .mission {
      line-height: 50px;
      color: #333744;
    }
  }
  > .login-banner {
    width: 100%;
    height: 600px;
  }
  > .login-form {
    width: 1200px;
    position: absolute;
    left: 50%;
    margin-left: -600px;
    display: flex;
    justify-content: flex-end;
    z-index: 3000;

    > .el-form {
      padding: 30px;
      width: 410px;
      overflow: hidden;
      margin-top: -110px;
      background: #ffffff;
      border-radius: 5px;

      > .el-button--medium {
        width: 100%;
        padding: 15px 20px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size:18px;
      right: 0px;
      cursor: pointer;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>

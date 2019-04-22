<template>
  <el-header :height="variables.headerHeight" class="navbar">
    <div class="logo-container">
      <img :src="mainLogo">
    </div>
    <bv-hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <bv-breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <el-tooltip :content="$t('navbar.search')" effect="dark" placement="bottom">
          <bv-search class="right-menu-item" />
        </el-tooltip>

        <bv-error class="errLog-container right-menu-item hover-effect" />

        <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <bv-screenfull class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <router-link to="/user/setting">
            <el-dropdown-item>
              用户中心
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import { mapGetters } from 'vuex'
import BvBreadcrumb from '@/components/Breadcrumb'
import BvHamburger from '@/components/Hamburger'
import BvError from '@/components/ErrorLog'
import BvScreenfull from '@/components/Screenfull'
import BvSearch from '@/components/HeaderSearch'
import variables from '@/styles/variables.scss'
import mainLogo from '@/assets/main-logo.png'

export default {
  name: 'BvNavbar',
  components: {
    BvBreadcrumb,
    BvHamburger,
    BvError,
    BvScreenfull,
    BvSearch
  },
  data() {
    return {
      mainLogo
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ]),
    variables() {
      return variables
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../../styles/variables.scss';

.navbar {
  // height: 50px;
  display: flex;
  overflow: hidden;

  .logo-container {
    width: 200px;
    overflow: hidden;

    > img {
      height: 100%;
    }
  }

  .hamburger-container {
    line-height: $headerHeight;
    height: 100%;
    // float: left;
    cursor: pointer;
    transition: background .3s;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  /*.breadcrumb-container {
    float: left;
  }*/

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    // float: right;
    height: 100%;
    line-height: $headerHeight;
    flex: 1;
    text-align: right;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        line-height: initial;
        cursor: pointer;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

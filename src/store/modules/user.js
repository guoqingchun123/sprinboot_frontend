import Cookies from 'js-cookie'
import { login, logout, getInfo, modifyAvatar } from '@/api/authority'
import { auth } from '@bestvike/utils'
import router, { resetRouter } from '@/router'

const state = {
  token: auth.getToken(),
  needValidateCode: Cookies.get('needValidateCode') || false,
  needRefreshValidateCode: true,
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  refreshPromise: '',
  empId: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NEED_VALIDATE_CODE: (state, needValidateCode) => {
    if (state.needValidateCode && needValidateCode) {
      // 需要刷新验证码
      state.needRefreshValidateCode = true
    } else {
      state.needRefreshValidateCode = false
    }
    state.needValidateCode = needValidateCode
    if (needValidateCode) {
      Cookies.set('needValidateCode', true)
    } else {
      Cookies.remove('needValidateCode')
    }
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_REFRESH_PROMISE: (state, refreshPromise) => {
    state.refreshPromise = refreshPromise
  },
  SET_EMPID: (state,empId) => {
    state.empId = empId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        auth.setToken(data.token)
        auth.setRefreshToken(data.refreshToken)
        setTimeout(() => {
          commit('SET_NEED_VALIDATE_CODE', false)
        }, 2000)
        resolve()
      }).catch(error => {
        if (error.response.status === 403) {
          commit('SET_NEED_VALIDATE_CODE', true)
        } else {
          commit('SET_NEED_VALIDATE_CODE', false)
        }
        reject(error)
      })
    })
  },

  refreshToken({ commit }, token) {
    commit('SET_TOKEN', token)
    auth.setToken(token)
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roleIds, userName, imgPath, introduction } = data

        // roles must be a non-empty array
        if (!roleIds || roleIds.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', roleIds)
        commit('SET_NAME', userName)
        commit('SET_AVATAR', imgPath)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  needValidateCode({ commit, needValidateCode }) {
    commit('SET_NEED_VALIDATE_CODE', needValidateCode)
  },

  // 登出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        auth.removeToken()
        auth.removeRefreshToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }, token) {
    return new Promise(resolve => {
      if (!token) {
        commit('SET_TOKEN', '')
        auth.removeToken()
      } else {
        commit('SET_TOKEN', token)
        auth.setToken(token)
      }
      resolve()
    })
  },

  // Dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      auth.setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // 设置头像
  setAvatar({ commit }, avatar) {
    modifyAvatar(avatar).then(() => {
      commit('SET_AVATAR', avatar)
    })
  },

  // 设置刷新token
  setRefreshPromise({ commit }, refreshPromise) {
    commit('SET_REFRESH_PROMISE', refreshPromise)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

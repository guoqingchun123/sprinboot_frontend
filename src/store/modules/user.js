import { login, logout, getInfo, modifyAvatar } from '@/api/authority'
import { auth } from '@bestvike/utils'
import router, { resetRouter } from '@/router'

const state = {
  token: auth.getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  refreshPromise: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
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
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { id, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ id: id.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        auth.setToken(data.token)
        auth.setRefreshToken(data.refreshToken)
        resolve()
      }).catch(error => {
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

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
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

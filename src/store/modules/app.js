import Cookies from 'js-cookie'
import { getLanguage } from '@/lang/index'
import { initDicts } from '@/api/authority'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  language: getLanguage(),
  size: Cookies.get('size') || 'medium',
  theme: Cookies.get('theme') || '#409EFF',
  // 字典配置
  dicts: {}
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  TOGGLE_SCREENFULL: (state, screenfull) => {
    if (screenfull === undefined) {
      state.screenfull = !state.screenfull
    } else {
      state.screenfull = screenfull
    }
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    Cookies.set('language', language)
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_THEME: (state, theme) => {
    state.theme = theme
    Cookies.set('theme', theme)
  },
  SET_DICTS: (state, data) => {
    const { code, dicts } = data
    state.dicts[code] = dicts
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  toggleScreenfull({ commit }, screenfull) {
    commit('TOGGLE_SCREENFULL', screenfull)
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  setTheme({ commit }, theme) {
    commit('SET_THEME', theme)
  },
  fetchDicts({ commit, state }, code) {
    return new Promise((resolve, reject) => {
      if (state.dicts[code]) {
        resolve(state.dicts[code])
      } else {
        initDicts(code).then(response => {
          const { data } = response
          commit('SET_DICTS', {
            code,
            dicts: data
          })
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

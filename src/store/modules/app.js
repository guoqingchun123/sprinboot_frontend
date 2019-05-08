import Cookies from 'js-cookie'
import { getLanguage } from '@/lang/index'
import { fetchDicts,fetchDepts,fetchComps } from '@/api/authority'

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
  dicts: {},
  //字典一项
  dictsone: {},
  //行政区域下拉
  depts: {},
  //从业机构下拉
  comps:{}
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
    const {dicts } = data
    var attr='';
    for (var i in dicts ){
      attr=dicts[i].dictCode

      let childArr=[];
      for (var c in dicts[i].children){
        let child={}
        child.value = dicts[i].children[c].dictCode
        child.label = dicts[i].children[c].dictName
        //遍历子类字典，转为 value lable，支持下拉列表和table
        childArr.push(child)
      }
      state.dicts[attr]=childArr;
    }
  },

  SET_DICTSONE: (state, data) => {
    const {dictsone } = data
    var attr='';
    for (var i in dictsone ){
      attr=dictsone[i].dictCode

      let childArr=[];
      for (var c in dictsone[i].children){
        let child={}
        child.value = dictsone[i].children[c].dictCode
        child.label = dictsone[i].children[c].dictName
        //遍历子类字典，转为 value lable，支持下拉列表和table
        childArr.push(child)
      }
      state.dictsone[attr]=childArr;
    }
  },

  SET_DEPTS: (state, data) => {
    const {depts } = data
    let deptArr=[];
    for (var i in depts ){

      let child={}
      child.value = depts[i].divisionCode
      child.label = depts[i].divisionName
      deptArr.push(child)

    }
    state.depts=deptArr;
  },
  SET_COMPS: (state, data) => {
    const {comps } = data
    let compsArr=[];
    for (var i in comps ){

      let child={}
      child.value = comps[i].companyId
      child.label = comps[i].compName
      compsArr.push(child)

    }
    state.comps = compsArr;
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
  fetchDicts({ commit}) {
    return new Promise((resolve, reject) => {

        fetchDicts().then(response => {
          const { data } = response
          commit('SET_DICTS', {
            dicts: data
          })
          resolve(data)
        }).catch(error => {
          reject(error)
        })

    })
  },
  fetchDepts({ commit}) {
    return new Promise((resolve, reject) => {

      fetchDepts().then(response => {
        const { data } = response
        commit('SET_DEPTS', {
          depts: data
        })
        resolve(data)
      }).catch(error => {
        reject(error)
      })

    })
  },
  fetchComps({ commit}) {
    return new Promise((resolve, reject) => {

      fetchComps().then(response => {
        const { data } = response
        commit('SET_COMPS', {
          comps: data
        })
        resolve(data)
      }).catch(error => {
        reject(error)
      })

    })
  },

  // fetchDictsOne({ commit, state }, code) {
  //   return new Promise((resolve, reject) => {
  //     if (state.dicts[code]) {
  //       resolve(state.dicts[code])
  //     } else {
  //       initDicts(code).then(response => {
  //         const { data } = response
  //         commit('SET_DICTSONE', {
  //           code,
  //           dicts: data
  //         })
  //         resolve(data)
  //       }).catch(error => {
  //         reject(error)
  //       })
  //     }
  //   })
  // }

  /**
   * 查询某一项字典
   */

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

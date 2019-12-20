const defaultSettings = {
  layout: {
    tagsView: true,
    fixedHeader: true,
    sidebarLogo: true
  },
  // 每页显示条数
  table: {
    limit: 10,
    rowSelect: false
  },
  // 标签页样式 default legacy
  tabs: {
    style: 'default'
  },
  devices: {
    liangtian: {
      // 默认摄像头
      camera: null,
      // 默认分辨率
      resolution: null
    },
    guangzhen: {
      camera: null,
      resolution: null
    }
  },
  display: {
    // 隐私模式，部分数据**显示
    privacy: false
  }
}

function merge(result, source) {
  for (let p in source) {
    if (!result[p]) {
      result[p] = source[p]
    } else if (typeof(source[p]) === 'object' && !Array.isArray(source[p])) {
      merge(result[p], source[p])
    } else {
      result[p] = source[p]
    }
  }
}

const state = {
  ...defaultSettings
}

const mutations = {
  SET_SETTINGS: (state, { settings, clearFirst }) => {
    if (clearFirst) {
      state = {
        ...defaultSettings
      }
    }
    merge(state, settings)
    // Object.assign(state.settings, settings)
    /*for (let p in settings) {
      state.settings[p] = settings[p]
    }*/
  },
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      Object.assign(state.settings[key], value)
      // state[key] = value
    }
  },
  CHANGE_SETTINGS: (state, settings) => {
    Object.assign(state, settings)
  }
}

const actions = {
  setSettings({ commit }, settings) {
    commit('SET_SETTINGS', {
      settings: settings || {},
      clearFirst: true
    })
  },
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  changeSettings({ commit }, settings) {
    commit('CHANGE_SETTINGS', {
      settings
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

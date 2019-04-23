import { asyncRoutes, constantRoutes } from '@/router'
import { route as routeUtils } from '@bestvike/utils'

function filterAsyncRoutes(routes, authorityRoutes) {
  let results = []
  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children, authorityRoutes)
    }
    if (authorityRoutes[tmp.id] && authorityRoutes[tmp.id].length > 0) {
      if (!tmp.meta) {
        tmp.meta = {}
      }
      tmp.meta.authoritiedOperates__ = [...authorityRoutes[tmp.id]]
      // Vue.set(tmp.meta, '__authorityOperates', [...authorityRoutes[tmp.id]])
    }
    
    if (authorityRoutes[tmp.id] !== undefined || (tmp.meta && tmp.meta.authority === false) || (tmp.children && tmp.children.length > 0)) {
      results.push(tmp)
    }
  })
  
  return results
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, routes) {
    return new Promise(resolve => {
      /*let accessedRouters
      if (roles.includes('admin')) {
        accessedRouters = asyncRoutes
      } else {
        accessedRouters = filterAsyncRouter(asyncRoutes, roles)
      }*/
      if (process.env.VUE_APP_AUTHORITY === 'true') {
        let accessedRoutes = []
        if (routes) {
          accessedRoutes = filterAsyncRoutes(routeUtils.initRoutesId(asyncRoutes), routes)
        }
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      } else {
        commit('SET_ROUTES', asyncRoutes)
        resolve(asyncRoutes)
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

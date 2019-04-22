import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
/*function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}*/

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
/*function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}
function filterAsyncRouter(routes, userRoutes, parent) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      ...route
    }
    tmp.fullPath = tmp.path
    if (tmp.path.indexOf('/') !== 0 && parent) {
      tmp.fullPath = parent + '/' + tmp.path
    }
    if (tmp.children) {
      tmp.children = filterAsyncRouter(tmp.children, userRoutes, tmp.fullPath)
    }
    for (let i=0; i<userRoutes.length; i++) {
      if (userRoutes[i].path === tmp.fullPath) {
        tmp.title = userRoutes[i].title
        res.push(tmp)
        break
      }
    }
  })

  return res
}*/
function filterAsyncRouter(routes, subRoutes) {
  const res = []
  routes.forEach(route => {
    const tmp = {
      ...route
    }
    subRoutes.forEach(subRoute => {
      if (tmp.name === subRoute.name) {
        if (subRoute.children) {
          tmp.children = filterAsyncRouter(tmp.children, subRoute.children)
        }
        res.push(tmp)
      }
    })
  })
  return res
}

const permission = {
  state: {
    routers: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        //const { routes } = data
        /*let accessedRouters
        if (roles.includes('admin')) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }*/
        //let accessedRouters = filterAsyncRouter(asyncRouterMap, routes)
        //commit('SET_ROUTERS', accessedRouters)
        commit('SET_ROUTERS', asyncRouterMap)
        resolve()
      })
    }
  }
}

export default permission

const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  theme: state => state.app.theme,
  device: state => state.app.device,
  screenfull: state => state.app.screenfull,
  dicts: state => state.app.dicts,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  routes: state => state.user.routes,
  permissionRoutes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  // 刷新token用
  refreshPromise: state => state.user.refreshPromise,
  dictsone: state => state.app.dictsone,
}
export default getters

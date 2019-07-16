import defaultAvatar from '@/assets/avatar.png'

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
  avatar: state => state.user.avatar || defaultAvatar,
  name: state => state.user.name,
  empId: state => state.user.empId,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  routes: state => state.user.routes,
  // 是否需要校验码
  needValidateCode: state => state.user.needValidateCode,
  needRefreshValidateCode: state => state.user.needRefreshValidateCode,
  permissionRoutes: state => state.permission.routes,
  // 刷新token用
  refreshPromise: state => state.user.refreshPromise
}
export default getters

import store from '@/store'

//登出不记忆打开的标签页
export function delAllViews() {
  store.dispatch('tagsView/delAllViews')
}

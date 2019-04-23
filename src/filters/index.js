import i18n from '@/lang'

/**
 * 路由名称翻译
 * @param router 路由配置
 */
export function transTitle(meta) {
  if (!meta) {
    return null
  }
  if (meta.title.indexOf('${') === 0 && meta.title.indexOf('}') === meta.title.length - 1 ) {
    const titleName = meta.title.substring(2, meta.title.length - 1)
    return i18n.t(`route.${titleName}`)
  }
  return meta.title
}

export function key(item) {
  for (let p in item) {
    return p
  }
}
export function value(item, key) {
  for (let p in item) {
    if (!key) {
      return item[p]
    }
    return item[p][key]
  }
}

export function selection(item) {
  return item && item.selection
}
export function one(arr) {
  return arr && arr.length === 1
}

/**
 * 弹窗考勤时间格式化
 * @param val
 * @returns {string}
 */
export function formatDateByAttendDialog(val) {
  let unixTime = val.toString()
  let a = unixTime.replace("/Date(", "").replace(")/", "");
  let date = new Date(parseInt(a));
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let minute = date.getMinutes();
  let second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return h + ':' + minute + ':' + second;
}

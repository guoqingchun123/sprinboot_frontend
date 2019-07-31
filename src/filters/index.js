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
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * 格式化时间戳
 * @param val
 * @returns {string}
 */
export function formatDateTime(val) {
  let unixTime = val.toString()
  let a = unixTime.replace("/Date(", "").replace(")/", "");
  let date = new Date(parseInt(a));
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let minute = date.getMinutes();
  let second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d+' '+h + ':' + minute + ':' + second;
}

/**
 * 组合显示代码和名称
 */
export function comboShow(code, name) {
  if (!code) {
    return name
  }
  return '（' + code + '）' + name
}

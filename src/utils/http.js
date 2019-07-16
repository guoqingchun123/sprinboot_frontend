import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
// import { auth } from '@bestvike/utils'

// 直接使用Message会出现问题：只有第一处可用，后面的会有js错误
const showMessage = (options) => {
  Message(options)
}

// const baseUrl = process.env.VUE_APP_MOCK === 'true' ? '' : (process.env.VUE_APP_API_SERVER || process.env.VUE_APP_ROOT) + process.env.VUE_APP_BASE_API
// create an axios instance
const instance = axios.create({
  baseURL: process.env.VUE_APP_MOCK === 'true' ? '' : process.env.VUE_APP_ROOT + (process.env.VUE_APP_BASE_API === '/' ? '' : process.env.VUE_APP_BASE_API),
  withCredentials: true,
  isRetryRequest: false,
  timeout: 50000, // request timeout
  // 指定header属性，避免spring security返回www-authenticate: Basic realm="Realm"造成浏览器弹窗
  headers: {'X-Requested-With': 'XMLHttpRequest'}
})

// request interceptor
instance.interceptors.request.use(
  config => {
    switch (config.method) {
      case 'get': {
        // get方法加一个时间参数,解决ie下可能缓存问题.
        if (!config.params) {
          config.params = {}
        } else {
          config.params = {...config.params}
        }
        if (!config.params.t) {
          config.params.t = new Date().getTime()
        }
        break
      }
      case 'post': {
        if (!config.headers['Content-Type']) {
          config.headers['Content-Type'] = 'application/json;charset=UTF-8'
        }
        break
      }
      case 'put': {
        if (!config.headers['Content-Type']) {
          config.headers['Content-Type'] = 'application/json;charset=UTF-8'
        }
        break
      }
    }
    /*if (store.getters.token) {
      const token = auth.getToken()
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['X-Token'] = token
    }*/
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)

const isLogin = () => {
  return router.currentRoute.path === '/login'
}
const toLogin = () => {
  const currentPath = router.currentRoute.fullPath
  store.dispatch('user/logout').then(() => {
    router.push(`/login?redirect=${currentPath}`)
  })
}

// response interceptor
instance.interceptors.response.use(
  response => response,
  error => {
    // 如果是401错误，需要弹出登录窗口
    if (error.response.status === 401) {
      if (isLogin()) {
        showMessage({
          message: error.response.data.message,
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(error)
      } else {
        // 暂时跳转登录页面，后续修改为弹出登录窗口
        toLogin()
        return Promise.reject(error)
      }
    } else {
      let data = error.response.data
      if (error.config.responseType && error.config.responseType === 'blob') {
        var reader = new FileReader()
        reader.onload = e => {
          const result = JSON.parse(e.target.result)
          showMessage({
            message: result.message,
            type: 'error',
            duration: 5 * 1000
          })
          return Promise.reject(error)
        }
        reader.readAsText(data)
      } else {
        showMessage({
          message: data.message,
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(error)
      }
    }
  }
)

instance.upload = (url, file, data) => {
  let formData = new FormData();
  // formData.append('file', file)
  if (file) {
    file.forEach((value) => {
      formData.append('file', value);
    });
  }
  if (data) {
    // data.forEach((value, key) => {
    //   formData.append(key, value)
    // })
    Object.keys(data).forEach(function(key){
      formData.append(key, data[key]);
    });
  }
  return instance({
    url: url,
    method: 'post',
    headers: {
        'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

instance.download = (url, data) => {
  return instance({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: JSON.stringify(data),
    responseType: 'arraybuffer'
  })
}
instance.pdf = (url, data) => {
  return instance({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: JSON.stringify(data),
    responseType: 'blob'
  })
}

export default instance

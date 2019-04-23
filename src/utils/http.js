import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { auth } from '@bestvike/utils'
import { refresh } from '@/api/authority'

// create an axios instance
const instance = axios.create({
  baseURL: (process.env.VUE_APP_API_SERVER || '') + process.env.VUE_APP_BASE_API, // api 的 base_url
  // withCredentials: true, // 跨域请求时发送 cookies
  isRetryRequest: false,
  timeout: 50000 // request timeout
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
    // 可以在此处判断token的有效期，快到期时刷新token
    // 刷新token之后config_param要处理新Token的拼装
    // 请求拦截器中要能识别出是否是refresh_token的请求
    // 能识别出是否正在进行refresh_token，并能正确处理其他进入的请求
    /*
    return new Promise(resolve => {
      // 模拟等待refresh_token
      setTimeout(function (config_param) {
          resolve(config_param);
      }, 2000, config)
    });
    */
    // Do something before request is sent
    if (store.getters.token) {
      const token = auth.getToken()
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['X-Token'] = token
      if (!config.ignoreToken) {
        config.headers['Authorization'] = 'Bearer ' + token
      }
    }
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)

const isRefreshTokenReq = () => {
  return false
}
const toLogin = () => {
  router.replace(`/login?redirect=${router.currentRoute.fullPath}`)
}
const refreshAccessToken = () => {
  if (!store.getters.refreshPromise) {
    const refreshToken = auth.getRefreshToken()
    store.dispatch('user/setRefreshPromise', new Promise((resolve, reject) => {
      refresh(refreshToken).then(res => {
        store.dispatch('user/resetToken', res.data)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    }))
  }
  return store.getters.refreshPromise
}

// response interceptor
instance.interceptors.response.use(
  response => response,
  error => {
    // 判断401错误，重新获取token
    switch (error.response.status) {
      case 401: {
        // 先清空token
        store.dispatch('user/resetToken')
        let config = error.config
        if (isRefreshTokenReq(config.url)) {
          // 刷新Token的请求如果出现401直接退出登录
          toLogin()
        } else {
          // console.log('请求的返回值出现401，由请求' + config.url + '的返回值触发，开始进行refresh_token！')
          try {
            return refreshAccessToken().then(res => {
              config.headers['X-Token'] = res.data
              config.headers['Authorization'] = 'Bearer ' + res.data
              store.dispatch('user/setRefreshPromise', '')
              return axios(config)
            }).catch (() => {
              toLogin()
            })
          } catch (error) {
            console.log('无法等待刷新Token！', error)
            toLogin()
          }
        }
        break
      }
      default: {
        Message({
          message: error.response.data.message,
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(error)
      }
    }
  }
)

/*
let http = {}
http.get = (url, params = {}) => {
  params.t = new Date().getTime(); //get方法加一个时间参数,解决ie下可能缓存问题.
  return instance({
    url: url,
    method: 'get',
    headers: {
    },
    params
  })
}

//封装post请求
http.post = (url, data = {}) => {
  return instance({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: JSON.stringify(data)
  })
}

http.put = (url, data = {}) => {
  return instance({
    url: url,
    method: 'put',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    data: JSON.stringify(data)
  })
}

http.delete = (url, ids) => {
  return instance({
    // `http://localhost:3000/heroes/${id}`
    url: url + `/${ids}`,
    method: 'delete',
    headers: {
    }
  })
}
*/

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

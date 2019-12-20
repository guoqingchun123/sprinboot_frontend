import Vue from 'vue'
// import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

import { auth } from '@bestvike/utils'

const handleMessage = (dispatch, message) => {
  if (message && message.type) {
    if (message.type === 'alert') {
      Vue.prototype.$alert(message.content, message.title || "请注意")
    } else if (message.type === 'offline') {
      dispatch('closeSocket')
    }
  }
}

const state = {
  // socket: null,
  stomp: null,
  socketPromise: null,
  onlineSubscribe: null
}

const mutations = {
  /*SET_SOCKET: (state, socket) => {
    state.socket = socket
  },*/
  SET_STOMP: (state, stomp) => {
    state.stomp = stomp
  },
  SET_SOCKET_PROMISE: (state, promise) => {
    state.socketPromise = promise
  }
}

const actions = {
  initSocket({ commit, state, dispatch }) {
    if (Vue.prototype.$SOCKET_SERVER === 'false') {
      return new Promise(resolve => {
        resolve()
      })
    }
    if (!state.socketPromise) {
      let socketPromise = new Promise(resolve => {
        if (!state.stomp) {
          // let socket = new SockJS(Vue.prototype.$SOCKET_SERVER + '/socket')
          const client = new Client({
            brokerURL: Vue.prototype.$SOCKET_SERVER + '/socket',
            /*connectHeaders: {
              login: "user",
              passcode: "password"
            },
            debug: str => {
              console.log(str);
            },*/
            reconnectDelay: 0
            // heartbeatIncoming: 4000,
            // heartbeatOutgoing: 4000
          })
          client.onConnect = () => {
            commit('SET_STOMP', client)
            resolve()
            client.subscribe('/user/queue/response', response => {
              handleMessage(dispatch, JSON.parse(response.body))
            })
            // 订阅广播消息
            client.subscribe('/topic/response', response => {
              handleMessage(dispatch, JSON.parse(response.body))
            })
            // 订阅基于session的消息
            client.subscribe('/user/queue/' + auth.getToken(), response => {
              handleMessage(dispatch, JSON.parse(response.body))
            })
            // stomp.send('/app/subscribe', {}, JSON.stringify({type: 'hello'}))
            // console.log(frame)
          }
          client.onWebSocketClose = () => {
            dispatch('closeSocket')
          }
          client.activate()
          // let stomp = Stomp.over(socket)
          // stomp.debug = null
          /*stomp.connect({}, () => {
            commit('SET_SOCKET', socket)
            commit('SET_STOMP', stomp)
            resolve()
            // 订阅个人消息
            stomp.subscribe('/user/queue/response', response => {
              const responseJson = JSON.parse(response.body)
              if (responseJson) {
                showMessage(responseJson)
              }
            })
            // 订阅广播消息
            stomp.subscribe('/topic/response', response => {
              // console.log('response:', response)
              showMessage(JSON.parse(response.body))
            })
            // stomp.send('/app/subscribe', {}, JSON.stringify({type: 'hello'}))
          })*/
        } else {
          resolve()
        }
      })
      commit('SET_SOCKET_PROMISE', socketPromise)
      return socketPromise
    } else {
      return state.socketPromise
    }
  },
  closeSocket({ commit, state }) {
    if (Vue.prototype.$SOCKET_SERVER !== 'false' && state.stomp) {
      state.stomp.deactivate()
      commit('SET_STOMP', null)
    }
    commit('SET_SOCKET_PROMISE', null)
  },
  send({ state }, message) {
    if (Vue.prototype.$SOCKET_SERVER !== 'false' && state.stomp) {
      if (!message) {
        message = {}
      }
      message.appCode = process.env.VUE_APP_CODE
      message.sessionId = auth.getToken()
      message.token = auth.getToken()
      state.stomp.publish({
        destination: '/app/subscribe',
        body: JSON.stringify(message)
        // 'X-App-Code': process.env.VUE_APP_CODE,
        // 'X-Token': auth.getToken()
      })
    }
  },
  subscribeOnline({ state }, callback) {
    if (Vue.prototype.$SOCKET_SERVER !== 'false' && state.stomp && callback) {
      state.onlineSubscribe = state.stomp.subscribe('/user/queue/online', response => {
        callback.call(null, {
          data: JSON.parse(JSON.parse(response.body).content)
        })
      })
    }
  },
  unsubscribeOnline({ state }) {
    if (Vue.prototype.$SOCKET_SERVER !== 'false' && state.onlineSubscribe) {
      state.onlineSubscribe.unsubscribe()
      state.onlineSubscribe = null
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

const userMap = {
  admin: {
    roles: ['admin'],
    routes: [
      {
        path: '/example',
        //component: 'Layout',
        redirect: '/example/complex-example',
        name: 'Example',
        meta: {
          title: 'example',
          icon: 'example'
        },
        children: [
          {
            path: 'dynamic-example',
            //component: '@/views/example/dynamicExample',
            name: 'DynamicExample',
            meta: {
              title: 'dynamicExample'
            }
          },
          {
            path: 'complex-example',
            //component: '@/views/example/complexExample',
            name: 'ComplexExample',
            meta: {
              title: 'ComplexExample'
            }
          }
        ]
      }
    ],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    routes: [
      {
        path: '/example',
        title: '开发用例',
        children: [{
          path: 'dynamic-example',
          title: '动态'
        }, {
          path: 'complex-example',
          title: '复合'
        }]
      }
    ],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default {
  '/login/login': config => {
    const { username } = config.body
    return userMap[username]
  },
  '/login/logout': 'success',
  '/user/info': config => {
    const { token } = config.query
    if (userMap[token]) {
      return userMap[token]
    } else {
      return false
    }
  }
}


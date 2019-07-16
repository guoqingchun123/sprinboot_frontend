import Layout from '@/layout'

const authorityRouter = {
  path: '/authority',
  alwaysShow: true,
  component: Layout,
  meta: {
    title: '${authority}',
    icon: 'lock'
  },
  children: [
    {
      path: 'routers',
      component: () => import('@/views/authority/router'),
      name: 'ListRouter',
      meta: {
        title: '路由一览'
      }
    }, {
      path: 'users',
      component: () => import('@/views/authority/user/list'),
      name: 'ListUser',
      meta: {
        title: '用户管理'
      }
    }
  ]
}
export default authorityRouter

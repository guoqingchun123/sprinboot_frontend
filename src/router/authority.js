import Layout from '@/layout/Layout'

const authorityRouter = {
  path: '/authority',
  alwaysShow: true,
  component: Layout,
  // redirect: '/areas',
  // name: 'Authority',
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
      path: 'areas',
      component: () => import('@/views/authority/area'),
      name: 'ListArea',
      meta: {
        title: '区域维护'
      }
    }, {
      path: 'roles',
      component: () => import('@/views/authority/role'),
      name: 'ListRole',
      meta: {
        title: '角色维护'
      }
    }
  ]
}
export default authorityRouter

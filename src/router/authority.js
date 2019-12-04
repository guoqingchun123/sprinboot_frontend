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
        title: '菜单管理'
      }
    }, {
      path: 'users',
      component: () => import('@/views/authority/user/list'),
      name: 'ListUser',
      meta: {
        title: '用户管理'
      }
    }, {
      path: 'roles',
      component: () => import('@/views/authority/role'),
      name: 'ListRole',
      meta: {
        title: '角色管理'
      }
    }, {
      path: 'token',
      component: () => import('@/views/authority/token'),
      name: 'token',
      meta: {
        title: '动态令牌管理'
      },
      redirect: 'noRedirect',
      children: [
        {
          path: 'fileImport',
          component: () => import('@/views/authority/token/fileImport'),
          name: 'fileImport',
          meta: {
            title: '种子文件导入'
          }
        }, {
          path: 'fileQuery',
          component: () => import('@/views/authority/token/fileQuery'),
          name: 'fileQuery',
          meta: {
            title: '种子文件查询'
          }
        }, {
          path: 'tokenAllot',
          component: () => import('@/views/authority/token/tokenAllot'),
          name: 'tokenAllot',
          meta: {
            title: '用户令牌分配'
          }
        }, {
          path: 'tokenSyn',
          component: () => import('@/views/authority/token/tokenSyn'),
          name: 'tokenSyn',
          meta: {
            title: '同步事件戳'
          }
        }
      ]
    },{
      path: 'dicts',
      component: () => import('@/views/authority/dict'),
      name: 'Dict',
      meta: {
        title: '字典管理'
      }
    }
  ]
}
export default authorityRouter

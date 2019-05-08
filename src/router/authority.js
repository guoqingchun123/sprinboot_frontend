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
      path: 'users',
      component: () => import('@/views/authority/user/list'),
      name: 'ListUser',
      meta: {
        title: '用户管理'
      }
    }, {
      path: 'roles',
      component: () => import('@/views/authority/role/list'),
      name: 'ListRole',
      meta: {
        title: '角色维护',
        operates: [
          {
            name: 'grant',
            label: '授权',
            routes: ['GET:/api/roles/{id}/routes', 'POST:/api/roles/{id}/routes']
          }, {
            name: 'add',
            label: '新增',
            routes: ['POST:/api/roles']
          }, {
            name: 'modify',
            label: '修改',
            routes: ['PUT:/api/roles']
          }, {
            name: 'remove',
            label: '删除',
            routes: ['DELETE:/api/roles/{ids}']
          }
        ]
      }
    }, {
      path: 'token',
      component: () => import('@/views/authority/token'),
      name: 'token',
      meta: {
        title: '动态令牌管理'
      },
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
        },
      ]
    },
    {
      path: 'dicts',
      component: () => import('@/views/authority/dict'),
      name: 'Dict',
      meta: {
        title: '字典管理',
        operates: [
          {
            name: 'add',
            label: '新增',
            routes: ['POST:/api/dicts', 'POST:/api/dicts/{path}']
          }, {
            name: 'modify',
            label: '修改',
            routes: ['PUT:/api/dicts', 'PUT:/api/dicts/{path}']
          }, {
            name: 'remove',
            label: '删除',
            routes: ['DELETE:/api/dicts/{codes}', 'DELETE:/api/dicts/{path}/{codes}']
          }
        ]
      }
    },
    {
      path: 'company',
      component: () => import('@/views/company/company'),
      name: 'company',
      meta: {
        title: '从业机构管理',
      },
      children: [
        {
          path: '/companyManage',
          component: () => import('@/views/company/companyManage'),
          name: 'companyManage',
          meta: { title: '从业机构维护', noCache: true }
        },
       /* {
          path: '/companyManage',
          component: () => import('@/views/company/companyManage'),
          name: 'companyManage',
          meta: { title: '从业机构维护', noCache: true }
        },*/
      ]
    },
    {
      path: 'dept',
      component: ()=> import('@/views/authority/dept'),
      // redirect: 'noredirect',
      name: 'dept',
      meta: {
        title: '行政区维护'
      }
    },
    {
      path: 'project',
      component: () => import('@/views/project/projectManger'),
      name: 'project',
      meta: {
        title: '项目管理'
      }
    }
  ]
}
export default authorityRouter

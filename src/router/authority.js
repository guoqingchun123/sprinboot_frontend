import Layout from '@/layout'

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
    },{
      path: 'users',
      component: () => import('@/views/authority/user'),
      name: 'ListUser',
      meta: {
        title: '用户管理'
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
        },{
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
    },
    {
      path: 'dicts',
      component: () => import('@/views/authority/dict'),
      name: 'Dict',
      meta: {
        title: '字典管理',
        // operates: [
        //   {
        //     name: 'add',
        //     label: '新增',
        //     routes: ['POST:/api/dicts', 'POST:/api/dicts/{path}']
        //   }, {
        //     name: 'modify',
        //     label: '修改',
        //     routes: ['PUT:/api/dicts', 'PUT:/api/dicts/{path}']
        //   }, {
        //     name: 'remove',
        //     label: '删除',
        //     routes: ['DELETE:/api/dicts/{codes}', 'DELETE:/api/dicts/{path}/{codes}']
        //   }
        // ]
      }
    },
    {
      path: 'product',
      component: () => import('@/views/authority/product'),
      name: 'Product',
      meta: {
        title: '产品管理'
      }
    },
    {
      path: 'flow',
      component: () => import('@/views/authority/flowManger'),
      name: 'Flow',
      meta: {
        title: '审批流程配置',
        // operates: [
        //   {
        //     name: 'add',
        //     label: '新增',
        //     routes: ['POST:/api/flow']
        //   }, {
        //     name: 'modify',
        //     label: '修改',
        //     routes: ['PUT:/api/flow']
        //   }, {
        //     name: 'remove',
        //     label: '删除',
        //     routes: ['DELETE:/api/flowRemove']
        //   }
        // ]
      }
    },
    {
      path: 'deptEmpLevel',
      component: () => import('@/views/authority/deptManage/deptEmpLevel'),
      name: 'DeptEmpLevel',
      meta: {
        title: '人员层级配置'
      },
    },
    {
      path: 'branch',
      component: () => import('@/views/authority/branch/branchManage'),
      name: 'ListAreaManage',
      meta: {
        title: '分支机构',
        icon: 'location'
      }
    },
    {
      path: 'deptManage',
      component: () => import('@/views/authority/deptManage/deptManage'),
      name: 'ListDeptManage',
      meta: {
        title: '部门管理',
        icon: 'cluster'
      },
    },
    {
      path: 'holidayConfig',
      component: () => import('@/views/authority/holidayConfig/index'),
      name: 'HolidayConfig',
      meta: {
        title: '节假日配置',
        icon: 'schedule',
        operates: [
         {
            name: 'add',
            label: '新增',
            routes: ['POST:/api/holidayConfigs']
          }, {
            name: 'modify',
            label: '修改',
            routes: ['PUT:/api/holidayConfigs']
          }, {
            name: 'remove',
            label: '删除',
            routes: ['DELETE:/api/holidayConfigs/{ids}']
          }
        ]
      },
    }
  ]
}
export default authorityRouter

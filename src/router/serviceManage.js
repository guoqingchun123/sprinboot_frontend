/** When your routing project is too long, you can split it into small modules**/

import Layout from '@/layout/Layout'

const serviceRouter =  {
    path: '/serviceManage',
    alwaysShow: true,
    component: Layout,
    name: 'serviceManage',
    meta: {
      title: '服务管理',
      icon: 'audit'
    },
    children: [
      {
        path: '/potralVisit',
        component: () => import('@/views/serviceManage/potralVisitManage/index'),
        name: 'potralVisit',
        alwaysShow: true,
        meta: { title: '巡检回访管理', noCache: true },
        children: [
          {
            path: 'potralVisitCheck',
            component: () => import('@/views/serviceManage/potralVisitManage/potralVisitCheck'),
            name: 'PotralVisitCheck',
            meta: { title: '巡检回访维护', noCache: true }
          },
          {
            path: 'potralVisitContent',
            component: () => import('@/views/serviceManage/potralVisitManage/potralVisitContent'),
            name: 'PotralVisitContent',
            meta: { title: '巡检回访内容管理', noCache: true }
          }
        ]
      },
      {
        path: '/manageService',
        component: () => import('@/views/serviceManage/manageService/index'),
        name: 'manageService',
        alwaysShow: true,
        meta: { title: '服务记录管理', noCache: true },
        children: [
          {
            path: 'RecordManagement',
            component: () => import('@/views/serviceManage/manageService/recordManagement'),
            name: 'RecordManagement',
            meta: { title: '服务记录管理', noCache: true }
          },
          {
            path: 'RecordScheduling',
            component: () => import('@/views/serviceManage/manageService/recordScheduling'),
            name: 'RecordScheduling',
            meta: { title: '服务记录调度', noCache: true }
          },
          {
            path: 'RecordAllocation',
            component: () => import('@/views/serviceManage/manageService/recordAllocation'),
            name: 'RecordAllocation',
            meta: { title: '服务记录分配', noCache: true }
          },
        ]
      },
    ]
  };
export default serviceRouter

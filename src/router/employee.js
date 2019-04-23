import Layout from '@/layout/Layout'

const employRouter = {
  path: '/employManage',
  alwaysShow: true,
  component: Layout,
  // redirect: '/areas',
  // name: 'Authority',
  meta: {
    title: '${employee}',
    icon: 'user'
  },
  children: [
    {
      path: 'file',
      component: () => import('@/views/employee/file/index'),
      name: 'EmployFile',
      alwaysShow: true,
      meta: {
        title: '员工档案'
      },
      children: [
        {
          path: 'employInfo',
          component: () => import('@/views/employee/file/employInfo'),
          name: 'EmployInfo',
          meta: {
            title: '员工信息',
            icon:'contacts'
          }
        }
      ]
    },
    {
      path: 'employDaily',
      component: () => import('@/views/employee/employDaily/index'),
      name: 'EmployDaily',
      alwaysShow: true,
      meta: {
        title: '员工日报'
      },
      children: [
        {
          path: 'editEmpSchedule',
          component: () => import('@/views/employee/employDaily/editEmpSchedule'),
          name: 'EditEmpSchedule',
          meta: {
            title: '我的行事历',
            icon: 'schedule'
          }
        },
        {
          path: 'empQueryEmpSchedule',
          component: () => import('@/views/employee/employDaily/empQueryEmpSchedule'),
          name: 'EmpQueryEmpSchedule',
          meta: {
            title: '我的行事历'
          },
          hidden: true,
          authority: false
        },
        {
          path: 'auditEmpSchedule',
          component: () => import('@/views/employee/employDaily/auditEmpSchedule'),
          name: 'AuditEmpSchedule',
          meta: {
            title: '行事历审核',
            icon: 'audit'
          }
        },
        {
          path: 'approvalQueryEmpSchedule',
          component: () => import('@/views/employee/employDaily/approvalQueryEmpSchedule'),
          name: 'ApprovalQueryEmpSchedule',
          meta: {
            title: '行事历审核'
          },
          hidden: true,
          authority: false
        },
        {
          path: 'cancelSchedule',
          component: () => import('@/views/employee/employDaily/cancelSchedule'),
          name: 'CancelSchedule',
          meta: {
            title: '撤销审核行事历',
            icon: 'cancelAudit'
          }
        }
      ]
    },
    {
      path: 'empAttend',
      component: () => import('@/views/employee/empAttend/index'),
      name: 'EmpAttend',
      alwaysShow: true,
      meta: {
        title: '考勤统计'
      },
      children: [
        {
          path: 'listEmpAttend',
          component: () => import('@/views/employee/empAttend/listEmpAttend'),
          name: 'ListEmpAttend',
          meta: {
            title: '考勤记录',
            icon: 'attend'
          }
        },
        {
          path: 'empQueryEmpAttend',
          component: () => import('@/views/employee/empAttend/empQueryEmpAttend'),
          name: 'EmpQueryEmpAttend',
          meta: {
            title: '我的考勤信息',
            icon: 'attend-info'
          }
        }
      ]
    },
    {
      path: 'travelManages',
      component: () => import('@/views/employee/empTravel/index'),
      name:'EmpTravel',
      alwaysShow: true,
      meta: {
        title: '差旅管理'
      },
      children: [
        {
          path: 'travels',
          component: () => import('@/views/employee/empTravel/listEmpTravel'),
          name: 'ListEmpTravel',
          meta: {
            title: '员工差旅明细'
          },
        },
        {
          path: 'myTravels',
          component: () => import('@/views/employee/empTravel/listMyTravel'),
          name: 'ListMyTravel',
          meta: {
            title: '我的差旅明细'
          }
        }
      ]
    },
    {
      path: 'proWeekly',
      component: () => import('@/views/employee/otherManage/proWeekly'),
      name: 'proWeekly',
      meta: {
        title: '项目周报'
      },
    },
    {
      path: 'quaEvaluateList',
      component: () => import('@/views/employee/otherManage/index'),
      name: 'quaEvaluateList',
      meta: {
        title: '季度自评'
      },
      children: [
        {
          path: 'quaEvaluate',
          component: () => import('@/views/employee/otherManage/quaEvaluate'),
          name: 'quaEvaluate',
          meta: {
            title: '季度自评'
          }
        },
        {
          path: 'quaEvaluateShow',
          component: () => import('@/views/employee/otherManage/quaEvaluateShow'),
          name: 'quaEvaluateShow',
          meta: {
            title: '自评展示'
          }
        }
      ]
    },
  ]
}
export default employRouter

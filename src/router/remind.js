/** When your routing project is too long, you can split it into small modules**/

import Layout from '@/layout/Layout'

const remindRouter =  {
  path: '/remind',
  component:Layout,
  name:'customManageSchedule',
  meta: {
    title: '${customManageSchedule}',
    icon:'email'
  },
  children:[
    {
      path: 'serviceDueRemind',
      component: () => import('@/views/remind/serviceDueRemind'),
      name: 'ServiceDueRemind',
      meta: { title: '${serviceDueRemind}', noCache: true }
    },
    {
      path: 'inspectionVisitRemind',
      component: () => import('@/views/remind/inspectionVisitRemind'),
      name: 'InspectionVisitRemind',
      meta: { title: '${inspectionVisitRemind}', noCache: true }
    },
    {
      path: 'contactCustomRemind',
      component: () => import('@/views/remind/contactCustomRemind'),
      name: 'ContactCustomRemind',
      meta: { title: '${contactCustomRemind}', noCache: true }
    },
    {
      path: 'myWork',
      component: () => import('@/views/remind/myWork'),
      name: 'MyWork',
      meta: { title: '${myWork}', noCache: true }
    },
    {
      path: 'empContractRemind',
      component: () => import('@/views/remind/empContractRemind'),
      name: 'EmpContractRemind',
      meta: { title: '${empContractRemind}', noCache: true }
    }
  ]


  };
export default remindRouter

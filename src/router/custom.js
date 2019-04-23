/** When your routing project is too long, you can split it into small modules**/

import Layout from '@/layout/Layout'

const customRouter =  {

  path: '/custom',
    component: Layout,
  name: 'custom',
  meta: {
  title: '${customInfoManage}',
    icon: 'peoples'
},
  children: [
    {
      path: 'customManage',
      component: () => import('@/views/custom/customManage'),
      name: 'CustomManage',
      meta: { title: '${customManage}', noCache: true }
    },
    {
      path: 'contractMessage',
      component: () => import('@/views/custom/contractMessage'),
      name: 'ContractMessage',
      meta: { title: '${contractMessage}', noCache: true }
    },
    {
      path: 'customManageDetail',
      component: () => import('@/views/custom/customManageDetail'),
      hidden:true,
      name: 'CustomManageDetail',
      meta: { title: '${customManageDetail}', noCache: true }
    },
    {
      path: 'contractMessageDetail',
      component: () => import('@/views/custom/contractMessageDetail'),
      hidden:true,
      name: 'ContractMessageDetail',
      meta: { title: '销售合同详情', noCache: true }
    },
  ]

  };
export default customRouter

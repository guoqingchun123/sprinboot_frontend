/** When your routing project is too long, you can split it into small modules**/

import Layout from '@/layout/Layout'

const projectRouter = {
  path: '/project',
  component: Layout,
  redirect: '/project/basicprojInfo',
  name: 'projManage',
  meta: {
    title: '${projManage}',
    icon: 'example'
  },
  children: [
    {
      path: 'basicProjInfo',
      component: () => import('@/views/project/BasicProjInfo'),
      name: 'BasicprojInfo',
      meta: { title: '${basicprojInfo}' }
    },
    {
      path: 'projApproval',
      component: () => import('@/views/project/ProjApproval'),
      name: 'ProjApproval',
      meta: { title: '${projApproval}' }
    },
    {
      path: 'projApprovalLog',
      component: () => import('@/views/project/ProjApprovalLog'),
      name: 'ProjApprovalLog',
      meta: { title: '${projApprovalLog}' }
    },
    {
      path: 'presaleProjInfo',
      component: () => import('@/views/project/PresaleProjInfo'),
      name: 'PresaleProjInfo',
      meta: { title: '${presaleProjInfo}' }
    },
    {
      path: 'productList',
      component: () => import('@/views/authority/product/productList'),
      name: 'ProductList',
      meta: { title: '${productList}' }
    }
    // ,{
    //   path:'basicProjInfo/taskInfo',
    //   component: () => import('@/views/project/TaskInfo'),
    //   name: 'TaskInfo',
    //   hidden:true,
    //   meta: { title: '${taskInfo}' }
    // }
  ]
}
export default projectRouter
